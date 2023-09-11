import React, { useState } from "react";
import { View, Text, TouchableOpacity, Dimensions, ScrollView } from "react-native";
import { TextInput } from "react-native-paper";
import globalStyles from "../styles/globalStyles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AvatarCarousel from "../components/AvatarCarousel";
import { useNavigation } from "@react-navigation/native";
import FirebaseManager from "../scripts/firebase_manager";

export default function NewAccountScreen() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(true);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(true);
    const initialCarouselAvatarID = 15;
    const [avatarIndex, setAvatarIndex] = useState(initialCarouselAvatarID - 1); // Use a state to hold the current avatar index

    const handleAvatarChange = (index) => {
        index -= 1; // Correct for padding in carousel
        setAvatarIndex(index);
        // Here, you can do anything with the new avatar index
    }

    const createAccount = () => {
        FirebaseManager.CreateUser("email", email, password, username, avatarIndex)
            .then(user => {
                navigation.navigate("Home");
            })
            .catch(errorMessage => {
                console.error("Error signing in: ", errorMessage);
                // Handle the error here, e.g. show an error message to the user
            });
    }

    const navigation = useNavigation();

    return(
        <View style={[ {alignItems: "center", backgroundColor: '#fff', height: Dimensions.get("window").height- 64}]}>
            <ScrollView style={[{marginBottom: 40, paddingBottom: 40}]}>
                <Text style={[globalStyles.bigWhitespace, {fontSize: 26, fontWeight: 600, marginBottom: 30, alignSelf: "center"}]}>Create New Account</Text>
                <View style={globalStyles.form}>
                    <TextInput
                        label="Username"
                        value={username}
                        onChangeText={username => setUsername(username)}
                        mode="outlined"
                        theme={{colors:{primary: '#49454F'}}}
                        style={[globalStyles.bigWhitespace]}
                    />
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
                    <View style={{position: "relative"}}>
                        <TextInput
                            label="Confirm password"
                            secureTextEntry={confirmPasswordVisible}
                            value={confirmPassword}
                            onChangeText={confirmPassword => setConfirmPassword(confirmPassword)}
                            mode="outlined"
                            theme={{colors:{primary: '#49454F'}}}
                            style={[globalStyles.bigWhitespace, {paddingRight: 30}]}
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
                    <View style={{flexGrow: 0, marginVertical: 30, height: 100, maxHeight: 100}}>
                        <AvatarCarousel initialActiveIndex={initialCarouselAvatarID} onAvatarChange={handleAvatarChange}/>
                    </View>
                    <TouchableOpacity style={[globalStyles.formButton, globalStyles.bigWhitespace]} onPress={createAccount}>
                        <Text style={[globalStyles.formButtonLabel]}>Create</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <Text style={globalStyles.formBottomText}>
                Don't have an account? 
                <TouchableOpacity>
                    <Text style={globalStyles.formBottomTextHighlight}> Create a new one</Text>
                </TouchableOpacity>
            </Text>
        </View>
    )
}