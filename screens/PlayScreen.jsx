import React, { useState, useContext, useEffect, useRef } from "react";
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
import Analytics from "../scripts/analytics";
import { requestReview } from "../scripts/store_review";
import { DialogTrigger, useDialog } from "../components/Dialog";
import AudioPlayer from "../scripts/audio";
import { HeaderBackButton } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from "react-native";

function isNum(n) {
    return /.*[0-9].*/.test(n);
}

export default function PlayScreen({ route }) {

	const { playAudio } = AudioPlayer();

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
	const [currentLib, setCurrentLib] = useState(LibManager.getLibByID(libId, type));

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
	const currentPromptIndexRef = useRef(currentPromptIndex);
	useEffect(() => {
		currentPromptIndexRef.current = currentPromptIndex;
	  }, [currentPromptIndex]);
	const [responses, setResponses] = useState([]);
	const responsesRef = useRef(responses);
	useEffect(() => {
		responsesRef.current = responses;
	  }, [responses]);
	const [currentInput, setCurrentInput] = useState("");
	const currentInputRef = useRef(currentInput);
	useEffect(() => {
		currentInputRef.current = currentInput;
	  }, [currentInput]);
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

	const { openDialog } = useDialog();

    const drawerClosed = async () => {
        let libsPlayed = await FileManager._retrieveData("libsPlayed");
        let reviewPopupShowed = await FileManager._retrieveData("reviewPopupShowed");

        if (libsPlayed) {
            libsPlayed = parseInt(libsPlayed);
            if ((libsPlayed % 10 === 0) && reviewPopupShowed != "1" && Platform.OS !== "ios") {
                // Trigger the review dialog here
                openDialog('reviewDialog', {
					onCancel: () => FileManager._storeData("reviewPopupShowed", "1"),
					onConfirm: () => {
						console.log("User agreed to review");
						requestReview(); // Assuming this function prompts the user to review the app
						FileManager._storeData("reviewPopupShowed", "1"); // Set the flag so the popup doesn't show again
					},
					children: (
						<>
							<Text style={globalStyles.dialogTitle}>🌟 Enjoying our app? 🌟</Text>
                    		<Text style={globalStyles.dialogText}>Your feedback helps us grow. Mind leaving a review?</Text>
						</>
					),
					cancelLabel: "No thanks",
					confirmLabel: "Of Course!"
				});
            }
        }
    }

	useEffect(() => {
		if (shouldOpenDrawer) {
			openDrawer(
				{
					component: finishedLibDrawerContent,
					header: {
						middleComponent: (
							<View style={{flex: 1}}>
								<Text style={{fontSize: 18}}>{currentLib.name}</Text>
								<Text style={{fontSize: 14}}>by {currentLib.username}</Text>
							</View>
						)
					},
					onCloseComplete: drawerClosed
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
			if (Platform.OS !== "ios") AdManager.showAd("interstitial");
			Analytics.increment("libsPlayed");
		}
		// Clear current input
		if (responses[currentPromptIndex + 1]) {
			setCurrentInput(responses[currentPromptIndex + 1]);
		} else {
			setCurrentInput("");
		}
	};

	useEffect(() => {
		navigation.setOptions({
			headerLeft: (props) => {
				const { onPress } = props;  // Extract default onPress
	
				return (
					<TouchableOpacity 
						onPress={async () => {
							let progressFound = await handleSaveProgress();
							if (progressFound && ((parseInt(responsesRef.current.length) - parseInt(currentPromptIndexRef.current)) !== 2)) {
								openDialog('savedChangesDialog', {
									onCancel: () => {
										onPress();
									},
									onConfirm: () => {
										
									},
									children: (
										<>
											<Text style={globalStyles.dialogTitle}>Unsaved progress!</Text>
											<Text style={globalStyles.dialogText}>Do you want to continue writing, or discard the progress?</Text>
										</>
									),
									cancelLabel: "Discard",
									confirmLabel: "Continue"
								});
							} else {
								onPress();
							}
						}}
						style={{ marginLeft: 10 }} 
					>
						<Ionicons name="arrow-back" size={24} color="black" />
					</TouchableOpacity>
				);
			},
		});
	}, [navigation]);

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
		if (index < 0 || index === undefined || index === null) return;
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
		FunLibsShare.Share(LibManager.displayForShare(currentLib.text) + "\n\nCreated using: https://funlibs0.wordpress.com/download")
	};

	const onSave = async () => {
		let currentLib_ = JSON.parse(JSON.stringify(currentLib));
		currentLib_.published = false;
		currentLib_.playable = false;
		currentLib_.local = true;
		currentLib_.date = new Date();
		currentLib.official = false;
		let readArray = []
        if (currentLib_) {
            let result = await FileManager._retrieveData("read");
            if (!result) result = [];
            if (Object.keys(result).length >= 1) {
                readArray = JSON.parse(result);
            }
            readArray.push(currentLib_);
        }
        FileManager._storeData("read", JSON.stringify(readArray));
        showToast('Your story is saved under Read!');
        closeDrawer();
        navigation.navigate("Home");
	}

	const [isUpdating, setIsUpdating] = useState(false);

	useEffect(() => {
		console.log("Updated currentLib:", currentLib);
	}, [currentLib]);

	const onFavorite = async () => {
        if (isUpdating) return;  // Prevent further interactions while updating
        if (!FirebaseManager.currentUserData?.auth?.uid) {
            showToast("You have to be signed in to like a post.");
            return;
        }

        setIsUpdating(true);
		closeDrawer();

        const userUid = FirebaseManager.currentUserData.auth.uid;
		if (!currentLib.likesArray) currentLib.likesArray = [];
        let isUserLiked = currentLib.likesArray.includes(userUid);
        let updatedLikesArray = [...currentLib.likesArray];

        if (isUserLiked) {
            updatedLikesArray = updatedLikesArray.filter(uid => uid !== userUid);
			setCurrentLib(prevLib => ({
				...prevLib,
				likesArray: updatedLikesArray
			}));
			console.log(currentLib);
			await FirebaseManager.updateLikesWithTransaction(currentLib.id, userUid);
			setIsUpdating(false);
			return;
        } else {
            updatedLikesArray.push(userUid);
        }

        try {
            await FirebaseManager.updateLikesWithTransaction(currentLib.id, userUid);
            playAudio("pop");
            setCurrentLib(prevLib => ({
				...prevLib,
				likesArray: updatedLikesArray
			}));
			console.log("ADDED LIKE TO FIREBASE");
        } catch (error) {
            console.error("Failed to update likes in Firebase:", error);
            // Revert the UI changes
        } finally {
            setIsUpdating(false);  // Allow further interactions
        }
    };

	const handleSaveProgress = () => {
		try {
			if (responsesRef.current.every(item => item === "")) {
				return false;
			}
			if (responsesRef.current.length > 0 || currentInputRef.current.length > 0) {
				responsesRef.current.push(currentInputRef.current);
				setResponses(responsesRef.current)
				return true;
			}
		} catch (err) {
			console.log(err);
			return false;
		}
		return false;
	}

	const { openDrawer, closeDrawer, drawerRef } = useDrawer();

	const finishedLibDrawerContent = (
			// style={{width: Dimensions.get("window").width - (0.15 * Dimensions.get("window").width)}}
		<>
			<ScrollView >
				<View style={globalStyles.drawerTop}>
					{LibManager.displayInDrawer(finishedLib)}
				</View>
			</ScrollView>
			<DrawerActions
				onShare={onShare}
				onSave={onSave}
				likesArray={currentLib.likesArray}
				//onFavorite={onFavorite} sdsdf
				//{...(!currentLib.local ? { onFavorite: onFavorite } : {  })}
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
						<Text style={[{fontSize: 13, color: "#49454F"}]}>by {currentLib.username} | {currentLib.likes} likes</Text>
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
				source={require("../assets/images/girl-with-balloon.png")}
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
		width: 207,
		height: 212,
	},
})