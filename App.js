//import "expo-dev-client";
import { Text, TouchableOpacity, StyleSheet, View, Image } from "react-native";
import { useRef } from "react";
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
import { DrawerProvider, useDrawer } from "./components/Drawer";

LibManager.initialize();

const Stack = createStackNavigator();
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

function HomeStackScreen({ navigation }) {

  const { openDrawer } = useDrawer();

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
            <MaterialIcons style={{ marginLeft: 12, color: "49454F" }} name="menu" size={28} onPress={() => navigation.openDrawer()} />
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => (
              openDrawer(
                {
                  header: {
                    // component: <Text>Header</Text>,
                    headerStyle: {marginHorizontal: 0, marginTop: 10},
                    leftComponent: (
                      <Image
                        style={{height: 45, width: 45, justifyContent: "center", alignSelf: "center"}}
                        source={require("./assets/images/avatars/2.png")}
                      />
                    ),
                    title: "Username",
                    titleStyle: {fontSize: 15, fontWeight: 500, color: "#49454F"}
                  },
                  component: (
                    <View style={{gap: 35, marginTop: 10}}>
                      <Text style={{fontSize: 15, fontWeight: 500, color: "#49454F", marginBottom: 5}}>Security</Text>
                      <TouchableOpacity>
                        <Text style={{fontSize: 15, fontWeight: 500, color: "#5C9BEB"}}>Change username</Text>
                      </TouchableOpacity>
                      <TouchableOpacity>
                        <Text style={{fontSize: 15, fontWeight: 500, color: "#5C9BEB"}}>Change avatar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity>
                        <Text style={{fontSize: 15, fontWeight: 500, color: "#5C9BEB"}}>Reset password</Text>
                      </TouchableOpacity>
                      <TouchableOpacity>
                        <Text style={{fontSize: 15, fontWeight: 500, color: "#5C9BEB"}}>Sign out</Text>
                      </TouchableOpacity>
                    </View>
                  ),
                  closeSide: {left: false, right: true, leftIcon: "arrow-back"},
                  containerStyle: {paddingHorizontal: 26}
                }
              )
            )}>
            <MaterialIcons style={{marginRight: 12, color: "#49454F"}} name="account-circle" size={22} />
              </TouchableOpacity>
          ),
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
      {/* <Stack.Screen
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
      /> */}
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
          <DrawerProvider>
            <NavigationContainer>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <DrawerNav.Navigator
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
                    component={HomeStackScreen}
                    options={{headerShown: false}}
                  />
                </DrawerNav.Navigator>
                {/* <HomeStackScreen/> */}
                {/* Place the BannerAdComponent outside of NavigationContainer */}
                <BannerAdComponent bannerAdHeight />
              </GestureHandlerRootView>
            </NavigationContainer>
          </DrawerProvider>
        </ToastProvider>
    </ScreenProvider>
  </Provider>
  );
}

const styles = StyleSheet.create({

});