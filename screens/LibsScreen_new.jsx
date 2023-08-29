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

	async function loadListObjectsFromDatabase(playReadValue_) {
		let filterOptions = {
			playable: playReadValue_
		}

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
		console.log(temp_listObjects);
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
		loadListObjectsFromDatabase(newValue);
	};

	const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  
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
							icon: "done",
							buttonStyle: {borderColor: "transparent", backgroundColor: "#D1E8D5"}
						},
						{
							label: "All"
						},
						{
							label: "My favorites"
						},
						{
							label: "My content"
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
							icon: "done",
							buttonStyle: {borderColor: "transparent", backgroundColor: "#D1E8D5"}
						},
						{
							label: "Trending"
						},
						{
							label: "Newest"
						},
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
							icon: "done",
							buttonStyle: {borderColor: "transparent", backgroundColor: "#D1E8D5"}
						},
						{
							label: "Today"
						},
						{
							label: "This week"
						},
						{
							label: "This month"
						},
						{
							label: "This year"
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