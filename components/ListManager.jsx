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
    let { filterOptions, paddingBottom, showPreview, pack, locked, showLoader = true, readStories, official } = props;

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [lastVisibleDoc, setLastVisibleDoc] = useState(null);
    const [page, setPage] = useState(1);

    const [endReached, setEndReached] = useState(false);

    let blockedList = [];
    let blockFlag = false;

    let getBlockedList = async () => {
        let blockedUsers = await FirebaseManager.getAllBlockedUsers();
        blockedList = blockedUsers;
        blockFlag = true;
    }

    const fetchData = useCallback(async (newFetch = true) => {
        setLoading(true);
        try {
            if (newFetch) {
                setData([]);
                blockFlag = false;
                getBlockedList();
            }
            let result;
            
            if (official) {
                result = {data: LibManager.getOfficialLibs() }
            } else {
                result = !pack ? (await FirebaseManager.getDatabaseData("posts", filterOptions, newFetch ? null : lastVisibleDoc)) : (readStories ? {data: JSON.parse(await FileManager._retrieveData("read"))} : {data: PackManager.getLibsByPack(pack)});
            }

            try {
                if (filterOptions.category == "myContent") {
                    let myContent = await FileManager._retrieveData("my_content");
                    if (myContent && result.data && result.data != "no-internet") {
                        myContent = JSON.parse(myContent);
                        result.data.push(...myContent);
                    } else {
                        result.data = myContent;
                    }
                    result.data.sort((a, b) => a.date < b.date ? 1 : -1);
                }
            } catch (err){
                console.log("ERROR: " + err);
            }
            if (!result.data || result.data == "no-internet") throw error;
            if (result.data.length < 10) setEndReached(true);
            else setEndReached(false);

            await new Promise((resolve, reject) => {
                const waitTime = 5000; // Max wait time in milliseconds
                const checkInterval = 100; // Check every 100 ms
                let totalTime = 0;

                const checkBlockFlag = () => {
                    if (blockFlag) {
                        resolve();
                    } else if (totalTime > waitTime) {
                        resolve('Timeout waiting for blockFlag');
                    } else {
                        totalTime += checkInterval;
                        setTimeout(checkBlockFlag, checkInterval);
                    }
                };

                checkBlockFlag();
            });

            // Filter out users from the blockedList
            if (blockedList?.length > 0 && result.data) {
                result.data = result.data.filter(item => !blockedList.includes(item.user));
            }

            blockFlag = false;

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
        fetchData(true);
    }, [pack, filterOptions]);

    const handleRefresh = () => {
        fetchData(true);
    };

    const handleLoadMore = () => {
        console.log("test");
        fetchData(false);
    };

    //if (loading && !refreshing) return <View><Text>Loading...</Text></View>;

    const userColor = FirebaseManager.getRandomColor();

    function renderFooter() {
        if (refreshing) {
            return null; // Don't render anything in the footer when refreshing
        }

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
                    refresh={handleRefresh}
                    published={item.published}
                />
            )}
            refreshing={refreshing} // Use the loading state to indicate whether the list is being refreshed
            onRefresh={() => { // Function that will be called when the user pulls to refresh
                setRefreshing(false);
                fetchData(true);
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