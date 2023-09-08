import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import * as Progress from "react-native-progress";
import globalStyles from "../styles/globalStyles";
import LibManager from "../scripts/lib_manager";
import { useDrawer } from "../components/Drawer";
import Buttons from "../components/Buttons";
import { useNavigation } from "@react-navigation/native";
import AdManager from "../scripts/ad_manager";
import BannerAdComponent from "../components/BannerAd";
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import { ScreenContext } from "../App";
import FunLibsShare from "../scripts/share";
import { TextInput } from "react-native-paper";
import { ToastContext } from "../components/Toast";
import DrawerActions from "../components/DrawerActions";
import FirebaseManager from "../scripts/firebase_manager";
import FileManager from "../scripts/file_manager";

function isNum(n) {
    return /.*[0-9].*/.test(n);
}

export default function PlayScreen({ route }) {

	useFocusEffect(() => {
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

	// Calculate progress
	const progress = (currentPromptIndex + 1) / prompts.length;

	const navigation = useNavigation();
	const showToast = useContext(ToastContext);

	const autofill = () => {
		if(fillAvailable) {
			let fill = LibManager.getPromptFill(Object.keys(currentLib.prompts[currentPromptIndex])[0]);
			if (fill === "" || fill === null) {
				return "";
			}
			setCurrentInput(fill);
		} else {
			showToast("Autofill is unavailable for this promt.")
		}
	};

	const [shouldOpenDrawer, setShouldOpenDrawer] = useState(false);

	useEffect(() => {
		if (shouldOpenDrawer) {
			openDrawer(
				{
					component: finishedLibDrawerContent,
					header: {
						middleComponent: (
							<View style={{flex: 1}}>
								<Text style={{fontSize: 18}}>{currentLib.name}</Text>
								<Text style={{fontSize: 14}}>By You</Text>
							</View>
						)
					}
				}
			);
			setShouldOpenDrawer(false);  // Reset the flag
		}
	  }, [shouldOpenDrawer, finishedLibDrawerContent]);

	const handleNext = () => {
		// Add the current response to the responses array
		setResponses((prevResponses) => {
			const newResponses = [...prevResponses];
			newResponses[currentPromptIndex] = currentInput;
			for (let i = 0; i < currentLib.prompts[currentPromptIndex][prompts[currentPromptIndex]].length; i++) {
				if (currentInput) {
					currentLib.text[currentLib.prompts[currentPromptIndex][prompts[currentPromptIndex]][i]] = currentInput;
					newResponses[currentPromptIndex] = currentInput;
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
			promptFillCheck(currentPromptIndex + 1);
		} else {
			setShouldOpenDrawer(true);
			displayLib(() => {
				return currentLib.text;
			});
		}
		// Clear current input
		if (responses[currentPromptIndex + 1]) {
			setCurrentInput(responses[currentPromptIndex + 1]);
		} else {
			setCurrentInput("");
		}
	};

	const handleBack = () => {
		if (currentPromptIndex > 0) {
			// If there are previous prompts, show the previous one
			setCurrentPromptIndex(currentPromptIndex - 1);
			// Set current input to previous response
			setCurrentInput(responses[currentPromptIndex - 1]);
		}
		promptFillCheck(currentPromptIndex - 1);
	};

	const [fillAvailable, setFillAvailable] = useState(true);
	function promptFillCheck(index) {
		// Check if prompt fill is available
		if (!index || index < 0) return;
		let fill = LibManager.getPromptFill(Object.keys(currentLib.prompts[index])[0]);
		if (fill.length < 1) {
			setFillAvailable(false);
		} else {
			setFillAvailable(true);
		}
	}

	// Check prompt availability on first prompt when the screen is first opened
	useEffect(() => {
		promptFillCheck(currentPromptIndex);
    }, []);

	const onPublish = () => {
		console.log('Publish');
	};

	const onShare = () => {
		FunLibsShare.Share(currentLib.display + "\n\nCreated using: https://funlibs0.wordpress.com/download")
	};

	const onSave = async () => {
		console.log("1: " + JSON.stringify(currentLib));
		currentLib.user = FirebaseManager.currentUserData.auth.uid;
		currentLib.published = false;
		currentLib.playable = false;
		currentLib.local = true;
		currentLib.date = new Date();
		let readArray = []
        if (currentLib) {
            let result = await FileManager._retrieveData("read");
            if (!result) result = [];
            if (Object.keys(result).length >= 1) {
                readArray = JSON.parse(result);
            }
            readArray.push(currentLib);
        }
		console.log("2: " + JSON.stringify(readArray));
        FileManager._storeData("read", JSON.stringify(readArray));
        showToast('Your lib has been stored locally.');
        closeDrawer();
        navigation.navigate("LibsHomeScreen");
	}

	const onFavorite = () => {
		console.log("Favorite");
	};

	const { openDrawer, closeDrawer, drawerRef } = useDrawer();

	const finishedLibDrawerContent = (
			// style={{width: Dimensions.get("window").width - (0.15 * Dimensions.get("window").width)}}
		<>
			<ScrollView>
				<View style={globalStyles.drawerTop}>
					{LibManager.displayInDrawer(finishedLib)}
				</View>
			</ScrollView>
			<DrawerActions
				onPublish={onPublish}
				onShare={onShare}
				onSave={onSave}
				onFavorite={onFavorite}
			/>
		</>
	)

	return (
		<View style={[globalStyles.screenStandard]}>
			<View style={[styles.promptContainer, globalStyles.containerWhitespace]}>
				<View style={{flexDirection: "row", gap: 15}}>
					<Image
						style={{height: 45, width: 45, justifyContent: "center", alignSelf: "center", justifyContent: "center"}}
						source={FirebaseManager.avatars[currentLib.avatarID]} 
					/>
					<View style={[{width: "75%", gap: 0, flexDirection: "column",}]}>
						<Text numberOfLines={1} ellipsizeMode="tail" style={[{fontSize: 16, color: "#505050", fontWeight: 500}]}>{currentLib.name}</Text>
						<Text style={[{fontSize: 13, color: "#49454F"}]}>{currentLib.username} | {currentLib.likes} likes</Text>
					</View>
				</View>
				<View style={{position: "relative"}}>
					<TextInput
						label={displayPrompts[currentPromptIndex]}
						value={currentInput}
						onChangeText={setCurrentInput}
						mode="outlined"
						theme={{
							colors: {
								primary: '#49454F', // For the outline color
							},
						}}
					/>
					{fillAvailable && ( // Render only if autofill is available
						<TouchableOpacity onPress={autofill} style={{position: "absolute", right: 15, top: 20}}>
							<Text style={{color: "#5C9BEB", fontSize: 15}}>Fill</Text>
						</TouchableOpacity>
					)}
				</View>
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
							label: "Next",
							onPress: handleNext,
							buttonStyle: {backgroundColor: "#D1E8D5", borderColor: "#D1E8D5"}
						}]
					}
					labelStyle={{fontWeight: 600}}
				/>
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