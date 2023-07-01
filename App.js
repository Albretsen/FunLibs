import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import ListItem from '/components/ListItem';
import Header from '/components/Header';
import FixedButton from '/components/FixedButton';
import data from './libs.json';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Drawer.Screen name="Home" component={HomeStackScreen} />
        {/* You can add more Drawer.Screens here if you have more pages in the drawer */}
      </Drawer.Navigator>
    </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const Stack = createStackNavigator();

// Your stack navigator is now its own component
function HomeStackScreen({ navigation }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          header: (props) => <Header {...props} navigation={navigation} />,  // Pass navigation prop to your Header
          title: 'My Home Screen',
        }}
      />
      {/* You can add more Stack.Screens here if you have more pages in your stack */}
    </Stack.Navigator>
  );
}

function HomeScreen() {
  return (
    <View style={styles.container}>
      <FixedButton />
      <StatusBar style="auto" />
      <ScrollView style={styles.listItemContainer}>
        {data.map((item) => (
          <ListItem name={item.name}></ListItem>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
