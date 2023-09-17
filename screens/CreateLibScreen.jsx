import React, { useContext, useState, useEffect, useRef } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, Platform, KeyboardAvoidingView, Dimensions, TouchableOpacity, Image } from "react-native";
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
import { useDrawer } from "../components/Drawer";
import { Divider } from '@rneui/themed';
import DrawerActions from "../components/DrawerActions";
import FileManager from "../scripts/file_manager";
import FirebaseManager from "../scripts/firebase_manager";
import { useFocusEffect } from '@react-navigation/native';
import AudioPlayer from "../scripts/audio";
import { DialogTrigger, useDialog } from "../components/Dialog";

export default function CreateLibScreen({ route }) {
    const [libText, setLibText] = useState(route.params?.libText || "");
    const [libNameText, setLibNameText] = useState(route.params?.libNameText || "");
    const [item, setItem] = useState(route.params?.item || undefined);
    const [finishedLib, setFinishedLib] = useState(null);
    const showToast = useContext(ToastContext);
    const [cursorPosition, setCursorPosition] = useState({ start: 0, end: 0 });
    const [newCursorPosition, setNewCursorPosition] = useState();
    const [editLibID, setEditLibID] = useState(null);
    const { playAudio } = AudioPlayer();
    const navigation = useNavigation();

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
                            navigation.navigate("Home", {
                                screen: "Create",
                                params: {
                                    libText: libTextRef.current,
                                    libNameText: libNameTextRef.current,
                                    editID: editLibID,
                                }
                            });
                        },
                        children: (
                            <>
                                <Text style={{ fontWeight: 'bold' }}>Unsaved progress!</Text>
                                <Text style={{ marginTop: 10 }}>
                                    Do you want to continue writing, or discard the changes?
                                </Text>
                            </>
                        ),
                        cancelLabel: "Discard",  // Custom text for the cancel button
                        confirmLabel: "Continue"  // Custom text for the confirm button
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
            navigation.setOptions({ swipeEnabled: true });
        };
    }, []);

    useEffect(() => {
        // Log the route.params to see the values
        console.log("route.params:", route.params);

        // Check if the parameters exist and then update the state
        if (route.params?.libText) {
            setLibText(route.params.libText);
            setInitialLibText(route.params.libText);
        } else {
            setLibText("");
        }
        if (route.params?.libNameText) {
            setLibNameText(route.params.libNameText);
            setInitialLibNameText(route.params.libNameText);
        } else {
            setLibNameText("");
        }
        if (route.params?.editID) {
            setEditLibID(route.params.editID);
        } else {
            setEditLibID(undefined);
        }
        if (route.params?.item) {
            setItem(route.params.item);
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
            openDrawer({
                header: {
                    middleComponent: (
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 18 }}>{libNameTextRef.current}</Text>
                            <Text style={{ fontSize: 14 }}>By You</Text>
                        </View>
                    )
                },
                component: saveDrawerContent
            });
        }
    }, [finishedLib]);

    const saveLib = () => {
        if (!libNameTextRef.current) {
            showToast("Please add a title to your lib!");
            return;
        }
        if (!libTextRef.current) {
            showToast("Please add some text to your lib!");
            return;
        }
        //console.log(libTextRef.current);

        let temp_finished_lib = Lib.createLib(libTextRef.current);

        if (temp_finished_lib.prompts.length < 1) {
            showToast("Please add some prompts to your lib!");
            return;
        }

        setFinishedLib(Lib.createLib(libTextRef.current));
    }

    let publishDialog = () => {
        // setShowDialogPublish(true);
        openDrawer({
            header: {
                title: "Publish Lib?"
            },
            component: (
                <>
                    <ScrollView>
                        <View style={[globalStyles.drawerTop, { height: "100%" }]}>
                            <Text style={styles.paragraph}>
                                {"By publishing your story, everyone gets to create all sorts of whacky and hilarious stories, thanks to you!"}
                            </Text>
                            <Text style={styles.paragraph}>
                                {"If you don't want to publish your story, you can simply save it locally to your device."}
                            </Text>
                        </View>
                    </ScrollView>
                    <Image
                        style={{ height: 212, width: 205 }}
                        source={require("../assets/images/girl-with-balloon.png")}
                    />
                    <DrawerActions
                        onPublish={() => {
                            publishSaveLib();
                        }}
                        publishLabel={editLibID ? "Publish Changes" : "Publish"}
                        onSave={() => {
                            localSaveLib();
                        }}
                        saveLabel={editLibID ? "Save Changes to Device" : "No, just save to Device"}
                    />
                </>
            )
        });
    }

    const POSTS_COLLECTION = "posts";
    const MY_CONTENT_KEY = "my_content";


    const keyboardVerticalOffset = Platform.OS === 'ios' ? 90 : null

    const ParentTag = Platform.OS === 'ios' ? KeyboardAvoidingView : View;

    const buttonColor = "#006D40";

    const libTextInputRef = useRef(null);

    let addPrompt = (prompt) => {
        playAudio('pop');
        const beforeCursor = libText.substring(0, cursorPosition.start);
        const afterCursor = libText.substring(cursorPosition.start); // Note the change here
        const updatedText = beforeCursor + '(' + prompt + ')' + afterCursor;

        newCursorPositionRef.current = cursorPosition.start + prompt.length + 2;

        if (libTextInputRef.current) {
            libTextInputRef.current.setNativeProps({
                text: updatedText,
            });
        }

        setLibText(updatedText);
    }

    // Dialog-related functions

    let addCustomPrompt = (text) => {
        console.log("TESX:T " + text);
        addPrompt(text);
    }

    const [showDialogCustom, setShowDialogCustom] = useState(false);
    const [showDialogInfo, setShowDialogInfo] = useState(false);
    const [showDialogPublish, setShowDialogPublish] = useState(false);

    // Drawer 

    const { openDrawer, drawerRef, closeDrawer } = useDrawer();

    const saveDrawerContent = (
        <>
            <ScrollView style={{ width: Dimensions.get("window").width - (0.15 * Dimensions.get("window").width) }}>
                <View style={globalStyles.drawerTop}>
                    {/* <Text style={globalStyles.fontLarge}>{libNameTextRef.current}</Text> */}
                    {finishedLib ? LibManager.displayInDrawer(finishedLib.text) : <Text>No item selected</Text>}
                </View>
            </ScrollView>
            <DrawerActions
                {...(!editLibID || (editLibID && item?.local) ? { onPublish: () => { publish() } } : {})}
                onSave={() => { save() }}
                saveLabel={!editLibID ? "Save as draft" : "Save changes"}
                {...(editLibID ? { onDelete: () => { showDeleteDialog() } } : {})}
            />
        </>
    )

    const save = () => {
        // Brand new lib
        showToast("Saving...");
        closeDrawer();

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
        showToast("Error saving. Try again later.");
    }

    const saveNew = async () => {
        let lib = finishedLibRef.current;

        lib.name = libNameTextRef.current;
        lib.date = new Date();
        lib.id = new Date().getTime() / 1000;
        lib.likes = 0;
        lib.likesArray = [];
        lib.official = FirebaseManager.currentUserData?.firestoreData?.username === "Official";
        lib.playable = true;
        
        lib.published = false;
        lib.local = true;

        lib.avatarID = FirebaseManager.currentUserData?.firestoreData?.avatarID ? FirebaseManager.currentUserData.firestoreData.avatarID : "0";
        lib.user = FirebaseManager.currentUserData?.auth?.uid ? FirebaseManager.currentUserData.auth.uid : "NO_ACCOUNT";
        lib.username =  FirebaseManager.currentUserData?.firestoreData?.username ? FirebaseManager.currentUserData.firestoreData.username : "You";

        let local_libs = await getLocalLibs();
        local_libs.push(lib);
        await FileManager._storeData("my_content", JSON.stringify(local_libs));

        finished("Your text has been saved under My libs", { category: "myContent" });
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

        finished("Your changes have been saved.", { category: "myContent" });
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

        finished("Your changes have been saved.", { category: "all" });
    }

    const getLocalLibs = async () => {
        let local_libs = await FileManager._retrieveData("my_content");

        if (local_libs) return JSON.parse(local_libs);
        return [];
    }

    const publish = () => {
        if (!FirebaseManager.currentUserData.auth) {
            notLoggedIn();
            return;
        }

        showToast("Publishing...");
        closeDrawer();
        if (!editLibID && !item?.local) {
            publishNew();
            return;
        }
        if (editLibID && item?.local) {
            publishLocal();
            return;
        }
        showToast("Error publishing. Try again later.");
    }

    const publishNew = async () => {
        let lib = {...finishedLibRef.current}; // Spread operator converts Lib object to standard JS object

        lib.name = libNameTextRef.current;
        lib.date = new Date();
        lib.id = new Date().getTime() / 1000;
        lib.likes = 0;
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

        finished("Your text has been published", { category: "all" });
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

        finished("Your text has been published.", { category: "all" });
    }

    const notLoggedIn = () => {
        showToast("You have to be logged in. Please 'Save as draft', then 'Publish' after signing in.");
        closeDrawer();
    }

    const finished = (message, refreshOptions) => {
        refreshOptions.sortBy = "newest";
        FirebaseManager.RefreshList(refreshOptions);
        closeDrawer();
        setLibText("");
        setLibNameText("");
        setEditLibID("");
        setItem(undefined);
        showToast(message);
    }

    const showDeleteDialog = () => {
        openDialog('deleteDialog', {
            onCancel: () => {
                
            },
            onConfirm: () => {
                delete_();
            },
            children: (
                <>
                    <Text>Are you sure you want to delete?</Text>
                </>
            ),
            cancelLabel: "Cancel",  // Custom text for the cancel button
            confirmLabel: "Delete"  // Custom text for the confirm button
        });
    }

    const delete_ = async () => {
        closeDrawer();
        showToast("Deleting...");
        if (editLibID && item?.local) {
            let local_libs = await getLocalLibs();

            let index = local_libs.findIndex(obj => obj.id === item.id);

            if (index !== -1) {
                local_libs.splice(index, 1);
            }

            await FileManager._storeData("my_content", JSON.stringify(local_libs));

            finished("Your text has been deleted.", { category: "myContent" });
            return;
        }
        if (editLibID && !item?.local) {
            await FirebaseManager.DeleteDocument("posts", item.id);

            finished("Your text has been deleted.", { category: "myContent" });
            return;
        }

        finished("Your text has been deleted.", { category: "myContent" });
    }

    /*<DrawerActions
                onSave={""}
                saveLabel={!editLibID ? "Save draft" : "Save changes"}
                {...(editLibID ? { onDelete: deleteLib } : { onPublish: "publishSaveLib", publishLabel: "Publish" })}
                {...(true ? { onPublish: "publishSaveLib", publishLabel: "Publish" } : {})}
            />*/

    return (
        <ParentTag behavior='padding' keyboardVerticalOffset={keyboardVerticalOffset} style={[{ flex: 1 }, { backgroundColor: "white" }]}>

            <ScrollView style={{ marginHorizontal: 14 }}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps={'always'}
            >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TextInput
                        style={[globalStyles.input, globalStyles.inputSmall, { fontSize: 24, borderColor: "white", width: Dimensions.get("window").width - 28 - 40 }]}
                        placeholder="Title"
                        placeholderTextColor={"#9e9e9e"}
                        onChangeText={text => setLibNameText(text)}
                        value={libNameText}
                    />
                    <TouchableOpacity onPress={() => setShowDialogInfo(true)}>
                        <MaterialIcons style={{ color: "#49454F" }} name="help" size={28} />
                    </TouchableOpacity>
                </View>

                <TextInput
                    ref={libTextInputRef}
                    style={[globalStyles.input, globalStyles.inputLarge, { flex: 1, fontSize: 18, height: 140, flexGrow: 0.75 }]}
                    multiline={true}
                    numberOfLines={10}
                    onChangeText={text => setLibText(text)}
                    placeholder="Write your text here..."
                    placeholderTextColor={"#9e9e9e"}
                    onSelectionChange={(event) => setCursorPosition(event.nativeEvent.selection)}
                    selection={newCursorPosition}
                    value={libText}
                />
                <Divider color="#CAC4D0" style={{ marginVertical: 10 }} />
                <View style={{ flexGrow: 0 }}>
                    <Buttons
                        buttons={
                            [{
                                label: "Custom",
                                icon: "add",
                                onPress: () => setShowDialogCustom(true)
                            },
                            {
                                label: "Adjective",
                                icon: "add",
                                onPress: () => {
                                    addPrompt("Adjective");
                                },
                            },
                            {
                                label: "Verb",
                                icon: "add",
                                onPress: () => {
                                    addPrompt("Verb");
                                },
                            },
                            {
                                label: "Noun",
                                icon: "add",
                                onPress: () => {
                                    addPrompt("Noun");
                                },
                            },
                            {
                                label: "Occupation",
                                icon: "add",
                                onPress: () => {
                                    addPrompt("Occupation");
                                },
                            },
                            {
                                label: "Name",
                                icon: "add",
                                onPress: () => {
                                    addPrompt("Name");
                                },
                            },
                            {
                                label: "Emotion",
                                icon: "add",
                                onPress: () => {
                                    addPrompt("Emotion");
                                },
                            },
                            {
                                label: "Place",
                                icon: "add",
                                onPress: () => {
                                    addPrompt("Place");
                                },
                            },
                            {
                                label: "Animal",
                                icon: "add",
                                onPress: () => {
                                    addPrompt("Animal");
                                },
                            },
                            ]
                        }
                        buttonStyle={{ borderRadius: 12, borderColor: "#454247", backgroundColor: "white", minWidth: 50, height: 40 }}
                        containerStyle={{ justifyContent: "flex-start" }}
                        labelStyle={{ fontSize: 17, fontWeight: 500 }}
                        sideScroll={true}
                    />
                </View>

                <Buttons
                    buttons={
                        [{
                            label: "Next",
                            icon: "arrow-forward",
                            iconSide: "right",
                            onPress: saveLib
                        }]
                    }
                    buttonStyle={{ borderRadius: 50, borderColor: "transparent", backgroundColor: "#D1E8D5", minWidth: 120, height: 50 }}
                    containerStyle={{ justifyContent: "flex-end" }}
                    labelStyle={{ fontSize: 17, fontWeight: 500 }}
                />

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
                // modalStyle={{backgroundColor: "white"}}
                // confirmStyle={{backgroundColor: "#D1E8D5", borderColor: "#D1E8D5"}}
                // buttonStyle={globalStyles.buttonDefault}
                // labelStyle={{color: "black"}}
                // containerStyle={{gap: 0}}
                >
                    <View style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}>
                        <View style={styles.iconCircle}>
                            <MaterialIcons style={{ color: "white" }} name="add" size={28} />
                        </View>
                        <View>
                            <Text style={[{ fontSize: 20 }, globalStyles.bold]}>Custom prompt</Text>
                            <Text style={{ fontSize: 18 }}>Add a custom prompt</Text>
                        </View>
                    </View>
                    <TextInput
                        style={[globalStyles.input, globalStyles.inputSmall, { paddingHorizontal: 14, marginVertical: 10, fontSize: 18 }]}
                        numberOfLines={1}
                        placeholder="Your prompt..."
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
                >
                    <Text style={styles.paragraph}>
                        Write your text by using prompts enclosed in parentheses. For example:
                    </Text>
                    <Text style={styles.paragraph}>
                        They built an <Text style={styles.highlighted}>(adjective)</Text> house.
                    </Text>
                    <Text style={styles.paragraph}>
                        You can repeat words by adding a number at the end, like so:
                    </Text>
                    <Text style={styles.paragraph}>
                        <Text style={styles.highlighted}>(Name 1)</Text> is building a table. <Text style={styles.highlighted}>(Name 1)</Text> is a carpenter.
                    </Text>
                </DialogTrigger>
            </ScrollView>
        </ParentTag>
    )
}

const styles = StyleSheet.create({
    label: {
        fontSize: 18,
        marginBottom: 4,
        marginTop: 16,
    },
    highlighted: {
        color: "#00522F"
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