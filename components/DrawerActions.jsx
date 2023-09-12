import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default function DrawerActions(props) {
    const { playOrWrite, onPublish, onShare, onSave, onFavorite, onDelete, publishLabel, saveLabel } = props;

    return (
        <View style={{
            flexDirection: "row",
            paddingLeft: 20,
            paddingVertical: 10,
            paddingBottom: 25,
            paddingTop: 25,
            borderTopWidth: 1,
            borderColor: "#cccccc",
            justifyContent: "space-around"
        }}>
            {onSave && (<TouchableOpacity
                style={{alignItems: "center"}}
                onPress={onSave}
            >
                <MaterialIcons
                    style={{color: "#49454F"}}
                    name="file-download"
                    size={26}
                />
                <Text style={styles.actionText}>{saveLabel ? saveLabel: "Save"}</Text>
            </TouchableOpacity>)}
            {onShare && (<TouchableOpacity
                style={{alignItems: "center"}}
                onPress={onShare}
            >
                <MaterialIcons
                    style={{color: "#49454F"}}
                    name="share"
                    size={26}
                />
                <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>)}
            {onFavorite && (
                <TouchableOpacity
                    style={{alignItems: "center"}}
                    onPress={onFavorite}
                >
                    <MaterialIcons
                        style={{color: "#49454F"}}
                        name="favorite"
                        size={26}
                    />
                    <Text style={styles.actionText}>Favorite</Text>
                </TouchableOpacity>
            )}
            {onDelete && (
                <TouchableOpacity
                    style={{alignItems: "center"}}
                    onPress={onDelete}
                >
                    <MaterialIcons
                        style={{color: "#49454F"}}
                        name="delete"
                        size={26}
                    />
                    <Text style={styles.actionText}>Delete</Text>
                </TouchableOpacity>
            )}
            {onPublish && (
                <TouchableOpacity
                    style={{alignItems: "center"}}
                    onPress={onPublish}
                >
                    <MaterialIcons
                        style={{color: "#49454F"}}
                        name="file-upload"
                        size={26}
                    />
                    <Text style={styles.actionText}>{publishLabel ? publishLabel : "Publish"}</Text>
                </TouchableOpacity>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    actionText: {
        fontSize: 15
    }
})