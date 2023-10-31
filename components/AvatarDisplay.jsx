import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import FirebaseManager from "../scripts/firebase_manager";
import globalStyles from "../styles/globalStyles";

export default function AvatarDisplay({ onPress, avatarID, title, titleComponent, text, titleStyle, textStyle, rightComponent, color }) {
    const ParentTag = onPress ? TouchableOpacity : View;

    return (
        <ParentTag style={styles.container} onPress={onPress}>
            <View style={[styles.imageContainer, {backgroundColor: color}]}>
                <Image
                    style={styles.image}
                    source={FirebaseManager.avatars[avatarID]} 
                />
            </View>
            <View style={styles.textContainer}>
                {titleComponent ? (
                    titleComponent
                ) : (
                    <Text
                        style={[styles.title, titleStyle ? titleStyle : null]}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                    >
                        {title}
                    </Text>
                )}
                <Text style={[styles.text, globalStyles.grayText, textStyle ? textStyle : null]}>
                    {text}
                </Text>
            </View>
            {rightComponent ? (
                <View style={[styles.rightContainer]}>
                    {rightComponent}
                </View>
            ) : null}
        </ParentTag>
    )
}

const imageSize = 45;
const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        gap: 15,
        width: "100%"
    },

    image: {
        height: imageSize,
        width: imageSize,
        // flexBasis: 45,
        justifyContent:"center",
        alignSelf: "center",
        justifyContent: "center",
    },

    imageContainer: {
        height: imageSize + 5,
        width: imageSize + 5,
        flexBasis: imageSize + 5,
        justifyContent: "center",
        alignSelf: "center",
        borderRadius: 100,
    },

    textContainer: {
        flex: 1,
        gap: 0,
        flexDirection: "column",
        justifyContent: "center"
    },

    rightContainer: {
        flex: 0.3
    },

    title: {
        fontSize: 16,
        color: "#505050",
        fontWeight: 500,
    },

    text: {
        fontSize: 13,
    }
})