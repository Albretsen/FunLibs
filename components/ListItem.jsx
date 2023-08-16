import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import globalStyles from "../styles/globalStyles";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Dialog from "./Dialog";
import _ from "lodash";

export default function ListItem(props) {
    const { name, promptAmount, prompts, text, id, type, drawer, onClick, length, onDelete, showDelete } = props;
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [listItemClickTimestamp, setListItemClickTimestamp] = useState(1);

    const debouncedNavigationRef = useRef(
        _.debounce((id, type) => {
            if (type === "stories") {
                drawer.current.openDrawer();
                onClick({ id, name, type });
            } else {
                navigation.navigate("PlayScreen", { libId: id, type: type });
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
                <View style={styles.letterCircle}>
                    <Text style={[globalStyles.fontLarge, {color: "#006D40"}]}>{name[0]}</Text>
                </View>
                <View style={[styles.textRow, {width: showDelete ? "65%" : "75%"}]}>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={[globalStyles.fontMedium, globalStyles.bold, styles.title]}>{name}</Text>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={[globalStyles.fontMedium, {flexShrink: 1}]}>{text.map((key, index) => (
                        // Description
                        <Text key={key + index} style={(index + (promptOrText ? 0 : 1)) % 2 === 0 ? {fontStyle: "italic", color: "#006D40"} : null}>{key}</Text>
                    ))}</Text>
                    <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                        <View style={[styles.progressBarContainer, {width: "88%"}]}>
                            <View style={[styles.progressBar, {width: (100 * length) + "%"}]}></View>
                        </View>
                        <Text style={{fontSize: 14, marginBottom: 4, width: "12%", textAlign: "center"}}>{promptAmount}</Text>
                    </View>
                </View>
                {showDelete && (
                <View style={styles.rightIcons}>
                    <TouchableOpacity style={styles.delete} onPress={showDeleteDialogHandler}>
                        <MaterialIcons style={{color: "#5A5A5A"}} name="delete" size={34}  />
                    </TouchableOpacity> 
                </View>
                )}
                {/* Conditionally render the delete confirmation dialog */}
                {showDeleteDialog && (
                    <Dialog
                        title="Delete lib"
                        text="Are you sure you want to delete this lib? Once deleted it cannot be recovered."
                        onCancel={hideDeleteDialogHandler}
                        onConfirm={() => {
                            onDelete(id);
                            setShowDeleteDialog(false); // Hide the dialog after deletion
                        }}
                    />
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        gap: 10,
        paddingTop: 20,
        justifyContent: "center"
    },

    textRow: {
        flexDirection: "column",
        // width: "65%",
        gap: 6,
        // flex: 1,
    },

    rightIcons: {
        width: "10%",
        // flexDirection: "column",
        justifyContent: "center"
    },

    letterCircle: {
        paddingBottom: 2, // Accounts for slight off-center letter
        backgroundColor: "#D1E8D5",
        borderRadius: 50,
        height: 50,
        width: 50,
        justifyContent: "center",
        alignItems: "center",
    },

    progressBarContainer: {
        height: 4,
        backgroundColor: "#D1E8D5",
    },

    progressBar: {
        backgroundColor: "#006D40",
        height: 4
    },
})