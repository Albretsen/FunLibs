import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Modal } from "react-native";
import globalStyles from "../styles/globalStyles";

export default function Dialog(props) {
    const { onCancel, onConfirm, cancelLabel, confirmLabel, cancelStyle, confirmStyle, modalStyle } = props;
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
                        <View style={styles.buttonsContainer}>
                            <TouchableOpacity style={cancelStyle ? cancelStyle : styles.button} onPress={handleCancel}>
                                <Text style={[styles.buttonText, globalStyles.bold]}>
                                    {cancelLabel ? cancelLabel : "Cancel"}
                            </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={confirmStyle ? confirmStyle : styles.button} onPress={handleConfirm}>
                                <Text style={[styles.buttonText, globalStyles.bold]}>
                                    {confirmLabel ? confirmLabel : "Confirm"}
                                </Text>
                            </TouchableOpacity>
                        </View>
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
        // justifyContent: "center",
        // alignItems: "center",
        gap: 10,
        padding: 20,
        borderRadius: 16,
    },

    buttonsContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignSelf: "flex-end",
        marginTop: 20,
    },

    button: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginLeft: 10,
        borderRadius: 5,
    },

    button: {
		borderRadius: 40,
		backgroundColor: "white",
		borderWidth: 1,
		borderColor: "gray",
		padding: 10,
		paddingHorizontal: 20,
		minWidth: 100,
		height: 50,
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "row",
		gap: 10
	},

    text: {
        color: "white",
        fontSize: 16,
        lineHeight: 34,
        fontWeight: 400,
        letterSpacing: 0.5
    },

    title: {
        color: "white",
        fontSize: 24,
    },

    buttonText: {
        color: "white",
        fontSize: 18
    },
});