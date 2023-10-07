import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, Dimensions, ScrollView } from "react-native";
import { TextInput } from "react-native-paper";
import globalStyles from "../styles/globalStyles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import FirebaseManager from "../scripts/firebase_manager";
import { useDrawer } from "../components/Drawer";
import { ToastContext } from "../components/Toast";
import FileManager from "../scripts/file_manager";

export default function DeleteAccountScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(true);

    const showToast = useContext(ToastContext);

    const navigation = useNavigation();

    const { closeDrawer } = useDrawer();

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    return(
        <View style={[ {alignItems: "center", backgroundColor: '#fff', height: Dimensions.get("window").height- 64}]}>
            <ScrollView style={[{marginBottom: 40, paddingBottom: 40}]}>
                <Text style={[globalStyles.bigWhitespace, {fontSize: 26, fontWeight: 600, marginBottom: 10, alignSelf: "center"}]}>Delete Account</Text>
                <Text style={[globalStyles.bigWhitespace, {marginBottom: 20}]}>
				    This will delete your account, as well as any content you've published.
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
                    <View style={globalStyles.formField}>
                        <View style={{position: "relative"}}>
                            <TextInput
                                label="Password"
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
                                setEmailError("Email does not match the signed in account");
                                return;
                            }
                            let result = await FirebaseManager.SignInWithEmailAndPassword(email, password);
                            if (!result?.uid) {
                                console.log("Wrong credentials");
                                return;
                            }
                            showToast({text: "Deleting account...", loading: true})
                            await FileManager._storeData("uid", "");
                            FirebaseManager.localUID = "";
                            await FirebaseManager.DeleteUser();
                            showToast({text: "Account deleted.", loading: false});
                            navigation.navigate("Home");
                        } catch (error) {
                            const errorMessage = FirebaseManager.getAuthErrorMessage(error.code);
                            setEmailError("");
                            setPasswordError("");
                            switch (error.code) {
                                case 'auth/wrong-password':
                                    setPasswordError("Wrong password!")
                                    break;
                                case 'auth/user-not-found':
                                    setEmailError("User not found.")
                                    break;
                                case 'auth/user-disabled':
                                    setEmailError("User not found.")
                                    break;
                                case 'auth/invalid-email':
                                    setEmailError("Please format your email correctly: example@email.com.")
                                    break;
                                case 'auth/operation-not-allowed':
                                    break;
                                case 'auth/too-many-requests':
                                    break;
                                case 'auth/missing-password':
                                    setPasswordError("Please enter a password!")
                                    break;
                                default:
                                    //Unknown erorr
                                    break;
                            }

                            showToast(errorMessage);
                        }
                    }}>
                        <Text style={[globalStyles.formButtonLabel]}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
}