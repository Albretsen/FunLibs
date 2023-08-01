//import "expo-dev-client";
import { StyleSheet } from "react-native";
import PlayScreen from "./screens/PlayScreen";
import LibsHomeScreen from "./screens/LibsHomeScreen";
import CreateLibScreen from "./screens/CreateLibScreen";
import { NavigationContainer, getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import LibManager from "./scripts/lib_manager.js";
import ToastProvider from "./components/Toast/ToastProvider";
import SplashScreen from "./screens/SplashScreen";

LibManager.initialize();

const Drawer = createDrawerNavigator();
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
          headerTitle: getHeaderTitle(route),
          headerTitleAlign: "center",
          headerStyle: {
            elevation: 0, // remove shadow on Android
            shadowOpacity: 0, // remove shadow on iOS
            borderBottomWidth: 0, // for explicit border settings
          },
          headerLeft: () => (
            // Size set to 0, effectively hiding the navigation menu, for now.
            <MaterialIcons style={{marginLeft: 12, color: "white"}} name="menu" size={0} onPress={() => navigation.openDrawer()} />
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
          // header: (props) => <Header {...props} leftIcon="Backbutton" navigation={navigation} />,
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
        options={{
          // header: (props) => <Header {...props} leftIcon="Backbutton" navigation={navigation} />,
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
      {/* You can add more Stack.Screens here if you have more pages in your stack */}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <Drawer.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
            <Drawer.Screen name="Home" component={HomeStackScreen} />
            {/* <Drawer.Screen name="PlayScreen" component={PlayScreen} /> */}
            {/* You can add more Drawer.Screens here if you have more pages in the drawer */}
          </Drawer.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </ToastProvider>
  );
}

const styles = StyleSheet.create({

});