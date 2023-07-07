import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import * as Progress from 'react-native-progress';
import data from '../libs.json';
import miscStyles from '../styles/miscStyles';
import textStyles from '../styles/textStyles';
import Lib from "../scripts/lib.js";
import LibManager from '../scripts/lib_manager';
import Drawer from "../components/Drawer";
import ButtonPair from '../components/ButtonPair';
import { useNavigation } from '@react-navigation/native';

function PlayScreen({ route }) {
	// The id passed from ListItem component is received here
	const libId = route.params.libId;

	const type = route.params.type;
	// Find the right lib from data
	//const currentLib = data.find(lib => lib.id === libId);
	const currentLib = LibManager.getLibByID(libId, type);

	// Extract prompts from the current lib
	const prompts = currentLib ? currentLib.suggestions : [];

	// Keep track of current prompt index, user responses and current input
	const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
	const [responses, setResponses] = useState([]);
	const [currentInput, setCurrentInput] = useState('');
	const [finishedLib, displayLib] = useState([]);
	
	const drawerRef = useRef(null);

	// Calculate progress
	const progress = (currentPromptIndex + 1) / prompts.length;

	const navigation = useNavigation();

	const saveLib = () => {
		LibManager.storeLib(LibManager.libs[type][libId], "stories");
		drawerRef.current.closeDrawer();
		navigation.navigate('LibsHomeScreen');
	}

	const handleNext = () => {
		// Add the current response to the responses array
		setResponses((prevResponses) => {
			const newResponses = [...prevResponses];
			newResponses[currentPromptIndex] = currentInput;
			currentLib.words = newResponses;
			return newResponses;
		});

		console.log(currentPromptIndex, prompts.length - 1)
		if (currentPromptIndex < prompts.length - 1) {
			// If there are more prompts, show the next one
			setCurrentPromptIndex(currentPromptIndex + 1);
		} else {
			drawerRef.current.openDrawer();
			displayLib(() => {
				return currentLib.display;
			});
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
				<ButtonPair firstLabel="Back" firstOnPress={handleBack} secondLabel="Next" secondOnPress={handleNext} bottomButtons={false} />
				<Drawer ref={drawerRef} title="Finished Lib">
					<View style={styles.drawerContainer}>
						<View style={styles.drawerTop}>
							<Text style={textStyles.fontLarge}>Title of Lib here</Text>
							<Text style={textStyles.fontMedium}>{JSON.stringify(finishedLib)}</Text>
						</View>
						<ButtonPair firstLabel="Cancel" secondLabel="Save" secondOnPress={saveLib} bottomButtons={true} />
					</View>
				</Drawer>
			</View>
			<View style={styles.bottomLeftContainer}>
				<Image
				style={styles.image}
				source={require('../assets/images/girl-with-balloon.svg')}
				/>
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
	drawerTop: {
		marginHorizontal: 20,
	},
	drawerBottom: {
		marginBottom: 10,
		marginRight: 10,
		paddingTop: 10,
		borderTopWidth: 1,
		borderColor: "gray",
	},
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	bottomLeftContainer: {
		position: 'absolute',
		bottom: 0,
		left: 0,
	},
	image: {
		width: 170,
		height: 180,
	},
})