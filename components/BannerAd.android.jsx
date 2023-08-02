import React, { useMemo, useContext } from 'react';
import { View } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import AdManager from '../scripts/ad_manager';
import FixedButton from './FixedButton';
import { useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { useFocusedScreen } from '../scripts/screen_context.js';
import { ScreenContext } from '../App';
import { useEffect } from 'react';
import SplashScreen from '../screens/SplashScreen';

const adUnitId = AdManager.production ? 'ca-app-pub-1354741235649835/9424468100' : TestIds.BANNER;

export default function BannerAdComponent() {
    const { currentScreenName } = useContext(ScreenContext);
    const [adHeight, setAdHeight] = useState(74);
    const [buttonBottom, setButtonBottom] = useState(74);

    const [showFixedButton, setShowFixedButton] = useState(false);
    const [showBannerAd, setShowBannerAd] = useState(false);

    useEffect(() => {
        if (["LibsScreen", "StoriesScreen", "YourLibsScreen"].includes(currentScreenName)) {
            setAdHeight(74);
            setShowFixedButton(true);
            setShowBannerAd(true);
        } else {
            setAdHeight(0);
            setShowFixedButton(false);
            if (currentScreenName == "SplashScreen") setShowBannerAd(false);
        }
    }, [currentScreenName])

    const handleAdFailedToLoad = (error) => {
        setButtonBottom(20);
    };

    const handleAdLoaded = () => {
        setButtonBottom(80);
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
                />)}
                {showFixedButton && (
                    <FixedButton buttonBottom={buttonBottom} />
                )}
            </View>
        ),
        [adHeight, showFixedButton] // Empty dependency array to ensure the BannerAd is created only once
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