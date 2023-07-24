import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TouchableWithoutFeedback, Dimensions } from 'react-native';
import globalStyles from '../styles/globalStyles';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LibManager from '../scripts/lib_manager';
import Dialog from './Dialog'; // Import the Dialog component

export default function ListItem(props) {
    const { name, description, id, type, drawer, onClick, length, onDelete } = props;
    const navigation = useNavigation();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false); // Step 1

    function deleteLib() {
        setShowDeleteDialog(true); // Step 3: Show the delete confirmation dialog
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
        setShowDeleteDialog(true); // Step 2: Show the delete confirmation dialog
    }

    function hideDeleteDialogHandler() {
        setShowDeleteDialog(false); // Step 2: Hide the delete confirmation dialog
    }

    return (
        <TouchableWithoutFeedback onPress={() => playLib(id, type)}>
            <View style={[styles.container, globalStyles.containerWhitespace]}>
                <View style={styles.letterCircle}>
                    <Text style={globalStyles.fontLarge}>{name[0]}</Text>
                </View>
                <View style={styles.textRow}>
                    <Text style={[globalStyles.fontMedium, globalStyles.bold]}>{name}</Text>
                    <Text numberOfLines={1} ellipsizeMode='tail' style={[globalStyles.fontMedium, {flexShrink: 1}]}>{description}</Text>
                    <View style={styles.progressBarContainer}>
                        <View style={[styles.progressBar, {width: (100 * length) + '%'}]}></View>
                    </View>
                </View>
                <View style={styles.rightIcons}>
                    <TouchableOpacity style={styles.delete} onPress={showDeleteDialogHandler}>
                        <MaterialIcons style={{color: '#FF847B'}} name="delete" size={34}  />
                    </TouchableOpacity>
                </View>
                {/* Step 4: Conditionally render the delete confirmation dialog */}
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
        paddingTop: 20
    },

    textRow: {
        flexDirection: "column",
        width: "65%",
        gap: 6
    },

    rightIcons: {
        width: "10%",
        // flexDirection: "column",
        justifyContent: "center"
    },

    letterCircle: {
        width: "20%",
        padding: 10,
        backgroundColor: "#D1E8D5",
        borderRadius: 50,
        height: 50,
        width: 50,
        justifyContent: "center",
        alignItems: "center",
    },

    progressBarContainer: {
        height: 4,
        width: "100%",
        backgroundColor: "#D1E8D5",
    },

    progressBar: {
        backgroundColor: "#006D40",
        height: 4
    },

    delete: {

    } 
})