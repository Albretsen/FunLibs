import { ScrollView, StyleSheet, Text, View } from 'react-native';
import ListItem from '../components/ListItem';
import miscStyles from "../styles/miscStyles";
import FixedButton from "../components/FixedButton";
import LibManager from '../scripts/lib_manager';

export default function YourLibsScreen() {
    return (
      <View style={miscStyles.screenStandard}>
        <FixedButton />
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