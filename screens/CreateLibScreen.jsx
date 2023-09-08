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
import { DialogTrigger } from "../components/Dialog";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useDrawer } from "../components/Drawer";
import { Divider } from '@rneui/themed';
import DrawerActions from "../components/DrawerActions";
import FileManager from "../scripts/file_manager";
import FirebaseManager from "../scripts/firebase_manager";

export default function CreateLibScreen() {
    const [libText, setLibText] = useState("");
    const [libNameText, setLibNameText] = useState("");
    const [finishedLib, setFinishedLib] = useState(null);
    const showToast = useContext(ToastContext);
    const [cursorPosition, setCursorPosition] = useState({ start: 0, end: 0 });
    const [newCursorPosition, setNewCursorPosition] = useState();

    const libTextRef = useRef(libText);
    const finishedLibRef = useRef(finishedLib);
    const libNameTextRef = useRef(libNameText);
    const newCursorPositionRef = useRef(newCursorPosition);

    useEffect(() => {
        libTextRef.current = libText;
        finishedLibRef.current = finishedLib;
        libNameTextRef.current = libNameText;
    }, [libText, finishedLib, libNameText]);
    
    const [customPromptText, setCustomPromptText] = useState("");

    const navigation = useNavigation();

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
        setFinishedLib(Lib.createLib(libTextRef.current));

        if (temp_finished_lib.prompts.length < 1) {
            showToast("Please add some prompts to your lib!");
            return;
        }
    }

    let publishDialog = () => {
        setShowDialogPublish(true);
    }

    let publishSaveLib = async () => {
        if (!FirebaseManager.currentUserData.auth) showToast('You have to be logged in to publish.');

        finishedLibRef.current.name = libNameTextRef.current;
        finishedLibRef.current.user = FirebaseManager.currentUserData.auth ? FirebaseManager.currentUserData.auth.uid : null;
		finishedLibRef.current.published = true;
		finishedLibRef.current.playable = true;
		finishedLibRef.current.date = new Date();
        finishedLibRef.current.likes = 0;

        FirebaseManager.AddDocumentToCollection("posts", JSON.parse(JSON.stringify(finishedLibRef.current)));

        showToast('Your lib has been uploaded');
        closeDrawer();
        navigation.navigate("LibsHomeScreen", {initalTab: "Your Libs"});
    }

    let localSaveLib = async () => {
        finishedLibRef.current.name = libNameTextRef.current;
        finishedLibRef.current.user = FirebaseManager.currentUserData.auth ? FirebaseManager.currentUserData.auth.uid : null;
		finishedLibRef.current.published = false;
		finishedLibRef.current.playable = true;
		finishedLibRef.current.date = new Date();
        finishedLibRef.current.likes = 0;
        finishedLibRef.current.local = true;

        let readArray = []
        if (finishedLibRef.current) {
            let result = await FileManager._retrieveData("my_content");
            if (!result) result = [];
            if (Object.keys(result).length >= 1) {
                readArray = JSON.parse(result);
            }
            if (!finishedLibRef.current.id) {
                finishedLibRef.current.id = readArray.length;
                readArray.push(finishedLibRef.current);
            } else {
                readArray[finishedLib.current.id] = finishedLibRef.current;
            }
        }
        FileManager._storeData("my_content", JSON.stringify(readArray));
        showToast('Your lib has been stored locally.');
        closeDrawer();
        navigation.navigate("LibsHomeScreen", {initalTab: "Your Libs"});
    }

    const keyboardVerticalOffset = Platform.OS === 'ios' ? 90 : null

    const ParentTag = Platform.OS === 'ios' ? KeyboardAvoidingView : View;

    const buttonColor = "#006D40";

    const libTextInputRef = useRef(null);

    let addPrompt = (prompt) => {
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
				// onFavorite={onFavorite}
			/>
        </>
    )

    return(
        <ParentTag behavior='padding' keyboardVerticalOffset={keyboardVerticalOffset} style={[{flex: 1}, {backgroundColor: "white"}, Platform.OS === 'android' ? {paddingBottom: 60} : null]}>

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
                />
                <Divider color="#CAC4D0" style={{marginVertical: 10}} />
                <View style={{flexGrow: 0}}>
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
                    buttonStyle={{borderRadius: 12, borderColor: "#454247", backgroundColor: "white", minWidth: 50, height: 40}}
                    containerStyle={{justifyContent: "flex-start"}}
                    labelStyle={{fontSize: 17, fontWeight: 500}}
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
                    confirmLabel="Publish"
                    cancelLabel="Save locally"
                >
                    <Text style={styles.paragraph}>
                        {"Do you want to publish your story so that other users can play it? Users will be able to enjoy your story, and share their whacky libs the world!"}
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