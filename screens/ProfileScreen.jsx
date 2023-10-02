import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet, Dimensions } from "react-native";
import UserProfile from "../components/UserProfile";
import ListItem from "../components/ListItem";
import { LinearGradient } from 'expo-linear-gradient';
import globalStyles from "../styles/globalStyles";
import FirebaseManager from "../scripts/firebase_manager";
import Dropdown from "../components/Dropdown";

export default function ProfileScreen({ route }) {
    const userId = route.userId;
    return (
        <View style={[{flex: 1, backgroundColor: "white"}, {maxHeight: Dimensions.get("window").height - 64}]}>
            <LinearGradient
                colors={['#19BB77', '#3E99ED']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.background}
            />
            <View style={{overflow: "hidden", maxHeight: Dimensions.get("window").height - 64}}>
                <View style={styles.circleBackground} />
                <View style={styles.imageContainer}>
                    <Image
                        style={styles.image}
                        source={FirebaseManager.avatars[21]} // Avatar id goes here!
                    />
                </View>
                <View style={{alignSelf: "center", zIndex: 100, gap: 10, paddingVertical: 10}}>
                    <Dropdown
                        title={"Hallvard"} // Username goes here!
                        titleStyle={[globalStyles.fontMedium, {color: "#1D1B20"}]}
                        containerStyle={{alignSelf: "center", height: "auto"}}
                        options={[
                            {
                                name: "User options?",
                                onPress: null
                            }
                        ]}
                    />
                </View>
                <ScrollView>
                <UserProfile 
                    memberSince={"Member since 2. October 2023"}
                    likes={21}
                    libsCount={2}
                    bio={"Hey there! I'm Hallvard, Bergen's very own beanstalk. I'm so tall, I sometimes bump my head on the moon. Between my awkward dance moves and serenading my plants (yes, they're my only roommates), I also dabble in programming. Living solo means no one sees me talk to my ferns... until now. Oops!"}
                />
                </ScrollView>
            </View>
        </View>
    )
}

const imageSize = 120;
const screenWidth = Dimensions.get("window").width;
// Width added to background circle, in this case 30 percent of the screen width
// I'm adding extra width to it in order to get a smoother border radius as a background
const extraBgWidth = screenWidth * 0.3;
// Calculate the amount of width in order to center it by placing it half of itself to the left
const leftPercentage = -(extraBgWidth / 2 / screenWidth) * 100;

const styles = StyleSheet.create({
    circleBackground: {
        position: 'absolute',
        left: `${leftPercentage}%`,
        top: 75,
        height: 200,
        borderRadius: "50%",
        backgroundColor: "white",
        width: screenWidth + extraBgWidth
    },

    image: {
        height: imageSize,
        width: imageSize,
        justifyContent: "center",
        alignSelf: "center",
    },

    imageContainer: {
        height: imageSize + 6,
        width: imageSize + 6,
        justifyContent: "center",
        alignSelf: "center",
        backgroundColor: "white",
        borderRadius: "100%",
        zIndex: 100
    },

    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        // This makes the background go to the top of the page, behind the header which is 64px tall
        top: -64,
        height: 64 + 75 + 100,
    },
})