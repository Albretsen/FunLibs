/**
 * @component Dialog
 * 
 * @overview
 * Provides a customizable modal dialog that can be used to prompt users
 * for a decision, confirmation, or any other user interaction. The dialog can contain any type
 * of content, including text, images, and interactive elements.
 * 
* @props
 * - `onCancel` (Function): Function to be executed when the Cancel button is pressed. (Required)
 * - `onConfirm` (Function): Function to be executed when the Confirm button is pressed. (Required)
 * - `cancelLabel` (String): Label for the Cancel button. Default is "Cancel".
 * - `confirmLabel` (String): Label for the Confirm button. Default is "Confirm".
 * - `buttonStyle` (Object): Custom styles for the buttons (both Cancel and Confirm).
 * - `labelStyle` (Object): Custom styles for the button labels (both Cancel and Confirm).
 * - `cancelStyle` (Object): Custom styles for the Cancel button.
 * - `confirmStyle` (Object): Custom styles for the Confirm button.
 * - `modalStyle` (Object): Custom styles for the modal container.
 * - `containerStyle` (Object): Custom styles for the content container within the modal.
 * 
 * @example
 * ```
 * import React, { useState } from "react";
 * import { Text, Button } from "react-native";
 * import Dialog from "../components/Dialog";
 * 
 * function ExampleComponent() {
 *   const [showDialog, setShowDialog] = useState(false);
 * 
 *   const handleOpenDialog = () => {
 *     setShowDialog(true);
 *   };
 * 
 *   const handleCloseDialog = () => {
 *     setShowDialog(false);
 *   };
 * 
 *   const handleConfirmDialog = () => {
 *     console.log("Dialog confirmed");
 *     setShowDialog(false);
 *   };
 * 
 *   return (
 *     <>
 *       <Button title="Open Dialog" onPress={handleOpenDialog} />
 *       {showDialog && (
 *         <Dialog
 *           onCancel={handleCloseDialog}
 *           onConfirm={handleConfirmDialog}
 *           cancelLabel="No, Cancel"
 *           confirmLabel="Yes, Confirm"
 *           buttonStyle={{backgroundColor: 'blue', borderRadius: 5}}
 *           labelStyle={{color: 'white', fontWeight: 'bold'}}
 *           cancelStyle={{backgroundColor: 'red'}}
 *           confirmStyle={{backgroundColor: 'green'}}
 *           modalStyle={{padding: 20}}
 *           containerStyle={{justifyContent: 'center'}}
 *         >
 *           <Text>Are you sure you want to proceed?</Text>
 *         </Dialog>
 *       )}
 *     </>
 *   );
 * }
 * ```
 */

import React, { useState } from "react";
import { StyleSheet, View, Modal } from "react-native";
import globalStyles from "../styles/globalStyles";
import Buttons from "./Buttons";

export default function Dialog(props) {
    const { onCancel, onConfirm, cancelLabel, confirmLabel, buttonStyle, labelStyle, cancelStyle, confirmStyle, modalStyle, containerStyle } = props;
    const [modalVisible, setModalVisible] = useState(true);

    function openDialog() {
        setModalVisible(true);
    }

    function closeDialog() {
        setModalVisible(false);
    }

    function handleCancel() {
        closeDialog();
        onCancel();
    }

    function handleConfirm() {
        openDialog();
        onConfirm();
    }

    return (
        <Modal
            transparent={true}
            visible={modalVisible}
            onRequestClose={closeDialog}
        >
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <View style={[styles.contentContainer, modalStyle ? modalStyle : null]}>
                        {props.children}
                        <Buttons
                            buttons={[
                                {
                                    label: cancelLabel ? cancelLabel : "Cancel",
                                    onPress: handleCancel,
                                    buttonStyle: cancelStyle
                                },
                                {
                                    label: confirmLabel ? confirmLabel : "Confirm",
                                    onPress: handleConfirm,
                                    buttonStyle: confirmStyle
                                }
                            ]}
                            buttonStyle={[styles.button, buttonStyle]}
                            labelStyle={[styles.buttonText, globalStyles.bold, labelStyle]}
                            containerStyle={containerStyle}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.25)",
    },
    
    modalContainer: {
        justifyContent: "center",
        alignItems: "center",
        width: "100%"
    },

    contentContainer: {
        height: "auto",
        width: "80%",
        backgroundColor: "#3B6470",
        gap: 10,
        padding: 20,
        borderRadius: 16,
    },

    button: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginLeft: 10,
        borderRadius: 5,
        backgroundColor: "transparent"
    },

    buttonText: {
        color: "white",
        fontSize: 18
    },
});