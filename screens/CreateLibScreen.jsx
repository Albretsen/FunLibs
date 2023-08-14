import React, { useContext, useState, useEffect } from "react";
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
import StyledInput from "../components/StyledInput";

export default function CreateLibScreen() {
    const [libText, setLibText] = useState("");
    const [libTitle, setLibTitle] = useState("");
    const showToast = useContext(ToastContext);

    const navigation = useNavigation();

    const isFocused = useIsFocused();
    const { setCurrentScreenName } = useContext(ScreenContext);

    useEffect(() => {
        if (isFocused) {
          setCurrentScreenName("CreateLibScreen");
        }
      }, [isFocused]);

    const saveLib = () => {
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

    return(
        <ParentTag behavior='padding' keyboardVerticalOffset={keyboardVerticalOffset} style={[{flex: 1}, {backgroundColor: "white"}, Platform.OS === 'android' ? {paddingBottom: 100} : null]}>

            <StyledInput/>


            <ScrollView style={{marginHorizontal: 14}}>
                <Text style={styles.paragraph}>
                    {"Write your text here. Use quotation marks for playable words like adjectives and nouns. Here's an example:"}
                </Text>
                <Text style={styles.paragraph}>
                    {"They built an "}
                    <Text style={styles.highlighted}>{"“adjective”"}</Text>
                    {" house."}
                </Text>
                <Text style={styles.paragraph}>
                    {"Add a number at the end for words you would like to repeat, like names:"}
                </Text>
                <Text style={styles.paragraph}>
                    <Text style={styles.highlighted}>{"“Name 1”"}</Text>
                    {" is building a table. "}
                    <Text style={styles.highlighted}>{"“Name 1”"}</Text>
                    {" is a carpenter."}
                </Text>
                <Text style={styles.label}>{"Lib title"}</Text>
                <TextInput
                    style={[globalStyles.input, globalStyles.inputSmall]}
                    multiline={true}
                    numberOfLines={1}
                    onChangeText={text => setLibTitle(text)}
                />
                <Text style={styles.label}>{"Lib text"}</Text>
                <TextInput
                    style={[globalStyles.input, globalStyles.inputLarge, {flex: 1}]}
                    multiline={true}
                    numberOfLines={10}
                    onChangeText={text => setLibText(text)}
                />
                <View style={{alignSelf: "center"}}>
                    <Buttons
                        buttons={
                            [{
                                label: "Save",
                                onPress: saveLib,
                                extendWidth: true,
                                filled: true
                            }]
                        }
                    />
                </View>
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