import React from 'react';
import { View } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import AdManager from '../scripts/ad_manager';
import FixedButton from './FixedButton';
import { useContext } from 'react';

const adUnitId = AdManager.production ? 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy' : TestIds.BANNER;

export default function BannerAdComponent() {
    const handleAdFailedToLoad = (error) => {
        console.log('Ad failed to load:', error);
        // You can perform additional actions here, such as showing a backup ad.
    };

    const handleAdLoaded = () => {
        console.log('Ad successfully loaded');
        // You can perform additional actions here, such as showing the ad to the user.
    };

    return(
        <View style={{position: 'absolute', bottom: 0, left: 0, zIndex: 200}}>
            <BannerAd
                unitId={adUnitId}
                size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                //size={BannerAdSize.FULL_BANNER} // 60
                requestOptions={{
                    requestNonPersonalizedAdsOnly: true,
                }}
                onAdFailedToLoad={handleAdFailedToLoad}
                onAdLoaded={handleAdLoaded}
            />
        </View>
    )
}
/**

<BannerAd
      unitId={adUnitId}
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
    />

*/