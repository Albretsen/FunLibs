import React from "react";
import { Text, View, Image, TouchableOpacity, StyleSheet, ImageRequireSource, StyleProp, ViewStyle } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

type PackCardProps = {
    title: string;
    description?: string;
    image: ImageRequireSource;
    imageWidth?: number;
    imageHeight?: number;
    onPress?: () => void;
    colorStart?: string;
    colorEnd?: string;
    containerStyle?: StyleProp<ViewStyle>;
    smallButton?: boolean
};

export default function PackCard({title, description, image, imageWidth = 48, imageHeight = 48, onPress, colorStart = "transparent", colorEnd = "transparent", containerStyle}: PackCardProps) {

    // colorStart = "#638BD5"
    // colorEnd = "#60C195"

    return(
        <View style={[styles.container]}>
            <LinearGradient
                colors={[colorStart, colorEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.background, containerStyle ? containerStyle : null]}
            >
                <View style={{flexDirection: "row", alignItems: "center", gap: 10}}>
                    <Text style={styles.title}>
                        {title}
                    </Text>
                    <View style={styles.premiumTextContainer}>
                        <Text style={styles.premiumText}>Premium</Text>
                    </View>
                </View>
                <View style={styles.topSection}>
                    <View style={[styles.section, {flexBasis: 85}]}>
                        <Text style={styles.description}>
                            {description}
                        </Text>
                    </View>
                    {image && (
                        <View style={[styles.section, {alignContent: "center"}]}>
                            <Image
                                style={[styles.image, {height: imageHeight, width: imageWidth}]}
                                source={image}
                            />
                        </View>
                    )}
                </View>
                <View style={styles.bottomSection}>
                    <TouchableOpacity style={[styles.button]} onPress={onPress}>
                        <Text style={styles.buttonText}>Check out pack</Text>
                        <Feather name="arrow-right-circle" size={24} color="#F2F2F2" />
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </View>
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
        // borderWidth: 1,
        // borderStyle: "dashed",
        borderColor: "#95691B",
        height: 216,
        width: "auto"
    },

    topSection: {
        flexDirection: "row",
        // minHeight: 150,
        alignItems: "center"
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
        paddingVertical: 4,
        marginRight: 10,
    },

    buttonText: {
        fontSize: 16,
        color: "#F2F2F2",
        fontWeight: "600",
        // borderBottomWidth: 1,
        // borderStyle: "dashed",
        // borderColor: "white"
    },

    title: {
        fontSize: 18,
        fontWeight: "500",
        lineHeight: 25,
        color: "#F2F2F2"
    },

    premiumTextContainer: {
        // borderStyle: "dashed",
        paddingHorizontal: 6,
        paddingVertical: 3,
        backgroundColor: "white",
        // borderWidth: 1,
        borderColor: "#fdc702",
        borderRadius: 5
    },

    premiumText: {
        color: "#c39c0e",
        fontSize: 14,
    },

    description: {
        fontSize: 14,
        color: "#F2F2F2",
        lineHeight: 25
    },

    image: {

    }
})