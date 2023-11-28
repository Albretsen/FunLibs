import React, { createContext, useContext, useState, useEffect } from 'react';
import { Modal, View, StyleSheet } from "react-native";
import Buttons from "./Buttons";

function Dialog(props) {
  const { onCancel, onConfirm, closeDialog } = props;

  const handleCancel = () => {
    closeDialog();
    onCancel();
  };

  const handleConfirm = () => {
    closeDialog();
    onConfirm();
  };

  return (
        <Modal
            transparent={true}
            visible={true}
            onRequestClose={closeDialog}
        >
            <View style={styles.modalBackground}>
                <View style={[styles.modalContainer]}>
					<View style={styles.contentContainer}>
						{props.children}
						<Buttons
							buttons={[
								{
									label: props.cancelLabel || "Cancel",
									onPress: handleCancel,
									buttonStyle: {paddingLeft: 0}
								},
								{
									label: props.confirmLabel || "Confirm",
									onPress: handleConfirm,
								},
							]}
							buttonStyle={{borderWidth: 0, backgroundColor: "transparent", justifyContent: "flex-start", paddingRight: 10, minWidth: 10}}
							containerStyle={{justifyContent: "flex-end", marginTop: 0, gap: 0}}
							labelStyle={{color: "#006D40", fontWeight: "600", fontSize: 15}}
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
        // height: "auto",
        width: "80%",
        // backgroundColor: "#F0F1EC",
        backgroundColor: "white",
        gap: 10,
        padding: 20,
        paddingBottom: 0,
        borderRadius: 16,
    },

    button: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginLeft: 10,
        borderRadius: 5,
        backgroundColor: "transparent"
    },
});

const DialogContext = createContext();

export const useDialog = () => {
  return useContext(DialogContext);
};

export const DialogProvider = ({ children }) => {
	const [dialogs, setDialogs] = useState({});

	const openDialog = (id = 'default', props) => {
		setDialogs(prevDialogs => ({
			...prevDialogs,
			[id]: props,
		}));
	};

	const closeDialog = (id = 'default') => {
		setDialogs(prevDialogs => {
			const newDialogs = { ...prevDialogs };
			delete newDialogs[id];
			return newDialogs;
		});
	};

	return (
		<DialogContext.Provider value={{ openDialog, closeDialog }}>
			{children}
			{Object.keys(dialogs).map(id => (
				<Dialog key={id} {...dialogs[id]} closeDialog={() => closeDialog(id)} />
			))}
		</DialogContext.Provider>
	);
};

export const DialogTrigger = ({ id = 'default', show, ...props }) => {
	const { openDialog, closeDialog } = useDialog();
	const [lastShow, setLastShow] = useState(show);

	useEffect(() => {
		if (show && !lastShow) {
			openDialog(id, props);
		} else if (!show && lastShow) {
			closeDialog(id);
		}
			setLastShow(show);
	}, [show, props]);

	return null;
};

export default DialogProvider;