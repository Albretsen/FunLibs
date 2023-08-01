import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TouchableWithoutFeedback, Dimensions } from 'react-native';
import globalStyles from '../styles/globalStyles';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LibManager from '../scripts/lib_manager';
import Dialog from './Dialog'; // Import the Dialog component

export default function ListItem(props) {
    const { name, description, prompt_amount, prompts, text, id, type, drawer, onClick, length, onDelete, showDelete } = props;
    const navigation = useNavigation();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    let promptFirst = false;
    for (let i = 0; i < prompts.length; i++) {
        let firstIndex = prompts[i][Object.keys(prompts[i])[0]][0];
        if (firstIndex == 0) {
            promptFirst = true;
        }
    }

    function deleteLib() {
        setShowDeleteDialog(true);
    }

    function playLib(id, type) {
        if (type === 'stories') {
            drawer.current.openDrawer();
            onClick({ id, name, type });
        } else {
            navigation.navigate('PlayScreen', { libId: id, type: type });
        }
    }

    function showDeleteDialogHandler() {
        setShowDeleteDialog(true);
    }

    function hideDeleteDialogHandler() {
        setShowDeleteDialog(false);
    }

    let promptOrText = promptFirst;
    return (
        <TouchableWithoutFeedback onPress={() => playLib(id, type)}>
            <View style={[styles.container, globalStyles.containerWhitespace]}>
                <View style={styles.letterCircle}>
                    <Text style={globalStyles.fontLarge}>{name[0]}</Text>
                </View>
                <View style={[styles.textRow, {width: showDelete ? "65%" : "75%"}]}>
                    <Text numberOfLines={1} ellipsizeMode='tail' style={[globalStyles.fontMedium, globalStyles.bold, styles.title]}>{name}</Text>
                    <Text numberOfLines={1} ellipsizeMode='tail' style={[globalStyles.fontMedium, {flexShrink: 1}]}>{text.map((key, index) => (
                        <Text key={key + index} style={(index + (promptOrText ? 0 : 1)) % 2 === 0 ? {fontStyle: "italic", color: "#006D40"} : null}>{key}</Text>
                        // description
                    ))}</Text>
                    {/* <Text numberOfLines={1} ellipsizeMode='tail' style={[globalStyles.fontMedium, {flexShrink: 1}]}>{description}</Text> */}
                    <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                        <View style={[styles.progressBarContainer, {width: "88%"}]}>
                            <View style={[styles.progressBar, {width: (100 * length) + '%'}]}></View>
                        </View>
                        <Text style={{fontSize: 14, marginBottom: 4, width: "12%", textAlign: "center"}}>{prompt_amount}</Text>
                    </View>
                </View>
                {showDelete && (
                <View style={styles.rightIcons}>
                    <TouchableOpacity style={styles.delete} onPress={showDeleteDialogHandler}>
                        <MaterialIcons style={{color: '#5A5A5A'}} name="delete" size={34}  />
                    </TouchableOpacity> 
                </View>
                )}
                {/* Conditionally render the delete confirmation dialog */}
                {showDeleteDialog && (
                    <Dialog
                        title="Delete lib"
                        text="Are you sure you want to delete this lib? Once delete it cannot be recovered."
                        onCancel={hideDeleteDialogHandler}
                        onConfirm={() => {
                            onDelete(id);
                            setShowDeleteDialog(false); // Hide the dialog after deletion
                        }}
                    />
                )}
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        gap: 10,
        paddingTop: 20,
        justifyContent: "center"
    },

    textRow: {
        flexDirection: "column",
        // width: "65%",
        gap: 6,
        // flex: 1,
    },

    rightIcons: {
        width: "10%",
        // flexDirection: "column",
        justifyContent: "center"
    },

    letterCircle: {
        paddingBottom: 2, // Accounts for slight off-center letter
        backgroundColor: "#D1E8D5",
        borderRadius: 50,
        height: 50,
        width: 50,
        justifyContent: "center",
        alignItems: "center",
    },

    progressBarContainer: {
        height: 4,
        backgroundColor: "#D1E8D5",
    },

    progressBar: {
        backgroundColor: "#006D40",
        height: 4
    },
})