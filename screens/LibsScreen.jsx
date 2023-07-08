import { ScrollView, StyleSheet, View } from 'react-native';
import ListItem from '../components/ListItem';
import globalStyles from "../styles/globalStyles";
import FixedButton from "../components/FixedButton";
import { StatusBar } from "expo-status-bar";
import LibManager from '../scripts/lib_manager';

export default function LibsScreen() {
    return (
		<View style={[globalStyles.screenStandard]}>
			<FixedButton/>
			<StatusBar style="auto" />
			<ScrollView>
				{LibManager.libs["libs"].map((item) => (
					<ListItem name={item.name} id={item.id} type="libs" key={item.id}></ListItem>
				))}
			</ScrollView>
		</View>
    );
}

const styles = StyleSheet.create({

})