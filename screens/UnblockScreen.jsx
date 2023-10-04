import React, { useState, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import globalStyles from "../styles/globalStyles";
import { useNavigation } from "@react-navigation/native";
import { ToastContext } from "../components/Toast";
import FirebaseManager from "../scripts/firebase_manager";

export default function UnblockScreen() {
    const showToast = useContext(ToastContext);
    const navigation = useNavigation();
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBlockedUsers = async () => {
            try {
                const userIDs = await FirebaseManager.getAllBlockedUsers();
                console.log("" + JSON.stringify(userIDs));
                const users = [];

                for (let uid of userIDs) {
                    const userData = await FirebaseManager.getUserData(uid);
                    if (userData && userData.username) {
                        users.push({ uid: uid, username: userData.username });
                    }
                }
                setBlockedUsers(users);
            } catch (error) {
                showToast("Error fetching blocked users.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchBlockedUsers();
    }, []);

    const handleUnblock = async (uid) => {
        showToast("Unblocking user...");
        try {
            await FirebaseManager.unblockUser(uid);
            setBlockedUsers(prevUsers => prevUsers.filter(user => user.uid !== uid));
            showToast("User unblocked successfully.");
        } catch (error) {
            console.log(error);
            showToast("Error unblocking user, please contact support.");
        }
    };

    const styles = {
        loadingOverlay: {
            position: 'absolute',
            top: 200,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
        }
    };

    return (
        <View style={[globalStyles.screenStandard]}>
            <View style={[globalStyles.bigWhitespace, { marginTop: 40 }]}>
                <Text style={{ fontSize: 26, fontWeight: 'bold', marginBottom: 30 }}>Unblock</Text>

                {isLoading ? (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color="#006D40" />
                    </View>
                ) : blockedUsers.length === 0 ? (
                    <Text>No blocked users.</Text>
                ) : (
                    <FlatList
                        data={blockedUsers}
                        keyExtractor={item => item.uid}
                        renderItem={({ item }) => (
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
                                <Text>{item.username}</Text>
                                <TouchableOpacity onPress={() => handleUnblock(item.uid)}>
                                    <Text style={{ color: 'red' }}>Unblock</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                )}
            </View>
        </View>
    );
}
