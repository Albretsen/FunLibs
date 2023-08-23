import { ScrollView, StyleSheet, View, SafeAreaView, Text, BackHandler, Dimensions, TouchableOpacity } from "react-native";
import React, { useEffect, useState, useCallback, useContext, useRef } from "react";
import ListItem from "../components/ListItem";
import globalStyles from "../styles/globalStyles";
import { StatusBar } from "expo-status-bar";
import LibManager from "../scripts/lib_manager";
import { useFocusEffect } from "@react-navigation/native";
// ADS
import AdManager from "../scripts/ad_manager";
import BannerAdComponent from "../components/BannerAd";
import { useIsFocused } from '@react-navigation/native';
import { ScreenContext } from "../App";
import { useNavigation } from "@react-navigation/native";
import Dropdown from "../components/Dropdown";
import BottomSheet from '@gorhom/bottom-sheet';
import Buttons from "../components/Buttons";
import CustomBackground from "../components/CustomBackground";
import { Divider } from '@rneui/themed';

export default function LibsScreen() {
	//const navigation = useNavigation();
	//navigation.navigate("CreateLibScreen")

	let type = "libs";
	const [listItems, setListItems] = useState(LibManager.libs[type]);

	const isFocused = useIsFocused();
    const { setCurrentScreenName } = useContext(ScreenContext);

	useEffect(() => {
		if (isFocused) {
			setCurrentScreenName('LibsScreen');
			const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
			return () => backHandler.remove()
		}
	}, [isFocused]);

	useEffect(() => {
		let maxLength = -Infinity;
		for (let i = 0; i < LibManager.libs[type].length; i++) {
			if (LibManager.libs[type][i].prompts.length > maxLength) maxLength = LibManager.libs[type][i].prompts.length;
		}

		for (let i = 0; i < LibManager.libs[type].length; i++) {
			LibManager.libs[type][i].percent = LibManager.libs[type][i].prompts.length / maxLength;
		}

		try {			
			// ADS		 
			AdManager.loadAd("interstitial");
		} catch {}
	})

	const deleteItem = (id) => {
		LibManager.deleteLib(id, type);
		setListItems([...LibManager.libs["libs"]]);
	};

	useFocusEffect(
	  useCallback(() => {
		setListItems([...LibManager.libs["libs"]]);
		return () => {
		}; // Cleanup function if necessary
	  }, [])
	);

	const bottomSheetRef = useRef(null);

	const handleOpenBottomSheet = () => {
	  bottomSheetRef.current?.snapToIndex(2);  // Or any other index, based on snapPoints array
	};
  
	return (
	  <SafeAreaView style={[globalStyles.screenStandard]}>
		<TouchableOpacity onPress={handleOpenBottomSheet}>
			<Text>Open</Text>
		</TouchableOpacity>
        {/*<BannerAdComponent />*/}
		<View style={[globalStyles.titleContainer, {height: 20}]}>
            <Text>Welcome to Fun Libs! Pick a lib you want to play!</Text>
        </View>
		<Dropdown options={[
			{
				name: "Featured"
			},
			{
				name: "Adventure",
			},
			{
				name: "Casual",
			},
			{
				name: "Space",
			},
		]}/>
		<StatusBar style="auto" />
		<ScrollView style={[globalStyles.listItemContainer, {height: Dimensions.get("window").height - (74 + 20 + 64 + 60)}]}>
			{listItems.map((item) => (
				<ListItem name={item.name} description={item.display_with_prompts} promptAmount={item.prompts.length} prompts={item.prompts} text={item.text} id={item.id} type="libs" key={item.id} length={item.percent} onDelete={deleteItem} showDelete={false}></ListItem>
			))}
		</ScrollView>
		<BottomSheet
			ref={bottomSheetRef}
			index={-1}
			snapPoints={['25%', '50%', '75%']}
			enablePanDownToClose={true}
			style={[{width: (Dimensions.get("window").width), paddingHorizontal: 20}]} // Required to work with the bottom navigation
			backgroundComponent={CustomBackground}
			containerStyle={{}}
		>
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
			</View>
      	</BottomSheet>
	  </SafeAreaView>
	);
}
  
const styles = StyleSheet.create({

})