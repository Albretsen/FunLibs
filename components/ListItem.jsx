import React, { useState, useEffect, useRef, useMemo, useContext } from "react";
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
import FunLibsShare from "../scripts/share";
import Lib from "../scripts/lib";
import { ToastContext } from "../components/Toast";

function ListItem(props) {
    const { name, promptAmount, prompts, text, id, type, drawer, onClick, length, icon, avatarID, username, likes, index, user, local, likesArray, playable, item } = props;
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [listItemClickTimestamp, setListItemClickTimestamp] = useState(1);
    let uid = FirebaseManager.currentUserData?.auth?.uid ? FirebaseManager.currentUserData.auth.uid: FirebaseManager.localUID;

    if (!uid) {
        uid = "";
    }
    const [isLiked, setIsLiked] = useState(likesArray?.includes(uid));
    useEffect(() => {
        const currentUid = FirebaseManager.currentUserData?.auth?.uid || FirebaseManager.localUID || "";
        setIsLiked(likesArray?.includes(currentUid));
    }, [FirebaseManager.currentUserData]);
    const [likeCount, setLikeCount] = useState(likes || 0);
    const { openDrawer, closeDrawer } = useDrawer();
    const { playAudio } = AudioPlayer();
    const [localLikesArray, setLocalLikesArray] = useState(likesArray || []);
    const showToast = useContext(ToastContext);

    const isInitialRender = useRef(true);

    const debouncedNavigationRef = useRef(
        _.debounce((id, type) => {
            if (playable) {
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
                                    onShare={() => {
                                        FunLibsShare.Share(text.join("") + "\n\nCreated using: https://funlibs0.wordpress.com/download");
                                    }}
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
                //onClick({ id, name, type });
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
		navigation.navigate("Home", { 
			screen: "Create",
			params: {
				libText: LibManager.display_edit(text, prompts),
				libNameText: name,
                editID: String(id),
                item: item,
			}
        });
    }

    const [isUpdating, setIsUpdating] = useState(false);

    const favorite = async () => {
        if (isUpdating) return;  // Prevent further interactions while updating
        if (!FirebaseManager.currentUserData?.auth?.uid) {
            showToast("You have to be signed in to like a post.");
            return;
        }

        setIsUpdating(true);

        const userUid = FirebaseManager.currentUserData.auth.uid;
        let isUserLiked = localLikesArray.includes(userUid);
        let updatedLikesArray = [...localLikesArray];

        if (isUserLiked) {
            setIsLiked(false);
            setLikeCount(likeCount - 1);
            updatedLikesArray = updatedLikesArray.filter(uid => uid !== userUid);
        } else {
            setIsLiked(true);
            setLikeCount(likeCount + 1);
            playAudio("pop");
            updatedLikesArray.push(userUid);
        }

        try {
            await FirebaseManager.updateLikesWithTransaction(id, userUid);
            setLocalLikesArray(updatedLikesArray);  // Update the local state
        } catch (error) {
            console.error("Failed to update likes in Firebase:", error);
            // Revert the UI changes
            setIsLiked(isUserLiked);
            setLikeCount(isUserLiked ? likeCount - 1 : likeCount + 1);
        } finally {
            setIsUpdating(false);  // Allow further interactions
        }
    };
    

    const deleteLib = async () => {
        let result = await FileManager._retrieveData("read");
        result = JSON.parse(result);
        result = result.filter(item => item.id !== id);

        FileManager._storeData("read", JSON.stringify(result));

        closeDrawer();

        FirebaseManager.RefreshList();
    }
  
    let promptOrText = promptFirst;

    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isInitialRender.current) {
          Animated.sequence([
            Animated.delay(index * 5),
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            })
          ]).start();
          isInitialRender.current = false;
        }
      }, [index]);

    return (
        <TouchableOpacity onPress={() => playLib(id, type)}>
            <Animated.View
                style={[
                    styles.container,
                    globalStyles.containerWhitespace,
                    {opacity: fadeAnim},
                    {justifyContent: "space-between"}
                ]}
            >
                <View style={{justifyContent: "flex-start", alignItems: "flex-start"}}>
                    <Image
                        style={{
                            height: 45,
                            width: 45,
                            justifyContent: "center",
                            alignSelf: "center",
                        }}
                        source={FirebaseManager.avatars[avatarID]}
                    />
                </View>
                <View style={[styles.textRow, {flex: 1}]}>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.title, { fontSize: 16, color: "#505050", fontWeight: 500 }]}>{name}</Text>
                    <Text style={[{ fontSize: 13, color: "#49454F" }]}>
                        by {username} {!local ? `| ${likeCount} ${likeCount === 1 ? 'like' : 'likes'}` : '| Not published'}
                    </Text>
                </View>
                {icon && (
                    <View>
                        {(local || user === FirebaseManager.currentUserData?.auth?.uid) && (playable) ? (
                            <TouchableOpacity
                                style={styles.icon}
                                onPress={edit}
                            >
                                <Image
                                    style={{ height: 25, width: 25 }}
                                    source={require("../assets/images/icons/edit.png")}
                                />
                            </TouchableOpacity>
                        ) : (playable ? (
                            <TouchableOpacity
                                style={styles.icon}
                                onPress={favorite}
                            >
                                <Image
                                    style={{ height: 25, width: 28 }}
                                    source={isLiked ? require("../assets/images/icons/favorite.png") : require("../assets/images/icons/favorite-outlined.png")}
                                />
                            </TouchableOpacity>
                        ) : <TouchableOpacity
                            style={styles.icon}
                            onPress={deleteLib}
                        >
                            <Image
                                style={{ height: 27, width: 21 }}
                                source={require("../assets/images/icons/delete.png")}
                            />
                        </TouchableOpacity>)
                        }
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

    icon: {
        justifyContent: "flex-start",
        alignSelf: "flex-start",
        flex: 1,
        marginTop: 3,
        paddingRight: 20
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

export default ListItem;