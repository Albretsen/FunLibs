import React, { useState, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import globalStyles from "../styles/globalStyles";
import { useNavigation } from "@react-navigation/native";
import { ToastContext } from "../components/Toast";
import FirebaseManager from "../scripts/firebase_manager";
import i18n from "../scripts/i18n";

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
                showToast({text: i18n.t('error_fetching_blocked_users'), noBottomMargin: true});
            } finally {
                setIsLoading(false);
            }
        };

        fetchBlockedUsers();
    }, []);

    const handleUnblock = async (uid) => {
        showToast({text: i18n.t('unblocking_user'), noBottomMargin: true, loading: true});
        try {
            await FirebaseManager.unblockUser(uid);
            setBlockedUsers(prevUsers => prevUsers.filter(user => user.uid !== uid));
            showToast({text: i18n.t('user_unblocked_successfully'), noBottomMargin: true, loading: false});
        } catch (error) {
            console.log(error);
            showToast({text: i18n.t('error_unblocking_user_please_contact_support'), noBottomMargin: true, loading: false});
        }
    };

    return (
        <View style={[globalStyles.screenStandard]}>
            <View style={[globalStyles.bigWhitespace, { marginTop: 40 }]}>
                <Text style={{ fontSize: 26, fontWeight: 'bold', marginBottom: 30 }}>{i18n.t('unblock')}</Text>

                {isLoading ? (
                    <View style={globalStyles.loadingOverlay}>
                        <ActivityIndicator size="large" color="#6294C9" />
                    </View>
                ) : blockedUsers.length === 0 ? (
                    <Text>{i18n.t('no_blocked_users')}</Text>
                ) : (
                    <FlatList
                        data={blockedUsers}
                        keyExtractor={item => item.uid}
                        renderItem={({ item }) => (
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
                                <Text>{item.username}</Text>
                                <TouchableOpacity onPress={() => handleUnblock(item.uid)}>
                                    <Text style={{ color: 'red' }}>{i18n.t('unblock')}</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                )}
            </View>
        </View>
    );
}
