import React, { useState } from "react";
import { View, Text } from "react-native";
import ListManager from "../components/ListManager";
import { SafeAreaView } from "react-native-safe-area-context";
import globalStyles from "../styles/globalStyles";
import SegmentedButtons from "../components/SegmentedButtons";
import i18n from "../scripts/i18n";

export default function CommunityLibsScreen() {

    const [selectedSortBy, setSelectedSortBy] = useState("newest");

    return (
        <SafeAreaView style={[globalStyles.screenStandard, globalStyles.standardHeightBottomNav]}>
            <View style={[globalStyles.standardWhitespace, { flex: 1 }]}>
                <SegmentedButtons
                    buttons={[
                        {
                            label: i18n.t('newest'),
                            onPress: () => {
                                setSelectedSortBy("newest");
                            },
                            active: true,
                        },
                        {
                            label: i18n.t('top'),
                            onPress: () => {
                                setSelectedSortBy("likes");
                            },
                        },
                        {
                            label: i18n.t('trending'),
                            onPress: () => {
                                setSelectedSortBy("trending");
                            },
                        },
                    ]}
                />
                <ListManager filterOptions={{
                    "sortBy": selectedSortBy,
                    "dateRange": "allTime",
                    "playable": true
                }}></ListManager>
            </View>
        </SafeAreaView>
    )
}