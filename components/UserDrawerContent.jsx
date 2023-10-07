import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import FirebaseManager from '../scripts/firebase_manager';
import { useEffect } from 'react';

export default function UserDrawerContent({ navigation, closeDrawer }) {

	useEffect(() => {
		console.log("LOL")
        console.log("FIREBASE UAHT: " + JSON.stringify(FirebaseManager.currentUserData.auth));
		console.log("FIREBASE UAHT: " + JSON.stringify(FirebaseManager.currentUserData.firestoreData)); 
    }, []);

	return (
		<View style={{gap: 35, marginTop: 30}}>
			<TouchableOpacity onPress={() => {
				navigation.navigate("FeedbackScreen");
				closeDrawer();
			}}>
				<Text style={{ fontSize: 15, fontWeight: 500, color: '#5C9BEB' }}>Feedback</Text>
			</TouchableOpacity>
			{FirebaseManager.currentUserData.auth && (<>
				<TouchableOpacity onPress={() => {
					console.log("TEST: " + FirebaseManager.currentUserData?.auth?.uid);
					navigation.navigate("ProfileScreen", { uid: FirebaseManager.currentUserData?.auth?.uid });
					closeDrawer();
				}}>
					<Text style={{ fontSize: 15, fontWeight: 500, color: '#5C9BEB' }}>My profile</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => {
					navigation.navigate("UnblockScreen");
					closeDrawer();
				}}>
					<Text style={{ fontSize: 15, fontWeight: 500, color: '#5C9BEB' }}>Unblock</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => {
					navigation.navigate("ResetPasswordScreen");
					closeDrawer();
				}}>
					<Text style={{ fontSize: 15, fontWeight: 500, color: '#5C9BEB' }}>Reset password</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => {
					FirebaseManager.SignOut();
					closeDrawer();
				}}>
					<Text style={{ fontSize: 15, fontWeight: 500, color: '#5C9BEB' }}>Sign out</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => {
					navigation.navigate("DeleteAccountScreen");
					closeDrawer();
				}}>
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
		</View>
	);
}