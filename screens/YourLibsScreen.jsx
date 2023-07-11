import { ScrollView, StyleSheet, Text, View, TextInput} from 'react-native';
import React, { useRef, useContext } from 'react';
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
      <Text>Your Libs!</Text>
      <ScrollView style={styles.listItemContainer}>
        {LibManager.libs["yourLibs"].map((item) => (
          <ListItem name={item.name} id={item.id} type="yourLibs" key={item.id}></ListItem>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({

})