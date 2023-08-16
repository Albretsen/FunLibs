import React, { useContext, useState, useEffect, useRef } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, Platform, KeyboardAvoidingView, Dimensions } from "react-native";
import Buttons from "../components/Buttons";
import globalStyles from "../styles/globalStyles";
import Lib from "../scripts/lib";
import LibManager from "../scripts/lib_manager";
import ToastContext from "../components/Toast/ToastContext";
import { useNavigation } from "@react-navigation/native";
import BannerAdComponent from "../components/BannerAd";
import { useIsFocused } from '@react-navigation/native';
import { ScreenContext } from "../App";
import Dialog from "../components/Dialog";
import Drawer from "../components/Drawer";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default function CreateLibScreen() {
    const [libText, setLibText] = useState("");
    const [libNameText, setLibNameText] = useState("");
    const [finishedLib, setFinishedLib] = useState(null);
    const showToast = useContext(ToastContext);
    const [cursorPosition, setCursorPosition] = useState({ start: 0, end: 0 });

    const libTextRef = useRef(libText);
    const finishedLibRef = useRef(finishedLib);
    const libNameTextRef = useRef(libNameText);

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

    const drawerRef = useRef();

    const saveLib = () => {
        if (!libNameTextRef.current) { 
            showToast("Missing title", "Please add a title to your lib!");
            return;
        }
        if (!libTextRef.current) { 
            showToast("Missing text", "Please add some text to your lib!");
            return;
        } 
        //console.log(libTextRef.current);
        setFinishedLib(Lib.createLib(libTextRef.current));
        //console.log(finishedLib)
        drawerRef.current.openDrawer();
        // Might want to add some proper validation here,
        // such as validating that the lib has at least one prompt
        // if(libTitle == "") {
        //     showToast("Missing title", "Please add a title to your lib!");
        // } else if(libText == "") {
        //     showToast("Missing text", "Your lib has no text!");
        // } else {
            // let lib = Lib.createLib(libText, libTitle);
            // LibManager.storeLib(lib, "yourLibs");
            // showToast("Lib saved", 'Your lib can be found under "Your libs" at the bottom of your screen.');
            // navigation.navigate("LibsHomeScreen", {initalTab: "Your Libs"});
        // }
    }

    let confirmSaveLib = () => {
        finishedLibRef.current.name = libNameTextRef.current;
        if (finishedLibRef.current) LibManager.storeLib(finishedLibRef.current, "yourLibs");

        showToast("Lib saved", 'Your lib can be found under "Your libs" at the bottom of your screen.');
        navigation.navigate("LibsHomeScreen", {initalTab: "Your Libs"});
    }

    const keyboardVerticalOffset = Platform.OS === 'ios' ? 90 : null

    const ParentTag = Platform.OS === 'ios' ? KeyboardAvoidingView : View;

    const buttonColor = "#006D40";

    const libTextInputRef = useRef(null);

    let addPrompt = (prompt) => {
        const beforeCursor = libText.substring(0, cursorPosition.start);
        const afterCursor = libText.substring(cursorPosition.start); // Note the change here
        const updatedText = beforeCursor + '"' + prompt + '"' + afterCursor;
        
        const newCursorPosition = cursorPosition.start + prompt.length + 2;
    
        if (libTextInputRef.current) {
            libTextInputRef.current.setNativeProps({ 
                text: updatedText,
                selection: { start: newCursorPosition, end: newCursorPosition }
            });
        }

        setLibText(updatedText);
    }

    // Dialog-related functions

    let addCustomPrompt = () => {
        addPrompt(customPromptText);
        closeCustomPromptDialog()
    }

    const [showCustomPromptDialog, setShowCustomPromptDialog] = useState(false);
    
    let openCustomPromptDialog = () => {
        setShowCustomPromptDialog(true)
    }

    let closeCustomPromptDialog = () => {
        setShowCustomPromptDialog(false)
    }

    return(
        <ParentTag behavior='padding' keyboardVerticalOffset={keyboardVerticalOffset} style={[{flex: 1}, {backgroundColor: "white"}, Platform.OS === 'android' ? {paddingBottom: 100} : null]}>

            <ScrollView style={{marginHorizontal: 14}}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps={'always'}
            >
                <TextInput
                    style={[globalStyles.input, globalStyles.inputSmall, {fontSize: 24, borderColor: "white"}]}
                    placeholder="Title"
                    placeholderTextColor={"#9e9e9e"}
                    onChangeText={text => setLibNameText(text)}
                >

                </TextInput>
                <TextInput
                    ref={libTextInputRef}
                    style={[globalStyles.input, globalStyles.inputLarge, {flex: 1, fontSize: 18, height: 200}]}
                    multiline={true}
                    numberOfLines={10}
                    onChangeText={text => setLibText(text)}
                    placeholder="Write your text here..."
                    placeholderTextColor={"#9e9e9e"}
                    onSelectionChange={(event) => setCursorPosition(event.nativeEvent.selection)}
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
                    buttonStyle={{backgroundColor: buttonColor, paddingHorizontal: 26}}
                    labelStyle={{color: "white", fontWeight: 500, fontSize: 19}}
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
                        ]
                    }
                    buttonStyle={{backgroundColor: buttonColor, paddingHorizontal: 26}}
                    labelStyle={{color: "white", fontWeight: 500, fontSize: 19}}
                    containerStyle={{justifyContent: "flex-start"}}
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
                <Drawer ref={drawerRef} title="Your story">
                    
                    <ScrollView style={{width: Dimensions.get("window").width - (0.15 * Dimensions.get("window").width)}}>
                        <View style={globalStyles.drawerTop}>
                        <Text style={globalStyles.fontLarge}>{libNameTextRef.current}</Text>
                            {finishedLib ? <Text style={[globalStyles.fontMedium, {marginTop: 16, lineHeight: 34}]}>
                                {finishedLib.text.map((key, index) => (
                                    <Text key={key + index} style={(index + 1) % 2 === 0 ? { fontStyle: "italic", color: "#006D40" } : null}>{key}</Text>
                                ))}
                            </Text> : <Text>No item selected</Text>}
                        </View>
                    </ScrollView>
                    <Buttons
                        buttons={[
                            {  
                                label: "Cancel",
                                onPress: () => drawerRef.current.closeDrawer()
                            },
                            { 
                                label: "Confirm",
                                onPress: confirmSaveLib,
                                buttonStyle: {backgroundColor: "#D1E8D5", borderColor: "#D1E8D5"}
                            }
                        ]}
                        labelStyle={{fontWeight: 600}}
					    containerStyle={{paddingLeft: 20, paddingVertical: 10, borderTopWidth: 1, borderColor: "#cccccc", justifyContent: "flex-start"}}
                    />
                </Drawer>
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