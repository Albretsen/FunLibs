//import "expo-dev-client";
import React from "react";
import { StyleSheet, useWindowDimensions, View, Platform } from "react-native";
import { NavigationContainer, getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import LibManager from "./scripts/lib_manager.js";
import { ToastProvider } from "./components/Toast";
import BannerAdComponent from "./components/BannerAd";
import { useState, createContext } from "react";
import { Provider } from "react-native-paper";
import FirebaseManager from "./scripts/firebase_manager";
import CustomDrawerContent from "./components/CustomDrawerContent";
import { DrawerProvider } from "./components/Drawer";
import AppScreenStack from "./screens/AppScreenStack";
import { DialogProvider } from "./components/Dialog.jsx"
import { TabProvider } from "./components/TabContext.jsx";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import CompatibilityVerification from "./scripts/compatibility_verification.js";
import { MenuProvider } from 'react-native-popup-menu';
import DeepLinkHandler from './components/DeepLinkHandler.jsx'

CompatibilityVerification.RunCompatibilityVerification();

const DrawerNav = createDrawerNavigator();

const getHeaderTitle = (route) => {
  // If the focused route is not found, use the screen"s name
  const routeName = getFocusedRouteNameFromRoute(route) ?? "Libs";

  switch (routeName) {
    case "Libs":
      return "Fun Libs";
    case "Stories":
      return "Stories";
    case "Your Libs":
      return "Your Libs";
    default:
      return "Fun Libs";
  }
};

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

  const handleDeepLink = ({ path, queryParams }) => {
    // Handle the deep link: navigate to the correct screen or perform other actions
    console.log('Received deep link:', path, queryParams);
  };

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

  return (
    // This outer view makes sure the Android keyboard doesn't move all UI elements to above the keyboard.
    <ConditionalWrapper>
      <DeepLinkHandler onDeepLink={handleDeepLink} />
      <MenuProvider>
        <SafeAreaProvider>
          <Provider>
            <ScreenProvider>
              <ToastProvider>
                <DialogProvider>
                  <DrawerProvider>
                    <TabProvider>
                      <NavigationContainer>
                        <GestureHandlerRootView style={{ flex: 1, paddingBottom: 0 }}>
                          <AppScreenStack />
                          <SafeAreaView>
                          <BannerAdComponent setAdHeightInParent={setBannerAdHeight} />
                          </SafeAreaView>
                        </GestureHandlerRootView>
                      </NavigationContainer>
                    </TabProvider>
                  </DrawerProvider>
                </DialogProvider>
              </ToastProvider>
            </ScreenProvider>
          </Provider>
        </SafeAreaProvider>
      </MenuProvider>
    </ConditionalWrapper>
  );
}

// If drawer navigation ever is desired again, here's the code: 
{/* <DrawerNav.Navigator
  drawerContent={(props) => <CustomDrawerContent {...props} />}
  screenOptions={{
    drawerStyle: {
      borderTopRightRadius: 15,
      borderBottomRightRadius: 15,
    }
  }}
>
  <DrawerNav.Screen
    name="Home"
    component={AppScreenStack}
    options={{ headerShown: false }}
  />
</DrawerNav.Navigator> */}

const styles = StyleSheet.create({

});