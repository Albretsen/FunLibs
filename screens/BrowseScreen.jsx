import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import LibsScreen from "./LibsScreen";
import CommunityLibsScreen from "./CommunityLibsScreen";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useTab } from "../components/TabContext";
import { useNavigation } from "@react-navigation/core";
import CustomTabBar from "../components/CustomTabBar";

export default function BrowseScreen({ route }) {
    const initialTab = route.params?.initialTab ?? "Official";
    const category = route.params?.category ?? "All";
    const sort = route.params?.sort ?? "newest";

    const { tab } = useTab();

    const Tab = createMaterialTopTabNavigator();

    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', (e) => {
            console.log(route.name);
        });
        
        // Clean up the listener when the component is unmounted
        return unsubscribe;
    }, [navigation, route]);

    return (
        <Tab.Navigator
            initialRouteName={initialTab}
            tabBarPosition="bottom"
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={({ route }) => ({
                swipeEnabled: true,
                headerShown: true,
            })}
        >
            <Tab.Screen 
                name="Official"
                component={LibsScreen}
            />
            <Tab.Screen 
                name="Community"
                component={CommunityLibsScreen}
                initialParams={{ category: category, sort: sort }}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    iconContainer: {
        height: 30,
        width: 60,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
    }
})