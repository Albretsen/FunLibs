import React, { useContext, useState, useEffect, useRef } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, Platform, KeyboardAvoidingView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
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

export default function CreateLibScreen() {
    const [libText, setLibText] = useState("");
    const [libTitle, setLibTitle] = useState("");
    const showToast = useContext(ToastContext);
    const [cursorPosition, setCursorPosition] = useState({ start: 0, end: 0 });


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

    const saveLib = () => {
        console.log("save pressed")
        // Might want to add some proper validation here,
        // such as validating that the lib has at least one prompt
        if(libTitle == "") {
            showToast("Missing title", "Please add a title to your lib!");
        } else if(libText == "") {
            showToast("Missing text", "Your lib has no text!");
        } else {
            let lib = Lib.createLib(libText, libTitle);
            LibManager.storeLib(lib, "yourLibs");
            showToast("Lib saved", 'Your lib can be found under "Your libs" at the bottom of your screen.');
            navigation.navigate("LibsHomeScreen", {initalTab: "Your Libs"});
        }
    }
    const keyboardVerticalOffset = Platform.OS === 'ios' ? 90 : null
    console.log(keyboardVerticalOffset);

    const ParentTag = Platform.OS === 'ios' ? KeyboardAvoidingView : View;

    const buttonColor = "#006D40";

    const libTextInputRef = useRef(null);

    let addPrompt = (prompt) => {
        const beforeCursor = libText.substring(0, cursorPosition.start);
        const afterCursor = libText.substring(cursorPosition.start); // Note the change here
        const updatedText = beforeCursor + prompt + afterCursor;
        
        const newCursorPosition = cursorPosition.start + prompt.length;
    
        if (libTextInputRef.current) {
            libTextInputRef.current.setNativeProps({ 
                text: updatedText,
                selection: { start: newCursorPosition, end: newCursorPosition }
            });
        }
        
        setLibText(updatedText);
    }

    const [showCustomPromptDialog, setShowCustomPromptDialog] = useState(false);
    
        

    return(
        <ParentTag behavior='padding' keyboardVerticalOffset={keyboardVerticalOffset} style={[{flex: 1}, {backgroundColor: "white"}, Platform.OS === 'android' ? {paddingBottom: 100} : null]}>

            <ScrollView style={{marginHorizontal: 14}}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps={'always'}
            >
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
                            iconColor: "white"
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
                        title="Delete lib"
                        text="Are you sure you want to delete this lib? Once deleted it cannot be recovered."
                        onCancel={hideDeleteDialogHandler}
                        onConfirm={() => {
                            onDelete(id);
                            setShowDeleteDialog(false); // Hide the dialog after deletion
                        }}
                    />
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
    }
})