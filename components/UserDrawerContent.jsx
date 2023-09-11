import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import FirebaseManager from '../scripts/firebase_manager';

export default function UserDrawerContent({ navigation, closeDrawer }) {

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