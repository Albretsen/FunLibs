import React, { useState, useEffect, useRef, useMemo, useContext } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Pressable, Image, ScrollView } from "react-native";
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
import { useDialog } from "./Dialog";
import { ToastContext } from "../components/Toast";
import AvatarDisplay from "./AvatarDisplay";
import LikeButton from "./LikeButton";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Entypo } from '@expo/vector-icons';

function ListItem(props) {
    const { name, prompts, text, id, type, drawer, onClick, avatarID, username, likes, index, user, local, likesArray, playable, item, color, plays, comments } = props;
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [listItemClickTimestamp, setListItemClickTimestamp] = useState(1);
    let uid = FirebaseManager.currentUserData?.auth?.uid ? FirebaseManager.currentUserData.auth.uid: FirebaseManager.localUID;

    const { openDialog } = useDialog();

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
        _.debounce(async (id, type) => {
            if (playable) {
                let lib = await LibManager.getLibByID(id, type);
                if (!lib) {
                    showToast({text: "There was an issue loading the template. Please refresh and try again."});
                    return;
                }
                navigation.navigate("Play Lib", { libId: id, type: type, lib: lib, key: Math.random().toString() });
                try {
                    FirebaseManager.updateNumericField("posts", id, "plays", 1);
                    FirebaseManager.updateNumericField("users", lib.user, "plays", 1);
                } catch (error) {
                    console.log("Error updating plays: " + error);
                }
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
        openDialog('deleteDialog', {
            onCancel: () => {

            },
            onConfirm: () => {
                deleteLib();
            },
            children: (
                <>
                    <Text style={globalStyles.dialogTitle}>Delete?</Text>
                    <Text style={globalStyles.dialogText}>Are you sure you want to delete the lib?</Text>
                </>
            ),
            cancelLabel: "Cancel",  // Custom textor the cancel button
            confirmLabel: "Delete"  // Custom text for the confirm button
        });
    }

    function hideDeleteDialogHandler() {
        setShowDeleteDialog(false);
    }

    const edit = () => {
		navigation.navigate("Create", {
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
            <Animated.View
                style={[
                    styles.container,
                    {opacity: fadeAnim},
                    globalStyles.containerWhitespaceMargin,
                    globalStyles.containerWhitespace,
                    {justifyContent: "center", alignSelf: "center", flex: 1}
                ]}
            >
                
                <AvatarDisplay 
                    avatarID={avatarID}
                    title={name}
                    color={color}
                    text={(
                        <Text>
                            {"by "} 
                            <Text style={user === "HOv8K8Z1Q6bUuGxENrPrleECIWe2" ? {color: "#6294C9", fontWeight: 600} : null}>{username}</Text>
                            {!local ? !` | ${likeCount} ${likeCount === 1 ? 'like' : 'likes'}` : ' | Not published'}
                        </Text>
                    )}
                    rightComponent={"userActions"}
                    uid={user}
                />
                {(
                    <View style={styles.preview}>
                        {LibManager.displayPreview(text)}
                    </View>
                )}
                <View style={[styles.actionsContainer, {marginTop: 8}]}>
                    <TouchableOpacity onPress={() => playLib(id, type)}>
                        <LinearGradient
                            colors={["#638BD5", "#60C195"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.actionPlay}
                        >
                            <MaterialCommunityIcons name="play-circle-outline" size={18} color="white" />
                            <Text style={[styles.actionText, {color: "white"}]}>Play Lib</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    {(local || user === FirebaseManager.currentUserData?.auth?.uid) ? (
                        <TouchableOpacity style={[styles.action, styles.actionButton]} onPress={edit}>
                            <MaterialCommunityIcons name="square-edit-outline" size={18} color="#6294C9" />
                            <Text style={styles.actionText}>Edit</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={[styles.action, styles.actionButton]}>
                            <LikeButton
                                style={styles.icon}
                                filled={isLiked ? true : false}
                                onPressed={favorite}
                                disabled={FirebaseManager.currentUserData?.auth?.uid ? false : true}
                                onDisabledPress={() => {
                                    showToast("You have to be signed in to like a post.");
                                }}
                            />
                            <Text style={styles.actionText}>{likes}</Text>
                        </TouchableOpacity>
                    )}
                    <Pressable style={styles.action} onPress={() => playLib(id, type)}>
                        <MaterialCommunityIcons name="comment-multiple-outline" size={18} color="#6294C9" />
                        <Text style={styles.actionText}>{comments ? comments.length : 0}</Text>
                    </Pressable>
                    <View style={styles.action}>
                        <Entypo name="open-book" size={18} color="#6294C9" />
                        <Text style={styles.actionText}>{plays ? plays : 0}</Text>
                    </View>
                </View>
                {showDeleteDialog && (
                    <Dialog
                        onCancel={hideDeleteDialogHandler}
                        onConfirm={() => {
                            deleteLib();
                            setShowDeleteDialog(false); // Hide the dialog after deletion
                        }}
                    >
                        <Text style={styles.dialogTitle}>Delete lib</Text>
                        <Text style={styles.dialogText}>Are you sure you want to delete this lib? Once deleted it cannot be recovered.</Text>
                    </Dialog>
                )}
            </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 0,
        justifyContent: "center",
        padding: 10,
        marginVertical: 8,
        borderRadius: 10,
        borderColor: "#CAC4D0",
        borderWidth: 1,
        borderStyle: "dashed",
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

    iconImage: {
        height: 28,
        width: 28,
        tintColor: "#D1E8D5",
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

    actionsContainer: {
        flexDirection: "row",
        gap: 14
    },

    action: {
        flexDirection: "row",
        gap: 8,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#6294C9",
        borderStyle: "dashed",
        padding: 6,
        alignItems: "center"
    },

    actionButton: {
        borderStyle: "solid"
    },

    actionNoBorder: {
        borderWidth: 0
    },

    actionPlay: {
        flexDirection: "row",
        gap: 4,
        borderRadius: 5,
        padding: 6,
        paddingHorizontal: 10,
        alignItems: "center"
    },

    actionText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#6294C9",
        lineHeight: 20
    }
})

export default ListItem;