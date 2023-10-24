import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import FirebaseManager from "../scripts/firebase_manager";
import globalStyles from "../styles/globalStyles";
import BigButton from "../components/BigButton";
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from "react-native-gesture-handler";

export default function HomeScreen() {

    const navigation = useNavigation();

    return(
        <View style={[globalStyles.screenStandard]}>
            <View style={[globalStyles.bigWhitespace]}>
                <View style={styles.titleSection}>
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
                <View style={[styles.section, {flexDirection: "row"}]}>
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
                <View style={[styles.section]}>
                    <View style={styles.titleSection}>
                        <Text style={{fontSize: 22, fontWeight: 500}}>Featured Today</Text>
                        <TouchableOpacity>
                            <Text style={globalStyles.touchableText}>View all</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    titleSection: {
        justifyContent: "space-between",
        flexDirection: "row",
        width: "100%",
        alignItems: "center"
    },

    section: {
        gap: 10,
        marginVertical: 15
    }
})