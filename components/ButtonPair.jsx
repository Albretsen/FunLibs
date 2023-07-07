import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import textStyles from '../styles/textStyles';

export default function ButtonPair({ firstLabel, secondLabel, firstOnPress, secondOnPress, bottomButtons }) {
    return (
        <View style={[styles.buttonContainer, bottomButtons ? styles.bottomStyle : null]}>
            <TouchableOpacity style={styles.button} onPress={firstOnPress}>
                <Text style={[textStyles.bold, textStyles.fontMedium]}>{firstLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.buttonNext]} onPress={secondOnPress}>
                <Text style={[textStyles.bold, textStyles.fontMedium]}>{secondLabel}</Text>
            </TouchableOpacity>
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
})