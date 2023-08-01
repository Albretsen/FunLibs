import { ScrollView, StyleSheet, View, Text } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import ListItem from "../components/ListItem";
import globalStyles from "../styles/globalStyles";
import { StatusBar } from "expo-status-bar";
import LibManager from "../scripts/lib_manager";
import { useFocusEffect } from "@react-navigation/native";
// ADS
import AdManager from "../scripts/ad_manager";
import BannerAdComponent from "../components/BannerAd";

export default function LibsScreen() {
	let type = "libs";
	const [listItems, setListItems] = useState(LibManager.libs[type]);

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
		return () => {}; // Cleanup function if necessary
	  }, [])
	);
  
	return (
	  <View style={[globalStyles.screenStandard]}>
        <BannerAdComponent />
		<View style={globalStyles.titleContainer}>
            <Text>Welcome to Fun Libs! Pick a lib you want to play!</Text>
        </View>
		<StatusBar style="auto" />
		<ScrollView style={globalStyles.listItemContainer}>
			{listItems.map((item) => (
				<ListItem name={item.name} description={item.display_with_prompts} promptAmount={item.prompts.length} prompts={item.prompts} text={item.text} id={item.id} type="libs" key={item.id} length={item.percent} onDelete={deleteItem} showDelete={false}></ListItem>
			))}
		</ScrollView>
	  </View>
	);
}
  
const styles = StyleSheet.create({

})