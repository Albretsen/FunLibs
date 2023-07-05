import { ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { useRef, useEffect } from 'react';
import ListItem from '../components/ListItem';
import miscStyles from "../styles/miscStyles";
import textStyles from '../styles/textStyles';
import FixedButton from "../components/FixedButton";
import { StatusBar } from "expo-status-bar";
import Drawer from '../components/Drawer';
import Lib from '../scripts/lib';
import LibManager from '../scripts/lib_manager';

export default function LibsScreen() {

    const drawerRef = useRef();
  
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

    return (
      <View style={[miscStyles.screenStandard]}>
        <FixedButton onPress={() => drawerRef.current.openDrawer()}/>
        <StatusBar style="auto" />
        <ScrollView>
            {LibManager.libs["libs"].map((item) => (
                <ListItem name={item.name} id={item.id} type="libs" key={item.id}></ListItem>
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
            <View style={[styles.buttonContainer, styles.drawerBottom]}>
                <TouchableOpacity style={styles.button}>
                    <Text style={[styles.buttonText, textStyles.bold, textStyles.fontMedium]}>Cancel</Text>
                </TouchableOpacity>
                {/* Add proper onPress */}
                <TouchableOpacity style={[styles.button, styles.buttonNext]} onPress={saveLib}>
                    <Text style={[textStyles.bold, textStyles.fontMedium]}>Save</Text>
                </TouchableOpacity>
            </View>
        </Drawer>
      </View>
    );
}

const styles = StyleSheet.create({
	promptContainer: {
		borderRadius: 10,
		borderColor: "#CAC4D0",
		borderWidth: 1,
		padding: 20,
		rowGap: 10,
	},
	input: {
		height: 60,
		borderWidth: 1,
		borderColor: "gray",
		borderRadius: 6,
		padding: 10,
		paddingLeft: 16
	},
	leftPadding: {
		paddingLeft: 16
	},
	explanation: {
		marginTop: -6
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "flex-end",
		gap: 10,
		marginTop: 10
	},
	button: {
		borderRadius: 40,
		backgroundColor: "white",
		borderWidth: 1,
		borderColor: "gray",
		padding: 10,
		minWidth: 100,
		height: 50,
		alignItems: "center",
		justifyContent: "center"
	},
	buttonNext: {
		backgroundColor: "#D1E8D5",
		borderColor: "#D1E8D5",
	},
	drawerContainer: {
		flex: 1,
		justifyContent: "space-between",
		borderRightWidth: 1,
		borderColor: "#D1E8D5"
	},
	drawerBottom: {
		marginBottom: 10,
		marginRight: 10,
		paddingTop: 10,
		borderTopWidth: 1,
		borderColor: "gray",
	}
})