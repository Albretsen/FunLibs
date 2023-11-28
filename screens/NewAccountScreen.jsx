import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, Dimensions, ScrollView } from "react-native";
import { TextInput } from "react-native-paper";
import globalStyles from "../styles/globalStyles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AvatarSelect from "../components/AvatarSelect";
import { useNavigation } from "@react-navigation/native";
import FirebaseManager from "../scripts/firebase_manager";
import { ToastContext } from "../components/Toast";
import i18n from "../scripts/i18n";

export default function NewAccountScreen() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(true);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(true);
    const initialCarouselAvatarID = 15;
    const [avatarIndex, setAvatarIndex] = useState(-1); // Use a state to hold the current avatar index

    const showToast = useContext(ToastContext);

    const handleAvatarChange = (index) => {
        setAvatarIndex(index);
        console.log(index);
        // Here, you can do anything with the new avatar index
    }

    let minimum_password_length = 6;
    const validatePassword = (password) => {
        let errors = [];
    
        if (password.length < minimum_password_length) {
            errors.push(i18n.t('password_should_be_at_least')+ " " + String(minimum_password_length) + " " + i18n.t('characters.'));
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

    const createAccount = () => {
        // Pre Firebase auth validation (Firebase handles the rest): password match, username filled in
        if (!username || username === "") {
            showToast(i18n.t('add_a_username'));
            return;
        }
        if (username?.length <= 2) {
            showToast(i18n.t('username_should_be_at_least_3_characters'));
            return;
        }
        if (username?.length > 24) {
            showToast(i18n.t('username_can_be_max_24_characters'));
            return;
        }
        if (!email || email === "") {
            showToast(i18n.t('please_add_an_email'));
            return;
        }
        if (!password || password === "") {
            showToast(i18n.t('please_add_a_password'));
            return;
        }
        const passwordErrors = validatePassword(password);
        if (passwordErrors.length > 0) {
            showToast(passwordErrors.join('\n\n'));
            return;
        }
        if (!confirmPassword || confirmPassword === "") {
            showToast(i18n.t('please_confirm_your_password'));
            return;
        }
        if (password !== confirmPassword) {
            showToast(i18n.t('password_do_not_match'));
            return;
        }
        if (avatarIndex === -1) {
            showToast(i18n.t('please_select_a_profile_picture'));
            return;
        }

        showToast({text: i18n.t('creating_account'), loading: true});

        try {
            FirebaseManager.CreateUser("email", email, password, username, avatarIndex)
                .then(user => {
                    showToast({text: i18n.t('welcome_to_fun_libs_comma') + username + "!", loading: false});
                    navigation.navigate("Browse");
                })
                .catch(error => {
                    FirebaseManager.DeleteUser();

                    const errorMessage = FirebaseManager.getCreateAccountErrorMessage(error.code);
                    console.log("Error creating account: ", error.message);

                    switch (error.code) {
                        case 'auth/email-already-in-use':
                            break;
                        case 'auth/invalid-email':
                            break;
                        case 'auth/operation-not-allowed':
                            break;
                        case 'auth/weak-password':
                            break;
                        case 'auth/missing-password':
                            break;
                        default:
                            // Handle unknown errors
                            break;
                    }

                    showToast({text: errorMessage, loading: false});
                });
        } catch (error) {
            const errorMessage = FirebaseManager.getCreateAccountErrorMessage(error.code);
            console.log("Error creating account: ", error.message);
            showToast({text: errorMessage, loading: false});
        }
    }

    const navigation = useNavigation();

    return (
        <View style={[globalStyles.headerAccountedHeight, { alignItems: "center", backgroundColor: '#fff' }]}>
            <ScrollView horizontal={false} vertical={true} style={[globalStyles.standardWhitespace, { marginBottom: 90, paddingBottom: 0 }]}>
                <Text style={[globalStyles.bigWhitespace, {fontSize: 26, fontWeight: "600", marginBottom: 30, alignSelf: "center" }]}>{i18n.t('create_new_account')}</Text>
                <View style={[globalStyles.form]}>
                    <TextInput
                        autoCapitalize="none"
                        label={i18n.t('username')}
                        value={username}
                        onChangeText={username => setUsername(username)}
                        mode="outlined"
                        theme={{ colors: { primary: '#49454F' } }}
                        style={[globalStyles.bigWhitespace]}
                    />
                    <TextInput
                        autoCapitalize="none"
                        keyboardType="email-address"
                        label={i18n.t('email')}
                        value={email}
                        onChangeText={email => setEmail(email)}
                        mode="outlined"
                        theme={{ colors: { primary: '#49454F' } }}
                        style={globalStyles.bigWhitespace}
                    />
                    <View style={{ position: "relative" }}>
                        <TextInput
                            autoCapitalize="none"
                            label={i18n.t('password')}
                            secureTextEntry={passwordVisible}
                            value={password}
                            onChangeText={password => setPassword(password)}
                            mode="outlined"
                            theme={{ colors: { primary: '#49454F' } }}
                            style={[globalStyles.bigWhitespace, { paddingRight: 30 }]}
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
                    <View style={{ position: "relative" }}>
                        <TextInput
                            autoCapitalize="none"
                            label={i18n.t('confirm_password')}
                            secureTextEntry={confirmPasswordVisible}
                            value={confirmPassword}
                            onChangeText={confirmPassword => setConfirmPassword(confirmPassword)}
                            mode="outlined"
                            theme={{ colors: { primary: '#49454F' } }}
                            style={[globalStyles.bigWhitespace, { paddingRight: 30 }]}
                        />
                        <TouchableOpacity
                            onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                            style={globalStyles.inputRightIcon}
                        >
                            <MaterialIcons
                                name={confirmPasswordVisible ? "visibility" : "visibility-off"}
                                size={22}
                            />
                        </TouchableOpacity>
                    </View>
                    <Text style={[globalStyles.bigWhitespace, { fontSize: 22, fontWeight: "600", alignSelf: "center" }]}>{i18n.t('select_your_avatar')}</Text>
                    <AvatarSelect onAvatarChange={handleAvatarChange} height={9} containerIsView />
                </View>
            </ScrollView>
            <TouchableOpacity style={[globalStyles.formButton, globalStyles.bigWhitespace, {position: "absolute", bottom: 30}]} onPress={createAccount}>
                        <Text style={[globalStyles.formButtonLabel]}>{i18n.t('create')}</Text>
                    </TouchableOpacity>
        </View>
    )
}