import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import FirebaseManager from "../scripts/firebase_manager";
import globalStyles from "../styles/globalStyles";
import BigButton from "../components/BigButton";
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {

    const navigation = useNavigation();

    return(
        <View style={[globalStyles.screenStandard]}>
            <View style={[globalStyles.bigWhitespace]}>
                <View style={{justifyContent: "space-between", flexDirection: "row", width: "100%", alignItems: "center"}}>
                    <View>
                        <Text style={{fontSize: 22}}>Hey,</Text>
                        <Text style={{fontSize: 22, fontWeight: 500}}>Bubbles</Text>
                    </View>
                    <Image
                        style={[{ width: 48, height: 48 }, FirebaseManager.currentUserData?.firestoreData ? null :  {tintColor: "#5f6368"}]}
                        source={
                            (FirebaseManager.currentUserData?.firestoreData) 
                            ? FirebaseManager.avatars[FirebaseManager.currentUserData.firestoreData.avatarID]
                            : FirebaseManager.avatars["no-avatar-48"]
                        }
                    />
                </View>
                <View style={{flexDirection: "row", gap: 10, marginTop: 16}}>
                    <BigButton
                        label={`Official${"\n"}Stories`}
                        image={require("../assets/images/girl-with-balloon.png")}
                        onPress={() => navigation.navigate("Browse")}
                    />
                    <BigButton
                        label={`Community${"\n"}Stories`}
                        image={require("../assets/images/girl-with-balloon.png")}
                        onPress={() => navigation.navigate("Browse")}
                    />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({

})