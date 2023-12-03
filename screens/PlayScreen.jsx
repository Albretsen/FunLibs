import React, { useState, useContext, useEffect, useRef } from "react";
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, Dimensions, SafeAreaView, Keyboard } from "react-native";
import * as Progress from "react-native-progress";
import globalStyles from "../styles/globalStyles";
import LibManager from "../scripts/lib_manager";
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
import CommentSection from "../components/CommentSection";
import { BackHandler } from 'react-native';
import AvatarDisplay from "../components/AvatarDisplay";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import i18n from "../scripts/i18n";
// import { Drawer } from "hallvardlh-react-native-drawer";
import Drawer from "../components/DrawerComponent";
import DrawerHeader from "../components/DrawerHeader";
import { ScrollView as DrawerScrollView } from "react-native-gesture-handler";
import Dropdown from "../components/Dropdown";

function isNum(n) {
	return /.*[0-9].*/.test(n);
}

export default function PlayScreen({ route }) {

	const { playAudio } = AudioPlayer();

	const isFocused = useIsFocused();
	const { setCurrentScreenName } = useContext(ScreenContext);

	useEffect(() => {
		if (isFocused) {
			setCurrentScreenName("Play Lib");
			if (Platform.OS === "ios") AdManager.showAd("interstitial");
		}
	}, [isFocused]);

	// The id passed from ListItem component is received here
	// Find the right lib from data
	//const currentLib = data.find(lib => lib.id === libId);
	const [currentLib, setCurrentLib] = useState(route.params.lib);

	useEffect(() => {
		// This will run every time you navigate to the screen
		if (route.params.lib) setCurrentLib(route.params.lib);
	  }, [route.params.lib]);

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
		if (fillAvailable) {
			let fill = LibManager.getPromptFill(Object.keys(currentLib.prompts[currentPromptIndex])[0]);
			if (fill === "" || fill === null) {
				return "";
			}
			setCurrentInput(fill);
			// Update prompt context display
			createPromptContext(fill);
		} else {
			showToast({ text: i18n.t('fill_is_unavailable_for_this_prompt'), noBottomMargin: true });
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
						requestReview();
						FileManager._storeData("reviewPopupShowed", "1"); // Set the flag so the popup doesn't show again
					},
					children: (
						<>
							<Text style={globalStyles.dialogTitle}>{i18n.t('enjoying_our_app')}</Text>
							<Text style={globalStyles.dialogText}>{i18n.t('your_feedback_helps_us_grow_mind_leaving_a_review')}</Text>
						</>
					),
					cancelLabel: i18n.t('no_thanks'),
					confirmLabel: i18n.t('of_course'),
				});
			}
		}
	}

	useEffect(() => {
		if (shouldOpenDrawer) {
			finishedLibDrawerRef.current?.openDrawer();
			setShouldOpenDrawer(false);  // Reset the flag
		}
	}, [shouldOpenDrawer]);

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
							onPress();
						}}
						style={{ marginLeft: 10 }}
					>
						<Ionicons name="arrow-back" size={24} color="black" />
					</TouchableOpacity>
				);
			},
		});
	}, [navigation]);

	useEffect(() => {
		const handleBackPress = async () => {

			let progressFound = await handleSaveProgress();
			if (progressFound && ((parseInt(responsesRef.current.length) - parseInt(currentPromptIndexRef.current)) !== 2)) {
				console.log("here 62");
				saveChangesDialog();
				return true;  // Prevents the default back action
			}
			return false;  // Allows the default back action
		};

		BackHandler.addEventListener('hardwareBackPress', handleBackPress);

		// Cleanup to avoid memory leaks
		return () => {
			BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
		};
	}, []);

	React.useEffect(() => {
		const unsubscribe = navigation.addListener('beforeRemove', async (e) => {
			let progressFound = await handleSaveProgress();
			if (progressFound && ((parseInt(responsesRef.current.length) - parseInt(currentPromptIndexRef.current)) !== 2)) {
				// Prevent the default action
				e.preventDefault();

				saveChangesDialog();
			}
		});

		return unsubscribe;
	}, [navigation]);

	const saveChangesDialog = (onPress) => {
		return;
		openDialog('savedChangesDialog', {
			onCancel: () => {
				if (onPress) onPress();
				else {
					navigation.navigate("Browse");
					return false;
				};
			},
			onConfirm: () => {
				navigation.navigate("Play Lib");
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
	}

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
		FunLibsShare.Share(LibManager.displayForShare(currentLib.text) + "\n\n" + i18n.t('created_using_link'))
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
			currentLib_.id = readArray.length;
			readArray.push(currentLib_);
		}
		FileManager._storeData("read", JSON.stringify(readArray));
		showToast({ text: i18n.t('your_story_has_been_saved'), noBottomMargin: true });
		finishedLibDrawerRef.current?.closeDrawer();
		navigation.navigate("Browse");
	}

	const [isUpdating, setIsUpdating] = useState(false);

	useEffect(() => {
		
	}, [currentLib]);

	const onFavorite = async () => {
		if (isUpdating) return;  // Prevent further interactions while updating
		if (!FirebaseManager.currentUserData?.auth?.uid) {
			showToast({ text: i18n.t('you_have_to_be_signed_in_to_like_a_post'), noBottomMargin: true });
			return;
		}

		setIsUpdating(true);
		finishedLibDrawerRef.current?.closeDrawer();

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

	const finishedLibDrawerRef = useRef(null)

	const [commentText, setCommentText] = useState("");

	function handleCommentChange(text) {
		setCommentText(text);
	}

	const submitComment = (comment, replyingToCommentIndex) => {
		if (!FirebaseManager.currentUserData?.auth?.uid) {
			console.log("not logged in");
			return;
		}

		FirebaseManager.submitComment(comment, replyingToCommentIndex, currentLib.id);
	}

	const deleteComment = (comment, replyingToCommentIndex) => {
		FirebaseManager.deleteComment(currentLib.id, comment, replyingToCommentIndex);
	}

	const [keyboardHeight, setKeyboardHeight] = useState(0);
	const [scrollY, setScrollY] = useState(0);
	const scrollViewRef = useRef(null);

	useEffect(() => {
		function onKeyboardDidShow(e) {
			const keyboardHeight = e.endCoordinates.height;
			const newScrollPosition = scrollY + keyboardHeight;
			scrollViewRef.current.scrollTo({ y: newScrollPosition, animated: true });
			setKeyboardHeight(e.endCoordinates.height);
		}

		function onKeyboardDidHide() {
			setKeyboardHeight(0);
		}

		const showSubscription = Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
		const hideSubscription = Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);
		return () => {
			showSubscription.remove();
			hideSubscription.remove();
		};
	}, []);



	// Prompt context:

	const [showPromptContext, setShowPromptContext] = useState(false);
	const [promptContext, setPromptContext] = useState("");

	const createPromptContext = (text) => {
		console.log(text)
		setPromptContext(
			LibManager.createPromptContext(
				currentLib,
				currentPromptIndex,
				text,
				displayPrompts[currentPromptIndex]
			)
		);
	}


	return (
		<View style={[globalStyles.screenStandard, globalStyles.standardHeight]}>
			<ScrollView ref={scrollViewRef}
				keyboardShouldPersistTaps="handled"
				onScroll={event => {
					setScrollY(event.nativeEvent.contentOffset.y);
				}}
				scrollEventThrottle={16}
				contentContainerStyle={[
					globalStyles.standardWhitespace,
					// Did our own custom keyboard avoiding view because we are better
					{ paddingBottom: keyboardHeight }
				]}>
				<View style={[styles.promptContainer]}>
					<AvatarDisplay
						avatarID={currentLib.avatarID}
						title={currentLib.name}
						text={(
							<Text>{i18n.t('by')} {currentLib.username} | {currentLib.likes} {i18n.t('likes')}</Text>
						)}
						rightComponent={"userActions"}
						uid={currentLib.user}
					/>
					<View style={{ position: "relative", height: 60, maxHeight: 60 }}>
						<TextInput
							label={displayPrompts[currentPromptIndex]}
							value={currentInput}
							onChangeText={(text) => {
								setCurrentInput(text);
								createPromptContext(text);
							}}
							mode="outlined"
							style={{paddingRight: 40}}
							autoCapitalize="none"
							theme={{
								colors: {
									primary: '#49454F', // For the outline color
								},
							}}
						/>
						{fillAvailable && ( // Render only if autofill is available
							<TouchableOpacity onPress={autofill} style={{ position: "absolute", right: 0, height: 60, width: 60, justifyContent: "center", alignItems: "center" }}>
								<Text style={[globalStyles.touchableText, { fontSize: 16 }]}>{i18n.t('fill')}</Text>
							</TouchableOpacity>
						)}
					</View>
					<Text style={[styles.leftPadding, globalStyles.fontSmall, styles.explanation]}>{LibManager.getPromptExplanation(Object.keys(currentLib.prompts[currentPromptIndex])[0])}</Text>
					{!showPromptContext && (
						<TouchableOpacity style={[{flexDirection: "row", gap: 10, alignItems: "center"}, styles.leftPadding]} onPress={() => {
							createPromptContext(currentInput);
							setShowPromptContext(true);
						}}>
							<MaterialIcons
								name={showPromptContext ? "visibility-off" : "visibility"}
								size={24}
								color="#635f6a"
							/>
							<Text style={[globalStyles.fontSmall, globalStyles.grayText, styles.explanation]}>{i18n.t('tap_to_see_prompt_in_text')}</Text>
						</TouchableOpacity>
					)}
					{showPromptContext && (
						<TouchableOpacity style={[{flexDirection: "row", gap: 10, alignItems: "center"}, styles.leftPadding]} onPress={() => {
							setShowPromptContext(false);
						}}>
							<MaterialIcons
								name={showPromptContext ? "visibility-off" : "visibility"}
								size={24}
								color="#635f6a"
							/>
							<Text
								style={[globalStyles.fontSmall, globalStyles.grayText, styles.explanation]}
								// numberOfLines={1}
								// ellipsizeMode="clip"
							>{promptContext}</Text>
						</TouchableOpacity>
					)}

					<Text style={[styles.leftPadding, globalStyles.fontSmall, styles.explanation]}></Text>
					<Progress.Bar
						progress={progress}
						width={null}
						color="#6294C9"
						unfilledColor="#E4EEF2"
						borderWidth={0}
						borderRadius={0}
					/>
					<Buttons
						buttons={
							[{
								label: i18n.t('back'),
								onPress: () => {
									handleBack();
									setShowPromptContext(false);
								},
							},
							{
								label: i18n.t('next'),
								labelStyle: {color: "white"},
								onPress: () => {
									handleNext();
									setShowPromptContext(false);
								},
								buttonStyle: { backgroundColor: "#6294C9", borderColor: "#6294C9" }
							}]
						}
						labelStyle={{ fontWeight: "600" }}
					/>
				</View>

				<Drawer ref={finishedLibDrawerRef} onStateChange={(isOpen) => {if(!isOpen) {drawerClosed()}}} containerStyle={[globalStyles.standardDrawer, {paddingHorizontal: 6}]}>
					<DrawerHeader
						containerStyle={{paddingHorizontal: 14}}
						center={(
							<View style={{ flex: 1 }}>
								<Text style={{ fontSize: 18 }}>{currentLib.name}</Text>
								<Text style={{ fontSize: 14 }}>{i18n.t('by')} {currentLib.username}</Text>
							</View>
						)}
						onClose={() => finishedLibDrawerRef.current?.closeDrawer()}
					/>
					<DrawerScrollView>
						<View style={[globalStyles.drawerTop, {paddingHorizontal: 20}]}>
							{LibManager.displayInDrawer(finishedLib)}
						</View>
					</DrawerScrollView>
					<DrawerActions
						onShare={onShare}
						onSave={onSave}
						likesArray={currentLib.likesArray}
						//onFavorite={onFavorite}
						//{...(!currentLib.local ? { onFavorite: onFavorite } : {  })}
					/>
				</Drawer>

				<View style={[{ width: "100%", marginTop: 35 /* Some whitespace between card and comment section*/ }]}>
					{!currentLib.official && (<>
						<Text style={globalStyles.title}>{i18n.t('comments')}</Text>

						<CommentSection
							// Username and avatar is what is to be displayed in the "write your comment" box
							username={FirebaseManager.currentUserData?.firestoreData?.username ? FirebaseManager.currentUserData.firestoreData.username : i18n.t('log_in_to_comment')}
							avatarID={FirebaseManager.currentUserData?.firestoreData?.avatarID ? FirebaseManager.currentUserData.firestoreData.avatarID : "no-avatar-48"}
							onCommentChange={handleCommentChange}
							onSubmitComment={submitComment}
							onDeleteComment={deleteComment}
							comments={currentLib.comments ? currentLib.comments : []}
							opUid={currentLib.user}
						/></>)}
				</View>
			</ScrollView>
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
		width: "100%"
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
		// Gap makes this too far away from input, so quick fix
		marginTop: -6,
		flex: 1
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