import React, { useState } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { TextInput } from "react-native-paper";
import globalStyles from "../styles/globalStyles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FirebaseManager from "../scripts/firebase_manager";
import { useNavigation } from "@react-navigation/native";

export default function SignInScreen() {
    const [email, setEmail] = useState("official@funlibs.com")
    const [password, setPassword] = useState("123456")
    const [passwordVisible, setPasswordVisible] = useState(true);

    const signIn = () => {
        console.log("SIGN IN");
        FirebaseManager.SignInWithEmailAndPassword(email, password)
            .then(user => {
                console.log("Signed in successfully with user: ", user);
                navigation.navigate("LibsHomeScreen");
            })
            .catch(errorMessage => {
                console.error("Error signing in: ", errorMessage);
                // Handle the error here, e.g. show an error message to the user
            });
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