import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRef, useState } from 'react';
import ListItem from '../components/ListItem';
import globalStyles from "../styles/globalStyles";
import FixedButton from "../components/FixedButton";
import LibManager from '../scripts/lib_manager';
import Lib from '../scripts/lib';
import Drawer from '../components/Drawer';

export default function StoriesScreen() {

    const drawerRef = useRef();
    
    const [selectedItem, setSelectedItem] = useState(null);

    const handleListItemClick = (item) => {
        setSelectedItem(item);
        drawerRef.current.openDrawer();
    };

    return (
        <View style={globalStyles.screenStandard}>
            <FixedButton />
            <Text>Stories</Text>
            <ScrollView style={styles.listItemContainer}>
                {LibManager.libs["stories"].map((item) => (
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