import { ScrollView, StyleSheet, View, SafeAreaView, Text, BackHandler, Dimensions, FlatList } from "react-native";
import React, { useEffect, useState, useCallback, useContext, useRef } from "react";
import ListItem from "../components/ListItem";
import globalStyles from "../styles/globalStyles";
import LibManager from "../scripts/lib_manager";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
// ADS
import AdManager from "../scripts/ad_manager";
import BannerAdComponent from "../components/BannerAd";
import { ToastContext } from "../components/Toast";
import { useIsFocused } from '@react-navigation/native';
import { ScreenContext } from "../App";
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import Buttons from "../components/Buttons";
import CustomBackground from "../components/CustomBackground";
import { Divider } from '@rneui/themed';
import FilterToggle from "../components/FilterToggle";
import { SegmentedButtons, ActivityIndicator } from "react-native-paper";
import FirebaseManager from "../scripts/firebase_manager";
import Analytics from "../scripts/analytics";
import { useTab } from "../components/TabContext";

export default function LibsScreen() {
	const navigation = useNavigation();

	const [listObjects, setListObjects] = useState([]);

	const isFocused = useIsFocused();
    const { setCurrentScreenName } = useContext(ScreenContext);

	const [isLoading, setIsLoading] = useState(false);

	const [lastDocument, setLastDocument] = useState(null);

	const quickload = false;

	async function loadListObjectsFromDatabase(filterOptions = {"category":selectedCategory,"sortBy":selectedSortBy,"dateRange":selectedDate,"playable":playReadValue}, lastDocument = undefined) {
		if (lastDocument === null) return;
		if (lastDocument === undefined) setIsLoading(true);
		let temp_listObjects = [];
		if (lastDocument) {
			temp_listObjects = await FirebaseManager.ReadDataFromDatabase("posts", filterOptions, lastDocument);
		} else {
			temp_listObjects = await FirebaseManager.ReadDataFromDatabase("posts", filterOptions);
		}
		if (!temp_listObjects.lastDocument) {
			setLastDocument(null);
		} else {
			setLastDocument(temp_listObjects.lastDocument);
		}
		temp_listObjects = temp_listObjects.data;
		if (temp_listObjects.length < 1) {
			Analytics.log("No documents found");
			if (!lastDocument) setListObjects([]);
			setIsLoading(false);
			return;
		}
		let users = [];
		if (temp_listObjects) {
			temp_listObjects.forEach(object => {
				if (!users.includes(object.user)) {
					if (object.user) {
						users.push(object.user);
					} else {
						users.push(null);
					}
				}
			});
		} else {
			temp_listObjects = [];
		}
		for (let i = 0; i < temp_listObjects.length; i++) {
			// Find the user from the users array with the same ID as the current object.user field.
			if (users[i] === null) { // This is if the lib is stored locally
				temp_listObjects[i].username = "You"; // This adds the user details to the object
				temp_listObjects[i].avatarID = 0;
			} else {
				temp_listObjects[i].username = ""; // This adds the user details to the object
				temp_listObjects[i].avatarID = 0;
			}
		}

		if (quickload) {
			let updatedListObjects;
			if (!lastDocument) {
				setListObjects(prevListObjects => temp_listObjects);
			} else {
				setListObjects(prevListObjects => prevListObjects.concat(temp_listObjects));
			}
			setListObjects(updatedListObjects);
			setIsLoading(false);
		}

		users = await FirebaseManager.ReadDataFromDatabase("users", { docIds: users });
		users = users.data;

		for (let i = 0; i < temp_listObjects.length; i++) {
			// Find the user from the users array with the same ID as the current object.user field.
			let matchingUser = users.find(user => user.id === temp_listObjects[i].user);
			if (matchingUser) {
				temp_listObjects[i].username = matchingUser.username; // This adds the user details to the object
				temp_listObjects[i].avatarID = matchingUser.avatarID;
			}
		}

		LibManager.libs = temp_listObjects;
		if (!lastDocument) {
			setListObjects(prevListObjects => temp_listObjects);
		} else {
			setListObjects(prevListObjects => prevListObjects.concat(temp_listObjects));
		}
		setIsLoading(false);
	}

	useEffect(() => {
		// Add a listener to the Auth state change event
		const authStateListener = (user) => {
			loadListObjectsFromDatabase();
		};
		FirebaseManager.addAuthStateListener(authStateListener);

		// Clean up the listener when the component is unmounted
		return () => {
			const index = FirebaseManager.authStateListeners.indexOf(authStateListener);
			if (index > -1) {
				FirebaseManager.authStateListeners.splice(index, 1);
			}
		};
	}, []);

	useEffect(() => {
		if (isFocused) {
			setCurrentScreenName('LibsScreen');
			const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
			return () => backHandler.remove()
		}
	}, [isFocused]);

	useFocusEffect(
		useCallback(() => {
			setTimeout(() => {
				bottomSheetRef?.current?.close();
			}, 10);

			return () => {
			};
		}, [])
	);

	const bottomSheetRef = useRef(null);

	const handleOpenBottomSheet = () => {
		bottomSheetRef.current?.snapToIndex(3);  // Or any other index, based on snapPoints array
		setIsBottomSheetOpen(true);
	};

	const handleCloseBottomSheet = () => {
		bottomSheetRef.current?.close();
		setIsBottomSheetOpen(false)
	};

	const handleBottomSheetChange = useCallback((index) => {
		console.log('handleSheetChanges', index);
		if (index <= 0) { // Would be -1, but needs to account for first snap point being 1% due to hack fix
			setIsBottomSheetOpen(false);
		} else {
			setIsBottomSheetOpen(true);
		}
	}, []);

	const [playReadValue, setPlayReadValue] = React.useState(true);

	const playReadToggle = (newValue) => {
		setPlayReadValue(newValue);
		updateFilterOptions(newValue);
	};

	const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

	const [selectedCategory, setSelectedCategory] = useState("official");
	const [selectedSortBy, setSelectedSortBy] = useState("newest");
	const [selectedDate, setSelectedDate] = useState("allTime");

	const updateFilterOptions = (playableValue = playReadValue, categoryValue = selectedCategory, sortByValue = selectedSortBy, dateValue = selectedDate) => {
		let filterOptions = {
			category: categoryValue,
			sortBy: sortByValue,
			dateRange: dateValue,
			playable: playableValue
		};
		loadListObjectsFromDatabase(filterOptions);
		setIsBottomSheetOpen(false);
	}

	const { setTab } = useTab();

	const favorite = () => {

	}

	const [scrollY, setScrollY] = useState(0);

	const [hasReachedBottom, setHasReachedBottom] = useState(false);

	const handleScroll = (event) => {
		let paddingToBottom = 10;
		let isCloseToBottom = event.nativeEvent.layoutMeasurement.height + event.nativeEvent.contentOffset.y >= event.nativeEvent.contentSize.height - paddingToBottom;

		if (isCloseToBottom && !hasReachedBottom) {
			setHasReachedBottom(true);
			loadListObjectsFromDatabase({ "category": selectedCategory, "sortBy": selectedSortBy, "dateRange": selectedDate, "playable": playReadValue }, lastDocument);
		} else if (!isCloseToBottom && hasReachedBottom) {
			setHasReachedBottom(false);
		}
	};

	return (
		<SafeAreaView style={[globalStyles.screenStandard]}>
			<View style={[{ flexDirection: "row", justifyContent: "space-around", alignItems: "center", gap: 10, width: "100%", paddingBottom: 20 }]}>
				<SegmentedButtons
					value={playReadValue}
					onValueChange={playReadToggle}
					style={{ width: 190 }}
					density="small"
					theme={{
						colors: {
							primary: '#49454F',
							outline: "#79747E",
							secondaryContainer: "#D1E8D5"
						},
					}}
					buttons={[
						{
							label: "Play",
							value: true,
							showSelectedCheck: true

						},
						{
							label: "Read",
							value: false,
							showSelectedCheck: true,
						}
					]}
				/>
				<FilterToggle open={handleOpenBottomSheet} close={handleCloseBottomSheet} isOpen={isBottomSheetOpen} />
			</View>
			{isLoading ? (
				<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 100 }}>
					<ActivityIndicator animating={true} color="#006D40" size="large" />
				</View>
			) : (<>
					<FlatList
						data={listObjects}
						renderItem={({ item, index }) => (
							<ListItem
								name={item.name}
								description={item.display_with_prompts}
								promptAmount={item.prompts.length}
								prompts={item.prompts}
								text={item.text}
								id={item.id}
								type="libs"
								key={item.id}
								length={item.percent}
								icon="favorite"
								favorite={favorite}
								username={item.username}
								likes={item.likes}
								avatarID={item.avatarID}
								index={index}
								user={item.user}
								local={item.local}
							/>
						)}
						keyExtractor={item => item.id}
						onEndReached={() => loadListObjectsFromDatabase({ "category": selectedCategory, "sortBy": selectedSortBy, "dateRange": selectedDate, "playable": playReadValue }, lastDocument)}
						onEndReachedThreshold={0.1}
						style={[globalStyles.listItemContainer, { height: Dimensions.get("window").height - (74 + 0 + 64 + 60) }]}
					/>
				<BottomSheet
					ref={bottomSheetRef}
					index={-1}
					// Bug causes bottom sheet to reappear on navigation
					// Kind of fixed with hack that sets it to the lowest snap point possible, then removes it after
					// 10ms
					snapPoints={['1%', '25%', '50%', '80%', '100%']}
					enablePanDownToClose={true}
					style={[{width: (Dimensions.get("window").width), paddingHorizontal: 20}]} // Required to work with the bottom navigation
					backgroundComponent={CustomBackground}
					onChange={handleBottomSheetChange}
					onAnimate={(fromIndex, toIndex) => {
						if (toIndex === -1) {
						console.log('The bottom sheet is hidden');
						} else {
						console.log('The bottom sheet is shown');
						}
					}}
				>
					{/* TEST IF THIS WORKS IN EMULATOR, DOES NOT WORK ON WEB */}
					{/* <BottomSheetScrollView> */}
					<View>
						<Text style={[ globalStyles.bold, {marginVertical: 6, fontSize: 20}]}>Category</Text>
						<Buttons 
							buttons={[
								{
									label: "Official",
									icon: selectedCategory === "official" ? "done" : null,
									buttonStyle: selectedCategory === "official" ? {borderColor: "transparent", backgroundColor: "#D1E8D5"} : null,
									onPress: () => { setSelectedCategory("official"); updateFilterOptions(playReadValue, "official"); }
								},
								{
									label: "All",
									icon: selectedCategory === "All" ? "done" : null,
									buttonStyle: selectedCategory === "All" ? {borderColor: "transparent", backgroundColor: "#D1E8D5"} : null,
									onPress: () => { setSelectedCategory("All"); updateFilterOptions(playReadValue, "All"); }
								},
								{
									label: "My favorites",
									icon: selectedCategory === "My favorites" ? "done" : null,
									buttonStyle: selectedCategory === "My favorites" ? {borderColor: "transparent", backgroundColor: "#D1E8D5"} : null,
									onPress: () => { setSelectedCategory("My favorites"); updateFilterOptions(playReadValue, "My favorites"); }
								},
								{
									label: "My content",
									icon: selectedCategory === "myContent" ? "done" : null,
									buttonStyle: selectedCategory === "myContent" ? {borderColor: "transparent", backgroundColor: "#D1E8D5"} : null,
									onPress: () => { setSelectedCategory("myContent"); updateFilterOptions(playReadValue, "myContent"); }
								},

							]}
							buttonStyle={{borderRadius: 10, borderColor: "#454247", backgroundColor: "#F0F1EC", minWidth: 50, height: 40}}
							containerStyle={{justifyContent: "flex-start", gap: 20}}
							labelStyle={{fontSize: 17, fontWeight: 500}}
						/>
						<Divider color="#CAC4D0" style={{marginVertical: 10}} />
						<Text style={[ globalStyles.bold, {marginVertical: 6, fontSize: 20}]}>Sort by</Text>
						<Buttons 
							buttons={[
								{
									label: "Newest",
									icon: selectedSortBy === "newest" ? "done" : null,
									buttonStyle: selectedSortBy === "newest" ? {borderColor: "transparent", backgroundColor: "#D1E8D5"} : null,
									onPress: () => { setSelectedSortBy("newest"); updateFilterOptions(playReadValue, undefined, "newest"); }
								},
								{
									label: "Top",
									icon: selectedSortBy === "likes" ? "done" : null,
									buttonStyle: selectedSortBy === "likes" ? {borderColor: "transparent", backgroundColor: "#D1E8D5"} : null,
									onPress: () => { setSelectedSortBy("likes"); updateFilterOptions(playReadValue, undefined, "likes"); }
								} //,
								// {
								// 	label: "Trending",
								// 	icon: selectedSortBy === "trending" ? "done" : null,
								// 	buttonStyle: selectedSortBy === "trending" ? {borderColor: "transparent", backgroundColor: "#D1E8D5"} : null,
								// 	onPress: () => { setSelectedSortBy("trending"); updateFilterOptions(playReadValue, undefined, "trending"); }
								// }
							]}
							buttonStyle={{borderRadius: 10, borderColor: "#454247", backgroundColor: "#F0F1EC", minWidth: 50, height: 40}}
							containerStyle={{justifyContent: "flex-start", gap: 20}}
							labelStyle={{fontSize: 17, fontWeight: 500}}
						/>
						<Divider color="#CAC4D0" style={{marginVertical: 10}}/>
						<Text style={[ globalStyles.bold, {marginVertical: 6, fontSize: 20}]}>Date</Text>
						<Buttons 
							buttons={[
								{
									label: "All time",
									icon: selectedDate === "allTime" ? "done" : null,
									buttonStyle: selectedDate === "allTime" ? {borderColor: "transparent", backgroundColor: "#D1E8D5"} : null,
									onPress: () => { setSelectedDate("allTime"); updateFilterOptions(playReadValue, undefined, undefined, "allTime"); }
								},
								{
									label: "Today",
									icon: selectedDate === "today" ? "done" : null,
									buttonStyle: selectedDate === "today" ? {borderColor: "transparent", backgroundColor: "#D1E8D5"} : null,
									onPress: () => { setSelectedDate("today"); updateFilterOptions(playReadValue, undefined, undefined, "today"); }
								},
								{
									label: "This week",
									icon: selectedDate === "thisWeek" ? "done" : null,
									buttonStyle: selectedDate === "thisWeek" ? {borderColor: "transparent", backgroundColor: "#D1E8D5"} : null,
									onPress: () => { setSelectedDate("thisWeek"); updateFilterOptions(playReadValue, undefined, undefined, "thisWeek"); }
								},
								{
									label: "This month",
									icon: selectedDate === "thisMonth" ? "done" : null,
									buttonStyle: selectedDate === "thisMonth" ? {borderColor: "transparent", backgroundColor: "#D1E8D5"} : null,
									onPress: () => { setSelectedDate("thisMonth"); updateFilterOptions(playReadValue, undefined, undefined, "thisMonth"); }
								},
								{
									label: "This year",
									icon: selectedDate === "thisYear" ? "done" : null,
									buttonStyle: selectedDate === "thisYear" ? {borderColor: "transparent", backgroundColor: "#D1E8D5"} : null,
									onPress: () => { setSelectedDate("thisYear"); updateFilterOptions(playReadValue, undefined, undefined, "thisYear"); }
								},
							]}
							buttonStyle={{borderRadius: 10, borderColor: "#454247", backgroundColor: "#F0F1EC", minWidth: 50, height: 40}}
							containerStyle={{justifyContent: "flex-start", gap: 20}}
							labelStyle={{fontSize: 17, fontWeight: 500}}
						/>
						<Divider color="#CAC4D0" style={{marginVertical: 10}}/>
					</View>
				</BottomSheet>
			</>)}
	  	</SafeAreaView>
	);
}
  
const styles = StyleSheet.create({

})