import React, { useEffect, useState, useContext, useRef } from "react";
import { View, SafeAreaView, BackHandler } from "react-native";
import globalStyles from "../styles/globalStyles";
import { useNavigation } from "@react-navigation/native";
import { useIsFocused } from '@react-navigation/native';
import { ScreenContext } from "../App";
import { ActivityIndicator } from "react-native-paper";
import FirebaseManager from "../scripts/firebase_manager";
import { useTab } from "../components/TabContext";
import Dropdown from "../components/Dropdown";
import FileManager from "../scripts/file_manager";
import _ from 'lodash';
import i18n from "../scripts/i18n";
import PreviewToggle from "../components/PreviewToggle";
import ListManager from "../components/ListManager";

export default function LibsScreen() {
	const navigation = useNavigation();

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

	async function loadLocalItems() {
		let result = await FileManager._retrieveData("libs");
		if (result) return JSON.parse(result);
		return []
	}

	useEffect(() => {
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

	const playReadToggle = (newValue) => {
		setPlayReadValue(newValue);
		updateFilterOptions(newValue);
	};


	const { setTab } = useTab();

	const [scrollY, setScrollY] = useState(0);

	const [hasReachedBottom, setHasReachedBottom] = useState(false);

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
				}]}>
				</View>
				<View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
					<Dropdown selected={selectedCategory} options={[
						{
							name: i18n.t('official_templates'),
							onPress: () => { 
								setSelectedCategory("official");
							}
						},
						{
							name: i18n.t('romance_pack'),
							onPress: () => {
								navigation.navigate("Pack", {packName: "romance"});
							},
						},
						{
							name: i18n.t('historical_events_pack'),
							onPress: () => {
								navigation.navigate("Pack", {packName: "historic"});
							},
						},
						{
							name: i18n.t('christmas_pack'),
							onPress: () => {
								navigation.navigate("Pack", {packName: "christmas"});
							},
						},
					]}/>

					<PreviewToggle onStateChange={(state) => {setShowPreview(state); console.log(state)}} />
				</View>
			</View>
			<ListManager official={true} showPreview={showPreview} filterOptions={{
				"category": selectedCategory,
				"dateRange": "allTime",
				"playable": true
			}}></ListManager>
	  	</SafeAreaView>
	);
}