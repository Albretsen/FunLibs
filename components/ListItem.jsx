import React, { useState, useEffect, useRef, useMemo } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import globalStyles from "../styles/globalStyles";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import Dialog from "./Dialog";
import _ from "lodash";
import LibManager from "../scripts/lib_manager";
import { Animated } from "react-native";
import FirebaseManager from "../scripts/firebase_manager";
import { useDrawer } from "./Drawer";
import DrawerActions from "./DrawerActions";
import AudioPlayer from "../scripts/audio";
import FileManager from "../scripts/file_manager";

function ListItem(props) {
    const { name, promptAmount, prompts, text, id, type, drawer, onClick, length, icon, avatarID, username, likes, index, user, local, likesArray } = props;
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [listItemClickTimestamp, setListItemClickTimestamp] = useState(1);
    const [isLiked, setIsLiked] = useState(likesArray?.includes(FirebaseManager.currentUserData.auth?.uid));
    const [likeCount, setLikeCount] = useState(likes || 0);
    const { openDrawer, closeDrawer } = useDrawer();
    const { playAudio } = AudioPlayer();

    const debouncedNavigationRef = useRef(
        _.debounce((id, type) => {
            let currentLib = LibManager.getLibByID(id);
            if (currentLib.playable) {
                navigation.navigate("PlayScreen", { libId: id, type: type });
            } else {
                openDrawer(
                    {
                        component: (
                            <>
                                <ScrollView>
                                    <View style={globalStyles.drawerTop}>
                                        <Text>{LibManager.displayInDrawer(text)}</Text>
                                    </View>
                                </ScrollView>
                                <DrawerActions
                                    onShare={() => console.log("on share")}
                                    onDelete={deleteLib}
                                />
                            </>
                        ),
                        header: {
                            middleComponent: (
                                <View style={{flex: 1}}>
                                    <Text style={{fontSize: 18}}>{name}</Text>
                                    <Text style={{fontSize: 14}}>By {username}</Text>
                                </View>
                            )
                        }
                    }
                );
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

    const edit = () => {
		navigation.navigate("LibsHomeScreen", { 
			screen: "Create",
			params: {
				libText: LibManager.display_edit(text, prompts),
				libNameText: name,
                editID: id,
			}
		});
	}

    const favorite = () => {
        if (!FirebaseManager.currentUserData?.auth) {
            console.log("NOT LOGGED IN");
            return;
        }
    
        let updatedLikesArray = likesArray ? [...likesArray] : [];
    
        if (isLiked) {
            // Remove the uid if it's already present
            updatedLikesArray = updatedLikesArray.filter(uid => uid !== FirebaseManager.currentUserData.auth.uid);
            setIsLiked(false);
            setLikeCount(likeCount - 1);
        } else {
            // Add the uid if it's not present
            updatedLikesArray.push(FirebaseManager.currentUserData.auth.uid);
            setIsLiked(true);
            setLikeCount(likeCount + 1);
            playAudio("pop");
        }
    
        // Now update the Firebase document
        FirebaseManager.UpdateDocument("posts", id, { likesArray: updatedLikesArray, likes: updatedLikesArray.length });
    }

    const deleteLib = async () => {
        let result = await FileManager._retrieveData("read");
        result = JSON.parse(result);
        result = result.filter(item => item.id !== id);

        FileManager._storeData("read", JSON.stringify(result));

        closeDrawer();
    }
  
    let promptOrText = promptFirst;

    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.sequence([
        Animated.delay(index * 50), // delay by index * 50ms, staggering the load animation
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        })
      ]).start();
    }, [index]);

    return (
        <TouchableOpacity onPress={() => playLib(id, type)}>
            <Animated.View
                style={[styles.container, globalStyles.containerWhitespace, {opacity: fadeAnim}]}
            >
                <Image
                    style={{height: 45, width: 45, justifyContent: "center", alignSelf: "center"}}
                    source={FirebaseManager.avatars[avatarID]}
                />
                <View style={[styles.textRow, {width: icon ? "63%" : "75%", gap: 0}]}>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.title, { fontSize: 16, color: "#505050", fontWeight: 500 }]}>{name}</Text>
                    <Text style={[{ fontSize: 13, color: "#49454F" }]}>by {username} | {likeCount} {likeCount === 1 ? 'like' : 'likes'}</Text>
                </View>
                {icon && (
                    <View style={styles.rightIcons}>
                        {(local || user === FirebaseManager.currentUserData?.auth?.uid) ? (
                            <TouchableOpacity
                                style={{ justifyContent: "flex-start", alignSelf: "flex-start", flex: 1, marginTop: 3 }}
                                onPress={edit}
                            >
                                <Image
                                    style={{ height: 25, width: 28 }}
                                    source={require("../assets/images/icons/edit.png")}
                                />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                style={{ justifyContent: "flex-start", alignSelf: "flex-start", flex: 1, marginTop: 3 }}
                                onPress={favorite}
                            >
                                    <Image
                                        style={{ height: 25, width: 28 }}
                                        source={isLiked ? require("../assets/images/icons/favorite.png") : require("../assets/images/icons/favorite-outlined.png")}
                                    />
                            </TouchableOpacity>
                        )}
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
            </Animated.View>
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

export default React.memo(ListItem);