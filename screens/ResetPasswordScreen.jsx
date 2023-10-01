import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, Dimensions, ScrollView } from "react-native";
import { TextInput } from "react-native-paper";
import globalStyles from "../styles/globalStyles";
import { useNavigation } from "@react-navigation/native";
import FirebaseManager from "../scripts/firebase_manager";
import { useDrawer } from "../components/Drawer";
import { ToastContext } from "../components/Toast";
import FileManager from "../scripts/file_manager";

export default function DeleteAccountScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(true);

    const showToast = useContext(ToastContext);

    const navigation = useNavigation();

    const { closeDrawer } = useDrawer();

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    let minimum_password_length = 6;
    const validatePassword = (password) => {
        let errors = [];
    
        if (password.length < minimum_password_length) {
            errors.push("The new password should be at least " + String(minimum_password_length) + " characters.");
        }
        if (!/[A-Z]/.test(password)) {
            errors.push("The new password should contain at least one uppercase letter.");
        }
        if (!/[a-z]/.test(password)) {
            errors.push("The new password should contain at least one lowercase letter.");
        }
        if (!/[0-9]/.test(password)) {
            errors.push("The new password should contain at least one number.");
        }
        /*if (!/[!@#$%^&*]/.test(password)) {
            errors.push("Password should contain at least one special character (e.g., !@#$%^&*).");
        }*/
    
        return errors;
    }

    return(
        <View style={[ {alignItems: "center", backgroundColor: '#fff', height: Dimensions.get("window").height- 64}]}>
            <ScrollView style={[{marginBottom: 40, paddingBottom: 40}]}>
                <Text style={[globalStyles.bigWhitespace, {fontSize: 26, fontWeight: 600, marginBottom: 10, alignSelf: "center"}]}>Reset Password</Text>
                <Text style={[globalStyles.bigWhitespace, {marginBottom: 20}]}>
				    This will send you an email.
			    </Text>
                <View style={globalStyles.form}>
                    <View style={globalStyles.formField}>
                        <TextInput
                            label="Email"
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
                            showToast("Please enter your email!");
                            return;
                        }
                        navigation.navigate("Home");
                        try {
                            FirebaseManager.sendPasswordResetEmail(email);
                        } catch {
                            showToast("There was an error. Please try again later.")
                        }
                        showToast("A password reset email has been sent to " + FirebaseManager.currentUserData?.auth?.email);
                    }}>
                        <Text style={[globalStyles.formButtonLabel]}>Send</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
}