import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import ListManager from "../components/ListManager";
import { SafeAreaView } from "react-native-safe-area-context";
import globalStyles from "../styles/globalStyles";
import SegmentedButtons from "../components/SegmentedButtons";
import i18n from "../scripts/i18n";
import Dropdown from "../components/Dropdown";
import PreviewToggle from "../components/PreviewToggle";
import FileManager from "../scripts/file_manager";

export default function CommunityLibsScreen({ route }) {
    const initialCategory = route.params?.category ?? "all";
    const initialSort = route.params?.sort ?? "newest";
    console.log("Initialsort: " + initialSort);

    const [selectedSortBy, setSelectedSortBy] = useState(initialSort);
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);

    const [showPreview, setShowPreview] = useState(true);

    // Get the current state of showPreview stored locally
    useEffect(() => {
        async function fetchData() {
            const storedPreview = await FileManager._retrieveData("previewToggle");
            setShowPreview(storedPreview === 'true');
        }
        fetchData();
    }, []);

    return (
        <SafeAreaView style={[globalStyles.screenStandard, globalStyles.standardHeightBottomNav, {flex: 1}]}>
			<View style={[globalStyles.containerWhitespacePadding]}>
                <SegmentedButtons
                    buttons={[
                        {
                            id: "newest",
                            label: i18n.t('newest'),
                            onPress: () => {
                                setSelectedSortBy("newest");
                            },
                        },
                        {
                            id: "likes",
                            label: i18n.t('top'),
                            onPress: () => {
                                setSelectedSortBy("likes");
                            },
                        },
                        {
                            id: "trending",
                            label: i18n.t('trending'),
                            onPress: () => {
                                setSelectedSortBy("trending");
                            },
                        },
                    ]}
                    initialActiveButtonId={initialSort}
                />
                <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 30}}>
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
                    <PreviewToggle onStateChange={(state) => {setShowPreview(state)}} />
                </View>
            </View>
            <ListManager showPreview={showPreview}  filterOptions={{
                "sortBy": selectedSortBy,
                "category": selectedCategory,
                "dateRange": "allTime",
                "playable": true
            }}></ListManager>
        </SafeAreaView>
    )
}