import { ScrollView, StyleSheet, Text, View, Platform } from 'react-native';
import { useRef, useState, useCallback, useEffect } from 'react';
import ListItem from '../components/ListItem';
import globalStyles from "../styles/globalStyles";
import FixedButton from "../components/FixedButton";
import LibManager from '../scripts/lib_manager';
import Lib from '../scripts/lib';
import Drawer from '../components/Drawer';
import { useFocusEffect } from '@react-navigation/native';
import BannerAdComponent from '../components/BannerAd';

export default function StoriesScreen() {
    let type = "stories";
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
		setListItems([...LibManager.libs["stories"]]);
		return () => {}; // Cleanup function if necessary
	  }, [])
	);

    const deleteItem = (id) => {
		LibManager.deleteLib(id, type);
		setListItems([...LibManager.libs["stories"]]);
	};

    const drawerRef = useRef();
    
    const [selectedItem, setSelectedItem] = useState(null);

    const handleListItemClick = (item) => {
        setSelectedItem(item);
        drawerRef.current.openDrawer();
    };

    return (
        <View style={globalStyles.screenStandard}>
            <BannerAdComponent />
            {/*<FixedButton/>*/}
            <View style={globalStyles.titleContainer}>
                <Text>These are the stories you have created by playing libs. Click on one to read it again.</Text>
            </View>
            <ScrollView style={globalStyles.listItemContainer}>
                {listItems.map((item) => (
                    <ListItem name={item.name} description={item.display} id={item.id} type="stories" drawer={drawerRef} key={item.id} onClick={() => handleListItemClick(item)} onPress={deleteItem} length={item.percent} onDelete={deleteItem} showDelete={true}></ListItem>
                ))}
            </ScrollView>
            <Drawer ref={drawerRef}>
                <View style={styles.drawerContent}>
                    {selectedItem ? <Text style={globalStyles.fontLarge}>{selectedItem.name}</Text> : <Text>No item selected</Text>}
                    {selectedItem ? <Text style={[globalStyles.fontMedium, {marginTop: 16}]}>{selectedItem.display}</Text> : <Text>No item selected</Text>}
                </View>
            </Drawer>
        </View>
    );
}

const styles = StyleSheet.create({
	drawerContent: {
		marginHorizontal: 20,
	},
})