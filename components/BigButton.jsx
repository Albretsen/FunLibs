import React from "react";
import { Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

export default function BigButton({label, image, onPress, height = 120, width = "auto", colorStart = "#638BD5", colorEnd = "#60C195"}) {
    return(
        <TouchableOpacity style={[styles.container]} onPress={onPress}>
            <LinearGradient
                colors={[colorStart, colorEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.background, {height: height, width: width}]}
            >
                <Image
                    style={styles.image}
                    source={image}
                />
                <Text style={styles.label}>
                    {label}
                </Text>
            </LinearGradient>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    background: {
        borderRadius: 30,
        flexDirection: "column",
        padding: 10,
        gap: 6,
    },

    label: {
        flex: 1,
        marginLeft: 15,
        fontSize: 16,
        fontWeight: 500,
        color: "white",
        lineHeight: 25
    },

    image: {
        flex: 1,
        alignSelf: "flex-end",
        height: 48,
        width: 48
    }
})