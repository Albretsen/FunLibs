import React, { useEffect, useState, useContext, useRef } from "react";
import { Platform, View } from "react-native";
import globalStyles from "../styles/globalStyles";
import { useNavigation } from "@react-navigation/native";
import { useIsFocused } from '@react-navigation/native';
import { ScreenContext } from "../App";
import FirebaseManager from "../scripts/firebase_manager";
import { useTab } from "../components/TabContext";
import Dropdown from "../components/Dropdown";
import FileManager from "../scripts/file_manager";
import _ from 'lodash';
import i18n from "../scripts/i18n";
import { PreviewToggle, PreviewContext } from "../components/PreviewToggle";
import ListManager from "../components/ListManager";
import { PackBanner } from "../components/PackBanner";

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

	const { setTab } = useTab();

	const { showPreview, setShowPreview } = useContext(PreviewContext);

    // Get the current state of showPreview stored locally
    useEffect(() => {
        async function fetchData() {
            const storedPreview = await FileManager._retrieveData("previewToggle");
            setShowPreview(storedPreview === 'true');
        }
        fetchData();
    }, []);

	return (
		<View style={[globalStyles.screenStandard, globalStyles.standardHeightBottomNav, {flex: 1}]}>
			<View style={[globalStyles.containerWhitespacePadding]}>
				<View style={[{
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
					gap: 10,
				}]}>
				</View>
				<PackBanner />
				<View style={[
					{flexDirection: "row", alignItems: "center"},
					{justifyContent: Platform.OS !== "ios" ? "space-between" : "flex-end"}
				]}>
					{Platform.OS !== "ios" ? <Dropdown selected={selectedCategory} options={[
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
					]}/> : <></>}

					<PreviewToggle />
				</View>
			</View>
			<ListManager official={true} showPreview={showPreview} filterOptions={{
				"category": selectedCategory,
				"dateRange": "allTime",
				"playable": true
			}}></ListManager>
	  	</View>
	);
}