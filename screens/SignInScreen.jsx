import React, { useState } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { TextInput } from "react-native-paper";
import globalStyles from "../styles/globalStyles";

export default function SignInScreen() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordVisible, setPasswordVisible] = useState(true);
    return(
        <View style={[globalStyles.screenStandard]}>
            <View style={[globalStyles.containerBigWhitespace, {marginTop: 40, height: Dimensions.get("window").height - 128}]}>
                <Text style={{fontSize: 26, fontWeight: 600, marginBottom: 30}}>Sign in</Text>
                <View style={globalStyles.form}>
                    <TextInput
                        label="Email"
                        value={email}
                        onChangeText={email => setEmail(email)}
                        mode="outlined"
                        theme={{colors:{primary: '#49454F'}}}
                    />
                    <TextInput
                        label="Password"
                        secureTextEntry={passwordVisible}
                        value={password}
                        onChangeText={password => setPassword(password)}
                        mode="outlined"
                        right={
                            <TextInput.Icon
                                color="#49454F"
                                name={passwordVisible ? "eye" : "eye-off"}
                                onPress={() => setPasswordVisible(!passwordVisible)}
                            />
                        }
                        theme={{colors:{primary: '#49454F'}}}
                    />
                    <TouchableOpacity style={globalStyles.formButton}>
                        <Text style={globalStyles.formButtonLabel}>Sign in</Text>
                    </TouchableOpacity>
                </View>
                <Text style={globalStyles.formBottomText}>
                    Don't have an account? 
                    <TouchableOpacity>
                        <Text style={globalStyles.formBottomTextHighlight}> Create a new one</Text>
                    </TouchableOpacity>
                </Text>
            </View>
        </View>
    )
}
