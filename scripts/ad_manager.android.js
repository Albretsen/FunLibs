import mobileAds from 'react-native-google-mobile-ads';
import { InterstitialAd, AppOpenAd, TestIds, AdEventType, AdsConsent, AdsConsentStatus, AdsConsentDebugGeography  } from 'react-native-google-mobile-ads';

export default class AdManager {
  static production = false;
  static requestNonPersonalizedAdsOnly = true;

  static interstitial;
  static interstitialID;
  static interstitialLoaded = false;

  static appOpenAd;
  static appOpenID;

  static consentInfo;

  static async initialize() {
    mobileAds().initialize().then(adapterStatuses => {});

    AdManager.interstitialID = AdManager.production ? 'ca-app-pub-1354741235649835/4619107832' : TestIds.INTERSTITIAL;
    AdManager.appOpenID = AdManager.production ?  'ca-app-pub-1354741235649835/9985906585' : TestIds.APP_OPEN;
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
      default:
        console.log("Invalid type");
    }
  }

  static showAd(type = null) {
    if (!type) return;

    switch (type){
      case "interstitial":
        console.log(AdManager.interstitialLoaded);
        if (AdManager.interstitialLoaded) {
          AdManager.interstitial.show();
          AdManager.interstitialLoaded = false;
        }
        break;
      default:
        console.log("Invalid type");
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