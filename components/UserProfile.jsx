import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet, Dimensions } from "react-native";
import FirebaseManager from "../scripts/firebase_manager";
import globalStyles from "../styles/globalStyles";
import Dropdown from "./Dropdown";

export default function UserProfile({memberSince, likes, libsCount, bio}) {
    return (
        <View>
            <View style={[globalStyles.screenStandard, globalStyles.bigWhitespacePadding, {gap: 10, alignSelf: "center", marginTop: 5}]}>
            <Text style={[globalStyles.grayText]}>
                {memberSince}
            </Text>
                <View style={styles.userStats}>
                    <View style={styles.userStat}>
                        <Text style={styles.userStatNum}>{likes}</Text>
                        <Text style={[styles.userStatText, globalStyles.grayText]}>likes</Text>
                    </View>
                    <View style={styles.userStat}>
                        <Text style={styles.userStatNum}>{libsCount}</Text>
                        <Text style={[styles.userStatText, globalStyles.grayText]}>libs</Text>
                    </View>
                </View>
                <ScrollView>
                    <Text style={styles.title}>About me</Text>
                    <Text style={[styles.bio, globalStyles.grayText]}>{bio}</Text>
                </ScrollView>
            </View>
        </View>
    )
}

const imageSize = 120;

const styles = StyleSheet.create({
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
        borderRadius: "100%"
    },

    userStats: {
        flexDirection: "row",
        gap: 75,
        marginTop: 10,
        marginBottom: 20
    },

    userStat: {
        alignItems: "center"
    },

    userStatNum: {
        fontWeight: 500,
        fontSize: 15
    },

    userStatText: {

    },

    title: {
        fontSize: 20
    },

    bio: {
        lineHeight: 24
    }

})