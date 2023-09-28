import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, Dimensions, ScrollView } from "react-native";
import { TextInput } from "react-native-paper";
import globalStyles from "../styles/globalStyles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AvatarSelect from "../components/AvatarSelect";
import { useNavigation } from "@react-navigation/native";
import FirebaseManager from "../scripts/firebase_manager";
import { ToastContext } from "../components/Toast";

export default function NewAccountScreen() {
    const [username, setUsername] = useState("test");
    const [email, setEmail] = useState("test@email.com");
    const [password, setPassword] = useState("Test123");
    const [passwordVisible, setPasswordVisible] = useState(true);
    const [confirmPassword, setConfirmPassword] = useState("Test123");
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
            errors.push("Password should be at least " + String(minimum_password_length) + " characters.");
        }
        if (!/[A-Z]/.test(password)) {
            errors.push("Password should contain at least one uppercase letter.");
        }
        if (!/[a-z]/.test(password)) {
            errors.push("Password should contain at least one lowercase letter.");
        }
        if (!/[0-9]/.test(password)) {
            errors.push("Password should contain at least one number.");
        }
        /*if (!/[!@#$%^&*]/.test(password)) {
            errors.push("Password should contain at least one special character (e.g., !@#$%^&*).");
        }*/
    
        return errors;
    }

    const createAccount = () => {
        // Pre Firebase auth validation (Firebase handles the rest): password match, username filled in
        if (!username || username === "") {
            showToast("Add a username.");
            return;
        }
        if (username?.length <= 2) {
            showToast("Username should be at least 3 characters.");
            return;
        }
        if (username?.length > 24) {
            showToast("Username can be max 24 characters.");
            return;
        }
        if (!email || email === "") {
            showToast("Please add an email");
            return;
        }
        if (!password || password === "") {
            showToast("Please add a password");
            return;
        }
        const passwordErrors = validatePassword(password);
        if (passwordErrors.length > 0) {
            showToast(passwordErrors.join('\n\n'));
            return;
        }
        if (!confirmPassword || confirmPassword === "") {
            showToast("Please confirm your password");
            return;
        }
        if (password !== confirmPassword) {
            showToast("Passwords do not match");
            return;
        }
        if (avatarIndex === -1) {
            showToast("Please select a profile picture");
            return;
        }

        showToast("Creating user...");

        try {
            FirebaseManager.CreateUser("email", email, password, username, avatarIndex)
                .then(user => {
                    showToast("Welcome to Fun Libs, " + username + "!");
                    navigation.navigate("Home");
                })
                .catch(error => {
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
                            break
                        default:
                            // Handle unknown errors
                            break;
                    }

                    showToast(errorMessage);
                });
        } catch (error) {
            const errorMessage = FirebaseManager.getCreateAccountErrorMessage(error.code);
            console.log("Error creating account: ", error.message);
            showToast(errorMessage);
        }
    }

    /*const createAccount = async (email, password, username, avatarIndex, navigation) => {
        try {
            const user = await FirebaseManager.CreateUser("email", email, password, username, avatarIndex);
            if (user?.uid) {
                navigation.navigate("Home");
            } else {
                console.error("Error creating account: Unexpected result format");
            }
        } catch (error) {
            const errorMessage = FirebaseManager.getCreateAccountErrorMessage(error.code);
            console.error("Error creating account: ", errorMessage);
    
            switch (error.code) {
                case 'auth/email-already-in-use':
                    // Handle specific logic for this error if needed
                    break;
                case 'auth/invalid-email':
                    // Handle specific logic for this error if needed
                    break;
                case 'auth/operation-not-allowed':
                    // Handle specific logic for this error if needed
                    break;
                case 'auth/weak-password':
                    // Handle specific logic for this error if needed
                    break;
                // Add more error codes and their handling logic as needed
                default:
                    // Handle unknown errors
                    break;
            }
    
            // Handle the error here, e.g. show an error message to the user
            showToast(errorMessage);
        }
    }*/

    const navigation = useNavigation();

    return (
        <View style={[{ alignItems: "center", backgroundColor: '#fff', height: Dimensions.get("window").height - 64 }]}>
            <ScrollView horizontal={false} vertical={true} style={[{ marginBottom: 40, paddingBottom: 40 }]}>
                <Text style={[globalStyles.bigWhitespace, { fontSize: 26, fontWeight: 600, marginBottom: 30, alignSelf: "center" }]}>Create New Account</Text>
                <View style={globalStyles.form}>
                    <TextInput
                        label="Username"
                        value={username}
                        onChangeText={username => setUsername(username)}
                        mode="outlined"
                        theme={{ colors: { primary: '#49454F' } }}
                        style={[globalStyles.bigWhitespace]}
                    />
                    <TextInput
                        label="Email"
                        value={email}
                        onChangeText={email => setEmail(email)}
                        mode="outlined"
                        theme={{ colors: { primary: '#49454F' } }}
                        style={globalStyles.bigWhitespace}
                    />
                    <View style={{ position: "relative" }}>
                        <TextInput
                            label="Password"
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
                            label="Confirm password"
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
                    <AvatarSelect onAvatarChange={handleAvatarChange} />
                    <TouchableOpacity style={[globalStyles.formButton, globalStyles.bigWhitespace]} onPress={createAccount}>
                        <Text style={[globalStyles.formButtonLabel]}>Create</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
}