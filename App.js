import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Header from './components/Header';
import PlayScreen from './screens/PlayScreen';
import LibsScreen from './screens/LibsScreen';
import StoriesScreen from './screens/StoriesScreen';
import YourLibsScreen from './screens/YourLibsScreen';
import CreateLibScreen from './screens/CreateLibScreen';
import data from './libs.json';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Lib from './scripts/lib.js';
import FileManager from "./scripts/file_manager.js";
import LibManager from "./scripts/lib_manager.js";
import AdManager from "./scripts/ad_manager.js";
import ToastProvider from './components/Toast/ToastProvider';
import SplashScreen from './screens/SplashScreen';

LibManager.initialize();
//LibManager.storeLib(new Lib("NEW LIB", null, ["Text"], "Suggestion"), "libs");

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStackScreen({ navigation }) {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="SplashScreen"
        component={SplashScreen}>
      </Stack.Screen>
      <Stack.Screen
        name="LibsHomeScreen"
        component={LibsHomeScreen}
        options={{
          // header: (props) => <Header {...props} leftIcon="Hamburger" navigation={navigation} />,
          headerTitle: 'Fun Libs',
          headerTitleAlign: "center",
          headerStyle: {
            elevation: 0, // remove shadow on Android
            shadowOpacity: 0, // remove shadow on iOS
            borderBottomWidth: 0, // for explicit border settings
          },
          headerLeft: () => (
            <MaterialIcons style={{marginLeft: 12, color: "#1c1c1c"}} name="menu" size={34} onPress={() => navigation.openDrawer()} />
          ),
          headerRight: () => (
            <MaterialIcons style={{marginRight: 12, color: "#1c1c1c"}} name="account-circle" size={26} />
          ),
        }}
      />
      <Stack.Screen
        name="PlayScreen"
        component={PlayScreen}
        options={{
          // header: (props) => <Header {...props} leftIcon="Backbutton" navigation={navigation} />,
          headerTitle: 'Fun Libs',
          headerTitleAlign: "center",
          headerStyle: {
            elevation: 0, // remove shadow on Android
            shadowOpacity: 0, // remove shadow on iOS
            borderBottomWidth: 0, // for explicit border settings
          },
          headerRight: () => (
            <MaterialIcons style={{marginRight: 12, color: "#1c1c1c"}} name="account-circle" size={26} />
          )
        }}
      />
      <Stack.Screen
        name="CreateLibScreen"
        component={CreateLibScreen}
        options={{
          // header: (props) => <Header {...props} leftIcon="Backbutton" navigation={navigation} />,
          headerTitle: 'Fun Libs',
          headerTitleAlign: "center",
          headerStyle: {
            elevation: 0, // remove shadow on Android
            shadowOpacity: 0, // remove shadow on iOS
            borderBottomWidth: 0, // for explicit border settings
          },
          headerRight: () => (
            <MaterialIcons style={{marginRight: 12, color: "#1c1c1c"}} name="account-circle" size={26} />
          )
        }}
      />
      {/* You can add more Stack.Screens here if you have more pages in your stack */}
    </Stack.Navigator>
  );
}

function LibsHomeScreen() {
  return (
    <Tab.Navigator
      initialRouteName="Libs"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          iconName = focused ? "radio-button-checked" : "radio-button-unchecked";

          // You can return any component that you like here!
          return (
            <View
              style={{
                height: 30, // or the size you want
                width: 60, // or the size you want
                backgroundColor: focused ? '#abc' : 'transparent', // Change #abc to your preferred color.
                borderRadius: 16, // half of your size to make it circular
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <MaterialIcons name={iconName} size={18} color={focused ? '#49454F' : color} />
            </View>
          );
        },
        tabBarActiveTintColor: "gray",
        tabBarInactiveTintColor: "gray",
        tabBarLabelStyle: {
          fontSize: 16
        },
        tabBarStyle: {
          paddingVertical: 1,
          paddingBottom: 10,
          backgroundColor: "#F0F1EC",
          elevation: 0, // remove shadow on Android
          shadowOpacity: 0, // remove shadow on iOS
          borderTopWidth: 0, // for explicit border settings
          height: 74
        }
      })}
    >
      <Tab.Screen name="Libs" component={LibsScreen} />
      <Tab.Screen name="Stories" component={StoriesScreen} />
      <Tab.Screen name="Your Libs" component={YourLibsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <GestureHandlerRootView style={{flex: 1}}>
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