import mobileAds from 'react-native-google-mobile-ads';
import { AppState } from 'react-native';
import { InterstitialAd, AppOpenAd, RewardedInterstitialAd, RewardedAdEventType, TestIds, AdEventType, AdsConsent, AdsConsentStatus, AdsConsentDebugGeography } from 'react-native-google-mobile-ads';
import FileManager from './file_manager';

export default class AdManager {
  static production = true;
  static requestNonPersonalizedAdsOnly = true;

  static interstitial;
  static interstitialID;
  static interstitialLoaded = false;
  static interstitialShownRecently = false;

  static rewarded;
  static rewardedID;
  static rewardedLoaded = false;
  static rewardedShownRecently = false;

  static appOpenAd;
  static appOpenID;

  static consentInfo;

  static async initialize() {
    mobileAds().initialize().then(adapterStatuses => { });

    AdManager.interstitialID = AdManager.production ? 'ca-app-pub-1354741235649835/4619107832' : TestIds.INTERSTITIAL;
    AdManager.rewardedID = AdManager.production ? 'ca-app-pub-1354741235649835/6730355149' : TestIds.REWARDED_INTERSTITIAL;
    AdManager.appOpenID = AdManager.production ? 'ca-app-pub-1354741235649835/9985906585' : TestIds.APP_OPEN;
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

    // Initialize appState
    AdManager.appState = AppState.currentState;

    // Listen for app state changes
    AppState.addEventListener('change', AdManager.handleAppStateChange);

    /* APP OPEN ADS */
    AdManager.appOpenAd = AppOpenAd.createForAdRequest(AdManager.appOpenID, {
      requestNonPersonalizedAdsOnly: AdManager.requestNonPersonalizedAdsOnly,
    });

    // Load the App Open Ad
    AdManager.appOpenAd.load();

    // Listen for app state changes
    AppState.addEventListener('change', AdManager.handleAppStateChange);
  }

  static handleAppStateChange(nextAppState) {
    console.log(":::::::::::::::::::::::::::::::::::::::::::::::::::::::::: " + AdManager.rewardedShownRecently);
    if (
      AdManager.appState &&
      AdManager.appState.match(/inactive|background/) &&
      nextAppState === 'active' &&
      !AdManager.interstitialShownRecently && !AdManager.rewardedShownRecently// Only show if interstitial wasn't shown recently
    ) {
      console.log('App has come to the foreground!');
      AdManager.showAppOpenAd();
    }
    AdManager.appState = nextAppState;
  }


  static async showAppOpenAd() {
    if (AdManager.appOpenAd) {
      try {
        let result = await FileManager._retrieveData("database_reads");
        if (result) {
          result = parseInt(result)
          if (result > 30) { AdManager.showAd("appOpen") }
        }
      } catch {
        console.log("App open not loaded");
      }

      // Reload the App Open Ad for next time
      AdManager.appOpenAd.load();
    } else {
      console.log('App Open Ad is not loaded yet');
    }
  }

  static showRewardedAd() {
    return true;
    return new Promise((resolve) => {
      if (!AdManager.rewardedLoaded) {
        console.log('Rewarded ad not loaded');
        resolve(undefined);
        return;
      }

      const unsubscribeEarned = AdManager.rewarded.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD,
        reward => {
          console.log('User earned reward of ', reward);
          unsubscribeAll();
          resolve(true);
        },
      );

      const unsubscribeClosed = AdManager.rewarded.addAdEventListener(
        AdEventType.CLOSED,
        () => {
          console.log('Rewarded ad was closed without reward');
          unsubscribeAll();
          resolve(false);
        },
      );

      const unsubscribeError = AdManager.rewarded.addAdEventListener(
        AdEventType.ERROR,
        error => {
          console.error('Error occurred while showing rewarded ad', error);
          unsubscribeAll();
          resolve(undefined);
        },
      );

      const unsubscribeAll = () => {
        unsubscribeEarned();
        unsubscribeClosed();
        unsubscribeError();
      };

      console.log('Showing rewarded ad');
      AdManager.rewardedShownRecently = true;
      setTimeout(() => {
        AdManager.rewardedShownRecently = false;
      }, 50000);  // Reset the flag after 5 seconds
      AdManager.rewarded.show();
      AdManager.rewardedLoaded = false;
      AdManager.loadAd('rewarded');
    });
  }

  static loadAd(type = null) {
    if (!type) return;

    switch (type) {
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
        break;
      default:
        console.log("Invalid type --");
    }
  }

  static showAd(type = null) {
    if (!type) return;

    switch (type) {
      case "interstitial":
        return;
        if (AdManager.interstitialLoaded) {
          AdManager.interstitial.show();
          AdManager.interstitialLoaded = false;
          AdManager.interstitialShownRecently = true;
          setTimeout(() => {
            AdManager.interstitialShownRecently = false;
          }, 50000);  // Reset the flag after 5 seconds
        }
        break;
      case "rewarded":
        if (AdManager.rewardedLoaded) {
          AdManager.rewarded.show();
          AdManager.rewardedLoaded = false;
          AdManager.rewardedShownRecently = true;
          setTimeout(() => {
            AdManager.rewardedShownRecently = false;
          }, 50000);  // Reset the flag after 5 seconds
          AdManager.loadAd("rewarded");
        }
        break;
      case "appOpen":
        return;
        AdManager.appOpenAd.show();
        break;
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