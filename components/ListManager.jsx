import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import FirebaseManager from '../scripts/firebase_manager';
import ListItem from './ListItem';

const ListManager = (props) => {
    let { filterOptions } = props;

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [lastVisibleDoc, setLastVisibleDoc] = useState(null);
    const [page, setPage] = useState(1);

    const fetchData = useCallback(async (newFetch = true) => {
        setRefreshing(true);
        setLoading(true);
        try {
            const result = await FirebaseManager.getDatabaseData("posts", filterOptions, newFetch ? null : lastVisibleDoc);
            if (!result.data) throw error;
            setData(prevData => (newFetch ? result.data : [...prevData, ...result.data]));
            setLastVisibleDoc(result.lastDocument);
            setLoading(false);
        } catch (error) {
            console.error(error);
        } finally {
            setRefreshing(false);
        }
    }, [filterOptions, lastVisibleDoc]);

    useEffect(() => {
        fetchData();
    }, []);

    const handleRefresh = () => {
        fetchData();
    };

    const handleLoadMore = () => {
        console.log("test");
        fetchData(false);
    };

    if (loading && !refreshing) return <View><Text>Loading...</Text></View>;

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
                />
            )}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                />
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
        />
    );
};

export default ListManager;