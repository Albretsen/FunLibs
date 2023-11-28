import React, { useEffect, useState, useRef } from 'react';
import { Text, TouchableOpacity, View, Image } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import PlayScreen from "./PlayScreen";
import HomeScreen from './HomeScreen';
import BrowseScreen from "./BrowseScreen";
import PackScreen from './PackScreen';
import CreateLibScreen from './CreateLibScreen';
import FeedbackScreen from './FeedbackScreen';
import SignInScreen from "./SignInScreen";
import NewAccountScreen from "./NewAccountScreen";
import DeleteAccountScreen from './DeleteAccountScreen';
import ProfileScreen from './ProfileScreen';
import FirebaseManager from "../scripts/firebase_manager";
import UserDrawerContent from "../components/UserDrawerContent";
import NavigationDrawerContent from '../components/NavigationDrawerContent';
import { useNavigation } from '@react-navigation/native';
import ResetPasswordScreen from "./ResetPasswordScreen";
import { BackHandler } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import UnblockScreen from './UnblockScreen';
import IAPScreen from './IAPScreen';
import i18n from '../scripts/i18n';
import { Drawer } from 'hallvardlh-react-native-drawer';
import globalStyles from '../styles/globalStyles';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Stack = createStackNavigator();

export default function AppScreenStack() {
	const [key, setKey] = useState(Math.random());

	const navigation = useNavigation();

	const userDrawerRef = useRef(null);
	const navigationDrawerRef = useRef(null);

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
            // FirebaseManager.removeAuthStateListener(authStateListener);
        };
    }, []);

	useEffect(() => {
		const handleFocus = () => {
			// Your desired code to run when "Browse" screen is focused goes here
			console.log('Navigated to Browse screen!');
		};
	
		// Add the listener for the focus event on the navigation object
		const unsubscribe = navigation.addListener('focus', handleFocus);
	
		// Cleanup the listener when the component is unmounted
		return unsubscribe;
	}, [navigation]);

	const standardHeaderStyle = {
		elevation: 0, // remove shadow on Android
		shadowOpacity: 0, // remove shadow on iOS
		borderBottomWidth: 0, // for explicit border settings
	}

    return (
		<Stack.Navigator initialRouteName="Home">
			<Stack.Screen
				name="Home"
				component={HomeScreen}
				options={({ route }) => ({
					headerTitle: () => (
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Text style={{ marginRight: 8, fontWeight: "600", fontSize: 17 }}>{i18n.t('fun_libs')}</Text>
							<Icon name="favorite" size={26} color="#6294C9" />
						</View>
					),
					headerTitleAlign: "center",
					headerStyle: standardHeaderStyle,
					headerLeft: () => (
						<>
						<TouchableOpacity onPress={() => navigationDrawerRef.current?.openDrawer()}>
							<Image
								style={{width: 24, height: 12, marginLeft: 20, tintColor: "#5f6368"}}
								source={require("../assets/images/icons/hamburger.png")}
							/>
						</TouchableOpacity>
						<Drawer
							ref={navigationDrawerRef}
							containerStyle={[globalStyles.standardDrawerLeft, {paddingHorizontal: 0}]}
							side="left"
						>
							<NavigationDrawerContent navigation={navigation} closeDrawer={() => navigationDrawerRef.current?.closeDrawer()}/>
						</Drawer>
						</>
					),
					headerRight: () => (
						<>
						<TouchableOpacity onPress={() => userDrawerRef.current?.openDrawer()}>
							<Image
								key={key}
								style={[{ width: 24, height: 24, marginRight: 20 }, FirebaseManager.currentUserData?.firestoreData ? null : {tintColor: "#5f6368"}]}
								source={
									(FirebaseManager.currentUserData?.firestoreData) 
									? FirebaseManager.avatars[FirebaseManager.currentUserData.firestoreData.avatarID]
									: FirebaseManager.avatars["no-avatar-24"]
								}
							/>
						</TouchableOpacity>
						<Drawer
							ref={userDrawerRef}
							containerStyle={globalStyles.standardDrawer}
						>
							<UserDrawerContent navigation={navigation} closeDrawer={() => userDrawerRef.current?.closeDrawer()}/>
						</Drawer>
						</>
					),
				})}
			/>
			<Stack.Screen
				name="Browse"
				component={BrowseScreen}
				options={({ route }) => ({
					headerTitle: () => (
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Text style={{ marginRight: 8, fontWeight: "600", fontSize: 17 }}>{i18n.t('fun_libs')}</Text>
							<Icon name="favorite" size={26} color="#6294C9" />
						</View>
					),
					headerTitleAlign: "center",
					headerStyle: standardHeaderStyle,
					headerLeft: () => (
						<>
						<TouchableOpacity onPress={() => navigationDrawerRef.current?.openDrawer()}>
							<Image
								style={{width: 24, height: 12, marginLeft: 20, tintColor: "#5f6368"}}
								source={require("../assets/images/icons/hamburger.png")}
							/>
						</TouchableOpacity>
						<Drawer
							ref={navigationDrawerRef}
							containerStyle={[globalStyles.standardDrawerLeft, {paddingHorizontal: 0}]}
							side="left"
						>
							<NavigationDrawerContent navigation={navigation} closeDrawer={() => navigationDrawerRef.current?.closeDrawer()}/>
						</Drawer>
						</>
					),
					headerRight: () => (
						<>
						<TouchableOpacity onPress={() => userDrawerRef.current?.openDrawer()}>
							<Image
								key={key}
								style={[{ width: 24, height: 24, marginRight: 20 }, FirebaseManager.currentUserData?.firestoreData ? null : {tintColor: "#5f6368"}]}
								source={
									(FirebaseManager.currentUserData?.firestoreData) 
									? FirebaseManager.avatars[FirebaseManager.currentUserData.firestoreData.avatarID]
									: FirebaseManager.avatars["no-avatar-24"]
								}
							/>
						</TouchableOpacity>
						<Drawer
							ref={userDrawerRef}
							containerStyle={globalStyles.standardDrawer}
						>
							<UserDrawerContent navigation={navigation} closeDrawer={() => userDrawerRef.current?.closeDrawer()}/>
						</Drawer>
						</>
					),
				})}
			/>
			<Stack.Screen
				name="Pack"
				component={PackScreen}
				options={({ route }) => ({
					headerTitle: () => (
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Text style={{ marginRight: 8, fontWeight: "600", fontSize: 17 }}>{i18n.t('lib_packs')}</Text>
							<Icon name="favorite" size={26} color="#6294C9" />
						</View>
					),
					headerTitleAlign: "center",
					headerStyle: standardHeaderStyle,
					headerLeft: () => (
						<>
						<TouchableOpacity onPress={() => navigationDrawerRef.current?.openDrawer()}>
							<Image
								style={{width: 24, height: 12, marginLeft: 20, tintColor: "#5f6368"}}
								source={require("../assets/images/icons/hamburger.png")}
							/>
						</TouchableOpacity>
						<Drawer
							ref={navigationDrawerRef}
							containerStyle={[globalStyles.standardDrawerLeft, {paddingHorizontal: 0}]}
							side="left"
						>
							<NavigationDrawerContent navigation={navigation} closeDrawer={() => navigationDrawerRef.current?.closeDrawer()}/>
						</Drawer>
						</>
					),
					headerRight: () => (
						<>
						<TouchableOpacity onPress={() => userDrawerRef.current?.openDrawer()}>
							<Image
								key={key}
								style={[{ width: 24, height: 24, marginRight: 20 }, FirebaseManager.currentUserData?.firestoreData ? null : {tintColor: "#5f6368"}]}
								source={
									(FirebaseManager.currentUserData?.firestoreData) 
									? FirebaseManager.avatars[FirebaseManager.currentUserData.firestoreData.avatarID]
									: FirebaseManager.avatars["no-avatar-24"]
								}
							/>
						</TouchableOpacity>
						<Drawer
							ref={userDrawerRef}
							containerStyle={globalStyles.standardDrawer}
						>
							<UserDrawerContent navigation={navigation} closeDrawer={() => userDrawerRef.current?.closeDrawer()}/>
						</Drawer>
						</>
					),
				})}
			/>
			<Stack.Screen
				name="Play Lib"
				component={PlayScreen}
				options={{
					headerTitle: () => (
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Text style={{ marginRight: 8, fontWeight: "600", fontSize: 17 }}>{i18n.t('fun_libs')}</Text>
							<Icon name="favorite" size={26} color="#6294C9" />
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
                name="Create"
                component={CreateLibScreen}
				options={{
					headerTitleAlign: "center",
					headerStyle: standardHeaderStyle,
					headerTitle: () => (
						<Text style={{ fontWeight: 600, fontSize: 17 }}>
							{i18n.t('write_a_lib')}
						</Text>
					),
					headerRight: () => (
						<View></View>
					)
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
			<Stack.Screen
				name="UnblockScreen"
				component={UnblockScreen}
				options={{
					headerTitle: "",
					headerStyle: standardHeaderStyle,
				}}
			/>
			<Stack.Screen
				name="IAPScreen"
				component={IAPScreen}
				options={{
					headerTitle: "",
					headerStyle: standardHeaderStyle,
				}}
			/>
		</Stack.Navigator>
	);
}