import React, { useContext, useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, Platform } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import ButtonPair from "../components/ButtonPair";
import globalStyles from "../styles/globalStyles";
import Lib from "../scripts/lib";
import LibManager from "../scripts/lib_manager";
import ToastContext from "../components/Toast/ToastContext";
import { useNavigation } from "@react-navigation/native";
import BannerAdComponent from "../components/BannerAd";

export default function CreateLibScreen() {
    const [libText, setLibText] = useState("");
    const [libTitle, setLibTitle] = useState("");
    const showToast = useContext(ToastContext);

    const navigation = useNavigation();

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

    return(
        <View style={[globalStyles.screenStandard]}>
            {Platform.OS === ("android" || "ios") && (
                <BannerAdComponent />
            )}
            <ScrollView style={{marginHorizontal: 14, flex: 1}}>
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
            </ScrollView>
            <ButtonPair firstLabel="hidden" secondLabel="Save" secondOnPress={saveLib} bottomButtons={false} />
        </View>
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