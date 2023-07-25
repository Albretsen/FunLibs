import { ScrollView, StyleSheet, Text, View, TextInput} from 'react-native';
import React, { useRef, useContext, useCallback, useState, useEffect } from 'react';
import ListItem from '../components/ListItem';
import globalStyles from "../styles/globalStyles";
import FixedButton from "../components/FixedButton";
import LibManager from '../scripts/lib_manager';
import Lib from '../scripts/lib';
import Drawer from '../components/Drawer';
import ButtonPair from '../components/ButtonPair';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import ToastContext from '../components/Toast/ToastContext';

export default function YourLibsScreen() {
  let type = "yourLibs";
  const [listItems, setListItems] = useState(LibManager.libs[type]);

  useEffect(() => {
		let maxLength = -Infinity;
		for (let i = 0; i < LibManager.libs[type].length; i++) {
			if (LibManager.libs[type][i].prompts.length > maxLength) maxLength = LibManager.libs[type][i].prompts.length;
		}

		for (let i = 0; i < LibManager.libs[type].length; i++) {
			LibManager.libs[type][i].percent = LibManager.libs[type][i].prompts.length / maxLength;
		}
	})

	useFocusEffect(
	  useCallback(() => {
		setListItems([...LibManager.libs["yourLibs"]]);
		return () => {}; // Cleanup function if necessary
	  }, [])
	);

  const deleteItem = (id) => {
		LibManager.deleteLib(id, type);
		setListItems([...LibManager.libs["yourLibs"]]);
	};

  const route = useRoute(); // Get the route prop to access the parameters
  const drawerRef = useRef();

  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.openDrawer) {
        drawerRef.current.openDrawer();
      }
      
      // Clean up function to remove the openDrawer parameter
      // This will ensure that the drawer doesn't always open on screen focus
      return () => {
        if (route.params?.openDrawer) {
          route.params.openDrawer = false;
        }
      }
    }, [route])
  );

  return (
    <View style={globalStyles.screenStandard}>
      <FixedButton/>
      <View style={globalStyles.titleContainer}>
        <Text>These are the libs that you have written. Click on a lib to play it! You can create a new lib by tapping the + icon in the bottom right corner.</Text>
      </View>
      <ScrollView style={globalStyles.listItemContainer}>
        {listItems.map((item) => (
          <ListItem name={item.name} description={item.display} id={item.id} type="yourLibs" key={item.id} length={item.percent} onDelete={deleteItem} showDelete={true}></ListItem>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({

})