import React from "react";
import { Text, View, Image, TouchableOpacity, Pressable, StyleSheet, ImageRequireSource, StyleProp, ViewStyle } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

type BigButtonProps = {
    label: string;
    description?: string;
    image: ImageRequireSource;
    imageWidth?: number;
    imageHeight?: number;
    onPress?: () => void;
    height?: number;
    width?: string | number;
    flexDirection?: "row" | "column" | "column-reverse" | "row-reverse";
    colorStart?: string;
    colorEnd?: string;
    containerStyle?: StyleProp<ViewStyle>;
    usePressable?: boolean;
};

export default function BigButton({label, description, image, imageWidth = 48, imageHeight = 48, onPress, height = 120, width = "auto", flexDirection = "column-reverse", colorStart = "transparent", colorEnd = "transparent", containerStyle, usePressable = false}: BigButtonProps) {

    let buttonOpacity = 0.2;
    if (usePressable) {
        buttonOpacity = 1;
    }

    // colorStart = "#638BD5"
    // colorEnd = "#60C195"

    return(
        <TouchableOpacity activeOpacity={buttonOpacity} style={[styles.container]} onPress={onPress}>
            <LinearGradient
                colors={[colorStart, colorEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.background, {height: height, width: width, flexDirection: flexDirection}, containerStyle ? containerStyle : null]}
            >
                <View style={styles.section}>
                    <Text style={styles.label}>
                        {label}
                    </Text>
                    <Text>
                        {description}
                    </Text>
                </View>
                {image && (
                <View style={styles.section}>
                    <Image
                        style={[styles.image, {height: imageHeight, width: imageWidth}]}
                        source={image}
                    />
                </View>
                )}
            </LinearGradient>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    background: {
        borderRadius: 16,
        padding: 10,
        gap: 6,
        borderWidth: 4,
        borderStyle: "solid",
        borderColor: "#638BD5"
    },

    section: {
        flex: 1
    },

    label: {
        // marginLeft: 15,
        fontSize: 16,
        fontWeight: "500",
        // color: "white",
        lineHeight: 25
    },

    image: {
        // flex: 1,
        alignSelf: "flex-end",
    }
})