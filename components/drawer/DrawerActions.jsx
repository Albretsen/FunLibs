import React, { useRef, useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FirebaseManager from "../../scripts/firebase_manager";

export default function DrawerActions(props) {
    const { playOrWrite, onPublish, onShare, onSave, onFavorite, onDelete, onUndo, publishLabel, saveLabel, deleteLabel, undoLabel, likesArray } = props;

    useEffect(() => {
        console.log("likesArray in DrawerActions:", likesArray);
    }, [likesArray]);

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
                    style={{ alignItems: "center" }}
                    onPress={async () => {
                        await onFavorite();
                    }}
                >
                    <MaterialIcons
                        style={{ color: "#49454F" }}
                        name={likesArray && likesArray.includes(FirebaseManager.currentUserData?.auth?.uid) ? "favorite" : "favorite-border"}
                        size={26}
                    />
                    <Text style={styles.actionText}>Favorite</Text>
                </TouchableOpacity>
            )}
            {onUndo && (
                <TouchableOpacity
                    style={{alignItems: "center"}}
                    onPress={onUndo}
                >
                    <MaterialIcons
                        style={{color: "#49454F"}}
                        name="undo"
                        size={26}
                    />
                    <Text style={styles.actionText}>{undoLabel ? undoLabel : "undo"}</Text>
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
                    <Text style={styles.actionText}>{deleteLabel ? deleteLabel : "Delete"}</Text>
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