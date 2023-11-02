import React from 'react';
import FirebaseManager from '../scripts/firebase_manager';
import DrawerContents from './DrawerContents';
import i18n from '../scripts/i18n';

export default function UserDrawerContent({ navigation, closeDrawer }) {
	return (<>
		{FirebaseManager.currentUserData.auth && (
			<DrawerContents 
				title={
					`Hey, ${FirebaseManager.currentUserData.firestoreData.username}!`
				}
				imageSrc={
					FirebaseManager.avatars[FirebaseManager.currentUserData.firestoreData.avatarID]
				}
				sections={
					[
						{
							title: "Fun Libs",
							links: [
								{
									title: "My Profile",
									icon: "home",
									onPress: () => {
										navigation.navigate("ProfileScreen", { uid: FirebaseManager.currentUserData?.auth?.uid });
										closeDrawer();
									}
								},
								{
									title: "Feedback",
									icon: "feedback",
									onPress: () => {
										navigation.navigate("FeedbackScreen");
										closeDrawer();
									}
								},
								{
									title: "IAP",
									icon: "monetization-on",
									onPress: () => {
										navigation.navigate("IAPScreen");
										closeDrawer();
									}
								}

							]
						},
						{
							title: "Account",
							links: [
								{
									title: "Reset Password",
									icon: "lock",
									onPress: () => {
										navigation.navigate("ResetPasswordScreen");
										closeDrawer();
									}
								},
								{
									title: "Unblock",
									icon: "block",
									onPress: () => {
										navigation.navigate("UnblockScreen");
										closeDrawer();
									}
								},
								{
									title: "Sign Out",
									icon: "logout",
									onPress: () => {
										FirebaseManager.SignOut();
										closeDrawer();
									}
								},
								{
									title: "Delete Account",
									icon: "person-remove",
									textColor: "#BA1A1A",
									iconColor: "#BA1A1A",
									onPress: () => {
										navigation.navigate("DeleteAccountScreen");
										closeDrawer();
									}
								}
							]
						},
					]
				}
			/>
		)}
		{!FirebaseManager.currentUserData.auth && (
			<DrawerContents 
				title={i18n.t('not_logged_in')}
				imageSrc={FirebaseManager.avatars["no-avatar-48"]}
				imageStyle={{tintColor: "#5f6368"}}
				sections={[
					{
						title: "Fun Libs",
						links: [
							{
								title: "Feedback",
								icon: "feedback",
								onPress: () => {
									navigation.navigate("FeedbackScreen");
									closeDrawer();
								}
							},
							{
								title: "Sign in",
								icon: "login",
								onPress: () => {
									navigation.navigate('SignInScreen');
									closeDrawer();
								}
							},
							{
								title: "Create new account",
								icon: "person-add",
								onPress: () => {
									navigation.navigate('NewAccountScreen');
									closeDrawer();
								}
							}
						]
					},
				]}
			/>
		)}
	</>)
}