import mobileAds from 'react-native-google-mobile-ads';
import { InterstitialAd, TestIds, AdEventType } from 'react-native-google-mobile-ads';

export default class AdManager {
  static interstitial;
  static interstitialLoaded = false;

  static production = false;

  static interstitialID;

  static initialize() {
    mobileAds().initialize().then(adapterStatuses => {});

    AdManager.interstitialID = AdManager.production ? 'ca-app-pub-1354741235649835/4619107832' : TestIds.INTERSTITIAL;

    AdManager.interstitial = InterstitialAd.createForAdRequest(AdManager.interstitialID, {
      requestNonPersonalizedAdsOnly: true
    });

    AdManager.interstitial.addAdEventListener(AdEventType.LOADED, () => {
      AdManager.interstitialLoaded = true;
    });

    AdManager.loadAd("interstitial");
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