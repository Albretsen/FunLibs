import React, { useState } from "react";
import { Image, Text, View, ScrollView, TouchableOpacity, StyleSheet} from 'react-native';
import FirebaseManager from '../scripts/firebase_manager';

const avatarKeys = Object.keys(FirebaseManager.avatars).filter(key => !isNaN(key));
export default function AvatarSelect({ onAvatarChange, containerStyle, selectedDefaultIndex = null, containerIsView }) {

    const [selectedAvatar, setSelectedAvatar] = useState(selectedDefaultIndex);

    let ContainerTag = ScrollView;
    if(containerIsView) ContainerTag = View;
    return (
        <ContainerTag style={[styles.selectorContainer, containerStyle ? containerStyle : null]}>
            <View style={styles.avatarContainer}>
                {avatarKeys.map((key, index) => (
                    <>
                        {index != 13 && (
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
                        )}
                    </>
                ))}
            </View>
        </ContainerTag>
    )
}

const avatarSize = 70;
const gapSize = 10;

const styles = StyleSheet.create({
    selectorContainer: {
        flexShrink: 0
    },

    avatarContainer: {
        justifyContent: "center",
        flexDirection: "row",
        // width: "100%",
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