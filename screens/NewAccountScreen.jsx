import React, { useState } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { TextInput } from "react-native-paper";
import globalStyles from "../styles/globalStyles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AvatarCarousel from "../components/AvatarCarousel";

export default function NewAccountScreen() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(true);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(true);
    return(
        <View style={[ {alignItems: "center", backgroundColor: '#fff', height: "100%"}]}>
            <View style={[globalStyles.containerBigWhitespace, {marginTop: 40, marginBottom: 10}]}>
                <Text style={{fontSize: 26, fontWeight: 600, marginBottom: 30}}>Create New Account</Text>
                <View style={globalStyles.form}>
                    <TextInput
                        label="Username"
                        value={username}
                        onChangeText={username => setUsername(username)}
                        mode="outlined"
                        theme={{colors:{primary: '#49454F'}}}
                    />
                    <TextInput
                        label="Email"
                        value={email}
                        onChangeText={email => setEmail(email)}
                        mode="outlined"
                        theme={{colors:{primary: '#49454F'}}}
                    />
                    <View style={{position: "relative"}}>
                        <TextInput
                            label="Password"
                            secureTextEntry={passwordVisible}
                            value={password}
                            onChangeText={password => setPassword(password)}
                            mode="outlined"
                            theme={{colors:{primary: '#49454F'}}}
                            style={{paddingRight: 30}}
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
                    <View style={{position: "relative"}}>
                        <TextInput
                            label="Confirm password"
                            secureTextEntry={confirmPasswordVisible}
                            value={confirmPassword}
                            onChangeText={confirmPassword => setConfirmPassword(confirmPassword)}
                            mode="outlined"
                            theme={{colors:{primary: '#49454F'}}}
                            style={{paddingRight: 30}}
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
                </View>
            </View>
            <View style={{flexGrow: 0, marginVertical: 30}}>
                <AvatarCarousel initialActiveIndex={15}/>
            </View>
            <View style={[globalStyles.containerBigWhitespace]}>
                <View style={globalStyles.form}>
                    <TouchableOpacity style={globalStyles.formButton}>
                        <Text style={globalStyles.formButtonLabel}>Create</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={globalStyles.formBottomText}>
                Don't have an account? 
                <TouchableOpacity>
                    <Text style={globalStyles.formBottomTextHighlight}> Create a new one</Text>
                </TouchableOpacity>
            </Text>
        </View>
    )
}