import React from "react";
import { Text, View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

interface PackBannerProps {

}

export default function PackBanner() {
    return(
        <LinearGradient
            colors={["#FF257E", "#FF2644"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.banner}
        >
            <View style={styles.textContainer}>
                <Text style={styles.title}>Happy Valentines! 💙</Text>
                <Text style={styles.text}>Celebrate the season of love with the Romance Pack!</Text>
                {/* Add pulsate to this */}
                <Text style={styles.discountText}>🎉 20% off until February 16th! 🎉</Text>
                <Image
                    style={[styles.image, {height: 0, width: 0}]}
                    source={require("../assets/images/couple-with-balloon.png")}
                />
            </View>
        </LinearGradient>

    )
}

const styles = StyleSheet.create({
    banner: {
        flexDirection: "row",
        padding: 10,
        borderRadius: 8,
        marginTop: 10,
        marginHorizontal: 4,
    },

    textContainer: {
        gap: 4
    },

    title: {
        fontSize: 16,
        fontWeight: "500",
        color: "white",
        textAlign: "center"
    },

    text: {
        fontSize: 14,
        color: "white",
        textAlign: "center"
    },

    discountText: {
        fontSize: 14,
        fontWeight: "500",
        color: "white",
        textAlign: "center"
    },

    image: {

    },
})