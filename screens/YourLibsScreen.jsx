import { ScrollView, StyleSheet, Text, View, TextInput} from 'react-native';
import React, { useRef } from 'react';
import ListItem from '../components/ListItem';
import miscStyles from "../styles/miscStyles";
import FixedButton from "../components/FixedButton";
import LibManager from '../scripts/lib_manager';
import Lib from '../scripts/lib';
import Drawer from '../components/Drawer';
import ButtonPair from '../components/ButtonPair';
import { useFocusEffect, useRoute } from '@react-navigation/native';

export default function YourLibsScreen() {
  let libText = "";
  let libTitle = "";
  const saveLib = () => {
    let lib = Lib.createLib(libText, libTitle);
    LibManager.storeLib(lib, "yourLibs");
  }

  const setText = (text) => {
    libText = text;
  }

  const setTitle = (title) => {
    libTitle = title;
  }

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
    <View style={miscStyles.screenStandard}>
      <FixedButton onPress={() => drawerRef.current.openDrawer()}/>
      <Text>Your Libs!</Text>
      <ScrollView style={styles.listItemContainer}>
        {LibManager.libs["yourLibs"].map((item) => (
          <ListItem name={item.name} id={item.id} type="yourLibs" key={item.id}></ListItem>
        ))}
      </ScrollView>
      <Drawer ref={drawerRef} title="Write your own Lib!">
        <Text>This is content inside the drawer.</Text>
        <TextInput
          multiline={true}
          numberOfLines={1}
          onChangeText={text => setTitle(text)}
        />
        <TextInput
          multiline={true}
          numberOfLines={50}
          onChangeText={text => setText(text)}
        />
        <ButtonPair firstLabel="Cancel" secondLabel="Save" secondOnPress={saveLib} bottomButtons={true} />
      </Drawer>
    </View>
  );
}

const styles = StyleSheet.create({

})