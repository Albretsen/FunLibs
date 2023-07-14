import mobileAds from 'react-native-google-mobile-ads';
import { AppOpenAd, InterstitialAd, TestIds, AdEventType } from 'react-native-google-mobile-ads';
const delay = ms => new Promise(res => setTimeout(res, ms));

mobileAds().initialize().then(adapterStatuses => {
  //requestInterstitial();
});

let interstitial;

async function requestInterstitial() {
  const adUnitId = TestIds.INTERSTITIAL;

  interstitial = InterstitialAd.createForAdRequest(adUnitId, {
    requestNonPersonalizedAdsOnly: true
  });

  await delay(2000);
  loadInterstitial();
}

async function loadInterstitial() {
  // Preload an app open ad
  interstitial.load();

  await delay(2000);

  showInterstitial();
}

function showInterstitial() {
  interstitial.show();

  //////
}