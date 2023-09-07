import { Text, TouchableOpacity, StyleSheet, View, Image } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import PlayScreen from "./PlayScreen";
import LibsHomeScreen from "./LibsHomeScreen";
import SignInScreen from "./SignInScreen";
import NewAccountScreen from "./NewAccountScreen";
import SplashScreen from "./SplashScreen";
import { useDrawer } from "../components/Drawer";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FirebaseManager from "../scripts/firebase_manager";

const Stack = createStackNavigator();

export default function AppScreenStack({ navigation }) {
    const { openDrawer, closeDrawer } = useDrawer();

	
  
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
									source={(FirebaseManager.currentUserData) 
										? FirebaseManager.avatars[FirebaseManager.currentUserData.firestoreData.avatarID]
										: FirebaseManager.avatars[0]}
									/>
								),
								title: (FirebaseManager.currentUserData) 
								? FirebaseManager.currentUserData.firestoreData.username
								: "Not logged in",
								titleStyle: {fontSize: 15, fontWeight: 500, color: "#49454F"}
								},
								component: (
									<View style={{gap: 35, marginTop: 10}}>
										<Text style={{fontSize: 15, fontWeight: 500, color: "#49454F", marginBottom: 5}}>Security</Text>
										{FirebaseManager.currentUserData && (
											<>
												<TouchableOpacity onPress={() => (
													openDrawer({
														component: (
															<View><Text>Test</Text></View>
														)
													})
												)}>
													<Text style={{fontSize: 15, fontWeight: 500, color: "#5C9BEB"}}>Change username</Text>
												</TouchableOpacity>
												<TouchableOpacity>
													<Text style={{fontSize: 15, fontWeight: 500, color: "#5C9BEB"}}>Change avatar</Text>
												</TouchableOpacity>
												<TouchableOpacity>
													<Text style={{fontSize: 15, fontWeight: 500, color: "#5C9BEB"}}>Reset password</Text>
												</TouchableOpacity>
												<TouchableOpacity 
													onPress={() => {
													FirebaseManager.SignOut(),
													closeDrawer()
												}}>
													<Text style={{fontSize: 15, fontWeight: 500, color: "#5C9BEB"}}>Sign out</Text>
												</TouchableOpacity>
											</>
										)}
										{!FirebaseManager.currentUserData && (
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