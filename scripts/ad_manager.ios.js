import mobileAds from 'react-native-google-mobile-ads';
import { InterstitialAd, AppOpenAd, RewardedInterstitialAd, RewardedAdEventType, TestIds, AdEventType, AdsConsent, AdsConsentStatus, AdsConsentDebugGeography  } from 'react-native-google-mobile-ads';

export default class AdManager {
  static production = false;
  static requestNonPersonalizedAdsOnly = true;

  static interstitial;
  static interstitialID;
  static interstitialLoaded = false;

  static rewarded;
  static rewardedID;
  static rewardedLoaded = false;

  static appOpenAd;
  static appOpenID;

  static consentInfo;

  static async initialize() {
    mobileAds().initialize().then(adapterStatuses => {});

    AdManager.interstitialID = AdManager.production ? 'ca-app-pub-1354741235649835/2967045976' : TestIds.INTERSTITIAL;
    AdManager.rewardedID = AdManager.production ?  'ca-app-pub-1354741235649835/1179321589' : TestIds.REWARDED_INTERSTITIAL;
    AdManager.appOpenID = AdManager.production ?  'ca-app-pub-1354741235649835/5809402553' : TestIds.APP_OPEN;
    //AdsConsent.reset();
    AdManager.consentInfo = await AdsConsent.requestInfoUpdate();

    if (AdManager.consentInfo.isConsentFormAvailable && AdManager.consentInfo.status === AdsConsentStatus.REQUIRED) {
      const { status } = await AdsConsent.showForm();
    }

    AdManager.interstitial = InterstitialAd.createForAdRequest(AdManager.interstitialID, {
      requestNonPersonalizedAdsOnly: AdManager.requestNonPersonalizedAdsOnly
    });

    AdManager.interstitial.addAdEventListener(AdEventType.LOADED, () => {
      AdManager.interstitialLoaded = true;
    });

    AdManager.loadAd("interstitial");

    AdManager.rewarded = RewardedInterstitialAd.createForAdRequest(AdManager.rewardedID, {
      requestNonPersonalizedAdsOnly: AdManager.requestNonPersonalizedAdsOnly
    });

    const unsubscribeLoaded = AdManager.rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      AdManager.rewardedLoaded = true;
    });

    const unsubscribeEarned = AdManager.rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      reward => {
        console.log('User earned reward of ', reward);
      },
    );

    AdManager.rewarded.load();

    /* APP OPEN ADS NOT IMPLEMENTED YET
    AdManager.appOpenAd = AppOpenAd.createForAdRequest(AdManager.appOpenID, {
      requestNonPersonalizedAdsOnly: AdManager.requestNonPersonalizedAdsOnly
    });

    AdManager.appOpenAd.load();
    AdManager.appOpenAd.show();*/
  }

  static loadAd(type = null) {
    if (!type) return;

    switch (type){
      case "interstitial":
        AdManager.interstitial.load();
        break;
      case "rewarded":
        AdManager.rewarded = RewardedInterstitialAd.createForAdRequest(AdManager.rewardedID, {
          requestNonPersonalizedAdsOnly: AdManager.requestNonPersonalizedAdsOnly
        });
    
        const unsubscribeLoaded = AdManager.rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
          AdManager.rewardedLoaded = true;
        });
    
        const unsubscribeEarned = AdManager.rewarded.addAdEventListener(
          RewardedAdEventType.EARNED_REWARD,
          reward => {
            console.log('User earned reward of ', reward);
          },
        );
    
        AdManager.rewarded.load();
      default:
        console.log("Invalid type --");
    }
  }

  static showAd(type = null) {
    if (!type) return;

    switch (type){
      case "interstitial":
        if (AdManager.interstitialLoaded) {
          AdManager.interstitial.show();
          AdManager.interstitialLoaded = false;
        }
        break;
      case "rewarded":
        console.log("test 0");
        if (AdManager.rewardedLoaded) {
          console.log("test 1");
          AdManager.rewarded.show();
          console.log("test 2");
          AdManager.rewardedLoaded = false;
          AdManager.loadAd("rewarded");
        }
      default:
        console.log("Invalid type -");
    }
  }
}

AdManager.initialize();

/*interstitial = InterstitialAd.createForAdRequest(interstitialID, {
  requestNonPersonalizedAdsOnly: true
});

async function loadInterstitial() {
  // Preload an app open ad
  interstitial.load();

  await delay(2000);

  showInterstitial();
}

function showInterstitial() {
  interstitial.show();

  //////
}*/