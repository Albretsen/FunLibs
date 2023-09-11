import { Text, TouchableOpacity, StyleSheet, View, Image, TextInput } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import PlayScreen from "./PlayScreen";
import LibsHomeScreen from "./LibsHomeScreen";
import SignInScreen from "./SignInScreen";
import NewAccountScreen from "./NewAccountScreen";
import SplashScreen from "./SplashScreen";
import { useDrawer } from "../components/Drawer";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FirebaseManager from "../scripts/firebase_manager";
import React, { useEffect, useState } from 'react';
import AvatarCarousel from "../components/AvatarCarousel";
import { DialogTrigger, useDialog } from "../components/Dialog";

const Stack = createStackNavigator();

export default function AppScreenStack({ navigation }) {
    const { openDrawer, closeDrawer } = useDrawer();
	const [key, setKey] = useState(Math.random());

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const { openDialog } = useDialog();

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
					headerStyle: {
						elevation: 0, // remove shadow on Android
						shadowOpacity: 0, // remove shadow on iOS
						borderBottomWidth: 0, // for explicit border settings
					},
					headerLeft: () => (
						<MaterialIcons style={{ marginLeft: 12, color: "#49454F" }} name="menu" size={28} onPress={() => navigation.openDrawer()} />
					),
					headerRight: () => (
						<TouchableOpacity onPress={() => (
							openDrawer({
								header: {
									// component: <Text>Header</Text>,
									headerStyle: {marginHorizontal: 0, marginTop: 10},
									leftComponent: (
										<Image
										style={{height: 45, width: 45, justifyContent: "center", alignSelf: "center"}}
										source={(FirebaseManager.currentUserData.firestoreData) 
											? FirebaseManager.avatars[FirebaseManager.currentUserData.firestoreData.avatarID]
											: FirebaseManager.avatars["no-avatar"]}
										/>
									),
									title: (FirebaseManager.currentUserData.firestoreData) 
									? FirebaseManager.currentUserData.firestoreData.username
									: "Not logged in",
									titleStyle: {fontSize: 15, fontWeight: 500, color: "#49454F"}
								},
								component: (
									<View style={{gap: 35, marginTop: 10}}>
										<Text style={{fontSize: 15, fontWeight: 500, color: "#49454F", marginBottom: 5}}>Security</Text>
										{FirebaseManager.currentUserData.auth && (
											<>
												{/* <TouchableOpacity onPress={() => (
													openDrawer({
														header: {
															title: "Change avatar",
															titleStyle: {fontSize: 15, fontWeight: 500, color: "#49454F"}
														},
														component: (
															<View style={{flexGrow: 0}}>
																<AvatarCarousel initialActiveIndex={15} onAvatarChange={null} inDrawer/>
															</View>
														)
													})
												)}>
													<Text style={{fontSize: 15, fontWeight: 500, color: "#5C9BEB"}}>Change avatar</Text>
												</TouchableOpacity> */}
												<TouchableOpacity>
													<Text style={{fontSize: 15, fontWeight: 500, color: "#5C9BEB"}}>Reset password</Text>
												</TouchableOpacity>
												<TouchableOpacity 
													onPress={() => {
													FirebaseManager.SignOut(),
															closeDrawer()
													}}>
													<Text style={{ fontSize: 15, fontWeight: 500, color: "#5C9BEB" }}>Sign out</Text>
												</TouchableOpacity>
												<Text style={{ fontSize: 15, fontWeight: 500, color: "#5C9BEB" }}></Text>
												<Text style={{ fontSize: 15, fontWeight: 500, color: "#5C9BEB" }}></Text>
												<Text style={{ fontSize: 15, fontWeight: 500, color: "#5C9BEB" }}></Text>
												<TouchableOpacity
													onPress={() => {
														openDialog('discardChangesDialog', {
															onCancel: () => {
																console.log("CANCALLED")
															},
															onConfirm: async () => {
																//await FirebaseManager.SignInWithEmailAndPassword(email, password);
																return;
																FirebaseManager.DeleteUser();
																closeDrawer();
															},
															children: (
																<>
																	<Text style={{ textAlign: 'center', fontWeight: 'bold' }}>Delete Account</Text>
																	<Text style={{ textAlign: 'center', marginTop: 10 }}>
																		This will delete your account, as well as any content published by you.
																	</Text>
																	<TextInput
																		style={{ borderColor: 'gray', borderWidth: 1, padding: 10, borderRadius: 5, marginBottom: 10 }}
																		placeholder="Email"
																		value={email}
																		onChangeText={setEmail}
																		keyboardType="email-address"
																		autoCapitalize="none"
																	/>
																	<TextInput
																		style={{ borderColor: 'gray', borderWidth: 1, padding: 10, borderRadius: 5 }}
																		placeholder="Password"
																		value={password}
																		onChangeText={setPassword}
																		secureTextEntry={true}
																	/>
																</>
															),
															cancelLabel: "Cancel",  // Custom text for the cancel button
															confirmLabel: "Confirm"  // Custom text for the confirm button
														});
													}}
												>
													<Text style={{ fontSize: 15, fontWeight: 600, color: "#BA1A1A" }}>Delete account</Text>
												</TouchableOpacity>
											</>
										)}
										{!FirebaseManager.currentUserData.auth && (
											<>
												<TouchableOpacity 
													onPress={() => {
														navigation.navigate("SignInScreen"),
														closeDrawer()
													}}>
													<Text style={{fontSize: 15, fontWeight: 500, color: "#5C9BEB"}}>Sign in</Text>
												</TouchableOpacity>
												<TouchableOpacity 
												onPress={() => {
													navigation.navigate("NewAccountScreen"),
													closeDrawer()
												}}>
													<Text style={{fontSize: 15, fontWeight: 500, color: "#5C9BEB"}}>Create new accont</Text>
												</TouchableOpacity>
											</>
										)}
									</View>
								),
								closeSide: {left: false, right: true, leftIcon: "arrow-back"},
								containerStyle: {paddingHorizontal: 26}
							})
						)}>

							{/* <MaterialIcons style={{marginRight: 12, color: "#49454F"}} name="account-circle" size={22} />  */}
							<Image
								key={key}
								style={{ width: 22, height: 22, marginRight: 12 }}
								source={
									FirebaseManager.currentUserData.firestoreData ?
										FirebaseManager.avatars[FirebaseManager.currentUserData.firestoreData.avatarID] :
										FirebaseManager.avatars["no-avatar"]
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
								source={require("../assets/images/heart.svg")}
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
				}}
			/>
			<Stack.Screen
				name="SignInScreen"
				component={SignInScreen}
				options={{
					headerTitle: "",
					headerStyle: {
						elevation: 0, // remove shadow on Android
						shadowOpacity: 0, // remove shadow on iOS
						borderBottomWidth: 0, // for explicit border settings
					},
				}}
			/>
			<Stack.Screen
				name="NewAccountScreen"
				component={NewAccountScreen}
				options={{
					headerTitle: "",
					headerStyle: {
						elevation: 0, // remove shadow on Android
						shadowOpacity: 0, // remove shadow on iOS
						borderBottomWidth: 0, // for explicit border settings
					},
				}}
			/>
		</Stack.Navigator>
	);
}