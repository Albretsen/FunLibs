import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import FirebaseManager from "../scripts/firebase_manager";
import globalStyles from "../styles/globalStyles";
import BigButton from "../components/BigButton";
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from "react-native-gesture-handler";
import PackCarousel from "../components/PackCarousel";

export default function HomeScreen() {

    const navigation = useNavigation();

    return(
        <View style={[globalStyles.screenStandard]}>
            <View style={[globalStyles.bigWhitespace]}>
                <View style={styles.titleSection}>
                    {FirebaseManager.currentUserData?.firestoreData ? (
                        <View>
                            <Text style={{fontSize: 22}}>Hey,</Text>
                            <Text style={{fontSize: 22, fontWeight: 500}}>{FirebaseManager.currentUserData.firestoreData.username}</Text>
                        </View>
                    ) : (
                        <View>
                            <Text style={{fontSize: 22}}>Welcome to</Text>
                            <Text style={{fontSize: 22, fontWeight: 500}}>Fun Libs!</Text>
                        </View>
                    )}
                    <Image
                        style={[{ width: 48, height: 48 }, FirebaseManager.currentUserData?.firestoreData ? null :  {tintColor: "#5f6368"}]}
                        source={
                            (FirebaseManager.currentUserData?.firestoreData) 
                            ? FirebaseManager.avatars[FirebaseManager.currentUserData.firestoreData.avatarID]
                            : null
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
                <View style={styles.titleSection}>
                    <Text style={{fontSize: 22, fontWeight: 500}}>Packs</Text>
                </View>
            </View>
            <PackCarousel data={[
                { title: 'Adventure Tales', key: 'item1' },
                { title: 'Mystery Chronicles', key: 'item2' },
                { title: 'Science Fiction Stories', key: 'item3' },
                { title: 'Historical Narratives', key: 'item4' },
                { title: 'Fantasy Fables', key: 'item5' },
                { title: 'Horror Histories', key: 'item6' },
                { title: 'Romantic Renditions', key: 'item7' },
                { title: 'Action Annals', key: 'item8' },
                { title: 'Drama Diaries', key: 'item9' },
                { title: 'Comedy Chronicles', key: 'item10' }
            ]}/>
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