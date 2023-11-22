import React, { useState } from "react";
import { View, Text } from "react-native";
import ListManager from "../components/ListManager";
import { SafeAreaView } from "react-native-safe-area-context";
import globalStyles from "../styles/globalStyles";
import SegmentedButtons from "../components/SegmentedButtons";
import i18n from "../scripts/i18n";
import Dropdown from "../components/Dropdown";
import PreviewToggle from "../components/PreviewToggle";

export default function CommunityLibsScreen() {

    const [selectedSortBy, setSelectedSortBy] = useState("newest");
    const [selectedCategory, setSelectedCategory] = useState("all");

    return (
        <SafeAreaView style={[globalStyles.screenStandard, globalStyles.standardHeightBottomNav, {flex: 1}]}>
			<View style={[globalStyles.containerWhitespacePadding]}>
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
                <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                    <Dropdown selected={selectedCategory} options={[
                        {
                            name: i18n.t('community_templates'),
                            onPress: () => {
                                setSelectedCategory("all");
                            }
                        },
                        {
                            name: i18n.t('favorite_templates'),
                            onPress: () => {
                                setSelectedCategory("myFavorites");
                            }
                        },
                        {
                            name: i18n.t('my_templates'),
                            onPress: () => {
                                setSelectedCategory("myContent");
                                //updateFilterOptions(playReadValue, "myFavorites");
                            }
                        }
                    ]} />
                    <PreviewToggle />
                </View>
            </View>
            <ListManager filterOptions={{
                "sortBy": selectedSortBy,
                "category": selectedCategory,
                "dateRange": "allTime",
                "playable": true
            }}></ListManager>
        </SafeAreaView>
    )
}