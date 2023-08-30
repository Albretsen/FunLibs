import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import globalStyles from "../styles/globalStyles";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import Dialog from "./Dialog";
import _ from "lodash";
import LibManager from "../scripts/lib_manager";

export default function ListItem(props) {
    const { name, promptAmount, prompts, text, id, type, drawer, onClick, length, icon, iconPress, avatarID, username, likes} = props;
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [listItemClickTimestamp, setListItemClickTimestamp] = useState(1);

    const debouncedNavigationRef = useRef(
        _.debounce((id, type) => {
            let currentLib = LibManager.getLibByID(id);
            if (currentLib.playable) {
                navigation.navigate("PlayScreen", { libId: id, type: type });
            } else {
                drawer.current.openDrawer();
                onClick({ id, name, type });
            }
        }, 1)
    );

    useEffect(() => {
        const unsubscribe = navigation.addListener("state", (e) => {
            if (listItemClickTimestamp) {
                const timeSinceClick = Date.now() - listItemClickTimestamp;
                if (timeSinceClick < 2000) {
                    debouncedNavigationRef.current.cancel(); // Cancel debounced function
                }
            }
        });
    
        return unsubscribe;
    }, [navigation, listItemClickTimestamp]);

    let promptFirst = false;
    for (let i = 0; i < prompts.length; i++) {
        let firstIndex = prompts[i][Object.keys(prompts[i])[0]][0];
        if (firstIndex == 0) {
            promptFirst = true;
        }
    }

    function deleteLib() {
        setShowDeleteDialog(true);
    }

    function playLib(id, type) {
        setListItemClickTimestamp(Date.now());
        if (type === "stories") {
            drawer.current.openDrawer();
            onClick({ id, name, type });
        } else {
            debouncedNavigationRef.current(id, type);
        }
    }

    function showDeleteDialogHandler() {
        setShowDeleteDialog(true);
    }

    function hideDeleteDialogHandler() {
        setShowDeleteDialog(false);
    }

    let promptOrText = promptFirst;
    return (
        <TouchableOpacity onPress={() => playLib(id, type)}>
            <View style={[styles.container, globalStyles.containerWhitespace]}>
                <Image
                    style={{height: 45, width: 45, justifyContent: "center", alignSelf: "center"}}
                    source={require("../assets/images/avatars/" + avatarID + ".png")}
                />
                <View style={[styles.textRow, {width: icon ? "63%" : "75%", gap: 0}]}>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.title, {fontSize: 16, color: "#505050", fontWeight: 500}]}>{name}</Text>
                    {/* <Text numberOfLines={1} ellipsizeMode="tail" style={[{fontSize: 16, flexShrink: 1, color: "#49454F"}]}>{text.map((key, index) => (
                        // Description
                        <Text key={key + index} style={(index + (promptOrText ? 0 : 1)) % 2 === 0 ? {fontStyle: "italic", color: "#006D40"} : null}>{key}</Text>
                    ))}</Text> */}
                    <Text style={[{fontSize: 13, color: "#49454F"}]}>by {username} | {likes} likes</Text>
                </View>
                {icon && (
                <View style={styles.rightIcons}>
                    <TouchableOpacity style={{justifyContent: "flex-start", alignSelf: "flex-start", flex: 1, marginTop: 3}} onPress={iconPress}>
                         {/* Using image for icon because outlined version of icon was needed */}
                        <Image
                            style={{height: 25, width: 28}}
                            source={require("../assets/images/icons/favorite-outlined.png")}
                        />
                    </TouchableOpacity>
                </View>
                )}
                {/* Conditionally render the delete confirmation dialog */}
                {showDeleteDialog && (
                    <Dialog
                        onCancel={hideDeleteDialogHandler}
                        onConfirm={() => {
                            onDelete(id);
                            setShowDeleteDialog(false); // Hide the dialog after deletion
                        }}
                    >
                        <Text style={styles.dialogTitle}>Delete lib</Text>
                        <Text style={styles.dialogText}>Are you sure you want to delete this lib? Once deleted it cannot be recovered.</Text>
                    </Dialog>
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        gap: 15,
        paddingTop: 20,
        justifyContent: "center",
        marginBottom: 16,
    },

    textRow: {
        flexDirection: "column",
    },

    rightIcons: {
        width: "12%",
    },

    progressBarContainer: {
        height: 4,
        backgroundColor: "#D1E8D5",
    },

    progressBar: {
        backgroundColor: "#006D40",
        height: 4
    },

    // Dialog style
    dialogText: {
        color: "white",
        fontSize: 16,
        lineHeight: 34,
        fontWeight: 400,
        letterSpacing: 0.5
    },
    dialogTitle: {
        color: "white",
        fontSize: 24,
    },
})