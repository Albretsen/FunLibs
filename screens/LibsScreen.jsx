import { ScrollView, StyleSheet, View, Text } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import ListItem from '../components/ListItem';
import globalStyles from "../styles/globalStyles";
import FixedButton from "../components/FixedButton";
import { StatusBar } from "expo-status-bar";
import LibManager from '../scripts/lib_manager';
import { useFocusEffect } from '@react-navigation/native';
// ADS ADS ADS ADS ADS ADS ADS ADS ADS ADS ADS ADS ADS ADS ADS ADS ADS ADS ADS ADS 
import AdManager from '../scripts/ad_manager';

export default function LibsScreen() {
	const [listItems, setListItems] = useState(LibManager.libs["libs"]);

	useEffect(() => {
		try {			
			// ADS ADS ADS ADS ADS ADS ADS ADS ADS ADS ADS ADS ADS ADS ADS ADS ADS ADS ADS ADS 			 
			AdManager.loadAd("interstitial");
		} catch {}
	})

	useFocusEffect(
	  useCallback(() => {
		setListItems([...LibManager.libs["libs"]]);
		return () => {}; // Cleanup function if necessary
	  }, [])
	);
  
	return (
	  <View style={[globalStyles.screenStandard]}>
		<FixedButton/>
		<View style={globalStyles.titleContainer}>
            <Text>Welcome to Fun Libs! Pick a lib you want to play!</Text>
        </View>
		<StatusBar style="auto" />
		<ScrollView style={globalStyles.listItemContainer}>
		  {listItems.map((item) => (
			<ListItem name={item.name} id={item.id} type="libs" key={item.id}></ListItem>
		  ))}
		</ScrollView>
	  </View>
	);
}
  
const styles = StyleSheet.create({

})