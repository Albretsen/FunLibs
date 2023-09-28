export default class AdManager {
  static interstitial;
  static interstitialLoaded = false;

  static production = false;

  static initialize() {
  }

  static showRewardedAd() {
    return undefined;
  }

  static loadAd(type = null) {
    return;
  }

  static showAd(type = null) {
    return;
  }
}

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