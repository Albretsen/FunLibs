import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRef, useEffect } from 'react';
import ListItem from '../components/ListItem';
import miscStyles from "../styles/miscStyles";
import FixedButton from "../components/FixedButton";
import { StatusBar } from "expo-status-bar";
import data from '../libs.json';
import Drawer from '../components/Drawer';

export default function LibsScreen() {

    const drawerRef = useRef();

    return (
      <View style={[miscStyles.screenStandard]}>
        <FixedButton onPress={() => drawerRef.current.openDrawer()}/>
        <StatusBar style="auto" />
        <ScrollView>
          {data.map((item) => (
            <ListItem name={item.name} id={item.id} key={item.id}></ListItem>
          ))}
        </ScrollView>
        <Drawer ref={drawerRef} title="Write your own Lib!">
            <Text>This is content inside the drawer.</Text>
        </Drawer>
      </View>
    );
}