import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import globalStyles from '../styles/globalStyles';

export default function Buttons({ buttons, containerStyle }) {
    return (
        <View style={[
			styles.buttonContainer,
			containerStyle ? containerStyle : null
		]}>
            {buttons.map((button, index) => (
                <TouchableOpacity
                    style={[
						styles.button,
						button.backgroundColor ? {backgroundColor: button.backgroundColor} :
						button.filled ? styles.filled : styles.unfilled,
						button.extendWidth ? styles.long : null
					]}
                    key={index}
                    onPress={button.onPress}
                >
                    <Text style={[globalStyles.bold, globalStyles.fontMedium, button.textColor ? {color: button.textColor} : null]}>{button.label}</Text>
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
		justifyContent: "center"
	},
	filled: {
		backgroundColor: "#D1E8D5",
		borderColor: "#D1E8D5",
	},
    unfilled: {
        backgroundColor: "white"
    },
	long: {
		minWidth: 200,
	}
})