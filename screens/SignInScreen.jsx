import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { TextInput } from "react-native-paper";
import globalStyles from "../styles/globalStyles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FirebaseManager from "../scripts/firebase_manager";
import { useNavigation } from "@react-navigation/native";
import { ToastContext } from "../components/Toast";
import i18n from "../scripts/i18n";

export default function SignInScreen() {
    const [email, setEmail] = useState("official@funlibs.com");
    const [password, setPassword] = useState("123456");
    const [passwordVisible, setPasswordVisible] = useState(true);

    const showToast = useContext(ToastContext);

    const signIn = async () => {
        showToast({text: i18n.t('signing_in'), noBottomMargin: true, loading: true});
        try {
            let result = await FirebaseManager.SignInWithEmailAndPassword(email, password);
            if (result?.uid) {
                showToast({text: i18n.t('signed_in_as') + " " + FirebaseManager.currentUserData.firestoreData.username, noBottomMargin: true, loading: false});
                navigation.navigate("Browse");
            } else {
                showToast({text: i18n.t('error_signing_in'), noBottomMargin: true, loading: false});
                console.log("SIGN IN FAILED: Unexpected result format");
            }
        } catch (error) {
            const errorMessage = FirebaseManager.getAuthErrorMessage(error.code);
            console.log("ACTUAL ERROR: " + error);
            switch (error.code) {
                case 'auth/wrong-password':
                    break;
                case 'auth/user-not-found':
                    break;
                case 'auth/user-disabled':
                    break;
                case 'auth/invalid-email':
                    break;
                case 'auth/operation-not-allowed':
                    break;
                case 'auth/too-many-requests':
                    break;
                default:
                    //Unknown erorr
                    break;
            }

            showToast({text: errorMessage, noBottomMargin: true, loading: false});
        }
    }

    const navigation = useNavigation();

    return(
        <View style={[globalStyles.screenStandard]}>
            <View style={[globalStyles.bigWhitespace, {marginTop: 40, height: Dimensions.get("window").height - 128}]}>
                <Text style={{fontSize: 26, fontWeight: "600", marginBottom: 30}}>{i18n.t('sign_in')}</Text>
                <View style={globalStyles.form}>
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
                    <TouchableOpacity onPress={() => {
                        navigation.navigate("ResetPasswordScreen");
                    }}>
                        <Text style={[globalStyles.bigWhitespace, { marginBottom: 20 }]}>{i18n.t('forgot_password')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[globalStyles.bigWhitespace, globalStyles.formButton]} onPress={signIn}>
                        <Text style={globalStyles.formButtonLabel}>{i18n.t('sign_in')}</Text>
                    </TouchableOpacity>
                </View>
                <View style={globalStyles.formBottomText}>
                    <Text>{i18n.t('dont_have_an_account')}</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("NewAccountScreen")}>
                        <Text style={globalStyles.formBottomTextHighlight}> {i18n.t('create_a_new_one')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}