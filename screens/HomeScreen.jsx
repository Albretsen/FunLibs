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
                                <Text style={{fontSize: 22, fontWeight: "500"}}>{FirebaseManager.currentUserData.firestoreData.username}</Text>
                            </View>
                        ) : (
                            <View>
                                <Text style={{fontSize: 22}}>Welcome to</Text>
                                <Text style={{fontSize: 22, fontWeight: "500"}}>Fun Libs!</Text>
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
                            label="Official"
                            description="Stories written by the Fun Libs team"
                            onPress={() => navigation.navigate("Browse")}
                        />
                        <BigButton
                            label="Community"
                            description="Stories written by other players"
                            onPress={() => navigation.navigate("Browse")}
                        />
                    </View>
                    <View style={[styles.section]}>
                        <View style={styles.titleSection}>
                            <Text style={{fontSize: 22, fontWeight: "500"}}>Featured Today</Text>
                            <TouchableOpacity>
                                <Text style={globalStyles.touchableText}>View all</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.titleSection}>
                        <Text style={{fontSize: 22, fontWeight: "500"}}>Packs</Text>
                    </View>
                </View>
                <View style={{marginTop: 16}}>
                    <PackCarousel data={[
                        {
                            title: 'Christmas Pack',
                            description: "Eight high quality Libs about romance. Stories include Romeo and Juliet, Twilight and many more heartwarming stories!",
                            key: 'item1',
                            image: require("../assets/images/christmas.png"),
                            onPress: () => {
                                navigation.navigate("Pack", {packName: "christmas"});
                            }
                        },
                        {
                            title: 'Romance Pack',
                            description: "Dive into a world of romance with our collection of 10 heartwarming Libs, each crafted with passion by the Fun Libs Team!",
                            key: 'item2',
                            image: require("../assets/images/romance.png"),
                            onPress: () => {
                                navigation.navigate("Pack", {packName: "romance"});
                            }
                        },
                        {
                            title: 'Historical Events Pack',
                            description: "Get ready to immerse yourself in history! The Historical Events pack is filled with funny takes on famous moments throughout history!",
                            key: 'item3',
                            image: require("../assets/images/historical.png"),
                            onPress: () => {
                                navigation.navigate("Pack", {packName: "historical"});
                            }
                        },
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