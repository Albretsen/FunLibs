import React from 'react';
import FirebaseManager from '../scripts/firebase_manager';
import DrawerContents from './DrawerContents';
import i18n from '../scripts/i18n';
import { Linking } from 'react-native';

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
				imageSrc={
					FirebaseManager.avatars[FirebaseManager.currentUserData.firestoreData.avatarID]
				}
				sections={
					[
						{
							title: i18n.t("fun_libs"),
							links: [
								{
									title: i18n.t("my_profile"),
									icon: "home",
									onPress: () => {
										navigation.navigate("ProfileScreen", { uid: FirebaseManager.currentUserData?.auth?.uid });
										closeDrawer();
									}
								},
								{
									title: i18n.t("feedback"),
									icon: "feedback",
									onPress: () => {
										navigation.navigate("FeedbackScreen");
										closeDrawer();
									}
								},
								{
									title: "contact@funlibs.app",
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
									icon: "lock",
									onPress: () => {
										navigation.navigate("ResetPasswordScreen");
										closeDrawer();
									}
								},
								{
									title: i18n.t("unblock"),
									icon: "block",
									onPress: () => {
										navigation.navigate("UnblockScreen");
										closeDrawer();
									}
								},
								{
									title: i18n.t("sign_out"),
									icon: "logout",
									onPress: () => {
										FirebaseManager.SignOut();
										closeDrawer();
									}
								},
								{
									title: i18n.t("delete_account"),
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
						title: i18n.t("fun_libs"),
						links: [
							{
								title: i18n.t("feedback"),
								icon: "feedback",
								onPress: () => {
									navigation.navigate("FeedbackScreen");
									closeDrawer();
								}
							},
							{
								title: i18n.t("sign_in"),
								icon: "login",
								onPress: () => {
									navigation.navigate('SignInScreen');
									closeDrawer();
								}
							},
							{
								title: i18n.t("create_new_account"),
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