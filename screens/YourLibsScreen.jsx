import { ScrollView, StyleSheet, Text, View } from 'react-native';
import ListItem from '/components/ListItem';
import miscStyles from "../styles/miscStyles";
import FixedButton from "../components/fixedButton";

export default function YourLibsScreen() {
    return (
      <View style={miscStyles.screenStandard}>
        <FixedButton />
        <Text>Your Libs!</Text>
        <ScrollView style={styles.listItemContainer}>
          <ListItem name={"Test"} id={0}></ListItem>
        </ScrollView>
      </View>
    );
}

const styles = StyleSheet.create({

})