import React, { useContext, useState, useEffect, useRef } from "react";
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Platform } from "react-native";
import Buttons from "../components/Buttons";
import globalStyles from "../styles/globalStyles";
import Lib from "../scripts/lib";
import LibManager from "../scripts/lib_manager";
import { ToastContext } from "../components/Toast";
import { useNavigation } from "@react-navigation/native";
import BannerAdComponent from "../components/BannerAd";
import { useIsFocused } from '@react-navigation/native';
import { ScreenContext } from "../App";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Divider } from '@rneui/themed';
import DrawerActions from "../components/DrawerActions";
import FileManager from "../scripts/file_manager";
import FirebaseManager from "../scripts/firebase_manager";
import { useFocusEffect } from '@react-navigation/native';
import AudioPlayer from "../scripts/audio";
import { DialogTrigger, useDialog } from "../components/Dialog";
import AdManager from "../scripts/ad_manager";
import AvatarDisplay from "../components/AvatarDisplay";
import Dropdown from "../components/Dropdown";
import i18n from "../scripts/i18n";
// import { Drawer } from 'hallvardlh-react-native-drawer';
import Drawer from "../components/DrawerComponent";
import DrawerHeader from "../components/DrawerHeader";
import { ScrollView as DrawerScrollView } from "react-native-gesture-handler";

export default function CreateLibScreen({ route }) {
    const [libText, setLibText] = useState(route.params?.params?.libText || "");
    const [libNameText, setLibNameText] = useState(route.params?.params?.libNameText || "");
    const [item, setItem] = useState(route.params?.params?.item || undefined);
    const [finishedLib, setFinishedLib] = useState(null);
    const showToast = useContext(ToastContext);
    const [cursorPosition, setCursorPosition] = useState({ start: 0, end: 0 });
    const [newCursorPosition, setNewCursorPosition] = useState();
    const [editLibID, setEditLibID] = useState(null);
    const { playAudio } = AudioPlayer();
    const navigation = useNavigation();

    const [keyboardHeight, setKeyboardHeight] = useState(0);

    // Drawer refs
    const saveDrawerRef = useRef(null);
    const deleteDrawerRef = useRef(null);

    useEffect(() => {
        function onKeyboardDidShow(e) {
            setKeyboardHeight(e.endCoordinates.height);
        }

        function onKeyboardDidHide() {
            setKeyboardHeight(0);
        }

        const showSubscription = Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
        const hideSubscription = Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);
        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    const [initialLibText, setInitialLibText] = useState(libText);
    const [initialLibNameText, setInitialLibNameText] = useState(libNameText);

    const { openDialog } = useDialog();

    const customPromptTextRef = useRef("");

    useFocusEffect(
        React.useCallback(() => {
            // This will run when the screen comes into focus

            return () => {
                if (libTextRef.current !== initialLibTextRef.current || libNameTextRef.current !== initialLibNameTextRef.current) {
                    if (libTextRef.current === "") return;
                    openDialog('discardChangesDialog', {
                        onCancel: () => {
                            setLibText("");
                            setLibNameText("");
                            setItem({});
                            setEditLibID(null);
                        },
                        onConfirm: () => {
                            navigation.navigate("Create", {
                                params: {
                                    libText: libTextRef.current,
                                    libNameText: libNameTextRef.current,
                                    editID: editLibID,
                                }
                            });
                        },
                        children: (
                            <>
                               <Text style={globalStyles.dialogTitle}>{i18n.t('unsaved_progress')}</Text>
                               <Text style={globalStyles.dialogText}>{i18n.t('continue_writing')}</Text>
                            </>
                        ),
                        cancelLabel: i18n.t('discard'),
                        confirmLabel: i18n.t('continue')
                    });
                } else {
                    //setLibText("");
                    //setLibNameText("");
                    //setEditLibID(null);
                }
            };
        }, [])
    );

    useEffect(() => {
        return () => {
            navigation.setOptions({ swipeEnabled: false });
        };
    }, []);

    useEffect(() => {
        // Log the route.params to see the values

        // Check if the parameters exist and then update the state
        if (route.params?.params?.libText) {
            setLibText(route.params.params.libText);
            setInitialLibText(route.params.params.libText);
        } else {
            setLibText("");
        }
        if (route.params?.params?.libNameText) {
            setLibNameText(route.params.params.libNameText);
            setInitialLibNameText(route.params.params.libNameText);
        } else {
            setLibNameText("");
        }
        if (route.params?.params?.editID) {
            setEditLibID(route.params.params.editID);
        } else {
            setEditLibID(undefined);
        }
        if (route.params?.params?.item) {
            setItem(route.params.params.item);
        } else {
            setItem(undefined);
        }
    }, [route.params]);

    const libTextRef = useRef(libText);
    const finishedLibRef = useRef(finishedLib);
    const libNameTextRef = useRef(libNameText);
    const initialLibTextRef = useRef(libText);
    const initialLibNameTextRef = useRef(libNameText);
    const newCursorPositionRef = useRef(newCursorPosition);

    useEffect(() => {
        initialLibNameTextRef.current = initialLibNameText;
        initialLibTextRef.current = initialLibText;
        libTextRef.current = libText;
        finishedLibRef.current = finishedLib;
        if (editLibID && finishedLibRef.current) {
            finishedLibRef.current.id = editLibID.id;
        }
        libNameTextRef.current = libNameText;
    }, [libText, finishedLib, libNameText, initialLibText, initialLibNameText]);

    const [customPromptText, setCustomPromptText] = useState("");

    const isFocused = useIsFocused();
    const { setCurrentScreenName } = useContext(ScreenContext);

    useEffect(() => {
        if (isFocused) {
            setCurrentScreenName("CreateLibScreen");
        }
    }, [isFocused]);

    const { setParams } = useNavigation();

    useEffect(() => {
        setParams({ saveLib });
    }, []);

    // Gets called whenever finishedLib is changed
    // finishedLib is only changed when the save button is tapped
    // so this works
    useEffect(() => {
        if (finishedLib) {
            saveDrawerRef.current?.openDrawer();
        }
    }, [finishedLib]);

    const saveLib = () => {
        if (!libNameTextRef.current) {
            showToast({text: i18n.t('please_add_a_title'), noBottomMargin: true});
            return;
        }
        if (!libTextRef.current) {
            showToast({text: i18n.t('please_add_some_text'), noBottomMargin: true});
            return;
        }

        let temp_finished_lib = Lib.createLib(libTextRef.current);

        temp_finished_lib.pack = "easter_pack";
        temp_finished_lib.avatarID = "13";
        temp_finished_lib.username = "The Fun Libs Team";
        temp_finished_lib.published = true;
        temp_finished_lib.playable = true;
        temp_finished_lib.user = "HOv8K8Z1Q6bUuGxENrPrleECIWe2";
        temp_finished_lib.name = libNameTextRef.current;
        temp_finished_lib.id = Math.random().toString(36).slice(2, 7);
        //console.log(JSON.stringify(temp_finished_lib));

        if (temp_finished_lib.prompts.length < 1) {
            showToast({text: i18n.t('please_add_some_prompts'), noBottomMargin: true});
            return;
        }

        setFinishedLib(Lib.createLib(libTextRef.current));
    }

    const POSTS_COLLECTION = "posts";
    const MY_CONTENT_KEY = "my_content";

    const keyboardVerticalOffset = 0;

    // const ParentTag = Platform.OS == "android" ? KeyboardAvoidingView : View;
    const ParentTag = KeyboardAvoidingView;

    const libTextInputRef = useRef(null);

    let addPrompt = (prompt) => {
        playAudio('pop');
        const beforeCursor = libText.substring(0, cursorPosition.start);
        const afterCursor = libText.substring(cursorPosition.start);
        const updatedText = beforeCursor + ' (' + prompt + ') ' + afterCursor;

        newCursorPositionRef.current = cursorPosition.start + prompt.length + 4;

        if (libTextInputRef.current) {
            libTextInputRef.current.setNativeProps({
                text: updatedText,
            });
        }

        setLibText(updatedText);
        setButtonPressed(false);
    }

    // Dialog-related functions

    let addCustomPrompt = (text) => {
        addPrompt(text);
    }

    const [showDialogCustom, setShowDialogCustom] = useState(false);
    const [showDialogInfo, setShowDialogInfo] = useState(false);

    const save = () => {
        // Brand new lib
        showToast({text: i18n.t('saving'), loading: true, noBottomMargin: true});
        saveDrawerRef.current?.closeDrawer();

        if (!editLibID && !item?.local) {
            saveNew();
            return;
        }
        if (editLibID && item?.local) {
            saveChangesLocal();
            return;
        }
        if (editLibID && !item?.local) {
            if (!FirebaseManager.currentUserData.auth) notLoggedIn();
            saveChangesPublished();
            return;
        }
        showToast({text: i18n.t('error_saving'), loading: false, noBottomMargin: true});
    }

    const saveNew = async () => {
        let lib = finishedLibRef.current;

        lib.name = libNameTextRef.current;
        lib.date = new Date();
        lib.id = new Date().getTime() / 1000;
        lib.likes = 0;
        lib.weightedLikes = 0;
        lib.likesArray = [];
        lib.official = FirebaseManager.currentUserData?.firestoreData?.username === "Official";
        lib.playable = true;
        
        lib.published = false;
        lib.local = true;

        lib.avatarID = FirebaseManager.currentUserData?.firestoreData?.avatarID ? FirebaseManager.currentUserData.firestoreData.avatarID : "0";
        lib.user = FirebaseManager.currentUserData?.auth?.uid ? FirebaseManager.currentUserData.auth.uid : "NO_ACCOUNT";
        lib.username =  FirebaseManager.currentUserData?.firestoreData?.username ? FirebaseManager.currentUserData.firestoreData.username : i18n.t('you');

        let local_libs = await getLocalLibs();
        local_libs.push(lib);
        await FileManager._storeData("my_content", JSON.stringify(local_libs));

        finished(i18n.t('your_text_has_been_saved_under_my_templates'), { category: "myContent" });
    }

    const saveChangesLocal = async () => {
        let lib = item;

        lib.name = libNameTextRef.current;
        lib.text = finishedLibRef.current.text;
        lib.prompts = finishedLibRef.current.prompts;

        let local_libs = await getLocalLibs();

        let index = local_libs.findIndex(obj => obj.id === lib.id);

        if (index !== -1) {
            local_libs.splice(index, 1, lib);
        }

        await FileManager._storeData("my_content", JSON.stringify(local_libs));

        finished(i18n.t('your_changes_have_been_saved'), { category: "myContent" });
    }

    const saveChangesPublished = async () => {
        let lib = item;

        lib.name = libNameTextRef.current;
        lib.text = finishedLibRef.current.text;
        lib.prompts = finishedLibRef.current.prompts;

        lib.avatarID = FirebaseManager.currentUserData.firestoreData.avatarID;
        lib.user = FirebaseManager.currentUserData.auth.uid;
        lib.username =  FirebaseManager.currentUserData.firestoreData.username;

        await FirebaseManager.UpdateDocument("posts", lib.id, { name: lib.name, text: lib.text, prompts: lib.prompts, avatarID: lib.avatarID, user: lib.user, username: lib.username});

        finished(i18n.t('your_changes_have_been_saved'), { category: "all" });
    }

    const getLocalLibs = async () => {
        let local_libs = await FileManager._retrieveData("my_content");

        if (local_libs) return JSON.parse(local_libs);
        return [];
    }

    const publish = async () => {
        if (!FirebaseManager.currentUserData.auth) {
            notLoggedIn();
            return;
        }
        saveDrawerRef.current?.closeDrawer();
        showToast({text: i18n.t('publishing'), loading: true, noBottomMargin: true});
        const wasRewardGiven = await AdManager.showRewardedAd(); 

        if (wasRewardGiven === true) {
            // The user has watched the ad and earned the reward
            // Continue with the publish action
            if (!editLibID && !item?.local) {
                await publishNew();
                return;
            }
            if (editLibID && item?.local) {
                await publishLocal();
                return;
            }
            showToast({text: i18n.t('error_publishing'), loading: false, noBottomMargin: true});
        } else if (wasRewardGiven === false) {
            // The user did not watch the ad or did not earn the reward
            // Show a toast message to inform the user
            showToast({text: i18n.t('you_need_to_watch_the_ad_to_proceed_with_publishing'), loading: false, noBottomMargin: true});
        } else {
            // The ad failed.
            // Continue with the publish action
            if (!editLibID && !item?.local) {
                await publishNew();
                return;
            }
            if (editLibID && item?.local) {
                await publishLocal();
                return;
            }
            showToast({text: i18n.t('error_publishing'), loading: false, noBottomMargin: true});
        }
    };    

    const publishNew = async () => {
        let lib = {...finishedLibRef.current}; // Spread operator converts Lib object to standard JS object

        lib.name = libNameTextRef.current;
        lib.date = new Date();
        lib.id = new Date().getTime() / 1000;
        lib.likes = 0;
        lib.weightedLikes = 0;
        lib.likesArray = [];
        lib.official = FirebaseManager.currentUserData?.firestoreData?.username === "Official";
        lib.playable = true;
        
        lib.published = true;
        lib.local = false;

        lib.avatarID = FirebaseManager.currentUserData.firestoreData.avatarID;
        lib.user = FirebaseManager.currentUserData.auth.uid;
        lib.username =  FirebaseManager.currentUserData.firestoreData.username;

        let id = await FirebaseManager.AddDocumentToCollection("posts", lib)
        await FirebaseManager.UpdateDocument("posts", id, { id: id });

        const userId = FirebaseManager.currentUserData.auth.uid;
        await FirebaseManager.updateNumericField("users", userId, "libsCount", 1);

        finished(i18n.t('your_text_has_been_published'), { category: "all" });
    }

    const publishLocal = async () => {
        let lib = item;

        lib.name = libNameTextRef.current;
        lib.text = finishedLibRef.current.text;
        lib.prompts = finishedLibRef.current.prompts;

        lib.date = new Date();

        lib.local = false;
        lib.published = true;

        lib.avatarID = FirebaseManager.currentUserData.firestoreData.avatarID;
        lib.user = FirebaseManager.currentUserData.auth.uid;
        lib.username =  FirebaseManager.currentUserData.firestoreData.username;

        let local_libs = await getLocalLibs();

        let index = local_libs.findIndex(obj => obj.id === lib.id);

        if (index !== -1) {
            local_libs.splice(index, 1);
        }

        await FileManager._storeData("my_content", JSON.stringify(local_libs));

        let id = await FirebaseManager.AddDocumentToCollection("posts", lib)
        await FirebaseManager.UpdateDocument("posts", id, { id: id });

        const userId = FirebaseManager.currentUserData.auth.uid;
        await FirebaseManager.updateNumericField("users", userId, "libsCount", 1);

        finished(i18n.t('your_text_has_been_published'), { category: "all" });
    }

    const notLoggedIn = () => {
        showToast({text: i18n.t('you_have_to_be_logged_in_please_save_as_draft_then_publish_after_signing_in'), noBottomMargin: true});
        saveDrawerRef.current?.closeDrawer();
    }

    const finished = (message, refreshOptions) => {
        refreshOptions.sortBy = "newest";
        //FirebaseManager.RefreshList(refreshOptions);
        setLibText("");
        setLibNameText("");
        setEditLibID("");
        setItem(undefined);
        showToast({text: message, loading: false, noBottomMargin: true});
        navigation.navigate("Browse", { initialTab: "Community", category: "myContent", refresh: Math.floor(Math.random() * 999) });
    }

    const showDeleteConfirmation = () => {
        deleteDrawerRef.current?.openDrawer();
    }

    const delete_ = async () => {
        deleteDrawerRef.current?.closeDrawer();
        showToast({text: i18n.t('deleting'), loading: true, noBottomMargin: true});
        if (editLibID && item?.local) {
            let local_libs = await getLocalLibs();

            let index = local_libs.findIndex(obj => obj.id === item.id);

            if (index !== -1) {
                local_libs.splice(index, 1);
            }

            await FileManager._storeData("my_content", JSON.stringify(local_libs));

            finished(i18n.t('your_text_has_been_deleted'), { category: "all" });
            return;
        }
        if (editLibID && !item?.local) {
            await FirebaseManager.DeleteDocument("posts", item.id);

            const userId = FirebaseManager.currentUserData.auth.uid;
            await FirebaseManager.updateNumericField("users", userId, "libsCount", -1);
            finished(i18n.t('your_text_has_been_deleted'), { category: "all" });
            return;
        }

        finished(i18n.t('your_text_has_been_deleted'), { category: "all" });
    }

    const [buttonPressed, setButtonPressed] = useState(false);

    const handleDismissKeyboard = () => {
        if (!buttonPressed) {
            Keyboard.dismiss();
        }
        setButtonPressed(false);
    };

    return (
        <TouchableWithoutFeedback onPressOut={handleDismissKeyboard}>
            <ParentTag
                behavior='height'
                keyboardVerticalOffset={keyboardVerticalOffset}
                style={[
                    globalStyles.screenStandard,
                    globalStyles.standardHeight,
                    { backgroundColor: "white", flex: 1, paddingBottom: 55 },
                ]}
            >
                {/* <ScrollView style={[globalStyles.standardWhitespace]}
                    keyboardShouldPersistTaps={'always'}
                    keyboardDismissMode='on-drag'
                > */}
                {/* paddingBottom: (keyboardHeight - (promptButtonsHeight + dividerHeight)) */}
                <View style={[{flex: 1}, globalStyles.standardWhitespace]}>
                    <AvatarDisplay
                        avatarID={(FirebaseManager.currentUserData?.firestoreData ? FirebaseManager.currentUserData.firestoreData.avatarID : "no-avatar-48")}
                        avatarTint={FirebaseManager.currentUserData?.firestoreData ? null : "#5f6368"}
                        titleComponent={(
                            <TextInput
                                style={[globalStyles.input, globalStyles.inputSmall, { fontSize: 18, borderColor: "white", padding: 0, height: "auto"}]}
                                placeholder={i18n.t('write_your_title_here')}
                                placeholderTextColor={"#9e9e9e"}
                                onChangeText={text => setLibNameText(text)}
                                value={libNameText}
                            />
                        )}
                        text={i18n.t('by') + " " + (FirebaseManager.currentUserData?.firestoreData ? FirebaseManager.currentUserData.firestoreData.username : i18n.t('you'))}
                        rightComponent={(
                            <View style={{ flexDirection: "column", alignItems: "flex-end", flex: 1, justifyContent: "center" }}>
                                <TouchableOpacity onPress={saveLib}>
                                    <Text style={[globalStyles.touchableText, {fontSize: 17, fontWeight: "500", paddingRight: 4}]}>{i18n.t('next')}</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />

                    <View style={{ flexGrow: 0 }}>
                        <Buttons
                            buttons={
                                [{
                                    label: i18n.t('custom'),
                                    icon: "add",
                                    iconColor: "#6294C9",
                                    onPress: () => {
                                        setButtonPressed(true);
                                        setShowDialogCustom(true)
                                    }
                                },
                                {
                                    label: i18n.t('adjective'),
                                    icon: "add",
                                    iconColor: "#6294C9",
                                    onPress: () => {
                                        setButtonPressed(true);
                                        addPrompt("Adjective");
                                    },
                                },
                                {
                                    label: i18n.t('verb'),
                                    icon: "add",
                                    iconColor: "#6294C9",
                                    onPress: () => {
                                        setButtonPressed(true);
                                        addPrompt("Verb");
                                    },
                                },
                                {
                                    label: i18n.t('noun'),
                                    icon: "add",
                                    iconColor: "#6294C9",
                                    onPress: () => {
                                        setButtonPressed(true);
                                        addPrompt("Noun");
                                    },
                                },
                                {
                                    label: i18n.t('occupation'),
                                    icon: "add",
                                    iconColor: "#6294C9",
                                    onPress: () => {
                                        setButtonPressed(true);
                                        addPrompt("Occupation");
                                    },
                                },
                                {
                                    label: i18n.t('name'),
                                    icon: "add",
                                    iconColor: "#6294C9",
                                    onPress: () => {
                                        setButtonPressed(true);
                                        addPrompt("Name");
                                    },
                                },
                                {
                                    label: i18n.t('emotion'),
                                    icon: "add",
                                    iconColor: "#6294C9",
                                    onPress: () => {
                                        setButtonPressed(true);
                                        addPrompt("Emotion");
                                    },
                                },
                                {
                                    label: i18n.t('place'),
                                    icon: "add",
                                    iconColor: "#6294C9",
                                    onPress: () => {
                                        setButtonPressed(true);
                                        addPrompt("Place");
                                    },
                                },
                                {
                                    label: i18n.t('animal'),
                                    icon: "add",
                                    iconColor: "#6294C9",
                                    onPress: () => {
                                        setButtonPressed(true);
                                        addPrompt("Animal");
                                    },
                                },
                                ]
                            }
                            buttonStyle={{ borderRadius: 8, borderColor: "#6294C9", borderWidth: 1, backgroundColor: "white",minWidth: 50, height: 38, padding: 4, gap: 4, paddingHorizontal: 10}}
                            containerStyle={{ justifyContent: "flex-start", marginBottom: 0, gap: 8 }}
                            labelStyle={{ fontSize: 14, fontWeight: "500", color: "#6294C9" }}
                            iconSize={16}
                            sideScroll={true}
                        />
                    </View>

                    <View style={{flexDirection: "row", flex: 1, marginTop: 14, marginBottom: Platform.OS === "ios" ? 25 : 0}}>
                        <TextInput
                            ref={libTextInputRef}
                            style={[globalStyles.input, globalStyles.inputLarge, { flex: 1, flexGrow: 1, fontSize: 18}]}
                            multiline={true}
                            onChangeText={text => setLibText(text)}
                            placeholder={i18n.t('write_your_text_here')}
                            placeholderTextColor={"#9e9e9e"}
                            onSelectionChange={(event) => setCursorPosition(event.nativeEvent.selection)}
                            selection={newCursorPosition}
                            value={libText}
                        />
                        <View style={{ height: "auto", flexBasis: 24, paddingTop: 10}}>
                            <TouchableOpacity onPress={() => setShowDialogInfo(true)}>
                                <MaterialIcons style={{ color: "#49454F" }} name="help" size={22} />
                            </TouchableOpacity>
                            <Dropdown
                                anchor={
                                    <MaterialIcons style={{ color: "#49454F" }} name="more-vert" size={20} />
                                }
                                containerStyle={{marginLeft: 0, alignSelf: "center"}}
                                options={[
                                    {
                                        name: i18n.t('save'),
                                        onPress: () => {
                                            saveLib();
                                        },
                                    }, {
                                        name: i18n.t('delete'),
                                        onPress: () => {
                                            showDeleteConfirmation();
                                        },
                                    }, {
                                        name: i18n.t('help'),
                                        onPress: () => {
                                            setShowDialogInfo(true);
                                        }
                                    }
                                ]}
                            />
                        </View>
                    </View>
                    <Divider color="#CAC4D0" style={{ marginVertical: 10 }} />

                    <Drawer ref={saveDrawerRef} containerStyle={[globalStyles.standardDrawer, {paddingHorizontal: 6}]}>
                        <DrawerHeader
                        containerStyle={{paddingHorizontal: 20}}
                            center={(
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 18 }}>{libNameTextRef.current}</Text>
                                    <Text style={{ fontSize: 14 }}>By You</Text>
                                </View>
                            )}
                            onClose={() => saveDrawerRef.current?.closeDrawer()}
                        />
                        <>
                            <DrawerScrollView>
                                <View style={[globalStyles.drawerTop, {paddingHorizontal: 20}]}>
                                    {finishedLib ? LibManager.displayInDrawer(finishedLib.text) : <Text>{i18n.t('no_item_selected')}</Text>}
                                </View>
                            </DrawerScrollView>
                            <DrawerActions
                                {...(!editLibID || (editLibID && item?.local) ? { onPublish: () => { publish() } } : {})}
                                onSave={() => { save() }}
                                saveLabel={!editLibID ? i18n.t('save_as_draft') : i18n.t('save_changes')}
                                {...(editLibID ? { onDelete: () => {
                                    saveDrawerRef.current?.closeDrawer();
                                    showDeleteConfirmation();
                                } } : {})}
                            />
                        </>
                    </Drawer>

                    <Drawer ref={deleteDrawerRef} containerStyle={globalStyles.standardDrawer}>
                        <DrawerHeader
                            center={(
                                <Text style={globalStyles.drawerTitle}>{i18n.t('delete_template')}</Text>
                            )}
                            onClose={() => deleteDrawerRef.current?.closeDrawer()}
                        />
                        
                        <DrawerScrollView>
                            <View style={[globalStyles.drawerTop, { height: "100%" }]}>
                                <Text style={styles.paragraph}>
                                    {i18n.t('are_you_sure_you_want_to_delete_this_template')}
                                </Text>
                                <Text style={styles.paragraph}>
                                    {i18n.t('by_deleting_the_story_will_be_lost_forever')}
                                </Text>
                            </View>
                        </DrawerScrollView>
                        <DrawerActions
                            onDelete={() => {
                                delete_();
                            }}
                            deleteLabel={i18n.t('im_sure_delete')}
                            onUndo={() => {
                                deleteDrawerRef.current?.closeDrawer();
                                saveDrawerRef.current?.openDrawer();
                            }}
                            undoLabel={i18n.t('dont_delete')}
                        />
                    </Drawer>

                    <DialogTrigger
                        id="dialogCustom"
                        show={showDialogCustom}
                        onCancel={() => setShowDialogCustom(false)}
                        onConfirm={() => {
                            addCustomPrompt(customPromptTextRef.current);
                            setShowDialogCustom(false);
                        }}
                        confirmLabel="Add"
                        cancelLabel="Cancel"
                    >
                        <View style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}>
                            <View style={styles.iconCircle}>
                                <MaterialIcons style={{ color: "white" }} name="add" size={28} />
                            </View>
                            <View>
                                <Text style={[{ fontSize: 20 }, globalStyles.bold]}>{i18n.t('custom_prompt')}</Text>
                                <Text style={{ fontSize: 18 }}>{i18n.t('add_a_custom_prompt')}</Text>
                            </View>
                        </View>
                        <TextInput
                            style={[globalStyles.input, globalStyles.inputSmall, { paddingHorizontal: 14, marginVertical: 10, fontSize: 18 }]}
                            numberOfLines={1}
                            placeholder={i18n.t('your_prompt')}
                            onChangeText={text => {
                                customPromptTextRef.current = text;
                                setCustomPromptText(text)
                            }}
                        />
                    </DialogTrigger>
                    <DialogTrigger
                        id="dialogInfo"
                        show={showDialogInfo}
                        onCancel={() => setShowDialogInfo(false)}
                        onConfirm={() => setShowDialogInfo(false)}
                        cancelLabel=" "
                    >
                        <Text style={styles.paragraph}>
                            {i18n.t('write_your_text_by_using_prompts_enclosed_in_parantheses_for_example')}:
                        </Text>
                        <Text style={styles.paragraph}>
                            {i18n.t('they_built_an')} <Text style={styles.highlighted}>({i18n.t('adjective')})</Text> {i18n.t('house')}.
                        </Text>
                        <Text style={styles.paragraph}>
                            {i18n.t('you_can_repeat_words_by_adding_a_number_at_the_end_like_so')}
                        </Text>
                        <Text style={styles.paragraph}>
                            <Text style={styles.highlighted}>({i18n.t('name_1')})</Text> {i18n.t('is_building_a_table')}. <Text style={styles.highlighted}>({i18n.t('name_1')})</Text> {i18n.t('is_a_carpenter')}
                        </Text>
                    </DialogTrigger>
                </View>
                {/* </ScrollView> */}
            </ParentTag>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    label: {
        fontSize: 18,
        marginBottom: 4,
        marginTop: 16,
    },
    highlighted: {
        color: "#6294C9"
    },
    paragraph: {
        marginBottom: 16,
        fontSize: 16,
    },

    iconCircle: {
        borderRadius: 100,
        height: 50,
        width: 50,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#006D40"
    }
})