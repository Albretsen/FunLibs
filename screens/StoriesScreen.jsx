import { ScrollView, StyleSheet, Text, View, Dimensions } from "react-native";
import { useRef, useState, useCallback, useEffect, useContext } from "react";
import ListItem from "../components/ListItem";
import globalStyles from "../styles/globalStyles";
import LibManager from "../scripts/lib_manager";
import Drawer from "../components/Drawer";
import { useFocusEffect } from "@react-navigation/native";
import BannerAdComponent from "../components/BannerAd";
import { useIsFocused } from '@react-navigation/native';
import { ScreenContext } from "../App";
import FunLibsShare from "../scripts/share";

export default function StoriesScreen() {
	const isFocused = useIsFocused();
    const { setCurrentScreenName } = useContext(ScreenContext);

    useEffect(() => {
        if (isFocused) {
          setCurrentScreenName("StoriesScreen");
        }
    }, [isFocused]);

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
        <View style={[globalStyles.screenStandard]}>
            {/*<BannerAdComponent />*/}
            <View style={[globalStyles.titleContainer, {height: 40}]}>
                <Text>These are the stories you have created by playing libs. Click on one to read it again.</Text>
            </View>
            <ScrollView style={[globalStyles.listItemContainer, {height: Dimensions.get("window").height - (74 + 40 + 64 + 60)}]}>
                {listItems.map((item) => (
                    <ListItem name={item.name} promptAmount={item.prompts.length} description={item.display} prompts={item.prompts} text={item.text} id={item.id} type="stories" drawer={drawerRef} key={item.id} onClick={() => handleListItemClick(item)} onPress={deleteItem} length={item.percent} onDelete={deleteItem} showDelete={true}></ListItem>
                ))}
            </ScrollView>
            <Drawer ref={drawerRef} title="Your story" onShare={() => {
				FunLibsShare.Share(selectedItem.display + "\n\nCreated using: https://funlibs0.wordpress.com/download")
			}}>
                <ScrollView style={{width: Dimensions.get("window").width - (0.15 * Dimensions.get("window").width)}}>
                    <View style={globalStyles.drawerTop}>
                        {selectedItem ? <Text style={globalStyles.fontLarge}>{selectedItem.name}</Text> : <Text>No item selected</Text>}
                        {selectedItem ? LibManager.displayInDrawer(selectedItem.text) : <Text>No item selected</Text>}
                    </View>
                </ScrollView>
            </Drawer>
        </View>
    );
}

const styles = StyleSheet.create({

})