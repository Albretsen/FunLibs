import React, { useEffect, useState, useContext, useRef } from "react";
import { View, SafeAreaView, Text, TouchableOpacity, BackHandler, FlatList } from "react-native";
import ListItem from "../components/ListItem";
import globalStyles from "../styles/globalStyles";
import LibManager from "../scripts/lib_manager";
import { useNavigation } from "@react-navigation/native";
// ADS
import { useIsFocused } from '@react-navigation/native';
import { ScreenContext } from "../App";
import { ActivityIndicator } from "react-native-paper";
import SegmentedButtons from "../components/SegmentedButtons";
import FirebaseManager from "../scripts/firebase_manager";
import Analytics from "../scripts/analytics";
import { useTab } from "../components/TabContext";
import Dropdown from "../components/Dropdown";
import FileManager from "../scripts/file_manager";
import _ from 'lodash';
import { ToastContext } from "../components/Toast";
import i18n from "../scripts/i18n";
import PreviewToggle from "../components/PreviewToggle";

export default function LibsScreen() {
	const navigation = useNavigation();
	const showToast = useContext(ToastContext);

	// This does not look nice
	const [selectedCategory, setSelectedCategory] = useState("official");
	const selectedCategoryRef = useRef(selectedCategory);
	useEffect(() => {
		selectedCategoryRef.current = selectedCategory;
	}, [selectedCategory]);
	const [selectedSortBy, setSelectedSortBy] = useState("newest");
	const selectedSortByRef = useRef(selectedSortBy);
	useEffect(() => {
		selectedSortByRef.current = selectedSortBy;
	}, [selectedSortBy]);
	const [selectedDate, setSelectedDate] = useState("allTime");
	const selectedDateRef = useRef(selectedDate);
	useEffect(() => {
			selectedDateRef.current = selectedDate;
	}, [selectedDate]);
	const [playReadValue, setPlayReadValue] = useState(true);
	const playReadValueRef = useRef(playReadValue);
	useEffect(() => {
		playReadValueRef.current = playReadValue;
	}, [playReadValue]);

	const currentTokenRef = useRef(null);

	const [listObjects, setListObjects] = useState([]);
	const [listItems, setListItems] = useState([]);

	const isFocused = useIsFocused();
    const { setCurrentScreenName } = useContext(ScreenContext);

	const [isLoading, setIsLoading] = useState(false);

	const [lastDocument, setLastDocument] = useState(null);

	const [loading, setLoading] = useState(false);
	const [loadingCircle, setLoadingCircle] = useState(false);
	const [loadingAdditional, setLoadingAdditional] = useState(false);

	const [endReached, setEndReached] = useState(false);

	const quickload = false;

	useEffect(() => {
		console.log(`endReached changed to: ${endReached}`);
	}, [endReached]);

	async function loadListItems(
		filterOptions = {
			"category": selectedCategory,
			"sortBy": selectedSortBy,
			"dateRange": selectedDate,
			"playable": playReadValue
		},
		lastDocument = undefined
	) {
		console.log("LOADING LIST ITEAMS::::::::");
		if (filterOptions.category) { 
			setSelectedCategory(filterOptions.category);
		}
		const thisCallToken = Math.random().toString();
		currentTokenRef.current = thisCallToken;

		if (currentTokenRef.current !== thisCallToken) return;
		setLoading(true);
		if (lastDocument == undefined) setLoadingCircle(true);
		if (lastDocument != undefined) setLoadingAdditional(true);

		let localItems = [];
		let updatedItems_ = [];
		if (filterOptions.category === "official" && filterOptions.playable === true) {
			console.log("LOADING OFFICAL");
			localItems = LibManager.localLibs.filter(item => item.official === true);
			try {
				localItems.sort((a, b) => {
					const dateA = convertToDate(a.date);
					const dateB = convertToDate(b.date);

					return dateB.getTime() - dateA.getTime();
				});
				setListItems(localItems);
				setLoadingCircle(false);
			} catch (error) {
				setListItems([]);
			}
			setLoading(false);
			setLoadingCircle(false);
			setLoadingAdditional(false);
			return;
		}
		else if (filterOptions.category === "offline") {
			localItems = await FileManager._retrieveData("libs");
			if (currentTokenRef.current !== thisCallToken) return;
			if (localItems) localItems = JSON.parse(localItems);
			try {
				localItems.sort((a, b) => {
					const dateA = convertToDate(a.date);
					const dateB = convertToDate(b.date);

					return dateB.getTime() - dateA.getTime();
				});
				setListItems(localItems);
				setLoadingCircle(false);
			} catch (error){
				setListItems([]);
			}
			setLoading(false);
			setLoadingCircle(false);
			setLoadingAdditional(false);
			return;
		}
		else if (filterOptions.playable === false) {
			localItems = await FileManager._retrieveData("read");
			if (currentTokenRef.current !== thisCallToken) return;
			if (localItems) localItems = JSON.parse(localItems);
			try {
				localItems.sort((a, b) => {
					const dateA = convertToDate(a.date);
					const dateB = convertToDate(b.date);

					return dateB.getTime() - dateA.getTime();
				});
				setListItems(localItems);
				setLoadingCircle(false);
			} catch (error){
				setListItems([]);
			}
			setLoading(false);
			setLoadingCircle(false);
			setLoadingAdditional(false);
			return;
		} else {
			if (!lastDocument) {
				//setListItems([]);
				//setIsLoading(true);
			}
		}

		try {
			let dbResult = await FirebaseManager.ReadDataFromDatabase("posts", filterOptions, lastDocument);
			if (dbResult?.data) {
				if (dbResult.data === "no-internet") {
					// This error sometimes shows when there is internet. Do not display it to the user.
					console.log("Connection issue detected. Sort by 'Offline libs' if the issue persists");
					return;
				}
			}
			if (currentTokenRef.current !== thisCallToken) return;
			let dbItems = dbResult.data;

			if (dbItems.length < 10) setEndReached(true);

			// Fetch the list of blocked users
			const blockedUsers = await FirebaseManager.getAllBlockedUsers();

			// Filter out items from blocked users
			if (blockedUsers) dbItems = dbItems.filter(item => !blockedUsers.includes(item.user));

			// If both localItems and dbItems are empty, unload the list
			if (localItems.length === 0 && (!dbItems || dbItems.length === 0)) {
				if (!lastDocument) {
					if (currentTokenRef.current !== thisCallToken) return;
					setListItems([]);
				}
				setLastDocument(undefined);
				setIsLoading(false);
				setLoading(false);
				setLoadingCircle(false);
				setLoadingAdditional(false);
				setEndReached(true);
				return; // Exit the function early
			}
			
			if (dbItems && dbItems.length > 0) {
				// Update the list with database data
				if (currentTokenRef.current !== thisCallToken) return;
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
					LibManager.libs = updatedListItems;
					return updatedListItems;
				});
			}
		} catch (error) {
			console.error("Error fetching data from database:", error);
			// Handle the error as needed, e.g., show a notification to the user
		}
		
		if (currentTokenRef.current !== thisCallToken) return;
		setLoading(false);
		setIsLoading(false);
		setLoadingCircle(false);
		setLoadingAdditional(false);
		//if (filterOptions.category === "official") updateOfficialDataInListItems(filterOptions.sortBy, thisCallToken);
		//else updateDataInListItems(updatedItems_);
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
		LibManager.libs = listItems;
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

	async function updateOfficialDataInListItems(sortBy, thisCallToken) {
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
		
		if (currentTokenRef.current !== thisCallToken) return;
		setListItems(localItems);
		LibManager.libs = localItems;
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
		let result = await FileManager._retrieveData("libs");
		if (result) return JSON.parse(result);
		return []
	}

	useEffect(() => {
		loadListItems({"category":selectedCategory,"sortBy":selectedSortBy,"dateRange":selectedDate,"playable":playReadValue});

		// Add a listener to the Auth state change event
		const authStateListener = (filterOptions) => {
			if (filterOptions) {
				if (filterOptions.category) {
					selectedCategoryRef.current = filterOptions.category;
				}
				if (filterOptions.sortBy) {
					selectedSortByRef.current = filterOptions.sortBy;
				}
				if (filterOptions.dateRange) {
					selectedDateRef.current = filterOptions.dateRange;
				}
				if (filterOptions.playable) {
					playReadValueRef.current = filterOptions.playable;
				}
			} else {
				setListItems([]);
			}
			loadListItems({"category":selectedCategoryRef.current,"sortBy":selectedSortByRef.current,"dateRange":selectedDateRef.current,"playable":playReadValueRef.current});
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

	const playReadToggle = (newValue) => {
		console.log(newValue)
		setPlayReadValue(newValue);
		updateFilterOptions(newValue);
	};


	const updateFilterOptions = (playableValue = playReadValue, categoryValue = selectedCategory, sortByValue = selectedSortBy, dateValue = selectedDate) => {
		setEndReached(false);
		setListItems([]);
		setLastDocument(null);
		let filterOptions = {
			category: categoryValue,
			sortBy: sortByValue,
			dateRange: dateValue,
			playable: playableValue
		};
		loadListItems(filterOptions);
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

	function renderFooter() {
		// Define the style based on loadingAdditional's value
		let activityIndicatorStyle = loadingAdditional ? {} : { opacity: 0 };

		return (
			<View>
				<ActivityIndicator
					animating={true}
					color="#006D40"
					size="large"
					style={activityIndicatorStyle}
				/>
			</View>
		);
	}

	const [showPreview, setShowPreview] = useState(true);

    // Get the current state of showPreview stored locally
    useEffect(() => {
        async function fetchData() {
            const storedPreview = await FileManager._retrieveData("previewToggle");
            setShowPreview(storedPreview === 'true');
        }
        fetchData();
    }, []);

	return (
		<SafeAreaView style={[globalStyles.screenStandard, globalStyles.standardHeightBottomNav, {flex: 1}]}>
			<View style={[globalStyles.containerWhitespacePadding]}>
				<View style={[{
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
					gap: 10,
					// padding: 2,
					// height: 40,
				}]}>
					{/*<SegmentedButtons
						value={playReadValue}
						onValueChange={playReadToggle}
						buttons={[
							{
								label: i18n.t('newest'),
								onPress: () => {
									setSelectedSortBy("newest");
									updateFilterOptions(playReadValue, undefined, "newest");
								},
								active: true,
							},
							{
								label: i18n.t('top'),
								onPress: () => {
									setSelectedSortBy("likes");
									updateFilterOptions(playReadValue, undefined, "likes");
								},
							},
							{
								label: i18n.t('trending'),
								onPress: () => {
									setSelectedSortBy("trending");
									updateFilterOptions(playReadValue, undefined, "trending");
								},
							},
						]}
					/>*/}
				</View>
				<View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
					<Dropdown selected={selectedCategory} options={[
						{
							name: i18n.t('official_templates'),
							onPress: () => { 
								setSelectedCategory("official");
								updateFilterOptions(playReadValue, "official");
							}
						},
						{
							name: i18n.t('favorite_templates'),
							onPress: () => {
								setSelectedCategory("myFavorites");
								updateFilterOptions(playReadValue, "myFavorites");
							}
						},
						{
							name: "Romance pack",
							onPress: () => {
								//setSelectedCategory("myFavorites");
								//updateFilterOptions(playReadValue, "myFavorites");
							}
						},
						{
							name: "Videogame pack",
							onPress: () => {
								//setSelectedCategory("myFavorites");
								//updateFilterOptions(playReadValue, "myFavorites");
							}
						},
					]}/>

					<PreviewToggle onStateChange={(state) => {setShowPreview(state); console.log(state)}} />
				</View>
			</View>
			{(isLoading && !endReached)? (
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
							playable={item.playable}
							item={item}
							color={FirebaseManager.getRandomColor()}
							plays={item.plays}
							comments={item.comments}
							showPreview={showPreview}
							official={item.official}
						/>
					)}
					keyExtractor={item => `${item.id}-${item.likes}`}
					refreshing={false} // Use the loading state to indicate whether the list is being refreshed
					onRefresh={() => { // Function that will be called when the user pulls to refresh
						if (listItems.length > 0) updateFilterOptions();
					}}
					style={[globalStyles.listItemContainer]}
					onEndReached={_.debounce(() => {
							if (!loading && listItems.length > 0 && !endReached) {
								loadListItems({
									"category": selectedCategory,
									"sortBy": selectedSortBy,
									"dateRange": selectedDate,
									"playable": playReadValue
								}, lastDocument);
							}
						}, 200)} // Call the loadListItems function when the end is reached
					onEndReachedThreshold={0.1} // Trigger when the user has scrolled 90% of the content
					ListEmptyComponent={<Text style={{textAlign: 'center', marginTop: 20}}>{loading ? "" : i18n.t('no_results')}</Text>}
					ListFooterComponent={renderFooter}
				/>
				{(loadingCircle) && (
					<View style={[globalStyles.loadingOverlay, {backgroundColor: "transparent"}]} pointerEvents="none">
						<ActivityIndicator size="large" color="#006D40" />
					</View>
				)}
			</>)}
	  	</SafeAreaView>
	);
}