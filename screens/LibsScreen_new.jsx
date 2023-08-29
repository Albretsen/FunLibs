import { ScrollView, StyleSheet, View, SafeAreaView, Text, BackHandler, Dimensions, TouchableOpacity } from "react-native";
import React, { useEffect, useState, useCallback, useContext, useRef } from "react";
import ListItem from "../components/ListItem";
import globalStyles from "../styles/globalStyles";
import LibManager from "../scripts/lib_manager";
import { useFocusEffect } from "@react-navigation/native";
// ADS
import AdManager from "../scripts/ad_manager";
import BannerAdComponent from "../components/BannerAd";
import { useIsFocused } from '@react-navigation/native';
import { ScreenContext } from "../App";
import Dropdown from "../components/Dropdown";
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import Buttons from "../components/Buttons";
import CustomBackground from "../components/CustomBackground";
import { Divider } from '@rneui/themed';
import FilterToggle from "../components/FilterToggle";
import { SegmentedButtons } from "react-native-paper";
import FirebaseManager from "../scripts/firebase_manager";
import { ScrollView as GestureScrollView } from "react-native-gesture-handler";

export default function LibsScreen() {
	const [listObjects, setListObjects] = useState([]);

	const isFocused = useIsFocused();
    const { setCurrentScreenName } = useContext(ScreenContext);

	async function loadListObjectsFromDatabase(filterOptions = {}) {
		let temp_listObjects = await FirebaseManager.ReadDataFromDatabase("posts", filterOptions);
		let users = [];
		temp_listObjects.forEach(object => {
			if (!users.includes(object.user)) {
				users.push(object.user);
			}
		});
		users = await FirebaseManager.ReadDataFromDatabase("users", { docIds: users });
		
		for (let i = 0; i < temp_listObjects.length; i++) {
			// Find the user from the users array with the same ID as the current object.user field.
			let matchingUser = users.find(user => user.id === temp_listObjects[i].user);
			if (matchingUser) {
				temp_listObjects[i].username = matchingUser.username; // This adds the user details to the object
				temp_listObjects[i].avatarID = matchingUser.avatarID;
			}
		}

		LibManager.libs = temp_listObjects;
		setListObjects(temp_listObjects);	
	}

	useEffect(() => {
        loadListObjectsFromDatabase();
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
		if(index <= 0) { // Would be -1, but needs to account for first snap point being 1% due to hack fix
			setIsBottomSheetOpen(false);
		} else {
			setIsBottomSheetOpen(true);
		}
	  }, []);

    const [playReadValue, setPlayReadValue] = React.useState(true);

	const playReadToggle = (newValue) => {
		setPlayReadValue(newValue);
		updateFilterOptions();
	};

	const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

	const [selectedCategory, setSelectedCategory] = useState("Official");
	const [selectedSortBy, setSelectedSortBy] = useState("likes");
	const [selectedDate, setSelectedDate] = useState("allTime");

	const updateFilterOptions = () => {
		let filterOptions = {
			official: selectedCategory === "Official",
			sortBy: selectedSortBy,
			dateRange: selectedDate,
			playable: playReadValue
		};
		loadListObjectsFromDatabase(filterOptions);
	}
  
	return (
	  <SafeAreaView style={[globalStyles.screenStandard]}>
        <View style={[{flexDirection: "row", justifyContent: "space-around", alignItems: "center", gap: 10, width: "100%", paddingBottom: 20}]}>
            <SegmentedButtons
                value={playReadValue}
                onValueChange={playReadToggle}
                style={{width: 190}}
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
            <FilterToggle open={handleOpenBottomSheet} close={handleCloseBottomSheet} isOpen={isBottomSheetOpen}/>
        </View>
		<ScrollView style={[globalStyles.listItemContainer, {height: Dimensions.get("window").height - (74 + 0 + 64 + 60)}]}>
			{listObjects.map((item) => (
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
					iconPress={null}
					username={item.username}
					likes={item.likes}
					avatarID={item.avatarID}>
				</ListItem>
			))}
		</ScrollView>
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
							icon: selectedCategory === "Official" ? "done" : null,
							buttonStyle: selectedCategory === "Official" ? {borderColor: "transparent", backgroundColor: "#D1E8D5"} : null,
							onPress: () => { setSelectedCategory("Official"); updateFilterOptions(); }
						},
						{
							label: "All",
							icon: selectedCategory === "All" ? "done" : null,
							buttonStyle: selectedCategory === "All" ? {borderColor: "transparent", backgroundColor: "#D1E8D5"} : null,
							onPress: () => { setSelectedCategory("All"); updateFilterOptions(); }
						},
						{
							label: "My favorites",
							icon: selectedCategory === "My favorites" ? "done" : null,
							buttonStyle: selectedCategory === "My favorites" ? {borderColor: "transparent", backgroundColor: "#D1E8D5"} : null,
							onPress: () => { setSelectedCategory("My favorites"); updateFilterOptions(); }
						},
						{
							label: "My content",
							icon: selectedCategory === "My content" ? "done" : null,
							buttonStyle: selectedCategory === "My content" ? {borderColor: "transparent", backgroundColor: "#D1E8D5"} : null,
							onPress: () => { setSelectedCategory("My content"); updateFilterOptions(); }
						},

					]}
					buttonStyle={{borderRadius: 10, borderColor: "#454247", backgroundColor: "#F0F1EC", minWidth: 50, height: 40}}
					containerStyle={{justifyContent: "flex-start", gap: 20}}
					labelStyle={{fontSize: 17, fontWeight: 500}}
				/>
				<Divider color="#CAC4D0" style={{marginVertical: 10}}/>
				<Text style={[ globalStyles.bold, {marginVertical: 6, fontSize: 20}]}>Sort by</Text>
				<Buttons 
					buttons={[
						{
							label: "Top",
							icon: selectedSortBy === "likes" ? "done" : null,
							buttonStyle: selectedSortBy === "likes" ? {borderColor: "transparent", backgroundColor: "#D1E8D5"} : null,
							onPress: () => { setSelectedSortBy("likes"); updateFilterOptions(); }
						},
						{
							label: "Trending",
							icon: selectedSortBy === "trending" ? "done" : null,
							buttonStyle: selectedSortBy === "trending" ? {borderColor: "transparent", backgroundColor: "#D1E8D5"} : null,
							onPress: () => { setSelectedSortBy("trending"); updateFilterOptions(); }
						},
						{
							label: "Newest",
							icon: selectedSortBy === "newest" ? "done" : null,
							buttonStyle: selectedSortBy === "newest" ? {borderColor: "transparent", backgroundColor: "#D1E8D5"} : null,
							onPress: () => { setSelectedSortBy("newest"); updateFilterOptions(); }
						}
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
							onPress: () => { setSelectedDate("allTime"); updateFilterOptions(); }
						},
						{
							label: "Today",
							icon: selectedDate === "today" ? "done" : null,
							buttonStyle: selectedDate === "today" ? {borderColor: "transparent", backgroundColor: "#D1E8D5"} : null,
							onPress: () => { setSelectedDate("today"); updateFilterOptions(); }
						},
						{
							label: "This week",
							icon: selectedDate === "thisWeek" ? "done" : null,
							buttonStyle: selectedDate === "thisWeek" ? {borderColor: "transparent", backgroundColor: "#D1E8D5"} : null,
							onPress: () => { setSelectedDate("thisWeek"); updateFilterOptions(); }
						},
						{
							label: "This month",
							icon: selectedDate === "thisMonth" ? "done" : null,
							buttonStyle: selectedDate === "thisMonth" ? {borderColor: "transparent", backgroundColor: "#D1E8D5"} : null,
							onPress: () => { setSelectedDate("thisMonth"); updateFilterOptions(); }
						},
						{
							label: "This year",
							icon: selectedDate === "thisYear" ? "done" : null,
							buttonStyle: selectedDate === "thisYear" ? {borderColor: "transparent", backgroundColor: "#D1E8D5"} : null,
							onPress: () => { setSelectedDate("thisYear"); updateFilterOptions(); }
						},
					]}
					buttonStyle={{borderRadius: 10, borderColor: "#454247", backgroundColor: "#F0F1EC", minWidth: 50, height: 40}}
					containerStyle={{justifyContent: "flex-start", gap: 20}}
					labelStyle={{fontSize: 17, fontWeight: 500}}
				/>
				<Divider color="#CAC4D0" style={{marginVertical: 10}}/>
			</View>
			{/* </BottomSheetScrollView> */}
      	</BottomSheet>
	  </SafeAreaView>
	);
}
  
const styles = StyleSheet.create({

})