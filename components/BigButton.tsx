import React from "react";
import { Text, View, TouchableOpacity, Pressable, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

type BigButtonProps = {
    label: string;
    description?: string;
    onPress?: () => void;
    height?: number;
    width?: string | number;
    colorStart?: string;
    colorEnd?: string;
    containerStyle?: StyleProp<ViewStyle>;
};

export default function BigButton({label, description, onPress, height = 130, width = "auto", colorStart = "#638BD5", colorEnd = "#60C195", containerStyle}: BigButtonProps) {

    return(
        <Pressable style={[styles.container]} onPress={onPress}>
            <LinearGradient
                colors={[colorStart, colorEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.background, {height: height, width: width}, containerStyle ? containerStyle : null]}
            >
                <View style={styles.section}>
                    <Text style={styles.label}>
                        {label}
                    </Text>
                    <Text style={styles.description}>
                        {description}
                    </Text>
                </View>
                <View style={styles.bottomSection}>
                    <TouchableOpacity style={[styles.button]} onPress={onPress}>
                        <Text style={styles.buttonText}>Browse</Text>
                        <Feather name="arrow-right-circle" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        gap: 10
    },

    background: {
        borderRadius: 16,
        padding: 10,
    },

    topSection: {
        flexDirection: "row",
        minHeight: 150
    },

    bottomSection: {
        alignItems: "flex-end",
        alignSelf: "flex-end"
    },

    section: {
        flex: 1
    },

    button: {
        flexDirection: "row",
        gap: 10,
        padding: 4,
    },

    buttonText: {
        fontSize: 16,
        color: "white",
        fontWeight: "600"
    },

    label: {
        fontSize: 16,
        fontWeight: "500",
        lineHeight: 25,
        color: "white"
    },

    description: {
        color: "white"
    },
})