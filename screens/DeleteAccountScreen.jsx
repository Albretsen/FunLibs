import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, Dimensions, ScrollView } from "react-native";
import { TextInput } from "react-native-paper";
import globalStyles from "../styles/globalStyles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import FirebaseManager from "../scripts/firebase_manager";
import { ToastContext } from "../components/Toast";
import FileManager from "../scripts/file_manager";
import i18n from "../scripts/i18n";

export default function DeleteAccountScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(true);

    const showToast = useContext(ToastContext);

    const navigation = useNavigation();

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    return(
        <View style={[ {alignItems: "center", backgroundColor: '#fff', height: Dimensions.get("window").height- 64}]}>
            <ScrollView style={[{marginBottom: 40, paddingBottom: 40}]}>
                <Text style={[globalStyles.bigWhitespace, {fontSize: 26, fontWeight: 600, marginBottom: 10, alignSelf: "center"}]}>{i18n.t('delete_account')}</Text>
                <Text style={[globalStyles.bigWhitespace, {marginBottom: 20}]}>
				    {i18n.t('this_will_delete_your_account_as_well_as_any_content_you_have_published')}
			    </Text>
                <View style={globalStyles.form}>
                    <View style={globalStyles.formField}>
                        <TextInput
                            autoCapitalize="none"
                            keyboardType="email-address"
                            label={i18n.t('email')}
                            value={email}
                            onChangeText={email => setEmail(email)}
                            mode="outlined"
                            theme={{colors:{primary: '#49454F'}}}
                            style={globalStyles.bigWhitespace}
                        />
                        <Text style={[globalStyles.formSupportText, globalStyles.formErrorText]}>{emailError}</Text>
                    </View>
                    <View style={globalStyles.formField}>
                        <View style={{position: "relative"}}>
                            <TextInput
                                autoCapitalize="none"
                                label={i18n.t('password')}
                                secureTextEntry={passwordVisible}
                                value={password}
                                onChangeText={password => setPassword(password)}
                                mode="outlined"
                                theme={{colors:{primary: '#49454F'}}}
                                style={[globalStyles.bigWhitespace, {paddingRight: 30}]}
                            />
                            <Text style={[globalStyles.formSupportText, globalStyles.formErrorText]}>{passwordError}</Text>
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
                    </View>
                    <TouchableOpacity style={[globalStyles.formButton, globalStyles.bigWhitespace]} onPress={async () => {
                        //setShowDialogDelete(false);
                        try {
                            if (email !== FirebaseManager.currentUserData?.auth?.email) {
                                // showToast("Email does not matched the signed in account");
                                setEmailError(i18n.t('email_does_not_match_the_signed_in_account'));
                                return;
                            }
                            let result = await FirebaseManager.SignInWithEmailAndPassword(email, password);
                            if (!result?.uid) {
                                console.log("Wrong credentials");
                                return;
                            }
                            showToast({text: i18n.t('deleting_account'), loading: true})
                            await FileManager._storeData("uid", "");
                            FirebaseManager.localUID = "";
                            await FirebaseManager.DeleteUser();
                            showToast({text: i18n.t('account_deleted'), loading: false});
                            navigation.navigate("Home");
                        } catch (error) {
                            const errorMessage = FirebaseManager.getAuthErrorMessage(error.code);
                            setEmailError("");
                            setPasswordError("");
                            switch (error.code) {
                                case 'auth/wrong-password':
                                    setPasswordError(i18n.t('wrong_password'))
                                    break;
                                case 'auth/user-not-found':
                                    setEmailError(i18n.t('user_not_found'))
                                    break;
                                case 'auth/user-disabled':
                                    setEmailError(i18n.t('user_not_found'))
                                    break;
                                case 'auth/invalid-email':
                                    setEmailError(i18n.t('there_is_an_issue_with_the_email_format'))
                                    break;
                                case 'auth/operation-not-allowed':
                                    break;
                                case 'auth/too-many-requests':
                                    break;
                                case 'auth/missing-password':
                                    setPasswordError(i18n.t('please_enter_a_password'))
                                    break;
                                default:
                                    //Unknown erorr
                                    break;
                            }

                            showToast(errorMessage);
                        }
                    }}>
                        <Text style={[globalStyles.formButtonLabel]}>{i18n.t('delete')}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
}