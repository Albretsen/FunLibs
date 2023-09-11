import React, { useState } from "react";
import { View, Text, TouchableOpacity, Dimensions, ScrollView } from "react-native";
import { TextInput } from "react-native-paper";
import globalStyles from "../styles/globalStyles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import FirebaseManager from "../scripts/firebase_manager";
import { useDrawer } from "../components/Drawer";

export default function DeleteAccountScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(true);

    const navigation = useNavigation();

    const { closeDrawer } = useDrawer();

    return(
        <View style={[ {alignItems: "center", backgroundColor: '#fff', height: Dimensions.get("window").height- 64}]}>
            <ScrollView style={[{marginBottom: 40, paddingBottom: 40}]}>
                <Text style={[globalStyles.bigWhitespace, {fontSize: 26, fontWeight: 600, marginBottom: 30, alignSelf: "center"}]}>Delete Account</Text>
                <Text style={globalStyles.bigWhitespace}>
				    This will delete your account, as well as any content you've published.
			    </Text>
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
                    <TouchableOpacity style={[globalStyles.formButton, globalStyles.bigWhitespace]} onPress={async () => {
                        //setShowDialogDelete(false);
                        console.log("Starting account deletion process")
                        let result = await FirebaseManager.SignInWithEmailAndPassword(email, password);
                        if (!result?.uid) {
                            console.log("Wrong credentials");
                            return;
                        }
                        console.log("Successfully re-signed-in user");
                        FirebaseManager.DeleteUser();
                        console.log("ACCOUNT DELETED");
                        navigation.navigate("Home");
                    }}>
                        <Text style={[globalStyles.formButtonLabel]}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
}