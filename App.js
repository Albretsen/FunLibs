import React from "react";
import { useWindowDimensions, View, Platform, StatusBar } from "react-native";
import { NavigationContainer, getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ToastProvider } from "./components/Toast";
import BannerAdComponent from "./components/BannerAd";
import { useState, createContext } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import AppScreenStack from "./screens/AppScreenStack";
import { DialogProvider } from "./components/Dialog.jsx"
import { TabProvider } from "./components/TabContext.jsx";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import CompatibilityVerification from "./scripts/compatibility_verification.js";
import { MenuProvider } from 'react-native-popup-menu';
import Purchases from "react-native-purchases";
import IAP from "./scripts/IAP.js";
import { SharedParamsProvider } from "./components/SharedParamsProvider";

// Initialize RevenueCat with API key
if (Platform.OS === "android") {
  Purchases.configure({ apiKey: 'goog_XgnhUeKjYuxuYkDsCnROqYgnPpK' });
  IAP.initialize();
} else if (Platform.OS === "ios") {
  Purchases.configure({ apiKey: 'appl_bMsEzGxJwHgmqENbiBWtwshHxOh' });
  IAP.initialize();
}

CompatibilityVerification.RunCompatibilityVerification();

export const ScreenContext = createContext();

export function ScreenProvider({ children }) {
  const [currentScreenName, setCurrentScreenName] = useState(null);

  return (
    <ScreenContext.Provider value={{ currentScreenName, setCurrentScreenName }}>
      {children}
    </ScreenContext.Provider>
  );
}

export default function App() {
  const [bannerAdHeight, setBannerAdHeight] = useState(0);
  const windowHeight = useWindowDimensions().height;

  const ConditionalWrapper = ({ children }) => {
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      return (
        <View style={[{ minHeight: Math.round(windowHeight) }]}>
          {children}
        </View>
      );
    }
    return children;
  };

  const ConditionalSafeAreaView = ({ children }) => {
    if (Platform.OS === 'android') {
      return (
        <SafeAreaView>
          {children}
        </SafeAreaView>
      );
    }
    return children;
  };

  // The outer view makes sure the Android keyboard doesn't move all UI elements to above the keyboard.
  return (
    <ConditionalWrapper>
      <StatusBar barStyle="dark-content" />
      <MenuProvider>
        <SafeAreaProvider>
          <PaperProvider>
            <SharedParamsProvider>
              <ScreenProvider>
                <ToastProvider>
                  <DialogProvider>
                      <TabProvider>
                        <NavigationContainer>
                          <GestureHandlerRootView style={{ flex: 1, paddingBottom: 0 }}>
                            <AppScreenStack />
                            <ConditionalSafeAreaView>
                              <BannerAdComponent setAdHeightInParent={setBannerAdHeight} />
                            </ConditionalSafeAreaView>
                          </GestureHandlerRootView>
                        </NavigationContainer>
                      </TabProvider>
                  </DialogProvider>
                </ToastProvider>
              </ScreenProvider>
            </SharedParamsProvider>
          </PaperProvider>
        </SafeAreaProvider>
      </MenuProvider>
    </ConditionalWrapper>
  );
}