import React, { useMemo, useContext } from "react";
import { View, Dimensions } from "react-native";
import {
    BannerAd,
    BannerAdSize,
    TestIds,
} from "react-native-google-mobile-ads";
import AdManager from "../scripts/ad_manager";
import { useState } from "react";
import { ScreenContext } from "../App";
import { useEffect } from "react";

const adUnitId = AdManager.production
    ? "ca-app-pub-1354741235649835/9424468100"
    : TestIds.BANNER;

export default function BannerAdComponent({ setAdHeightInParent }) {
    const { currentScreenName } = useContext(ScreenContext);
    const [adHeight, setAdHeight] = useState(74);

    const [showBannerAd, setShowBannerAd] = useState(false);

    useEffect(() => {
        if (
            ["Home", "Browse", "LibsScreen", "CommunityLibScreen"].includes(
                currentScreenName
            )
        ) {
            setAdHeight(74);
            setShowBannerAd(true);
        } else {
            setAdHeight(0);
            if (currentScreenName == "SplashScreen") setShowBannerAd(false);
        }
    }, [currentScreenName]);

    const handleAdFailedToLoad = (error) => {
        //setButtonBottom(20);
        console.log("Banner ad failed to load: " + error);
    };

    const getAdaptiveBannerHeight = (width) => {
        return 61;
        if (width < 400) {
            return 50; // For screen widths < 400dp
        } else if (width >= 400 && width <= 720) {
            return 90; // For screen widths > 400dp and <= 720dp
        } else {
            return 100; // For screen widths > 720dp
        }
    };

    const handleAdLoaded = (event) => {
        // Dynamically get the width of the screen
        const width = Dimensions.get("window").width;
        // Calculate the height of the ANCHORED_ADAPTIVE_BANNER
        const height = getAdaptiveBannerHeight(width);
        // Set the ad height in the parent component
        setAdHeightInParent(height);
    };

    // Memoize the BannerAd component to prevent re-creating it on each render
    const memoizedBannerAd = useMemo(
        () => (
            <View style={{ bottom: 0, left: 0, zIndex: 200 }}>
                {showBannerAd && (
                    <BannerAd
                        unitId={adUnitId}
                        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                        //size={BannerAdSize.FULL_BANNER} // 60
                        requestOptions={{
                            requestNonPersonalizedAdsOnly:
                                AdManager.requestNonPersonalizedAdsOnly,
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
