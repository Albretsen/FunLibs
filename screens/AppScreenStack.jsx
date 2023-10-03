import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, Image } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import PlayScreen from "./PlayScreen";
import LibsHomeScreen from "./LibsHomeScreen";
import FeedbackScreen from './FeedbackScreen';
import SignInScreen from "./SignInScreen";
import NewAccountScreen from "./NewAccountScreen";
import DeleteAccountScreen from './DeleteAccountScreen';
import ProfileScreen from './ProfileScreen';
import { useDrawer } from "../components/Drawer";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FirebaseManager from "../scripts/firebase_manager";
import UserDrawerContent from "../components/UserDrawerContent";
import { useNavigation } from '@react-navigation/native';
import ResetPasswordScreen from "./ResetPasswordScreen";
import { BackHandler } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Stack = createStackNavigator();

export default function AppScreenStack() {
    const { openDrawer, closeDrawer } = useDrawer();
	const [key, setKey] = useState(Math.random());

	const navigation = useNavigation();

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

	useEffect(() => {
		const handleFocus = () => {
			// Your desired code to run when "Home" screen is focused goes here
			console.log('Navigated to Home screen!');
		};
	
		// Add the listener for the focus event on the navigation object
		const unsubscribe = navigation.addListener('focus', handleFocus);
	
		// Cleanup the listener when the component is unmounted
		return unsubscribe;
	}, [navigation]);

	const avatarSrc = (FirebaseManager.currentUserData?.firestoreData) 
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
				name="Home"
				component={LibsHomeScreen}
				options={({ route }) => ({
					headerTitle: () => (
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Text style={{ marginRight: 8, fontWeight: 600, fontSize: 17 }}>Fun Libs</Text>
							<Image
								source={require("../assets/images/heart.png")}
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
											style={[{height: 48, width: 48, justifyContent: "center", alignSelf: "center"}, FirebaseManager.currentUserData.firestoreData ? null :  {tintColor: "#5f6368"}]}
											source={
												(FirebaseManager.currentUserData.firestoreData) 
												? FirebaseManager.avatars[FirebaseManager.currentUserData.firestoreData.avatarID]
												: FirebaseManager.avatars["no-avatar-48"]
											}
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
								style={[{ width: 24, height: 24, marginRight: 20 }, FirebaseManager.currentUserData?.firestoreData ? null :  {tintColor: "#5f6368"}]}
								source={
									(FirebaseManager.currentUserData?.firestoreData) 
									? FirebaseManager.avatars[FirebaseManager.currentUserData.firestoreData.avatarID]
									: FirebaseManager.avatars["no-avatar-24"]
								}
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
								source={require("../assets/images/heart.png")}
								style={{ width: 22, height: 20 }}
							/>
						</View>
					),
					headerLeft: (props) => {
						const { onPress } = props;  // Extract default onPress
			
						return (
							<TouchableOpacity onPress={() => {
								
								onPress();
							}}
							style={{ marginLeft: 10 }} 
							>
								<Ionicons name="arrow-back" size={24} color="black" />
							</TouchableOpacity>
						);
					},
					headerTitleAlign: "center",
					headerStyle: standardHeaderStyle,
				}}
			/>
			<Stack.Screen
				name="FeedbackScreen"
				component={FeedbackScreen}
				options={{
					headerTitle: "",
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
			<Stack.Screen
				name="DeleteAccountScreen"
				component={DeleteAccountScreen}
				options={{
					headerTitle: "",
					headerStyle: standardHeaderStyle,
				}}
			/>
			<Stack.Screen
				name="ResetPasswordScreen"
				component={ResetPasswordScreen}
				options={{
					headerTitle: "",
					headerStyle: standardHeaderStyle,
				}}
			/>
			<Stack.Screen
				name="ProfileScreen"
				component={ProfileScreen}
				options={{
					headerTitle: "",
					headerStyle: {
						elevation: 0,
						shadowOpacity: 0,
						borderBottomWidth: 0,
						
						backgroundColor: "transparent"
					},
				}}
			/>
		</Stack.Navigator>
	);
}