import React, { useContext, useState, useEffect, useRef } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, Platform, KeyboardAvoidingView, Dimensions } from "react-native";
import Buttons from "../components/Buttons";
import globalStyles from "../styles/globalStyles";
import Lib from "../scripts/lib";
import LibManager from "../scripts/lib_manager";
import { ToastContext } from "../components/Toast";
import { useNavigation } from "@react-navigation/native";
import BannerAdComponent from "../components/BannerAd";
import { useIsFocused } from '@react-navigation/native';
import { ScreenContext } from "../App";
import Dialog from "../components/Dialog";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { TouchableOpacity } from "react-native-web";
import { useDrawer } from "../components/Drawer";

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

    let confirmSaveLib = () => {
        finishedLibRef.current.name = libNameTextRef.current;
        if (finishedLibRef.current) LibManager.storeLib(finishedLibRef.current, "yourLibs");

        showToast('Your lib can be found under "Your libs" at the bottom of your screen.');
        drawerRef.current.closeDrawer();
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
        closeCustomPromptDialog();
    }

    const [showCustomPromptDialog, setShowCustomPromptDialog] = useState(false);
    
    let openCustomPromptDialog = () => {
        setShowCustomPromptDialog(true);
    }

    let closeCustomPromptDialog = () => {
        setShowCustomPromptDialog(false);
    }

    const [showInfoDialog, setShowInfoDialog] = useState(false)

    let openInfoDialog = () => {
        setShowInfoDialog(true);
    }

    let closeInfoDialog = () => {
        setShowInfoDialog(false);
    }

    // Drawer 

    const { openDrawer, drawerRef } = useDrawer();

    const saveDrawerContent = (
        <View>      
            <ScrollView style={{width: Dimensions.get("window").width - (0.15 * Dimensions.get("window").width)}}>
                <View style={globalStyles.drawerTop}>
                <Text style={globalStyles.fontLarge}>{libNameTextRef.current}</Text>
                    {finishedLib ? LibManager.displayInDrawer(finishedLib.text) : <Text>No item selected</Text>}
                </View>
            </ScrollView>
            <Buttons
                buttons={[
                    { 
                        label: "Save",
                        onPress: confirmSaveLib,
                        buttonStyle: {backgroundColor: "#D1E8D5", borderColor: "#D1E8D5"}
                    },
                    {  
                        label: "Cancel",
                        onPress: () => drawerRef.current.closeDrawer()
                    }
                ]}
                labelStyle={{fontWeight: 600}}
                containerStyle={{paddingLeft: 20, paddingVertical: 10, borderTopWidth: 1, borderColor: "#cccccc", justifyContent: "flex-start"}}
            />
        </View>
    )

    return(
        <ParentTag behavior='padding' keyboardVerticalOffset={keyboardVerticalOffset} style={[{flex: 1}, {backgroundColor: "white"}, Platform.OS === 'android' ? {paddingBottom: 60} : null]}>

            <ScrollView style={{marginHorizontal: 14}}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps={'always'}
            >
                <TouchableOpacity onPress={saveLib}>
                    <Text>Save</Text>
                </TouchableOpacity>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <TextInput
                        style={[globalStyles.input, globalStyles.inputSmall, {fontSize: 24, borderColor: "white", width: Dimensions.get("window").width - 28 - 40}]}
                        placeholder="Title"
                        placeholderTextColor={"#9e9e9e"}
                        onChangeText={text => setLibNameText(text)}
                    />
                    <TouchableOpacity onPress={openInfoDialog}>
                        <MaterialIcons style={{color: "#006d40"}} name="help" size={28} />
                    </TouchableOpacity>
                </View>

                <TextInput
                    ref={libTextInputRef}
                    style={[globalStyles.input, globalStyles.inputLarge, {flex: 1, fontSize: 18, height: 140}]}
                    multiline={true}
                    numberOfLines={10}
                    onChangeText={text => setLibText(text)}
                    placeholder="Write your text here..."
                    placeholderTextColor={"#9e9e9e"}
                    onSelectionChange={(event) => setCursorPosition(event.nativeEvent.selection)}
                    selection={newCursorPosition}
                />

                <Buttons
                    buttons={
                        [{
                            label: "Custom prompt",
                            icon: "add",
                            iconColor: "white",
                            onPress: openCustomPromptDialog
                        }]
                    }
                    buttonStyle={{backgroundColor: buttonColor, paddingHorizontal: 26, height: 45}}
                    labelStyle={{color: "white", fontWeight: 500, fontSize: 16}}
                    containerStyle={{justifyContent: "flex-start"}}
                />

                <Buttons
                    buttons={
                        [{
                            label: "Adjective",
                            onPress: () => {
                                addPrompt("Adjective");
                            },
                        },
                        {
                            label: "Verb",
                            onPress: () => {
                                addPrompt("Verb");
                            },
                        },
                        {
                            label: "Noun",
                            onPress: () => {
                                addPrompt("Noun");
                            },
                        },
                        {
                            label: "Occupation",
                            onPress: () => {
                                addPrompt("Occupation");
                            },
                        },
                        {
                            label: "Name",
                            onPress: () => {
                                addPrompt("Name");
                            },
                        },
                        {
                            label: "Emotion",
                            onPress: () => {
                                addPrompt("Emotion");
                            },
                        },
                        {
                            label: "Place",
                            onPress: () => {
                                addPrompt("Place");
                            },
                        },
                        {
                            label: "Animal",
                            onPress: () => {
                                addPrompt("Animal");
                            },
                        },
                        ]
                    }
                    buttonStyle={{backgroundColor: buttonColor, paddingHorizontal: 26, height: 45}}
                    labelStyle={{color: "white", fontWeight: 500, fontSize: 16}}
                    containerStyle={{justifyContent: "flex-start", marginBottom: 0}}
                    sideScroll={true}
                />

                {showCustomPromptDialog && (
                    <Dialog
                        modalStyle={{backgroundColor: "white"}}
                        onCancel={closeCustomPromptDialog}
                        onConfirm={addCustomPrompt}
                        confirmLabel="Add"
                        confirmStyle={{backgroundColor: "#D1E8D5", borderColor: "#D1E8D5"}}
                        buttonStyle={globalStyles.buttonDefault}
                        labelStyle={{color: "black"}}
                        containerStyle={{gap: 0}}
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
                        >
                            
                        </TextInput>
                    </Dialog>
                )}
                {showInfoDialog && (
                    <Dialog
                        modalStyle={{backgroundColor: "white"}}
                        onCancel={closeInfoDialog}
                        onConfirm={closeInfoDialog}
                        confirmStyle={{backgroundColor: "#D1E8D5", borderColor: "#D1E8D5"}}
                        buttonStyle={globalStyles.buttonDefault}
                        labelStyle={{color: "black"}}
                        containerStyle={{gap: 0}}
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
                    </Dialog>
                )}
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