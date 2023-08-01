import React, { useState, useRef, useContext } from "react";
import { StyleSheet, View, Text, TextInput, Image, ScrollView, Platform } from "react-native";
import * as Progress from "react-native-progress";
import globalStyles from "../styles/globalStyles";
import LibManager from "../scripts/lib_manager";
import Drawer from "../components/Drawer";
import ButtonPair from "../components/ButtonPair";
import { useNavigation } from "@react-navigation/native";
import ToastContext from "../components/Toast/ToastContext";
import { useEffect } from "react";
import AdManager from "../scripts/ad_manager";
import BannerAdComponent from "../components/BannerAd";

function PlayScreen({ route }) {

	useEffect(() => {
		AdManager.showAd("interstitial");
	});

	// The id passed from ListItem component is received here
	const libId = route.params.libId;

	const type = route.params.type;
	// Find the right lib from data
	//const currentLib = data.find(lib => lib.id === libId);
	var currentLib = LibManager.getLibByID(libId, type);

	// Extract prompts from the current lib
	const prompts = [];
	if (currentLib.prompts) {
		for (let i = 0; i < currentLib.prompts.length; i++) {
			prompts.push(Object.keys(currentLib.prompts[i])[0]);
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
		showToast("Story saved", "Your story can be found under "Stories" at the bottom of your screen.");
	}

	const handleNext = () => {
		// Add the current response to the responses array
		setResponses((prevResponses) => {
			const newResponses = [...prevResponses];
			newResponses[currentPromptIndex] = currentInput;
			for (let i = 0; i < currentLib.prompts[currentPromptIndex][prompts[currentPromptIndex]].length; i++) {
				currentLib.text[currentLib.prompts[currentPromptIndex][prompts[currentPromptIndex]][i]] = currentInput;
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
				return currentLib.display;
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
			{Platform.OS === ("android" || "ios") && (
				<BannerAdComponent />
			)}
			<Text style={[globalStyles.fontLarge, globalStyles.bold, {textAlign: "left", width: "100%", paddingLeft: 20, marginBottom: 10}]}>{currentLib.name}</Text>
			<View style={[styles.promptContainer, globalStyles.containerWhitespace]}>
				<Text style={[globalStyles.fontMedium, styles.leftPadding]}>{prompts[currentPromptIndex]}</Text>
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
				<ButtonPair firstLabel="Back" firstOnPress={handleBack} secondLabel="Next" secondOnPress={handleNext} bottomButtons={false} />
				<Drawer ref={drawerRef} title="Finished Lib">
					<ScrollView contentContainerStyle={globalStyles.drawerContainer}>
						<View style={globalStyles.drawerTop}>
							<Text style={globalStyles.fontLarge}>{currentLib.name}</Text>
							<Text style={[globalStyles.fontMedium, {marginTop: 16, lineHeight: 34}]}>{finishedLib}</Text>
						</View>
						<ButtonPair firstLabel="Cancel" firstOnPress={() => drawerRef.current.closeDrawer()} secondLabel="Save" secondOnPress={saveLib} bottomButtons={true}/>
					</ScrollView>
				</Drawer>
			</View>
			<View style={styles.bottomLeftContainer}>
				<Image
				style={styles.image}
				source={require("../assets/images/girl-with-balloon.svg")}
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