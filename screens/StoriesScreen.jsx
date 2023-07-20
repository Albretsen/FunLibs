import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRef, useState, useCallback } from 'react';
import ListItem from '../components/ListItem';
import globalStyles from "../styles/globalStyles";
import FixedButton from "../components/FixedButton";
import LibManager from '../scripts/lib_manager';
import Lib from '../scripts/lib';
import Drawer from '../components/Drawer';
import { useFocusEffect } from '@react-navigation/native';

export default function StoriesScreen() {

    const [listItems, setListItems] = useState(LibManager.libs["stories"]);

	useFocusEffect(
	  useCallback(() => {
		setListItems([...LibManager.libs["stories"]]);
		return () => {}; // Cleanup function if necessary
	  }, [])
	);

    const drawerRef = useRef();
    
    const [selectedItem, setSelectedItem] = useState(null);

    const handleListItemClick = (item) => {
        setSelectedItem(item);
        drawerRef.current.openDrawer();
    };

    return (
        <View style={globalStyles.screenStandard}>
            <FixedButton />
            <View style={globalStyles.titleContainer}>
                <Text>These are the stories you have created by playing libs. Click on one to read it again.</Text>
            </View>
            <ScrollView style={globalStyles.listItemContainer}>
                {listItems.map((item) => (
                    <ListItem name={item.name} id={item.id} type="stories" drawer={drawerRef} key={item.id} onClick={() => handleListItemClick(item)}></ListItem>
                ))}
            </ScrollView>
            <Drawer ref={drawerRef}>
                {selectedItem ? <Text>{`Selected Item: ${selectedItem.display}`}</Text> : <Text>No item selected</Text>}
            </Drawer>
        </View>
    );
}

const styles = StyleSheet.create({

})