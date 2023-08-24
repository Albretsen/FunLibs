//import "expo-dev-client";
import { Text, TouchableOpacity, StyleSheet, View, Image } from "react-native";
import PlayScreen from "./screens/PlayScreen";
import LibsHomeScreen from "./screens/LibsHomeScreen";
import CreateLibScreen from "./screens/CreateLibScreen";
import { NavigationContainer, getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import LibManager from "./scripts/lib_manager.js";
import ToastProvider from "./components/Toast/ToastProvider";
import SplashScreen from "./screens/SplashScreen";
import BannerAdComponent from "./components/BannerAd";
import { useState, createContext } from "react";
import { Provider } from "react-native-paper";
import FirebaseManager from "./scripts/firebase_manager";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import CustomDrawerContent from "./components/CustomDrawerContent";

LibManager.initialize();

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

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
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ marginRight: 8, fontWeight: 600, fontSize: 17 }}>Fun Libs</Text>
              <Image
                source={require("./assets/images/heart.svg")}
                style={{ width: 21, height: 20 }}
              />
            </View>
          ),
          headerTitleAlign: "center",
          headerStyle: {
            elevation: 0, // remove shadow on Android
            shadowOpacity: 0, // remove shadow on iOS
            borderBottomWidth: 0, // for explicit border settings
          },
          headerLeft: () => (
            <MaterialIcons style={{ marginLeft: 12, color: "black" }} name="menu" size={36} onPress={() => navigation.openDrawer()} />
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
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ marginRight: 8, fontWeight: 600, fontSize: 17 }}>Fun Libs</Text>
              <Image
                source={require("./assets/images/heart.svg")}
                style={{ width: 21, height: 20 }}
              />
            </View>
          ),
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
    <Provider> {/* React Native Paper provider */}
      <ScreenProvider>
        <ToastProvider>
          <NavigationContainer>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <Drawer.Navigator
                drawerContent={(props) => <CustomDrawerContent {...props} />}
                screenOptions={{
                  drawerStyle: {
                    borderTopRightRadius: 15, 
                    borderBottomRightRadius: 15,
                  }
                }}
                >
                <Drawer.Screen
                  name="Home"
                  component={HomeStackScreen}
                  options={{headerShown: false}}
                />
              </Drawer.Navigator>
              {/* <HomeStackScreen/> */}
              {/* Place the BannerAdComponent outside of NavigationContainer */}
              <BannerAdComponent bannerAdHeight />
              {/* !Remove before production! */}
              {/* <FixedButton/> */}
            </GestureHandlerRootView>
          </NavigationContainer>
        </ToastProvider>
    </ScreenProvider>
  </Provider>
  );
}

const styles = StyleSheet.create({

});