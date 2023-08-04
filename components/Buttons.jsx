import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import globalStyles from '../styles/globalStyles';

export default function Buttons({ buttons, inDrawer, extendWidth }) {
    return (
        <View style={[styles.buttonContainer, inDrawer ? styles.drawerBottom : null]}>
            {buttons.map((button, index) => (
                <TouchableOpacity
                    style={[styles.button, button.filled ? styles.filled : styles.unfilled, extendWidth ? styles.long : null]}
                    key={index}
                    onPress={button.onPress}
                >
                    <Text style={[globalStyles.bold, globalStyles.fontMedium]}>{button.label}</Text>
                </TouchableOpacity>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "flex-end",
		gap: 10,
		marginTop: 10,
        marginBottom: 10,
	},
	drawerBottom: {
		paddingLeft: 20,
		paddingTop: 10,
        paddingBottom: 10,
		borderTopWidth: 1,
		borderColor: "#cccccc",
		justifyContent: "flex-start"
	},
	button: {
		borderRadius: 40,
		backgroundColor: "white",
		borderWidth: 1,
		borderColor: "gray",
		padding: 10,
		minWidth: 100,
		height: 50,
		alignItems: "center",
		justifyContent: "center"
	},
	filled: {
		backgroundColor: "#D1E8D5",
		borderColor: "#D1E8D5",
	},
    unfilled: {
        backgroundColor: "White"
    },
	long: {
		minWidth: 200,
	}
})