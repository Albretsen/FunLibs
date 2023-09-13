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
import Dropdown from "../components/Dropdown";
import FileManager from "../scripts/file_manager";

export default function LibsScreen() {
	const navigation = useNavigation();

	const [selectedCategory, setSelectedCategory] = useState("official");
	const [selectedSortBy, setSelectedSortBy] = useState("newest");
	const [selectedDate, setSelectedDate] = useState("allTime");
	const [playReadValue, setPlayReadValue] = React.useState(true);

	const [listObjects, setListObjects] = useState([]);
	const [listItems, setListItems] = useState([]);

	const isFocused = useIsFocused();
    const { setCurrentScreenName } = useContext(ScreenContext);

	const [isLoading, setIsLoading] = useState(false);

	const [lastDocument, setLastDocument] = useState(null);

	const [loading, setLoading] = useState(false);

	const quickload = false;

	async function loadListItems(
		filterOptions = {
			"category": selectedCategory,
			"sortBy": selectedSortBy,
			"dateRange": selectedDate,
			"playable": playReadValue
		},
		lastDocument = undefined
	) {
		setLoading(true);

		let localItems = [];
		let updatedItems_ = [];
		if (
			filterOptions.category === "official" &&
			filterOptions.sortBy === "newest" &&
			filterOptions.dateRange === "allTime" &&
			filterOptions.playable === true
		) {
			localItems = await loadLocalItems();
			try {
				localItems.sort((a, b) => {
					const dateA = convertToDate(a.date);
					const dateB = convertToDate(b.date);

					return dateB.getTime() - dateA.getTime();
				});
			} catch {

			}
		} else {
			if (!lastDocument) {
				//setListItems([]);
			}
		}

		try {
			let dbResult = await FirebaseManager.ReadDataFromDatabase("posts", filterOptions, lastDocument);
			let dbItems = dbResult.data;

			// If both localItems and dbItems are empty, unload the list
			if (localItems.length === 0 && (!dbItems || dbItems.length === 0)) {
				if (!lastDocument) {
					setListItems([]);
				}
				setLastDocument(undefined);
				setIsLoading(false);
				setLoading(false);
				return; // Exit the function early
			}
			
			if (dbItems && dbItems.length > 0) {
				// Update the list with database data
				setListItems(prevListItems => {
					// Create a copy of the previous list items
					const updatedListItems = [...prevListItems];

					// If there are no local items, use dbItems directly
					if (localItems.length === 0) {
						// Create a map to store items by their ID
						const itemsMap = {};

						// Iterate over updatedListItems and store each item in the map
						for (const item of updatedListItems) {
							itemsMap[item.id] = item;
						}

						// Iterate over dbItems and either add or overwrite items in the map
						for (const item of dbItems) {
							itemsMap[item.id] = item;
						}

						// Convert the map back to a list
						const mergedItems = Object.values(itemsMap);

						dbItems = mergedItems;
					}

					// Update the lastDocument state for pagination
					setLastDocument(dbResult.lastDocument);

					dbItems.forEach(dbItem => {
						const index = updatedListItems.findIndex(localItem => localItem.id === dbItem.id);
						if (index !== -1) {
							updatedListItems[index] = dbItem; // Update the item if found
						} else {
							updatedListItems.push(dbItem); // Add the new item from the database if not found in local data
						}
					});
	
					// Ensure the updated list is sorted by newest
					if (filterOptions.sortBy === "likes") {
						updatedListItems.sort((a, b) => {						
							return b.likes - a.likes;
						});
					} else {
						updatedListItems.sort((a, b) => {
							const dateA = convertToDate(a.date);
							const dateB = convertToDate(b.date);
						
							return dateB.getTime() - dateA.getTime();
						});
					}

					mergeLocalLibs(dbItems, filterOptions.selectedSortBy);
					
					updatedItems_ = updatedListItems;
					return updatedListItems;
				});
			}
		} catch (error) {
			console.error("Error fetching data from database:", error);
			// Handle the error as needed, e.g., show a notification to the user
		}
	
		setLoading(false);
		setIsLoading(false);
		if (filterOptions.category === "official") updateOfficialDataInListItems(filterOptions.sortBy);
		else updateDataInListItems(updatedItems_);
	}

	async function updateDataInListItems(items) {
		const listIemIds = items.map(item => item.id);
		
		let lastDoc = null;
		let updatedData = [];
		
		for (let i = 0; i < items.length; i += 10) {
			const response = await FirebaseManager.ReadDataFromDatabase("posts", { docIds: listIemIds.slice(i, i+(10-(items.length-i))) }, lastDoc);
			updatedData = updatedData.concat(response.data);
			lastDoc = response.lastDocument;
		}

		for (let i = 0; i < items.length; i++) {
			const updatedItem = updatedData.find(item => item.id === items[i].id);
			if (updatedItem) {
				listItems[i] = updatedItem;
			}
		}
	}

	// This function converts different date formats to a JavaScript Date object
	const convertToDate = (input) => {
		// If it's a Firestore timestamp (assuming it's in seconds format)
		if (typeof input === 'object') {
			return new Date(input.seconds * 1000);
		}

		// If it's an ISO date string
		if (typeof input === 'string') {
			return new Date(input);
		}

		// If it's already a JavaScript Date object
		if (input instanceof Date) {
			return input;
		}

		// If unknown format, return a default date to avoid error (you can handle this differently if needed)
		return new Date(0); // This is 1970-01-01
	};

	async function updateOfficialDataInListItems(sortBy) {
		let localItems = await loadLocalItems();
		// Ensure the updated list is sorted by newest
		if (sortBy === "likes") {
			localItems.sort((a, b) => {						
				return b.likes - a.likes;
			});
		} else {
			localItems.sort((a, b) => {
				const dateA = convertToDate(a.date);
				const dateB = convertToDate(b.date);
			
				return dateB.getTime() - dateA.getTime();
			});
		}

		// Extract IDs from localItems
		const localItemIds = localItems.map(item => item.id);

		let lastDoc = null;
		let updatedData = [];
		
		for (let i = 0; i < localItems.length; i += 10) {
			const response = await FirebaseManager.ReadDataFromDatabase("posts", { docIds: localItemIds.slice(i, i+(10-(localItems.length-i))) }, lastDoc);
			updatedData = updatedData.concat(response.data);
			lastDoc = response.lastDocument;
		}
	
		// Overwrite any localItems with the database result with the same ID
		for (let i = 0; i < localItems.length; i++) {
			const updatedItem = updatedData.find(item => item.id === localItems[i].id);
			if (updatedItem) {
				localItems[i] = updatedItem;
			}
		}
	
		// Update listItems to use the up-to-date data
		for (let i = 0; i < listItems.length; i++) {
			const updatedItem = updatedData.find(item => item.id === listItems[i].id);
			if (updatedItem) {
				listItems[i] = updatedItem;
			}
		}
		
		setListItems(localItems)
	}

	async function mergeLocalLibs(dbItems, sortBy) {
		// Create a map to store items by their ID
		const itemsMap = {};

		let localItems = await loadLocalItems();
		// Ensure the updated list is sorted by newest
		if (sortBy === "likes") {
			localItems.sort((a, b) => {						
				return b.likes - a.likes;
			});
		} else {
			localItems.sort((a, b) => {
				const dateA = convertToDate(a.date);
				const dateB = convertToDate(b.date);
			
				return dateB.getTime() - dateA.getTime();
			});
		}

		// Iterate over updatedListItems and store each item in the map
		for (const item of localItems) {
			itemsMap[item.id] = item;
		}

		// Iterate over dbItems and either add or overwrite items in the map
		for (const item of dbItems) {
			if (item?.official) {
				itemsMap[item.id] = item;
			}
		}

		// Convert the map back to a list
		const mergedItems = Object.values(itemsMap);

		FileManager._storeData("libs", JSON.stringify(mergedItems));
	}

	async function loadLocalItems() {
		return JSON.parse(await FileManager._retrieveData("libs"));
	}

	useEffect(() => {
		loadListItems({"category":selectedCategory,"sortBy":selectedSortBy,"dateRange":selectedDate,"playable":playReadValue});

		// Add a listener to the Auth state change event
		const authStateListener = (user) => {
			loadListItems({"category":selectedCategory,"sortBy":selectedSortBy,"dateRange":selectedDate,"playable":playReadValue});
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

	const playReadToggle = (newValue) => {
		setPlayReadValue(newValue);
		updateFilterOptions(newValue);
	};

	const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

	const updateFilterOptions = (playableValue = playReadValue, categoryValue = selectedCategory, sortByValue = selectedSortBy, dateValue = selectedDate) => {
		setListItems([]);
		setLastDocument(null);
		let filterOptions = {
			category: categoryValue,
			sortBy: sortByValue,
			dateRange: dateValue,
			playable: playableValue
		};
		console.log("USING: " + JSON.stringify(filterOptions));
		loadListItems(filterOptions);
		setIsBottomSheetOpen(false);
	}

	const { setTab } = useTab();

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

	const [data, setData] = useState([]);

	// Function to sort data by id
	const sortById = (data) => {
		return [...data].sort((a, b) => a.id - b.id);
	};

	// Function to update likes for a specific item
	const updateLikes = (id, newLikes) => {
		const updatedData = data.map(item => {
			if (item.id === id) {
				return { ...item, likes: newLikes };
			}
			return item;
		});

		const sortedData = sortById(updatedData);
		setData(sortedData);
	};

	return (
		<SafeAreaView style={[globalStyles.screenStandard]}>
			<View style={[globalStyles.containerWhitespace, {
				flexDirection: "row",
				justifyContent: "space-between",
				alignItems: "center",
				gap: 10,
				padding: 2,
				height: 40
			}]}>
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
				<FilterToggle
					open={handleOpenBottomSheet}
					close={handleCloseBottomSheet}
					isOpen={isBottomSheetOpen}
				/>
			</View>
			<View style={globalStyles.containerWhitespace}>
				<Dropdown options={[
					{
						name: "Official libs",
						onPress: () => { 
							setSelectedCategory("official");
							updateFilterOptions(playReadValue, "official");
						}
					},
					{
						name: "All libs",
						onPress: () => {
							setSelectedCategory("All");
							updateFilterOptions(playReadValue, "All");
						}
					},
					{
						name: "Favorite libs",
						onPress: () => {
							setSelectedCategory("myFavorites");
							updateFilterOptions(playReadValue, "myFavorites");
						}
					},
					{
						name: "My libs",
						onPress: () => {
							setSelectedCategory("myContent");
							updateFilterOptions(playReadValue, "myContent");
						}
					},
				]}/>
			</View>
			{isLoading ? (
				<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 100 }}>
					<ActivityIndicator animating={true} color="#006D40" size="large" />
				</View>
			) : (<>
					<FlatList
						data={listItems}
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
								username={item.username}
								likes={item.likes}
								avatarID={item.avatarID}
								index={index}
								user={item.user}
								local={item.local}
								likesArray={item.likesArray}
							/>
						)}
						keyExtractor={item => `${item.id}-${item.likes}`}
						refreshing={loading}
						style={[globalStyles.listItemContainer, { height: Dimensions.get("window").height - (74 + 0 + 64 + 60) }]}
						onEndReached={() => loadListItems({
							"category": selectedCategory,
							"sortBy": selectedSortBy,
							"dateRange": selectedDate,
							"playable": playReadValue
						}, lastDocument)} // Call the loadListItems function when the end is reached
						onEndReachedThreshold={0.1} // Trigger when the user has scrolled 90% of the content
					/>
				<BottomSheet
					ref={bottomSheetRef}
					index={-1}
					// Bug causes bottom sheet to reappear on navigation
					// Kind of fixed with hack that sets it to the lowest snap point possible, then removes it after
					// 10ms
					snapPoints={['1%', '25%', '50%', '70%', '90%']}
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
						{/* <Text style={[ globalStyles.bold, {marginVertical: 6, fontSize: 20}]}>Category</Text>
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
									icon: selectedCategory === "myFavorites" ? "done" : null,
									buttonStyle: selectedCategory === "myFavorites" ? {borderColor: "transparent", backgroundColor: "#D1E8D5"} : null,
									onPress: () => { setSelectedCategory("myFavorites"); updateFilterOptions(playReadValue, "myFavorites"); }
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
						<Divider color="#CAC4D0" style={{marginVertical: 10}} /> */}
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
							labelStyle={{fontSize: 14, fontWeight: 500}}
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
							labelStyle={{fontSize: 14, fontWeight: 500}}
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