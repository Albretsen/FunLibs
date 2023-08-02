import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import globalStyles from '../styles/globalStyles';

export default function ButtonPair({ firstLabel, secondLabel, firstOnPress, secondOnPress, bottomButtons }) {
    return (
        <View style={[styles.buttonContainer, bottomButtons ? styles.bottomStyle : null]}>
			{firstLabel != "hidden" && ( // Hide button if specified
				<TouchableOpacity style={[styles.button, secondLabel == "hidden" ? styles.soleButton : null]} onPress={firstOnPress}>
					<Text style={[globalStyles.bold, globalStyles.fontMedium]}>{firstLabel}</Text>
				</TouchableOpacity>
			)}
			{secondLabel != "hidden" && (
				<TouchableOpacity style={[styles.button, styles.buttonNext, firstLabel == "hidden" ? styles.soleButton : null]} onPress={secondOnPress}>
					<Text style={[globalStyles.bold, globalStyles.fontMedium]}>{secondLabel}</Text>
				</TouchableOpacity>
			)}
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
	bottomStyle: {
		paddingLeft: 20,
		paddingTop: 10,
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
	buttonNext: {
		backgroundColor: "#D1E8D5",
		borderColor: "#D1E8D5",
	},
	soleButton: {
		minWidth: 200,
	}
})