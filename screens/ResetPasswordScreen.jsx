import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, Dimensions, ScrollView } from "react-native";
import { TextInput } from "react-native-paper";
import globalStyles from "../styles/globalStyles";
import { useNavigation } from "@react-navigation/native";
import FirebaseManager from "../scripts/firebase_manager";
import { ToastContext } from "../components/Toast";
import FileManager from "../scripts/file_manager";
import i18n from "../scripts/i18n";
import { t } from "i18n-js";

export default function DeleteAccountScreen() {
    const [email, setEmail] = useState("");

    const showToast = useContext(ToastContext);

    const navigation = useNavigation();

    const [emailError, setEmailError] = useState("");

    let minimum_password_length = 6;
    const validatePassword = (password) => {
        let errors = [];
    
        if (password.length < minimum_password_length) {
            errors.push(i18n.t('password_should_be_at_least') + " " + String(minimum_password_length) + " " + i18n.t('characters'));
        }
        if (!/[A-Z]/.test(password)) {
            errors.push(i18n.t('password_should_contain_at_least_one_uppercase_letter'));
        }
        if (!/[a-z]/.test(password)) {
            errors.push(i18n.t('password_should_contain_at_least_one_lowercase_letter'));
        }
        if (!/[0-9]/.test(password)) {
            errors.push(i18n.t('password_should_contain_at_least_one_number'));
        }
        /*if (!/[!@#$%^&*]/.test(password)) {
            errors.push("Password should contain at least one special character (e.g., !@#$%^&*).");
        }*/
    
        return errors;
    }

    return(
        <View style={[ {alignItems: "center", backgroundColor: '#fff', height: Dimensions.get("window").height- 64}]}>
            <ScrollView style={[{marginBottom: 40, paddingBottom: 40}]}>
                <Text style={[globalStyles.bigWhitespace, {fontSize: 26, fontWeight: 600, marginBottom: 10, alignSelf: "center"}]}>{i18n.t('reset_password')}</Text>
                <Text style={[globalStyles.bigWhitespace, {marginBottom: 20}]}>
				    {i18n.t('this_will_send_you_an_email')}
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
                    <TouchableOpacity style={[globalStyles.formButton, globalStyles.bigWhitespace]} onPress={async () => {
                        //setShowDialogDelete(false);
                        if (!FirebaseManager.currentUserData?.auth?.email || !email) {
                            showToast({text: i18n.t('please_enter_your_email'), noBottomMargin: true});
                            return;
                        }
                        navigation.navigate("Home");
                        try {
                            FirebaseManager.sendPasswordResetEmail(email);
                        } catch {
                            showToast({text: i18n.t('there_was_an_error_please_try_again_later'), noBottomMargin: true});
                        }
                        showToast({text: i18n.t('a_password_reset_email_has_been_sent_to') + " " + FirebaseManager.currentUserData?.auth?.email, noBottomMargin: true});
                    }}>
                        <Text style={[globalStyles.formButtonLabel]}>{i18n.t('send')}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
}