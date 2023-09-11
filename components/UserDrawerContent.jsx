import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import FirebaseManager from '../scripts/firebase_manager';
import { useDialog, DialogTrigger } from "../components/Dialog";
import { TextInput } from 'react-native-paper';
import globalStyles from '../styles/globalStyles';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default function UserDrawerContent({ navigation, closeDrawer }) {
	const [email, setEmail] = useState("official@funlibs.com")
	const [password, setPassword] = useState("");
	const [passwordVisible, setPasswordVisible] = useState(true);

	const { openDialog } = useDialog();

	const [showDialogDelete, setShowDialogDelete] = useState(false);

	return (
		<View style={{ gap: 35, marginTop: 10 }}>
		<Text style={{ fontSize: 15, fontWeight: 500, color: '#49454F', marginBottom: 5 }}>Security</Text>
		{FirebaseManager.currentUserData.auth && (<>
			<TouchableOpacity>
				<Text style={{ fontSize: 15, fontWeight: 500, color: '#5C9BEB' }}>Reset password</Text>
			</TouchableOpacity>
			<TouchableOpacity onPress={() => {
				FirebaseManager.SignOut();
				closeDrawer();
			}}>
				<Text style={{ fontSize: 15, fontWeight: 500, color: '#5C9BEB' }}>Sign out</Text>
			</TouchableOpacity>
			<TouchableOpacity onPress={() => setShowDialogDelete(true)}>
				<Text style={{ fontSize: 15, fontWeight: 600, color: "#BA1A1A", marginTop: 150 }}>Delete account</Text>
			</TouchableOpacity>
		</>)}
		{!FirebaseManager.currentUserData.auth && (<>
			<TouchableOpacity onPress={() => {
				navigation.navigate('SignInScreen');
				closeDrawer();
			}}>
				<Text style={{ fontSize: 15, fontWeight: 500, color: '#5C9BEB' }}>Sign in</Text>
			</TouchableOpacity>
			<TouchableOpacity onPress={() => {
				navigation.navigate('NewAccountScreen');
				closeDrawer();
			}}>
				<Text style={{ fontSize: 15, fontWeight: 500, color: '#5C9BEB' }}>Create new account</Text>
			</TouchableOpacity>
		</>)}
		<DialogTrigger
			id="dialogInfo"
			show={showDialogDelete}
			onCancel={() => setShowDialogDelete(false)}
			onConfirm={() => {
				setShowDialogDelete(false);
				async () => {
					//await FirebaseManager.SignInWithEmailAndPassword(email, password);
					return;
					FirebaseManager.DeleteUser();
					closeDrawer();
				}
			}}
        >
			<Text style={{ textAlign: 'center', fontWeight: 'bold' }}>Delete Account</Text>
			<Text style={{ textAlign: 'center', marginTop: 10 }}>
				This will delete your account, as well as any content you've published.
			</Text>
			<TextInput
				label="Email"
				value={email}
				onChangeText={email => setEmail(email)}
				mode="outlined"
				theme={{colors:{primary: '#49454F'}}}
			/>
			<View style={{position: "relative"}}>
				<TextInput
					label="Password"
					secureTextEntry={passwordVisible}
					value={password}
					onChangeText={password => setPassword(password)}
					mode="outlined"
					theme={{colors:{primary: '#49454F'}}}
					style={[{paddingRight: 10}]}
				/>
				<TouchableOpacity 
					onPress={() => setPasswordVisible(!passwordVisible)}
					style={globalStyles.inputRightIcon}
				>
					<MaterialIcons
						name={passwordVisible ? "visibility" : "visibility-off"}
						size={22}
					/>
				</TouchableOpacity>
			</View>
		</DialogTrigger>
		</View>
	);
}