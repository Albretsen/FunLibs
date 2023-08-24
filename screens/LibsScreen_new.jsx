import { ScrollView, StyleSheet, View, SafeAreaView, Text, BackHandler, Dimensions, TouchableOpacity } from "react-native";
import React, { useEffect, useState, useCallback, useContext, useRef } from "react";
import ListItem from "../components/ListItem";
import globalStyles from "../styles/globalStyles";
import LibManager from "../scripts/lib_manager";
import { useFocusEffect } from "@react-navigation/native";
// ADS
import AdManager from "../scripts/ad_manager";
import BannerAdComponent from "../components/BannerAd";
import { useIsFocused } from '@react-navigation/native';
import { ScreenContext } from "../App";
import Dropdown from "../components/Dropdown";
import BottomSheet from '@gorhom/bottom-sheet';
import Buttons from "../components/Buttons";
import CustomBackground from "../components/CustomBackground";
import { Divider } from '@rneui/themed';
import FilterToggle from "../components/FilterToggle";
import { SegmentedButtons } from "react-native-paper";

export default function LibsScreen() {
	let type = "libs";
	const [listItems, setListItems] = useState(LibManager.libs[type]);

	const isFocused = useIsFocused();
    const { setCurrentScreenName } = useContext(ScreenContext);

	useEffect(() => {
		if (isFocused) {
			setCurrentScreenName('LibsScreen');
			const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);

			return () => backHandler.remove()
		}
	}, [isFocused]);

	useEffect(() => {
		let maxLength = -Infinity;
		for (let i = 0; i < LibManager.libs[type].length; i++) {
			if (LibManager.libs[type][i].prompts.length > maxLength) maxLength = LibManager.libs[type][i].prompts.length;
		}

		for (let i = 0; i < LibManager.libs[type].length; i++) {
			LibManager.libs[type][i].percent = LibManager.libs[type][i].prompts.length / maxLength;
		}

		try {			
			// ADS		 
			AdManager.loadAd("interstitial");
		} catch {}
	})

	const deleteItem = (id) => {
		LibManager.deleteLib(id, type);
		setListItems([...LibManager.libs["libs"]]);
	};

	useFocusEffect(
	  useCallback(() => {
		setListItems([...LibManager.libs["libs"]]);

        setTimeout(() => {
            bottomSheetRef?.current?.close();
          }, 10);

		return () => {
		}; // Cleanup function if necessary
	  }, [])
	);

	const bottomSheetRef = useRef(null);

	const handleOpenBottomSheet = () => {
	  bottomSheetRef.current?.snapToIndex(3);  // Or any other index, based on snapPoints array
	};

    const handleCloseBottomSheet = () => {
        bottomSheetRef.current?.close();
    };

    const [value, setValue] = React.useState('play');
  
	return (
	  <SafeAreaView style={[globalStyles.screenStandard]}>
        <View style={[{flexDirection: "row", justifyContent: "space-around", alignItems: "center", gap: 10, width: "100%", paddingBottom: 20}]}>
            <SegmentedButtons
                value={value}
                onValueChange={setValue}
                style={{width: 200}}
                density="small"
                theme={{
                    colors: {
                    primary: '#49454F',
                    outline: "#79747E",
                    secondaryContainer: "#D1E8D5"
                    },
                }}
                buttons={[
                    {
                        label: "Play",
                        value: "play",
                        showSelectedCheck: true
                        
                    },
                    {
                        label: "Read",
                        value: "read",
                        showSelectedCheck: true,
                    }
                ]}
            />
            <FilterToggle open={handleOpenBottomSheet} close={handleCloseBottomSheet} />
        </View>
		<ScrollView style={[globalStyles.listItemContainer, {height: Dimensions.get("window").height - (74 + 0 + 64 + 60)}]}>
			{listItems.map((item) => (
				<ListItem name={item.name} description={item.display_with_prompts} promptAmount={item.prompts.length} prompts={item.prompts} text={item.text} id={item.id} type="libs" key={item.id} length={item.percent} icon="favorite" iconPress={null}></ListItem>
			))}
		</ScrollView>
		<BottomSheet
			ref={bottomSheetRef}
			index={-1}
            // Bug causes bottom sheet to reappear on navigation
            // Kind of fixed with hack that sets it to the lowest snap point possible, then removes it after
            // 10ms
			snapPoints={['1%', '25%', '50%', '75%', '100%']}
			enablePanDownToClose={true}
			style={[{width: (Dimensions.get("window").width), paddingHorizontal: 20}]} // Required to work with the bottom navigation
			backgroundComponent={CustomBackground}
		>
			<View>
				<Text style={[ globalStyles.bold, {marginVertical: 6, fontSize: 20}]}>Category</Text>
				<Buttons 
					buttons={[
						{
							label: "Official",
							icon: "done",
							buttonStyle: {borderColor: "transparent", backgroundColor: "#D1E8D5"}
						},
						{
							label: "All"
						},
						{
							label: "My favorites"
						},
						{
							label: "My content"
						},

					]}
					buttonStyle={{borderRadius: 10, borderColor: "#454247", backgroundColor: "#F0F1EC", minWidth: 50, height: 40}}
					containerStyle={{justifyContent: "flex-start", gap: 20}}
					labelStyle={{fontSize: 17, fontWeight: 500}}
				/>
				<Divider color="#CAC4D0" style={{marginVertical: 10}}/>
			</View>
      	</BottomSheet>
	  </SafeAreaView>
	);
}
  
const styles = StyleSheet.create({

})