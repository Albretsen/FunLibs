import React, { useMemo, useContext } from 'react';
import { View } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import AdManager from '../scripts/ad_manager';
import { useState } from 'react';
import { ScreenContext } from '../App';
import { useEffect } from 'react';

const adUnitId = AdManager.production ? 'ca-app-pub-1354741235649835/2448171228' : TestIds.BANNER;

export default function BannerAdComponent() {
    const { currentScreenName } = useContext(ScreenContext);
    const [adHeight, setAdHeight] = useState(74);

    const [showBannerAd, setShowBannerAd] = useState(false);

    useEffect(() => {
        if (["LibsScreen", "StoriesScreen", "YourLibsScreen"].includes(currentScreenName)) {
            setAdHeight(74);
            setShowBannerAd(true);
        } else {
            setAdHeight(0);
            if (currentScreenName == "SplashScreen") setShowBannerAd(false);
        }
    }, [currentScreenName])

    const handleAdFailedToLoad = (error) => {
        //setButtonBottom(20);
    };

    const handleAdLoaded = () => {
        //setButtonBottom(80);
    };

    // Memoize the BannerAd component to prevent re-creating it on each render
    const memoizedBannerAd = useMemo(
        () => (
            <View style={{ position: 'absolute', bottom: adHeight, left: 0, zIndex: 200 }}>
                {showBannerAd && (
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
                )}
            </View>
        ),
        [adHeight] // Empty dependency array to ensure the BannerAd is created only once
    );

    return memoizedBannerAd;
}