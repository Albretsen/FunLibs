import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { ScrollView } from 'react-native-gesture-handler';
import Avatar, { AVATAR_AMOUNT } from './Avatar';

interface AvatarSelectProps {
    onAvatarChange: (id: number) => void;
    // containerStyle:
    selectedDefaultIndex: number | string | null;
}

export default function AvatarSelect({ onAvatarChange, selectedDefaultIndex = null }: AvatarSelectProps) {

    // The selected avatar
    const [selectedAvatar, setSelectedAvatar] = useState(selectedDefaultIndex);

    // Creating a range from the avatar amount to loop through when generating avatars
    const avatarIds = Array.from({ length: AVATAR_AMOUNT }, (_, index) => index);

    return (
        <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
            <View style={styles.container}>
                <View style={styles.sectionContainer}>
                    {avatarIds.map((id) => (
                        <TouchableOpacity
                            key={id}
                            style={styles.avatarContainer}
                            onPress={() => {
                                onAvatarChange(id);
                                setSelectedAvatar(id);
                            }}
                        >
                            <Avatar backgroundColor={id == selectedAvatar ? "#A559FE" : "#638BD5"} size={100} id={id} />
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 10,
        alignItems: "center",
        marginTop: 10,
    },

    sectionContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 4,
        rowGap: 20,
    },

    avatarContainer: {
        gap: 10,
        justifyContent: "center",
        alignItems: "center",
        margin: 5,
    },

    button: {
        flexDirection: "row",
        gap: 8,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#6294C9",
        padding: 6,
        alignItems: "center",
        minHeight: 34,
        borderStyle: "solid"
    },

    buttonLabel: {
        fontSize: 15,
        fontWeight: "600",
        color: "#6294C9",
        lineHeight: 20
    },
});