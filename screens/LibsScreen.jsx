import { ScrollView, StyleSheet, Text, View } from 'react-native';
import ListItem from '/components/ListItem';
import miscStyles from "../styles/miscStyles";
import FixedButton from "../components/fixedButton";
import { StatusBar } from "expo-status-bar";
import data from '../libs.json';

export default function LibsScreen() {
    return (
      <View style={[miscStyles.screenStandard]}>
        <FixedButton />
        <StatusBar style="auto" />
        <ScrollView>
          {data.map((item) => (
            <ListItem name={item.name} id={item.id} key={item.id}></ListItem>
          ))}
        </ScrollView>
      </View>
    );
}