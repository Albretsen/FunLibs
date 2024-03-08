import React, { useContext, useEffect, useState } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { View, ScrollView, Text, Image, TouchableOpacity, StyleSheet, Platform } from "react-native";
import FirebaseManager from "../scripts/firebase_manager";
import globalStyles from "../styles/globalStyles";
import BigButton from "../components/BigButton";
import { useNavigation } from '@react-navigation/native';
import PackCarousel from "../components/PackCarousel";
import ListManager from "../components/ListManager";
import { ScreenContext } from "../App";
import { useIsFocused } from '@react-navigation/native';

export default function HomeScreen() {

    const isFocused = useIsFocused();
    const { setCurrentScreenName } = useContext(ScreenContext);

    useEffect(() => {
        if (isFocused) {
            setCurrentScreenName("Home");
        }
    }, [isFocused]);

    const navigation = useNavigation();

    const [randomField, setRandomField] = useState("initialValue");

    useFocusEffect(
        React.useCallback(() => {
            // Generate a new random value each time the screen comes into focus
            const newRandomValue = Math.random().toString(36).substring(2, 15);
            setRandomField(newRandomValue);

            return () => {
                // Optional cleanup if needed
            };
        }, [])
    );

    return(
        <View style={[globalStyles.screenStandard, globalStyles.headerAccountedHeight, {alignItems: "stretch"}]}>
            <ScrollView contentContainerStyle={{paddingBottom: 10}}>
                <View style={[globalStyles.containerWhitespaceMargin]}>
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
                        <TouchableOpacity onPress={() => {
                            if (FirebaseManager.currentUserData?.auth?.uid) {
                                navigation.navigate("ProfileScreen", { uid: FirebaseManager.currentUserData?.auth?.uid });
                            }
                        }}>
                            <Image
                                style={[{ width: 48, height: 48 }, FirebaseManager.currentUserData?.firestoreData ? null :  {tintColor: "#5f6368"}]}
                                source={
                                    (FirebaseManager.currentUserData?.firestoreData) 
                                    ? FirebaseManager.avatars[FirebaseManager.currentUserData.firestoreData.avatarID]
                                    : null
                                }
                            />
                        </TouchableOpacity>
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
                            description="Libs written by the Fun Libs team"
                            onPress={() => { 
                                navigation.navigate("Home");
                                navigation.navigate("Browse", { initialTab: "Official" })
                            }}
                        />
                        <BigButton
                            label="Community"
                            description="Libs written by other players"
                            onPress={() => {
                                navigation.navigate("Home");
                                navigation.navigate("Browse", { initialTab: "Community" })
                            }}
                            colorStart="#60C195"
                            colorEnd="#638BD5"
                        />
                    </View>
                    <View style={[styles.section]}>
                        <View style={styles.titleSection}>
                            <Text style={{fontSize: 22, fontWeight: "500"}}>Featured Today</Text>
                            <TouchableOpacity onPress={() => {
                                navigation.navigate("Browse", { initialTab: "Community", sort: "trending" });
                            }}>
                                <Text style={[globalStyles.touchableText, {marginRight: 10}]}>View all</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{height: 150}}>
                            <ListManager showPreview={false} bordered={true} showLoader={true} filterOptions={{
                                "sortBy": "trending",
                                "category": "All",
                                "dateRange": "allTime",
                                "playable": true,
                                "pageSize": 1,
                                "random": randomField,
                            }}></ListManager>
                        </View>
                    </View>
                    {Platform.OS != "ios" ? <View style={styles.titleSection}>
                        <Text style={{fontSize: 22, fontWeight: "500"}}>Packs</Text>
                    </View> 
                    :
                    <Image
                        style={{ width: "100%", height: 160, borderRadius: 8 }}
                        source={require("../assets/images/home-screen-image.png")}
                        // resizeMode="center"
                    />}
                </View>

                {Platform.OS != "ios" ? <View style={{marginTop: 16}}>
                    <PackCarousel data={[
                        {
                            title: 'Romance Pack',
                            description: "Dive into a world of romance with our collection of 10 heartwarming Libs, each crafted with passion by the Fun Libs Team!",
                            key: 'item1',
                            image: require("../assets/images/romance.png"),
                            onPress: () => {
                                navigation.navigate("Pack", {packName: "romance"});
                            }
                        },
                        {
                            title: 'Historical Events Pack',
                            description: "Get ready to immerse yourself in history! The Historical Events pack is filled with funny takes on famous moments throughout history!",
                            key: 'item2',
                            image: require("../assets/images/historic.png"),
                            onPress: () => {
                                navigation.navigate("Pack", {packName: "historic"});
                            }
                        },
                        {
                            title: 'The Easter Pack',
                            description: "Write some hilarious stories while enjoying the Easter festivities!",
                            key: 'item3',
                            image: require("../assets/images/easter.png"),
                            onPress: () => {
                                navigation.navigate("Pack", {packName: "easter"});
                            }
                        },
                        {
                            title: 'Christmas Pack',
                            description: "Eight high quality Libs about romance. Stories include Romeo and Juliet, Twilight and many more heartwarming stories!",
                            key: 'item4',
                            image: require("../assets/images/christmas.png"),
                            onPress: () => {
                                navigation.navigate("Pack", {packName: "christmas"});
                            }
                        }
                    ]}/>
                </View> : <></>}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    titleSection: {
        justifyContent: "space-between",
        flexDirection: "row",
        flex: 1,
        alignItems: "center"
    },

    section: {
        gap: 10,
        marginVertical: 15
    }
})