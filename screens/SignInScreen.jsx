import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { TextInput } from "react-native-paper";
import globalStyles from "../styles/globalStyles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FirebaseManager from "../scripts/firebase_manager";
import { useNavigation } from "@react-navigation/native";
import { ToastContext } from "../components/Toast";

export default function SignInScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(true);

    const showToast = useContext(ToastContext);

    const signIn = async () => {
        showToast({text: "Signing in", noBottomMargin: true, loading: true});
        try {
            let result = await FirebaseManager.SignInWithEmailAndPassword(email, password);
            if (result?.uid) {
                showToast({text: "Signed in as " + FirebaseManager.currentUserData.firestoreData.username, noBottomMargin: true, loading: false});
                navigation.navigate("Home");
            } else {
                showToast({text: "Error signing in", noBottomMargin: true, loading: false});
                console.log("SIGN IN FAILED: Unexpected result format");
            }
        } catch (error) {
            const errorMessage = FirebaseManager.getAuthErrorMessage(error.code);
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
                <Text style={{fontSize: 26, fontWeight: 600, marginBottom: 30}}>Sign in</Text>
                <View style={globalStyles.form}>
                    <TextInput
                        label="Email"
                        value={email}
                        onChangeText={email => setEmail(email)}
                        mode="outlined"
                        theme={{colors:{primary: '#49454F'}}}
                        style={globalStyles.bigWhitespace}
                    />
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
                        <Text style={[globalStyles.bigWhitespace, { marginBottom: 20 }]}>Forgot password?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[globalStyles.bigWhitespace, globalStyles.formButton]} onPress={signIn}>
                        <Text style={globalStyles.formButtonLabel}>Sign in</Text>
                    </TouchableOpacity>
                </View>
                <Text style={globalStyles.formBottomText}>
                    Don't have an account? 
                    <TouchableOpacity onPress={() => navigation.navigate("NewAccountScreen")}>
                        <Text style={globalStyles.formBottomTextHighlight}> Create a new one</Text>
                    </TouchableOpacity>
                </Text>
            </View>
        </View>
    )
}