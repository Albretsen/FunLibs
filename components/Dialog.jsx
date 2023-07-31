import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native';
import globalStyles from '../styles/globalStyles';

export default function Dialog(props) {
    const { text, title, onCancel, onConfirm } = props;
    const [modalVisible, setModalVisible] = useState(true);

    function handleCancel() {
        setModalVisible(false);
        onCancel();
    }

    function handleConfirm() {
        setModalVisible(false);
        onConfirm();
    }

    return (
        <Modal
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <View style={styles.modal}>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.text}>{text}</Text>
                        <View style={styles.buttonsContainer}>
                            <TouchableOpacity style={styles.button} onPress={handleCancel}>
                                <Text style={[styles.buttonText, globalStyles.bold]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={handleConfirm}>
                                <Text style={[styles.buttonText, globalStyles.bold]}>Confirm</Text>
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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
    },
    modalContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    },
    modal: {
        height: "auto",
        width: '80%',
        backgroundColor: '#3B6470',
        // justifyContent: 'center',
        // alignItems: 'center',
        gap: 10,
        padding: 20,
        borderRadius: 16,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignSelf: "flex-end",
        marginTop: 20,
    },
    button: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginLeft: 10,
        borderRadius: 5,
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
    confirmButton: {
        // backgroundColor: 'blue',
    },
    buttonText: {
        color: 'white',
        fontSize: 18
    },
});