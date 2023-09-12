import React, { useContext, useState, useEffect, useRef } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, Platform, KeyboardAvoidingView, Dimensions, TouchableOpacity } from "react-native";
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
    const [finishedLib, setFinishedLib] = useState(null);
    const showToast = useContext(ToastContext);
    const [cursorPosition, setCursorPosition] = useState({ start: 0, end: 0 });
    const [newCursorPosition, setNewCursorPosition] = useState();
    const [editLibID, setEditLibID] = useState(null);
    const { playAudio } = AudioPlayer();
    const navigation = useNavigation();

    const { openDialog } = useDialog();

    useFocusEffect(
        React.useCallback(() => {
            // This will run when the screen comes into focus

            return () => {
                console.log("libText.length: " + libNameTextRef.current);
                if (libTextRef.current.length >= 1 || libNameTextRef.current.length >= 1) {
                    openDialog('discardChangesDialog', {
                        onCancel: () => {
                            setLibText("");
                            setLibNameText("");
                            setEditLibID(null);
                        },
                        onConfirm: () => {
                            navigation.navigate("LibsHomeScreen", { 
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
                                <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>You have unsaved progress!</Text>
                                <Text style={{ textAlign: 'center', marginTop: 10 }}>
                                    Continue editing, or discard changes?
                                </Text>
                            </>
                        ),
                        cancelLabel: "Discard",  // Custom text for the cancel button
                        confirmLabel: "Continue"  // Custom text for the confirm button
                    });
                } else {
                    setLibText("");
                    setLibNameText("");
                    setEditLibID(null);
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
        } else {
            setLibText("");
        }
        if (route.params?.libNameText) {
            setLibNameText(route.params.libNameText);
        } else {
            setLibNameText("");
        }
        if (route.params?.editID) {
            setEditLibID(route.params.editID);
        } else {
            setEditLibID(undefined);
        }
    }, [route.params]);

    const libTextRef = useRef(libText);
    const finishedLibRef = useRef(finishedLib);
    const libNameTextRef = useRef(libNameText);
    const newCursorPositionRef = useRef(newCursorPosition);

    useEffect(() => {
        libTextRef.current = libText;
        finishedLibRef.current = finishedLib;
        if (editLibID && finishedLibRef.current) {
            finishedLibRef.current.id = editLibID.id;
        }
        libNameTextRef.current = libNameText;
    }, [libText, finishedLib, libNameText]);
    
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
        setShowDialogPublish(true);
    }

    let publishSaveLib = async () => {
        if (!FirebaseManager.currentUserData?.auth) { 
            showToast('You have to be logged in to publish.'); 
            return;
        }

        finishedLibRef.current.name = libNameTextRef.current;
        finishedLibRef.current.user = FirebaseManager.currentUserData.auth ? FirebaseManager.currentUserData.auth.uid : null;
		finishedLibRef.current.published = true;
		finishedLibRef.current.playable = true;
        finishedLibRef.current.username = FirebaseManager.currentUserData.firestoreData ? FirebaseManager.currentUserData.firestoreData.username : null;
        finishedLibRef.current.avatarID = FirebaseManager.currentUserData.firestoreData.avatarID ? FirebaseManager.currentUserData.firestoreData.avatarID : null;
        finishedLibRef.current.date = new Date();
        if (!editLibID) finishedLibRef.current.date = new Date();
        finishedLibRef.current.likes = 0;

        if (!editLibID) {
            let id = await FirebaseManager.AddDocumentToCollection("posts", { ...finishedLibRef.current });
            await FirebaseManager.UpdateDocument("posts", id, { id: id });
            showToast('Your lib has been uploaded');
        } else {
            let readArray = await FileManager._retrieveData("my_content") || [];
            if (typeof readArray === 'string') {
                readArray = JSON.parse(readArray);
            }
            console.log("LOOKOG FIR WITH ITD: " + editLibID);
            console.log(JSON.stringify(readArray));
            let exists = readArray.some(item => String(item.id) === String(editLibID));
            console.log("exists:" + exists);

            if (exists) {
                let id = await FirebaseManager.AddDocumentToCollection("posts", { ...finishedLibRef.current });
                await FirebaseManager.UpdateDocument("posts", id, { id: id });
                showToast('Your lib has been uploaded');
            } else {
                console.log("UPDATING DOC");
                FirebaseManager.UpdateDocument("posts", editLibID, {
                    name: finishedLibRef.current.name,
                    text: finishedLibRef.current.text,
                    prompts: finishedLibRef.current.prompts
                })
                showToast('Your changes have been saved');
            }
        }
        setLibText("");
        setLibNameText("");
        setEditLibID(null);
        closeDrawer();
        navigation.navigate("LibsHomeScreen", {initalTab: "Your Libs"});
    }

    let localSaveLib = async () => {
        if (editLibID) {
            let readArray = await FileManager._retrieveData("my_content") || [];
            if (typeof readArray === 'string') {
                readArray = JSON.parse(readArray);
            }
            let exists = readArray.some(item => String(item.id) === String(editLibID));

            if (exists) {

            } else {
                showToast("Can't save a published lib to device");
                return;
            }
        };
    
        const currentUser = FirebaseManager.currentUserData;
        const currentLib = finishedLibRef.current;
    
        // Update lib properties
        Object.assign(currentLib, {
            name: libNameTextRef.current,
            user: currentUser.auth ? currentUser.auth.uid : null,
            avatarID: currentUser.firestoreData ? currentUser.firestoreData.avatarID : "no-avatar",
            published: false,
            playable: true,
            date: new Date(),
            likes: 0,
            local: true
        });
    
        // Retrieve existing content
        let readArray = await FileManager._retrieveData("my_content") || [];
        if (typeof readArray === 'string') {
            readArray = JSON.parse(readArray);
        }
    
        // Determine the ID for the lib
        if (currentLib.id === undefined || currentLib.id == 0) {
            currentLib.id = new Date().getTime();  // Using timestamp as a unique ID
            readArray.push(currentLib);
        } else {
            const index = readArray.findIndex(lib => lib.id === currentLib.id);
            if (index !== -1) {
                readArray[index] = currentLib;
            } else {
                readArray.push(currentLib);
            }
        }
    
        // Store the updated content
        await FileManager._storeData("my_content", JSON.stringify(readArray));
    
        // Refresh and reset
        FirebaseManager.RefreshList(null);
        showToast('Your lib has been stored locally.');
        setLibText("");
        setLibNameText("");
        setEditLibID(null);
        closeDrawer();
        navigation.navigate("LibsHomeScreen", { initalTab: "Your Libs" });
    }
    

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

    let addCustomPrompt = () => {
        addPrompt(customPromptText);
    }

    const [showDialogCustom, setShowDialogCustom] = useState(false);
    const [showDialogInfo, setShowDialogInfo] = useState(false);
    const [showDialogPublish, setShowDialogPublish] = useState(false);

    const deleteLib = async () => {
        console.log("editLibID; " + editLibID);
        if (editLibID) {
            let result = await FileManager._retrieveData("my_content");
            result = JSON.parse(result);

            const filteredResult = result.filter(item => item.id != editLibID);

            FileManager._storeData("my_content", JSON.stringify(filteredResult));

            if (result.length === filteredResult.length) {
                FirebaseManager.DeleteDocument("posts", editLibID);
            }
        }

        setLibText("");
        setLibNameText("");
        setEditLibID(null);
        closeDrawer();
        navigation.navigate("LibsHomeScreen", {initalTab: "Home"});
    }

    // Drawer 

    const { openDrawer, drawerRef, closeDrawer } = useDrawer();

    const saveDrawerContent = (
        <>      
            <ScrollView style={{width: Dimensions.get("window").width - (0.15 * Dimensions.get("window").width)}}>
                <View style={globalStyles.drawerTop}>
                <Text style={globalStyles.fontLarge}>{libNameTextRef.current}</Text>
                    {finishedLib ? LibManager.displayInDrawer(finishedLib.text) : <Text>No item selected</Text>}
                </View>
            </ScrollView>
            <DrawerActions
				// onPublish={onPublish}
				// onShare={onShare}
				onSave={publishDialog}
                onDelete={deleteLib}
				// onFavorite={onFavorite}
			/>
        </>
    )

    return(
        <ParentTag behavior='padding' keyboardVerticalOffset={keyboardVerticalOffset} style={[{flex: 1}, {backgroundColor: "white"}]}>

            <ScrollView style={{marginHorizontal: 14}}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps={'always'}
            >
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <TextInput
                        style={[globalStyles.input, globalStyles.inputSmall, {fontSize: 24, borderColor: "white", width: Dimensions.get("window").width - 28 - 40}]}
                        placeholder="Title"
                        placeholderTextColor={"#9e9e9e"}
                        onChangeText={text => setLibNameText(text)}
                        value={libNameText}
                    />
                    <TouchableOpacity onPress={() => setShowDialogInfo(true)}>
                        <MaterialIcons style={{color: "#006d40"}} name="help" size={28} />
                    </TouchableOpacity>
                </View>

                <TextInput
                    ref={libTextInputRef}
                    style={[globalStyles.input, globalStyles.inputLarge, {flex: 1, fontSize: 18, height: 140, flexGrow: 0.75}]}
                    multiline={true}
                    numberOfLines={10}
                    onChangeText={text => setLibText(text)}
                    placeholder="Write your text here..."
                    placeholderTextColor={"#9e9e9e"}
                    onSelectionChange={(event) => setCursorPosition(event.nativeEvent.selection)}
                    selection={newCursorPosition}
                    value={libText}
                />
                <Divider color="#CAC4D0" style={{marginVertical: 10}} />
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
                    buttonStyle={{borderRadius: 50, borderColor: "transparent", backgroundColor: "#D1E8D5", minWidth: 120, height: 50}}
                    containerStyle={{justifyContent: "flex-end"}}
                    labelStyle={{fontSize: 17, fontWeight: 500}}
                />

                <DialogTrigger
                    id="dialogCustom"
                    show={showDialogCustom}
                    onCancel={() => setShowDialogCustom(false)}
                    onConfirm={() => {
                        addCustomPrompt();
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
                    <View style={{flexDirection: "row", gap: 10, marginBottom: 10}}>
                        <View style={styles.iconCircle}>
                            <MaterialIcons style={{color: "white"}} name="add" size={28} />
                        </View>
                        <View>
                            <Text style={[{fontSize: 20}, globalStyles.bold]}>Custom prompt</Text>
                            <Text style={{fontSize: 18}}>Add a custom prompt</Text>
                        </View>
                    </View>
                    <TextInput
                        style={[globalStyles.input, globalStyles.inputSmall, {paddingHorizontal: 14, marginVertical: 10, fontSize: 18}]}
                        numberOfLines={1}
                        placeholder="Your prompt..."
                        onChangeText={text => setCustomPromptText(text)}
                    />
                </DialogTrigger>
                <DialogTrigger
                    id="dialogInfo"
                    show={showDialogInfo}
                    onCancel={() => setShowDialogInfo(false)}
                    onConfirm={() => setShowDialogInfo(false)}
                >
                    <Text style={styles.paragraph}>
                        {"Write your lib by adding prompts using the suggestion buttons. Prompts use parentheses, and you can add these yourself if you prefer. Here's an example:"}
                    </Text>
                    <Text style={styles.paragraph}>
                        {"They built an "}
                        <Text style={styles.highlighted}>{"(adjective)"}</Text>
                        {" house."}
                    </Text>
                    <Text style={styles.paragraph}>
                        {"Add a number at the end for words you would like to repeat, like names:"}
                    </Text>
                    <Text style={styles.paragraph}>
                        <Text style={styles.highlighted}>{"(Name 1)"}</Text>
                        {" is building a table. "}
                        <Text style={styles.highlighted}>{"(Name 1)"}</Text>
                        {" is a carpenter."}
                    </Text>
                </DialogTrigger>
                <DialogTrigger
                    id="dialogPublish"
                    show={showDialogPublish}
                    onCancel={() => {
                        setShowDialogPublish(false),
                        localSaveLib();
                    }}
                    onConfirm={() => {
                        // Publish lib function here
                        publishSaveLib();
                        setShowDialogPublish(false);
                    }}
                    confirmLabel={editLibID ? "Publish Changes" : "Publish" }
                    cancelLabel={editLibID ? "Save Changes to Device" : "Save to Device" }
                >
                    <Text style={styles.paragraph}>
                        {"Do you want to publish your story so that other users can play it? Users will be able to enjoy your story, and share their whacky libs with the world!"}
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