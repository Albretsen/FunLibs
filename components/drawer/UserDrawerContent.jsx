import React from 'react';
import FirebaseManager from '../../scripts/firebase_manager';
import DrawerContents from './DrawerContents';
import i18n from '../../scripts/i18n';
import { Linking } from 'react-native';
import Avatar from '../Avatar';

export default function UserDrawerContent({ navigation, closeDrawer }) {

	const handleEmailPress = async () => {
		const url = "mailto:contact@funlibs.app";
		Linking.openURL(url);
	};

	return (<>
		{FirebaseManager.currentUserData.auth && (
			<DrawerContents 
				title={
					`${i18n.t("hey")}, ${FirebaseManager.currentUserData.firestoreData.username ? FirebaseManager.currentUserData.firestoreData.username : null}!`
				}
				imageComponent={<Avatar id={FirebaseManager.currentUserData.firestoreData.avatarID} />}
				sections={
					[
						{
							title: i18n.t("fun_libs"),
							links: [
								{
									title: i18n.t("my_profile"),
									description: "Change your avatar, edit your bio and view the libs you've written.",
									icon: "face",
									onPress: () => {
										navigation.navigate("ProfileScreen", { uid: FirebaseManager.currentUserData?.auth?.uid });
										closeDrawer();
									}
								},
								{
									title: i18n.t("feedback"),
									description: "Experiencing any problems? Let us know!",
									icon: "feedback",
									onPress: () => {
										navigation.navigate("FeedbackScreen");
										closeDrawer();
									}
								},
								{
									title: "contact@funlibs.app",
									description: "Want to get in touch with the Fun Libs team? Write us an email!",
									icon: "mail",
									onPress: () => {
										handleEmailPress();
										// closeDrawer();
									}
								},
								// {
								// 	title: "IAP",
								// 	icon: "monetization-on",
								// 	onPress: () => {
								// 		navigation.navigate("IAPScreen");
								// 		closeDrawer();
								// 	}
								// }
							]
						},
						{
							title: i18n.t("account"),
							links: [
								{
									title: i18n.t("reset_password"),
									description: "Forgotten your password? Reset it here!",
									icon: "lock",
									onPress: () => {
										navigation.navigate("ResetPasswordScreen");
										closeDrawer();
									}
								},
								{
									title: i18n.t("unblock"),
									icon: "block",
									description: "Manage the user's you've blocked.",
									onPress: () => {
										navigation.navigate("UnblockScreen");
										closeDrawer();
									}
								},
								{
									title: i18n.t("sign_out"),
									icon: "logout",
									description: "Sign out of your account.",
									onPress: () => {
										FirebaseManager.SignOut();
										closeDrawer();
									}
								},
								{
									title: i18n.t("delete_account"),
									icon: "person-remove",
									description: "Delete account, along with any content you've posted.",
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
				imageComponent={<Avatar noAvatar="48" />}
				sections={[
					{
						title: i18n.t("fun_libs"),
						links: [
							{
								title: i18n.t("feedback"),
								description: "Experiencing any problems? Let us know!",
								icon: "feedback",
								onPress: () => {
									navigation.navigate("FeedbackScreen");
									closeDrawer();
								}
							},
							{
								title: i18n.t("sign_in"),
								description: "Log in to your existing account.",
								icon: "login",
								onPress: () => {
									navigation.navigate('SignInScreen');
									closeDrawer();
								}
							},
							{
								title: i18n.t("create_new_account"),
								description: "Don't have an account? Create one! This lets you post your libs so that others can play them!",
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