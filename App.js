import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import ListItem from '/components/ListItem';
import Header from '/components/Header';
import FixedButton from '/components/FixedButton';
import PlayScreen from './components/PlayScreen';
import data from './libs.json';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStackScreen({ navigation }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={TabNavigation} // Replace LibsScreen with TabNavigation
        options={{
          header: (props) => <Header {...props} navigation={navigation} />,
          title: 'My Home Screen',
        }}
      />
      <Stack.Screen
        name="PlayScreen"
        component={PlayScreen} // Replace LibsScreen with TabNavigation
        // options={{
        //   header: (props) => <Header {...props} navigation={navigation} />,
        //   title: 'My Home Screen',
        // }}
      />
      {/* You can add more Stack.Screens here if you have more pages in your stack */}
    </Stack.Navigator>
  );
}

function TabNavigation() {
  return (
    <Tab.Navigator
      initialRouteName="Libs"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          iconName = focused ? "radio-button-checked" : "radio-button-unchecked";

          // You can return any component that you like here!
          return <MaterialIcons name={iconName} size={16} />;
        },
        tabBarActiveTintColor: "gray",
        tabBarInactiveTintColor: "gray",
        tabBarLabelStyle: {
          fontSize: 14
        },
        tabBarStyle: {
          paddingVertical: 1
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
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
          <Drawer.Screen name="Home" component={HomeStackScreen} />
          {/* <Drawer.Screen name="PlayScreen" component={PlayScreen} /> */}
          {/* You can add more Drawer.Screens here if you have more pages in the drawer */}
        </Drawer.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

function LibsScreen() {
  return (
    <View style={styles.container}>
      <FixedButton />
      <StatusBar style="auto" />
      <ScrollView style={styles.listItemContainer}>
        {data.map((item) => (
          <ListItem name={item.name} id={item.id}></ListItem>
        ))}
      </ScrollView>
    </View>
  );
}

function StoriesScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Stories!</Text>
    </View>
  );
}

function YourLibsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Your Libs!</Text>
    </View>
  );
}

// function PlayScreen() {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Play Lib</Text>
//     </View>
//   );
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});