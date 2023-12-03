import React, { useContext } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Pressable } from "react-native";
import FirebaseManager from "../scripts/firebase_manager";
import globalStyles from "../styles/globalStyles";
import Dropdown from "./Dropdown";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { ToastContext } from "./Toast";
import { useNavigation } from "@react-navigation/native";

export default function AvatarDisplay({ onPress, avatarID, avatarTint, title, titleComponent, text, titleStyle, textStyle, rightComponent, uid, color, locked, avatarOnPress }) {
    const ParentTag = onPress ? TouchableOpacity : View;

    const showToast = useContext(ToastContext);

    const navigation = useNavigation();

    let blockUser = (uid) => {
        if (uid == "HOv8K8Z1Q6bUuGxENrPrleECIWe2") {
            showToast(":(");
            return;
        }

        FirebaseManager.blockUser(uid);
    }

    if(rightComponent == "userActions") {
        rightComponent = (
            <Dropdown
                anchor={
                    <View style={[{marginTop: 10}, locked ? globalStyles.lockedOpacity : null]}>
                        <MaterialIcons style={{ color: "#49454F" }} name="more-vert" size={16} />
                    </View>
                }
                anchorStyle={null}
                containerStyle={{ height: "auto", alignSelf: "center" }}
                options={[
                    {
                        name: "Visit profile",
                        onPress: () => navigation.navigate("ProfileScreen", { uid: uid })
                    },
                    {
                        name: "Block user",
                        onPress: () => {
                            if (!FirebaseManager.currentUserData?.auth?.uid) {
                                showToast("Please log in to block users.");
                                return;
                            }
                    
                            blockUser(uid);
                        }
                    },
                ]}
            />
        )
    }

    // Effectively disable border color
    color = "transparent";
    return (
        <ParentTag style={styles.container} onPress={onPress}>
            <View style={[styles.imageContainer, {backgroundColor: color}]}>
                <Pressable onPress={avatarOnPress}>
                    <Image
                        style={[styles.image, locked ? globalStyles.lockedOpacity : null, avatarTint ? {tintColor: avatarTint} : null]}
                        source={FirebaseManager.avatars[avatarID]} 
                    />
                </Pressable>
            </View>
            <View style={styles.textContainer}>
                {titleComponent ? (
                    titleComponent
                ) : (
                    <Text
                        style={[styles.title, titleStyle ? titleStyle : null, locked ? globalStyles.lockedOpacity : null]}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                    >
                        {title}
                    </Text>
                )}
                <Text style={[styles.text, globalStyles.grayText, textStyle ? textStyle : null, locked ? globalStyles.lockedOpacity : null]}>
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
        fontWeight: "500",
    },

    text: {
        fontSize: 13,
    }
})