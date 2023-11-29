import React from 'react';
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import globalStyles from "../styles/globalStyles";
import ListManager from '../components/ListManager';

export default function ReadScreen() {
    return(
        <SafeAreaView style={[globalStyles.screenStandard, globalStyles.standardHeightBottomNav, { flex: 1 }]}>
            <View style={[globalStyles.containerWhitespacePadding]}>
                <ListManager readStories={true} paddingBottom={25} filterOptions={{
                    "sortBy": "trending",
                    "category": "All",
                    "dateRange": "allTime",
                    "playable": false,
                    "pageSize": 1,
                }}></ListManager>
            </View>
        </SafeAreaView>
    )
}