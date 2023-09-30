import React, { useState } from "react";
import { Image, Text, View, ScrollView, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import FirebaseManager from '../scripts/firebase_manager';

const avatarKeys = Object.keys(FirebaseManager.avatars).filter(key => !isNaN(key));

export default function AvatarSelect({ onAvatarChange }) {

    const [selectedAvatar, setSelectedAvatar] = useState(null);

    return (
        <ScrollView style={styles.selectorContainer}>
            <View style={styles.rowContainer}>
                {avatarKeys.map((key, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => {
                            onAvatarChange(key);
                            setSelectedAvatar(key);
                        }}
                        style={{overflow: "hidden"}}
                    >
                        <View>
                            <Image source={FirebaseManager.avatars[key]} style={[{height: avatarSize, width: avatarSize}, key === selectedAvatar ? styles.selectedAvatar : null]} />
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    )
}

const screenWidth = Dimensions.get('window').width;

// The other elemets have a margin for whitespace, account for this so that the avatars don't overflow the whitespace
const screenWidthWithMargin = screenWidth - screenWidth / 6;
// Define preferred avatar size in width and height, and gap size
const avatarSize = 70;
const gapSize = 10;

// Combine these for easier calculation
const avatarWithGap = avatarSize + gapSize;

// Start off with a container width of 0 - gapSize because we need to add gapSize one less time than AvatarSize
// This is because for every 2 avatars, there is only one gap between them
let containerWidth = 0 - gapSize;
// Calculate the widht of the selector's container until it would be wider than the screen
while((containerWidth + avatarWithGap) < screenWidthWithMargin) {
    containerWidth += avatarWithGap;
}

const styles = StyleSheet.create({
    selectorContainer: {
        height: (avatarSize * 2 + gapSize) + (avatarSize / 2), // Plus half an avatar, to let users know there is more
        flexShrink: 0
    },

    rowContainer: {
        flexDirection: "row",
        width: containerWidth,
        flexWrap: "wrap",
        gap: gapSize
    },
    
    selectedAvatar: {
        borderRadius: 40,
        borderWidth: 4,
        borderColor: "black"
    },
    
    avatarImage: {
        width: avatarSize,
        height: avatarSize,
        borderRadius: 40,
    },
});