import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import FirebaseManager from '../scripts/firebase_manager';
import ListItem from './ListItem';
import _ from 'lodash';
import { ActivityIndicator } from "react-native-paper";
import i18n from '../scripts/i18n';
import LibManager from '../scripts/lib_manager';
import PackManager from '../scripts/PackManager';
import FileManager from '../scripts/file_manager';

const ListManager = (props) => {
    let { filterOptions, paddingBottom, showPreview, pack, locked, showLoader = true } = props;

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [lastVisibleDoc, setLastVisibleDoc] = useState(null);
    const [page, setPage] = useState(1);

    const [endReached, setEndReached] = useState(false);

    const fetchData = useCallback(async (newFetch = true) => {
        setRefreshing(true);
        setLoading(true);
        try {
            if (newFetch) setData([]);
            const result = !pack ? (await FirebaseManager.getDatabaseData("posts", filterOptions, newFetch ? null : lastVisibleDoc)) : (readStories ? {data: JSON.parse(await FileManager._retrieveData("read"))} : {data: PackManager.getLibsByPack(pack)});
            if (!result.data) throw error;
            if (result.data.length < 10) setEndReached(true);
            else setEndReached(false);
            setData(prevData => (newFetch ? result.data : [...prevData, ...result.data]));
            setLastVisibleDoc(result.lastDocument);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
            setData([]);
        } finally {
            setRefreshing(false);
        }
    }, [pack, filterOptions, lastVisibleDoc]);

    useEffect(() => {
        fetchData();
    }, [pack, filterOptions]);

    const handleRefresh = () => {
        fetchData();
    };

    const handleLoadMore = () => {
        console.log("test");
        fetchData(false);
    };

    if (loading && !refreshing) return <View><Text>Loading...</Text></View>;

    const userColor = FirebaseManager.getRandomColor();

    function renderFooter() {
		// Define the style based on loadingAdditional's value
		let activityIndicatorStyle = ((lastVisibleDoc != null) && loading) ? {} : { opacity: 0 };

		return (
            <>
                {showLoader && (
                <View>
                    <ActivityIndicator
                        animating={true}
                        color="#006D40"
                        size="large"
                        style={activityIndicatorStyle}
                    />
                </View>
                )}
            </>
		);
	}

    return (
        <FlatList
            data={data}
            style={{paddingBottom: paddingBottom}}
            keyExtractor={(item, index) => item.id || String(index)}
            renderItem={({ item, index }) => (
                <ListItem
                    name={item.name}
                    description={item.display_with_prompts}
                    promptAmount={item.prompts.length}
                    prompts={item.prompts}
                    text={item.text}
                    id={item.id}
                    type="libs"
                    key={item.id}
                    length={item.percent}
                    username={item.username}
                    likes={item.likes}
                    avatarID={item.avatarID}
                    index={index}
                    user={item.user}
                    local={item.local}
                    likesArray={item.likesArray}
                    playable={item.playable}
                    item={item}
                    color={userColor}
                    plays={item.plays}
                    comments={item.comments}
                    showPreview={showPreview}
                    locked={locked}
                    official={item.official}
                    pack={item.pack}
                />
            )}
            refreshing={refreshing} // Use the loading state to indicate whether the list is being refreshed
            onRefresh={() => { // Function that will be called when the user pulls to refresh
                if (listItems.length > 0) updateFilterOptions();
            }}
            onEndReached={_.debounce(() => {
                if (!loading && data.length > 0 && !endReached && !pack) {
                    fetchData(false);
                }
            }, 200)} // Call the loadListItems function when the end is reached
            onEndReachedThreshold={0.1} // Trigger when the user has scrolled 90% of the content
            ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>{loading ? "" : i18n.t('no_results')}</Text>}
            ListFooterComponent={renderFooter}
        />
    );
};

export default ListManager;