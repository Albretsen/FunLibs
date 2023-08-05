import React, { useState, useRef, useContext } from "react";
import { StyleSheet, View, Text, TextInput, Image, Platform, ScrollView } from "react-native";
import * as Progress from "react-native-progress";
import globalStyles from "../styles/globalStyles";
import LibManager from "../scripts/lib_manager";
import Drawer from "../components/Drawer";
import Buttons from "../components/Buttons";
import { useNavigation } from "@react-navigation/native";
import ToastContext from "../components/Toast/ToastContext";
import { useEffect } from "react";
import AdManager from "../scripts/ad_manager";
import BannerAdComponent from "../components/BannerAd";
import { useIsFocused } from '@react-navigation/native';
import { ScreenContext } from "../App";

function isNum(n) {
    return /.*[0-9].*/.test(n);
}

function PlayScreen({ route }) {

	useEffect(() => {
		AdManager.showAd("interstitial");
	});

	const isFocused = useIsFocused();
    const { setCurrentScreenName } = useContext(ScreenContext);

    useEffect(() => {
        if (isFocused) {
          setCurrentScreenName("PlayScreen");
        }
      }, [isFocused]);

	// The id passed from ListItem component is received here
	const libId = route.params.libId;

	const type = route.params.type;
	// Find the right lib from data
	//const currentLib = data.find(lib => lib.id === libId);
	var currentLib = LibManager.getLibByID(libId, type);

	// Extract prompts from the current lib
	const prompts = [];
	const displayPrompts = [];
	if (currentLib.prompts) {
		for (let i = 0; i < currentLib.prompts.length; i++) {
			let prompt = Object.keys(currentLib.prompts[i])[0];
			// Get the last character of the inputString
			let lastChar = prompt.slice(-1);

			// Check if the last character is a number
			if (isNum(lastChar)) {
				// Remove the last character from the inputString
				prompt = prompt.slice(0, -1);
				lastChar = prompt.slice(-1);
				if (lastChar === " ") prompt = prompt.slice(0, -1);
			}
			prompts.push(Object.keys(currentLib.prompts[i])[0]);
			displayPrompts.push(prompt);
		}
	}

	// Keep track of current prompt index, user responses and current input
	const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
	const [responses, setResponses] = useState([]);
	const [currentInput, setCurrentInput] = useState("");
	const [finishedLib, displayLib] = useState([]);
	
	const drawerRef = useRef(null);

	// Calculate progress
	const progress = (currentPromptIndex + 1) / prompts.length;

	const navigation = useNavigation();
	const showToast = useContext(ToastContext);
	const saveLib = () => {
		LibManager.storeLib(currentLib, "stories");
		drawerRef.current.closeDrawer();
		navigation.navigate("LibsHomeScreen");
		showToast("Story saved", 'Your story can be found under "Stories" at the bottom of your screen.');
	}

	const autofill = () => {
		let fill = LibManager.getPromptFill(Object.keys(currentLib.prompts[currentPromptIndex])[0]);
		if (fill === "" || fill === null) {
			console.log("EHERE:E:R"); 
			return;
		 }
		setCurrentInput(fill);
	};

	const handleNext = () => {
		// Add the current response to the responses array
		setResponses((prevResponses) => {
			const newResponses = [...prevResponses];
			newResponses[currentPromptIndex] = currentInput;
			for (let i = 0; i < currentLib.prompts[currentPromptIndex][prompts[currentPromptIndex]].length; i++) {
				if (currentInput) {
					currentLib.text[currentLib.prompts[currentPromptIndex][prompts[currentPromptIndex]][i]] = currentInput;
				} else {
					currentLib.text[currentLib.prompts[currentPromptIndex][prompts[currentPromptIndex]][i]] = Object.keys(currentLib.prompts[currentPromptIndex])[0];	
				}
				//currentLib.text[currentLib.prompts[currentPromptIndex][prompts[currentPromptIndex]][i]] = LibManager.getPromptFill(Object.keys(currentLib.prompts[currentPromptIndex])[0]);
			}
			//currentLib.words = newResponses;
			return newResponses;
		});

		if (currentPromptIndex < prompts.length - 1) {
			// If there are more prompts, show the next one
			setCurrentPromptIndex(currentPromptIndex + 1);
		} else {
			drawerRef.current.openDrawer();
			displayLib(() => {
				return currentLib.text;
			});
		}
		// Clear current input
		setCurrentInput("");
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
		<View style={[globalStyles.screenStandard]}>
			<Text style={[globalStyles.fontLarge, globalStyles.bold, {textAlign: "left", width: "100%", paddingLeft: 20, marginBottom: 10}]}>{currentLib.name}</Text>
			<View style={[styles.promptContainer, globalStyles.containerWhitespace]}>
				<Text style={[globalStyles.fontMedium, styles.leftPadding]}>{displayPrompts[currentPromptIndex]}</Text>
				<TextInput
					style={[styles.input, globalStyles.fontMedium]}
					value={currentInput}
					onChangeText={setCurrentInput}
					placeholder={`Write your word here...`}
				/>
				<Text style={[styles.leftPadding, globalStyles.fontSmall, styles.explanation]}>{LibManager.getPromptExplanation(Object.keys(currentLib.prompts[currentPromptIndex])[0])}</Text>
				<Progress.Bar
					progress={progress}
					width={null}
					color="#006D40"
					unfilledColor="#D1E8D5"
					borderWidth={0}
					borderRadius={0}
				/>
				<Buttons
					buttons={
						[{
							label: "Back",
							onPress: handleBack,
						},
						{
							label: "Autofill",
							onPress: autofill,
							filled: true,
						},
						{
							label: "Next",
							onPress: handleNext,
							filled: true
						}]
					}
				/>
			</View>
			<View style={styles.bottomLeftContainer}>
				<Image
				style={styles.image}
				source={require("../assets/images/girl-with-balloon.svg")}
				/>
			</View>
			<Drawer ref={drawerRef} title="Finished Lib">
				<ScrollView>
					<View style={globalStyles.drawerTop}>
						<Text style={globalStyles.fontLarge}>{currentLib.name}</Text>
						<Text style={[globalStyles.fontMedium, {marginTop: 16, lineHeight: 34}]}>
							{finishedLib.map((key, index) => (
								<Text key={key + index} style={(index + 1) % 2 === 0 ? { fontStyle: "italic", color: "#006D40" } : null}>{key}</Text>
							))}
						</Text>
					</View>
				</ScrollView>
				<Buttons 
						buttons={
							[{
								label: "Cancel",
								onPress: () => drawerRef.current.closeDrawer(),
							},
							{
								label: "Save",
								onPress: saveLib,
								filled: true
							}]
						}
						inDrawer={true}
					/>
			</Drawer>
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
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	bottomLeftContainer: {
		position: "absolute",
		bottom: 0,
		left: 0,
	},
	image: {
		width: 170,
		height: 180,
	},
})