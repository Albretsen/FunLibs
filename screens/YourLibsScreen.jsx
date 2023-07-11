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
      <FixedButton onPress={() => drawerRef.current.openDrawer()}/>
      <Text>Your Libs!</Text>
      <ScrollView style={styles.listItemContainer}>
        {LibManager.libs["yourLibs"].map((item) => (
          <ListItem name={item.name} id={item.id} type="yourLibs" key={item.id}></ListItem>
        ))}
      </ScrollView>
      <Drawer ref={drawerRef} title="Write your own Lib!">
        <View style={{marginHorizontal: 14, flex: 1}}>
          <Text>This is content inside the drawer.</Text>
          <TextInput
            style={[globalStyles.input, globalStyles.inputSmall]}
            multiline={true}
            numberOfLines={1}
            onChangeText={text => setTitle(text)}
          />
          <TextInput
            style={[globalStyles.input, globalStyles.inputLarge, {flex: 1}]}
            multiline={true}
            numberOfLines={50}
            onChangeText={text => setText(text)}
          />
        </View>
        <ButtonPair firstLabel="Cancel" secondLabel="Save" secondOnPress={saveLib} bottomButtons={true} />
      </Drawer>
    </View>
  );
}

const styles = StyleSheet.create({

})