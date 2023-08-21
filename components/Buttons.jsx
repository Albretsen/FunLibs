
/**
 * @component Buttons
 *
 * @overview
 * Renders a group of touchable buttons with the flexibility to adjust styles
 * for each individual button or for all buttons at once.
 *
 * @props
 * - `buttons` (Array of Objects): 
 *     - `label` (String): The text label of the button. (Required)
 *     - `onPress` (Function): Callback when the button is pressed.
 *     - `buttonStyle` (Object): Style object specific to this button.
 *     - `labelStyle` (Object): Style object specific to this button's label.
 *     - `icon` (String): Icon name from MaterialIcons to be displayed in the button. (Optional)
 *     - `iconColor` (String): Color for the icon. (Optional)
 * 
 * - `containerStyle` (Object): Style object for the container wrapping all buttons.
 * - `buttonStyle` (Object): Default style object for all buttons. Specific styles provided in the buttons prop for individual buttons will take precedence over this.
 * - `labelStyle` (Object): Default style object for all button labels. Specific styles provided in the buttons prop for individual button labels will take precedence over this.
 *
 * @defaultStyles
 * - `buttonContainer`: Contains flex properties and margins.
 * - `button`: Has borderRadius, padding, min dimensions, and center alignment.
 * - `label`: Default fontSize of 18.
 * 
 * @example
 * <Buttons
 *     buttons={[
 *         { label: "Adjective", icon: "add", iconColor: "#3498db" },
 *         { label: "Verb" },
 *         { label: "Noun", icon: "create", iconColor: "red" },
 *         { label: "Occupation" }
 *     ]}
 *     buttonStyle={{ backgroundColor: "#3498db" }}
 *     labelStyle={{ color: "white", fontWeight: "400", fontSize: 19 }}
 *     containerStyle={{ justifyContent: "flex-start" }}
 * />
 */

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView} from 'react-native';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default function Buttons({ buttons, containerStyle, buttonStyle, labelStyle, sideScroll }) {
	let ParentTag = sideScroll ? ScrollView : View;
    return (
		<ParentTag 
			keyboardDismissMode="none"
			keyboardShouldPersistTaps={'always'}
			horizontal
			showsHorizontalScrollIndicator={false}
			contentStyle={containerStyle ? containerStyle : null}>
			<View style={[
				styles.buttonContainer,
				containerStyle ? containerStyle : null,
				sideScroll ? null : {flexWrap: "wrap"}
			]}>
				{buttons.map((button, index) => (
					<TouchableOpacity
						style={[
							styles.button,
							// If buttonStyle is defined, it applies to all buttons
							buttonStyle ? buttonStyle : null,
							// Specific button styles applied last for precedence
							button.buttonStyle ? button.buttonStyle : null,
							// Give button less left padding if it has an icon
							button.icon ? {paddingLeft: 16} : null
						]}
						key={index}
						onPress={button.onPress}
					>
						{button.icon ?
							<MaterialIcons
								style={[
									// {marginTop: 3}, // Account for slight icon offset
									button.iconColor ? {color: button.iconColor} : null
								]}
								name={button.icon}
								size={22}
							/>
						: null}

						<Text style={[
							styles.label,
							labelStyle ? labelStyle : null,
							button.labelStyle ? button.labelStyle : null
						]}>
							{button.label}
						</Text>
					</TouchableOpacity>
				))}
			</View>
		</ParentTag>
    )
}

const styles = StyleSheet.create({
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "flex-end",
		// flexWrap: "wrap",
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
		justifyContent: "center",
		flexDirection: "row",
		gap: 10
	},

	label: {
        fontSize: 18,
    },
})