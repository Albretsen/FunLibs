import { ScrollView, StyleSheet, View } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import ListItem from '../components/ListItem';
import globalStyles from "../styles/globalStyles";
import FixedButton from "../components/FixedButton";
import { StatusBar } from "expo-status-bar";
import LibManager from '../scripts/lib_manager';
import { useFocusEffect } from '@react-navigation/native';

export default function LibsScreen() {
	const [listItems, setListItems] = useState(LibManager.libs["libs"]);

	useFocusEffect(
	  useCallback(() => {
		setListItems([...LibManager.libs["libs"]]);
		return () => {}; // Cleanup function if necessary
	  }, [])
	);
  
	return (
	  <View style={[globalStyles.screenStandard]}>
		<FixedButton/>
		<StatusBar style="auto" />
		<ScrollView>
		  {listItems.map((item) => (
			<ListItem name={item.name} id={item.id} type="libs" key={item.id}></ListItem>
		  ))}
		</ScrollView>
	  </View>
	);
}
  
const styles = StyleSheet.create({

})