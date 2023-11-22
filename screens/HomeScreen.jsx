import React from "react";
import { View, ScrollView, Text, Image, StyleSheet } from "react-native";
import FirebaseManager from "../scripts/firebase_manager";
import globalStyles from "../styles/globalStyles";
import BigButton from "../components/BigButton";
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from "react-native-gesture-handler";
import PackCarousel from "../components/PackCarousel";

export default function HomeScreen() {

    const navigation = useNavigation();

    return(
        <View style={[globalStyles.screenStandard, globalStyles.headerAccountedHeight]}>
            <ScrollView>
                <View style={globalStyles.containerWhitespaceMargin}>
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

                    {/* <View style={styles.titleSection}>
                        <Text style={{fontSize: 22, fontWeight: 500}}>Featured</Text>
                    </View>
                    <View style={styles.titleSection}>
                        <BigButton
                            
                        />
                    </View> */}

                    <View style={[styles.section, {flexDirection: "row"}]}>
                        <BigButton
                            label={`Official`}
                            description="Official stories written by the Fun Libs team"
                            // image={require("../assets/images/girl-with-balloon.png")}
                            height={110}
                            imageHeight={48}
                            imageWidth={48}
                            onPress={() => navigation.navigate("Browse")}
                            containerStyle={{borderWidth: 0}}
                            usePressable
                            colorStart="#638BD5"
                            colorEnd="#60C195"
                        />
                        <BigButton
                            label={`Community`}
                            description="Stories written by other players"
                            // image={require("../assets/images/community.png")}
                            height={110}
                            imageHeight={48}
                            imageWidth={48}
                            onPress={() => navigation.navigate("Browse")}
                            containerStyle={{borderStyle: "dotted"}}
                            usePressable
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
                <View style={{marginTop: 16}}>
                    <PackCarousel data={[
                        {
                            title: 'Romance Pack',
                            description: "Ten high quality Libs about romance. Stories include Romeo and Juliet, Twilight and many more heartwarming stories!",
                            key: 'item1',
                            image: require("../assets/images/romance.png"),
                            onPress: () => navigation.navigate("Pack")
                        },
                        {
                            title: 'Gaming Pack',
                            description: "Gaming!!",
                            key: 'item2',
                            image: require("../assets/images/romance.png"),
                            onPress: () => navigation.navigate("Pack")
                        }
                    ]}/>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    titleSection: {
        justifyContent: "space-between",
        flexDirection: "row",
        // width: "100%",
        alignItems: "center"
    },

    section: {
        gap: 10,
        marginVertical: 15
    }
})