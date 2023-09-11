import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, Image } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import PlayScreen from "./PlayScreen";
import LibsHomeScreen from "./LibsHomeScreen";
import SignInScreen from "./SignInScreen";
import NewAccountScreen from "./NewAccountScreen";
import SplashScreen from "./SplashScreen";
import { useDrawer } from "../components/Drawer";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FirebaseManager from "../scripts/firebase_manager";
import UserDrawerContent from "../components/UserDrawerContent";

const Stack = createStackNavigator();

export default function AppScreenStack({ navigation }) {
    const { openDrawer, closeDrawer } = useDrawer();
	const [key, setKey] = useState(Math.random());

	useEffect(() => {
        // Define the listener
        const authStateListener = (user) => {
            // Force a re-render by updating the key
            setKey(Math.random());
        };

        // Add the listener
        FirebaseManager.addAuthStateListener(authStateListener);

        // Cleanup the listener on component unmount
        return () => {
            // You might want to create a method in FirebaseManager to remove listeners
            // For now, this is a mock of what it might look like:
            FirebaseManager.removeAuthStateListener(authStateListener);
        };
    }, []);

	const avatarSrc = (FirebaseManager.currentUserData.firestoreData) 
	? FirebaseManager.avatars[FirebaseManager.currentUserData.firestoreData.avatarID]
	: FirebaseManager.avatars["no-avatar"]

	const standardHeaderStyle = {
		elevation: 0, // remove shadow on Android
		shadowOpacity: 0, // remove shadow on iOS
		borderBottomWidth: 0, // for explicit border settings
	}

    return (
		<Stack.Navigator>
			<Stack.Screen
				name="SplashScreen"
				component={SplashScreen}
				options={{
					headerShown: false
				}}
			/>
			<Stack.Screen
				name="LibsHomeScreen"
				component={LibsHomeScreen}
				options={({ route }) => ({
					headerTitle: () => (
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Text style={{ marginRight: 8, fontWeight: 600, fontSize: 17 }}>Fun Libs</Text>
							<Image
								source={require("../assets/images/heart.svg")}
								style={{ width: 21, height: 20 }}
							/>
						</View>
					),
					headerTitleAlign: "center",
					headerStyle: standardHeaderStyle,
					headerLeft: () => (
						// <MaterialIcons style={{ marginLeft: 12, color: "#49454F" }} name="menu" size={28} onPress={() => navigation.openDrawer()} />
						null
					),
					headerRight: () => (
						<TouchableOpacity onPress={() => (
							openDrawer({
								header: {
									headerStyle: {marginHorizontal: 0, marginTop: 10},
									leftComponent: (
										<Image
											style={{height: 45, width: 45, justifyContent: "center", alignSelf: "center"}}
											source={avatarSrc}
										/>
									),
									title: (FirebaseManager.currentUserData.firestoreData) 
									? FirebaseManager.currentUserData.firestoreData.username
									: "Not logged in",
									titleStyle: {fontSize: 15, fontWeight: 500, color: "#49454F"}
								},
								component: <UserDrawerContent navigation={navigation} closeDrawer={closeDrawer}/>,
								closeSide: {left: false, right: true, leftIcon: "arrow-back"},
								containerStyle: {paddingHorizontal: 26}
							})
						)}>
							<Image
								key={key}
								style={{ width: 22, height: 22, marginRight: 12 }}
								source={avatarSrc}
							/>
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
								source={require("../assets/images/heart.svg")}
								style={{ width: 21, height: 20 }}
							/>
						</View>
					),
					headerTitleAlign: "center",
					headerStyle: standardHeaderStyle,
				}}
			/>
			<Stack.Screen
				name="SignInScreen"
				component={SignInScreen}
				options={{
					headerTitle: "",
					headerStyle: standardHeaderStyle,
				}}
			/>
			<Stack.Screen
				name="NewAccountScreen"
				component={NewAccountScreen}
				options={{
					headerTitle: "",
					headerStyle: standardHeaderStyle,
				}}
			/>
		</Stack.Navigator>
	);
}