//import "expo-dev-client";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import PlayScreen from "./screens/PlayScreen";
import LibsHomeScreen from "./screens/LibsHomeScreen";
import CreateLibScreen from "./screens/CreateLibScreen";
import { NavigationContainer, getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import LibManager from "./scripts/lib_manager.js";
import ToastProvider from "./components/Toast/ToastProvider";
import SplashScreen from "./screens/SplashScreen";
import BannerAdComponent from "./components/BannerAd";
import { useState, createContext } from "react";
import FixedButton from "./components/FixedButton";

LibManager.initialize();

const Stack = createStackNavigator();

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

function HomeStackScreen({ navigation }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{
          headerShown: false
        }}>
      </Stack.Screen>
      <Stack.Screen
        name="LibsHomeScreen"
        component={LibsHomeScreen}
        options={({ route }) => ({
          // headerTitle: getHeaderTitle(route),
          headerTitle: "Fun Libs",
          headerTitleAlign: "center",
          headerStyle: {
            elevation: 0, // remove shadow on Android
            shadowOpacity: 0, // remove shadow on iOS
            borderBottomWidth: 0, // for explicit border settings
          },
          headerLeft: () => (
            null
            // <MaterialIcons style={{ marginLeft: 12, color: "black" }} name="menu" size={36} onPress={() => navigation.openDrawer()} />
          ),
          // headerRight: () => (
          //   <MaterialIcons style={{marginRight: 12, color: "#1c1c1c"}} name="account-circle" size={26} />
          // ),
        })}
      />
      <Stack.Screen
        name="PlayScreen"
        component={PlayScreen}
        options={{
          headerTitle: "Fun Libs",
          headerTitleAlign: "center",
          headerStyle: {
            elevation: 0, // remove shadow on Android
            shadowOpacity: 0, // remove shadow on iOS
            borderBottomWidth: 0, // for explicit border settings
          },
          // headerRight: () => (
          //   <MaterialIcons style={{marginRight: 12, color: "#1c1c1c"}} name="account-circle" size={26} />
          // )
        }}
      />
      <Stack.Screen
        name="CreateLibScreen"
        component={CreateLibScreen}
        options={({ route }) => ({
          headerTitle: "Create New Lib",
          headerTitleAlign: "center",
          headerStyle: {
            elevation: 0, // remove shadow on Android
            shadowOpacity: 0, // remove shadow on iOS
            borderBottomWidth: 0, // for explicit border settings
          },
          headerRight: () => (
            <TouchableOpacity onPress={() => route.params?.saveLib()}>
              <Text style={{marginRight: 20, fontSize: 20, color: "#006D40", fontWeight: 600}}>Save</Text>
            </TouchableOpacity>
          )
        })}
      />
      {/* You can add more Stack.Screens here if you have more pages in your stack */}
    </Stack.Navigator>
  );
}

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
  const [bannerAdHeight, setBannerAdHeight] = useState(74);

  return (
    <ScreenProvider>
      <ToastProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          {/* Place the BannerAdComponent outside of NavigationContainer */}
          <NavigationContainer>
            <BannerAdComponent bannerAdHeight />
             <HomeStackScreen/>
             <FixedButton/>
          </NavigationContainer>
        </GestureHandlerRootView>
      </ToastProvider>
  </ScreenProvider>
  );
}

const styles = StyleSheet.create({

});