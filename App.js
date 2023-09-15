//import "expo-dev-client";
import { StyleSheet } from "react-native";
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
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CompatibilityVerification from "./scripts/compatibility_verification.js";

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

  return (
    <SafeAreaProvider>
      <Provider>
        <ScreenProvider>
          <ToastProvider>
            <DialogProvider>
              <DrawerProvider>
                <TabProvider>
                  <NavigationContainer>
                    <GestureHandlerRootView style={{ flex: 1, paddingBottom: bannerAdHeight }}>
                      <AppScreenStack />
                      <BannerAdComponent setAdHeightInParent={setBannerAdHeight} />
                    </GestureHandlerRootView>
                  </NavigationContainer>
                </TabProvider>
              </DrawerProvider>
            </DialogProvider>
          </ToastProvider>
        </ScreenProvider>
      </Provider>
    </SafeAreaProvider>
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