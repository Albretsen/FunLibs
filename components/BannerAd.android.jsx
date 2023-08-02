import React, { useMemo } from 'react';
import { View } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import AdManager from '../scripts/ad_manager';
import FixedButton from './FixedButton';
import { useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { useFocusedScreen } from '../scripts/screen_context.js';

const adUnitId = AdManager.production ? 'ca-app-pub-1354741235649835/9424468100' : TestIds.BANNER;

export default function BannerAdComponent() {
    const [buttonBottom, setButtonBottom] = useState(80); // Default value

    const handleAdFailedToLoad = (error) => {
        setButtonBottom(20);
    };

    const handleAdLoaded = () => {
        setButtonBottom(80);
    };

    // Memoize the BannerAd component to prevent re-creating it on each render
    const memoizedBannerAd = useMemo(
        () => (
            <View style={{ position: 'absolute', bottom: 74, left: 0, zIndex: 200 }}>
                <BannerAd
                    unitId={adUnitId}
                    size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                    //size={BannerAdSize.FULL_BANNER} // 60
                    requestOptions={{
                        requestNonPersonalizedAdsOnly: AdManager.requestNonPersonalizedAdsOnly,
                    }}
                    onAdFailedToLoad={handleAdFailedToLoad}
                    onAdLoaded={handleAdLoaded}
                />
                <FixedButton buttonBottom={buttonBottom} />
            </View>
        ),
        [] // Empty dependency array to ensure the BannerAd is created only once
    );

    return memoizedBannerAd;
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