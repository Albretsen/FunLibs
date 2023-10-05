import React, { useEffect, useState, useCallback } from 'react';
import FirebaseManager from '../scripts/firebase_manager';
import ListItem from './ListItem';

const ListManager = (props) => {
    let { filterOptions } = props;

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = useCallback(async () => {
        setRefreshing(true);
        setLoading(true);
        try {
            // Assume getDatabaseData() is your function to fetch data from the database.
            const result = await FirebaseManager.getDatabaseData("posts", filterOptions);
            console.log("RESULT: " + JSON.stringify(result))
            setData(result.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
        } finally {
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleRefresh = () => {
        fetchData();
    };

    if (loading && !refreshing) return <div>Loading...</div>;

    return (
        <div>
            <button onClick={handleRefresh}>Refresh</button>
            {data.map((item, index) => (
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
            ))}
        </div>
    );
};

export default ListManager;