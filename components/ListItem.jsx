import React, { useState, useEffect, useRef, useContext } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Pressable } from "react-native";
import globalStyles from "../styles/globalStyles";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import Dialog from "./Dialog";
import _ from "lodash";
import LibManager from "../scripts/lib_manager";
import { Animated } from "react-native";
import FirebaseManager from "../scripts/firebase_manager";
import DrawerActions from "./DrawerActions";
import AudioPlayer from "../scripts/audio";
import FileManager from "../scripts/file_manager";
import FunLibsShare from "../scripts/share";
import { useDialog } from "./Dialog";
import { ToastContext } from "../components/Toast";
import AvatarDisplay from "./AvatarDisplay";
import LikeButton from "./LikeButton";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import Drawer from "../components/DrawerComponent";
import { ScrollView as DrawerScrollView } from "react-native-gesture-handler";
import DrawerHeader from "../components/DrawerHeader";
import i18n from "../scripts/i18n";

function ListItem(props) {
    const { name, prompts, text, id, type, drawer, onClick, avatarID, username, likes, index, user, local, likesArray, playable, item, color, plays, comments, showPreview = true, locked, official, pack, refresh, published, bordered } = props;
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [listItemClickTimestamp, setListItemClickTimestamp] = useState(1);
    let uid = FirebaseManager.currentUserData?.auth?.uid ? FirebaseManager.currentUserData.auth.uid : FirebaseManager.localUID;

    const [likesAmount, setLikesAmount] = useState(likes)

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
    const { playAudio } = AudioPlayer();
    const [localLikesArray, setLocalLikesArray] = useState(likesArray || []);
    const showToast = useContext(ToastContext);

    const [loading, setLoading] = useState(false);

    const isInitialRender = useRef(true);

    const debouncedNavigationRef = useRef(
        _.debounce(async (id, type) => {
            if (playable) {
                let lib = await LibManager.getLibByID(id, type);
                if (!lib) {
                    showToast({ text: "There was an issue loading the lib. Please refresh and try again." });
                    setLoading(false);
                    return;
                }
                navigation.navigate("Play Lib", { libId: id, type: type, lib: lib, key: Math.random().toString() });
                setLoading(false);
                try {
                    FirebaseManager.updateNumericField("posts", id, "plays", 1);
                    FirebaseManager.updateNumericField("users", lib.user, "plays", 1);
                } catch (error) {
                    console.log("Error updating plays: " + error);
                }
            } else {
                readDrawerRef.current?.openDrawer();
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
        setLoading(true);
        setListItemClickTimestamp(Date.now());
        if (type === "stories") {
            readDrawerRef.current?.openDrawer();
            onClick({ id, name, type });
            setLoading(false);
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
        console.log("here 1");
        if (isUpdating) return;  // Prevent further interactions while updating
        console.log("here 2");
        if (!FirebaseManager.currentUserData?.auth?.uid) {
            showToast("You have to be signed in to like a post.");
            return;
        }
        console.log("here 3");
        setIsUpdating(true);

        const userUid = FirebaseManager.currentUserData.auth.uid;
        let isUserLiked = localLikesArray.includes(userUid);
        let updatedLikesArray = [...localLikesArray];
        console.log("here 4");
        if (isUserLiked) {
            console.log("here 5");
            setIsLiked(false);
            setLikeCount(likeCount - 1);
            updatedLikesArray = updatedLikesArray.filter(uid => uid !== userUid);
        } else {
            console.log("here 6");
            setIsLiked(true);
            setLikeCount(likeCount + 1);
            playAudio("pop");
            updatedLikesArray.push(userUid);
        }

        try {
            await FirebaseManager.updateLikesWithTransaction(id, userUid);
            setLocalLikesArray(updatedLikesArray);  // Update the local state
            console.log("here 7");
        } catch (error) {
            console.log("here 8");
            console.error("Failed to update likes in Firebase:", error);
            // Revert the UI changes
            setIsLiked(isUserLiked);
            setLikeCount(isUserLiked ? likeCount - 1 : likeCount + 1);
        } finally {
            console.log("here 9");
            setIsUpdating(false);  // Allow further interactions
        }
    };


    const deleteLib = async () => {
        let result = await FileManager._retrieveData("read");
        result = JSON.parse(result);
        result = result.filter(item => item.id !== id);

        FileManager._storeData("read", JSON.stringify(result));

        readDrawerRef.current?.closeDrawer();
        try {
            refresh();
        } catch (error) {
            console.log("REFRESH ERROR: " + error);
        }
    }

    let promptOrText = promptFirst;

    const fadeAnim = useRef(new Animated.Value(1)).current;

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

    const pulseAnim = useRef(new Animated.Value(1)).current;

    const startPulseAnimation = () => {
        pulseAnim.setValue(1); // Reset to full opacity before starting

        // Looping animation between 0.5 and 1 opacity
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 0.5,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]),
            {
                iterations: -1 // Infinite loop
            }
        ).start();

        setTimeout(() => {
            stopPulseAnimation();
        }, 3000);
    };

    const stopPulseAnimation = () => {
        pulseAnim.stopAnimation(); // Stop the animation
        pulseAnim.setValue(1); // Reset to full opacity
    };

    useEffect(() => {
        if (loading) {
            startPulseAnimation();
        } else {
            stopPulseAnimation();
        }

        // Cleanup function to stop the animation when the component unmounts or loading changes
        return () => stopPulseAnimation();
    }, [loading]);

    const readDrawerRef = useRef(null);

    return (
        <Animated.View
            style={[
                styles.container,
                { borderWidth: bordered ? 1 : 0},
                { opacity: fadeAnim },
                globalStyles.containerWhitespaceMargin,
                globalStyles.containerWhitespace,
                { justifyContent: "center", alignSelf: "center", flex: 1 }
            ]}
        >
            {locked && (
                <FontAwesome style={styles.lockedIcon} name="lock" size={70} color="#6294C9" />
            )}
            <AvatarDisplay
                avatarID={avatarID}
                title={name}
                color={color}
                locked={locked}
                text={(
                    <Text>
                        {"by "}
                        <Text style={user === "HOv8K8Z1Q6bUuGxENrPrleECIWe2" ? { color: "#6294C9", fontWeight: "600" } : null}>{username}</Text>
                        {!local ? !` | ${likeCount} ${likeCount === 1 ? 'like' : 'likes'}` : null}
                    </Text>
                )}
                rightComponent={"userActions"}
                uid={user}
                avatarOnPress={() => navigation.navigate("ProfileScreen", { uid: user })}
            />
            <View style={[styles.preview, locked ? globalStyles.lockedOpacity : null]}>
                {showPreview ? LibManager.displayPreview(text) : null}
            </View>
            <View style={[styles.actionsContainer, { marginTop: 8 }, locked ? globalStyles.lockedOpacity : null]}>
                <TouchableOpacity disabled={locked} onPress={() => playLib(id, type)}>
                    <Animated.View
                        style={[
                            { opacity: pulseAnim },
                        ]}>
                        <LinearGradient
                            colors={["#638BD5", "#60C195"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.actionPlay}
                        >
                            <MaterialCommunityIcons name="play-circle-outline" size={18} color="white" />
                            <Text style={[styles.actionText, { color: "white" }]}>
                                {!playable ? "Read lib" : "Play Lib"}
                            </Text>
                        </LinearGradient>
                    </Animated.View>
                </TouchableOpacity>
                {!playable && (
                    <TouchableOpacity style={[styles.action, styles.actionButton]} disabled={locked} onPress={showDeleteDialogHandler}>
                        <MaterialCommunityIcons name="delete-outline" size={18} color="#6294C9" />
                        <Text style={styles.actionText}>Delete</Text>
                    </TouchableOpacity>
                )}
                {(!official && !pack && playable ? (
                    <>
                        {(local || user === FirebaseManager.currentUserData?.auth?.uid) ? (
                            <TouchableOpacity style={[styles.action, styles.actionButton]} disabled={locked} onPress={edit}>
                                <MaterialCommunityIcons name="square-edit-outline" size={18} color="#6294C9" />
                                <Text style={styles.actionText}>Edit</Text>
                            </TouchableOpacity>
                        ) : (
                            <LikeButton
                                onPressed={favorite}
                                filled={isLiked ? true : false}
                                disabled={FirebaseManager.currentUserData?.auth?.uid ? false : true}
                                onDisabledPress={() => {
                                    showToast("You have to be signed in to like a post.");
                                }}
                                text={"" + likeCount}
                            />
                        )}
                        {published ? (
                            <>
                                <Pressable disabled={locked} style={styles.action} onPress={() => playLib(id, type)}>
                                    <MaterialCommunityIcons name="comment-multiple-outline" size={18} color="#6294C9" />
                                    <Text style={styles.actionText}>{comments ? comments.length : 0}</Text>
                                </Pressable>
                                <View style={styles.action}>
                                    <Entypo name="open-book" size={18} color="#6294C9" />
                                    <Text style={styles.actionText}>{plays ? plays : 0}</Text>
                                </View>
                            </>
                        ) : (
                            <Pressable disabled={locked} style={styles.action} onPress={() => {
                                showToast(i18n.t("edit_and_save_again_to_publish"));
                            }}>
                                <MaterialIcons name="public-off" size={18} color="#6294C9" />
                                <Text style={styles.actionText}>{i18n.t('not_published')}</Text>
                            </Pressable>
                        )}
                    </>)
                    :
                null)}
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
            <Drawer ref={readDrawerRef} containerStyle={[globalStyles.standardDrawer, { paddingHorizontal: 6 }]}>
                <DrawerHeader
                    containerStyle={{ paddingHorizontal: 20 }}
                    center={(
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 18 }}>{name}</Text>
                            <Text style={{ fontSize: 14 }}>{i18n.t('by')} {username}</Text>
                        </View>
                    )}
                    onClose={() => readDrawerRef.current?.closeDrawer()}
                />
                <DrawerScrollView>
                    <View style={[globalStyles.drawerTop, { paddingHorizontal: 14 }]}>
                        {LibManager.displayInDrawer(text)}
                    </View>
                </DrawerScrollView>
                <DrawerActions
                    onShare={() => {
                        FunLibsShare.Share(text.join("") + "\n\nCreated using: https://funlibs0.wordpress.com/download");
                    }}
                    onDelete={deleteLib}
                />
            </Drawer>
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
        minHeight: 130,
        borderStyle: "solid",
        // borderBottomWidth: 1
    },

    textRow: {
        flexDirection: "column",
    },

    lockedIcon: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: [{ translateX: -15 }, { translateY: -25 }], // Correct offset from its own size
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
        fontWeight: "400",
        letterSpacing: 0.5
    },
    dialogTitle: {
        color: "white",
        fontSize: 24,
    },

    actionsContainer: {
        flexDirection: "row",
        gap: 14,
        flexWrap: "wrap",
    },

    action: {
        flexDirection: "row",
        gap: 8,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#6294C9",
        borderStyle: "dashed",
        padding: 6,
        alignItems: "center",
        minHeight: 34
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
        alignItems: "center",
        minHeight: 34
    },

    actionText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#6294C9",
        lineHeight: 20
    },

    preview: {
        minHeight: 14,
    }
})

export default ListItem;