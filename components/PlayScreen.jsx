import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Modal, Animated, Dimensions } from 'react-native';
import * as Progress from 'react-native-progress';
import data from '/libs.json';
import miscStyles from './miscStyles';
import textStyles from './textStyles';

function PlayScreen({ route }) {
	// The id passed from ListItem component is received here
	const libId = route.params.libId;
	// Find the right lib from data
	const currentLib = data.find(lib => lib.id === libId);

	// Extract prompts from the current lib
	const prompts = currentLib ? currentLib.suggestions : [];

	// Keep track of current prompt index, user responses and current input
	const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
	const [responses, setResponses] = useState([]);
	const [currentInput, setCurrentInput] = useState('');

	// Calculate progress
	const progress = (currentPromptIndex + 1) / prompts.length;

	// State for controlling the visibility of the drawer
	const [drawerVisible, setDrawerVisible] = useState(false);
	const slideAnim = useRef(new Animated.Value(-Dimensions.get('window').width)).current;

	const openDrawer = () => {
		setDrawerVisible(true);
		Animated.timing(slideAnim, {
			toValue: 0,
			duration: 500,
			useNativeDriver: true,
		}).start();
	};

	const closeDrawer = () => {
		Animated.timing(slideAnim, {
			toValue: -Dimensions.get('window').width,
			duration: 500,
			useNativeDriver: true,
		}).start(() => setDrawerVisible(false));
	};

	const handleNext = () => {
		// Add the current response to the responses array
		setResponses((prevResponses) => {
		const newResponses = [...prevResponses];
		newResponses[currentPromptIndex] = currentInput;
		return newResponses;
		});

		if (currentPromptIndex < prompts.length - 1) {
			// If there are more prompts, show the next one
			setCurrentPromptIndex(currentPromptIndex + 1);
		} else {
			// Open the drawer instead of console logging
			openDrawer();
		}
		// Clear current input
		setCurrentInput('');
	};

	const handleBack = () => {
		if (currentPromptIndex > 0) {
			// If there are previous prompts, show the previous one
			setCurrentPromptIndex(currentPromptIndex - 1);
			// Set current input to previous response
			setCurrentInput(responses[currentPromptIndex - 1]);
		}
	};

	return (
		<View style={[miscStyles.screenStandard]}>
			<View style={[styles.promptContainer, miscStyles.containerWhitespace]}>
				<Text style={[textStyles.fontMedium, styles.leftPadding]}>{prompts[currentPromptIndex]}</Text>
				<TextInput
					style={[styles.input, textStyles.fontMedium]}
					value={currentInput}
					onChangeText={setCurrentInput}
					placeholder={`Write your word here...`}
				/>
				<Text style={[styles.leftPadding, textStyles.fontSmall, styles.explanation]}>Explanation of word here.</Text>
				<Progress.Bar
					progress={progress}
					width={null}
					color='#006D40'
					unfilledColor='#D1E8D5'
					borderWidth={0}
					borderRadius={0}
				/>
				<View style={styles.buttonContainer}>
					<TouchableOpacity style={styles.button} onPress={handleBack}>
						<Text style={[styles.buttonText, textStyles.bold, textStyles.fontMedium]}>Back</Text>
					</TouchableOpacity>
					<TouchableOpacity style={[styles.button, styles.buttonNext]} onPress={handleNext}>
						<Text style={[textStyles.bold, textStyles.fontMedium]}>Next</Text>
					</TouchableOpacity>
				</View>
				<Modal
				animationType="none"
				transparent={true}
				visible={drawerVisible}
				onRequestClose={closeDrawer}
				>
					<Animated.View style={{
						flex: 1,
						backgroundColor: 'white',
						// Set width of drawer to screen width - 15% of screen width
						width: Dimensions.get("window").width - (0.15 * Dimensions.get("window").width),
						transform: [{ translateX: slideAnim }],
					}}>
					<View style={styles.drawerContainer}>
						<View style={styles.drawerTop}>
							<Text>Finished, responses: {JSON.stringify(responses)}</Text>
						</View>

						<View style={[styles.buttonContainer, styles.drawerBottom]}>
							<TouchableOpacity style={styles.button}>
							<Text style={[styles.buttonText, textStyles.bold, textStyles.fontMedium]}>Cancel</Text>
							</TouchableOpacity>
							{/* Add proper onPress */}
							<TouchableOpacity style={[styles.button, styles.buttonNext]} onPress={closeDrawer}>
							<Text style={[textStyles.bold, textStyles.fontMedium]}>Save</Text>
							</TouchableOpacity>
						</View>
						</View>
					</Animated.View>
				</Modal>
			</View>
		</View>
	);
}

export default PlayScreen;

const styles = StyleSheet.create({
	promptContainer: {
		borderRadius: 10,
		borderColor: "#CAC4D0",
		borderWidth: 1,
		padding: 20,
		rowGap: 10,
	},
	input: {
		height: 60,
		borderWidth: 1,
		borderColor: "gray",
		borderRadius: 6,
		padding: 10,
		paddingLeft: 16
	},
	leftPadding: {
		paddingLeft: 16
	},
	explanation: {
		marginTop: -6
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "flex-end",
		gap: 10,
		marginTop: 10
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
	drawerContainer: {
		flex: 1,
		justifyContent: "space-between",
		borderRightWidth: 1,
		borderColor: "#D1E8D5"
	},
	drawerBottom: {
		marginBottom: 10,
		marginRight: 10,
		paddingTop: 10,
		borderTopWidth: 1,
		borderColor: "gray",
	}
})