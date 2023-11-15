import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import FirebaseManager from '../scripts/firebase_manager';
import ListItem from './ListItem';
import _ from 'lodash';
import { ActivityIndicator } from "react-native-paper";
import i18n from '../scripts/i18n';

const ListManager = (props) => {
    let { filterOptions } = props;

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
            const result = await FirebaseManager.getDatabaseData("posts", filterOptions, newFetch ? null : lastVisibleDoc);
            if (!result.data) throw error;
            if (result.data.length < 10) setEndReached(true);
            else setEndReached(false);
            setData(prevData => (newFetch ? result.data : [...prevData, ...result.data]));
            setLastVisibleDoc(result.lastDocument);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
            setData([]);
        } finally {
            setRefreshing(false);
        }
    }, [filterOptions, lastVisibleDoc]);

    useEffect(() => {
        fetchData();
    }, [filterOptions]);

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
			<View>
				<ActivityIndicator
					animating={true}
					color="#006D40"
					size="large"
					style={activityIndicatorStyle}
				/>
			</View>
		);
	}

    return (
        <FlatList
            data={data}
            keyExtractor={(item) => item.id}
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
                    icon="favorite"
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
                />
            )}
            refreshing={false} // Use the loading state to indicate whether the list is being refreshed
            onRefresh={() => { // Function that will be called when the user pulls to refresh
                if (listItems.length > 0) updateFilterOptions();
            }}
            onEndReached={_.debounce(() => {
                if (!loading && data.length > 0 && !endReached) {
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