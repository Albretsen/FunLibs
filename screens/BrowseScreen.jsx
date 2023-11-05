import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import LibsScreen from "./LibsScreen";
import CommunityLibsScreen from "./CommunityLibsScreen";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useTab } from "../components/TabContext";
import { useNavigation } from "@react-navigation/core";
import CustomTabBar from "../components/CustomTabBar";

export default function BrowseScreen({ route }) {
    const initialTab = route.params?.initialTab ?? "Browse";

    const { tab } = useTab();

    const Tab = createMaterialTopTabNavigator();

    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', (e) => {
            if (route.name === "Fun Libs") {
                // Your code to run when "Fun Libs" tab is navigated to
                console.log('Navigated to Fun Libs tab');
            }
        });
        
        // Clean up the listener when the component is unmounted
        return unsubscribe;
    }, [navigation, route]);

    return (
        <Tab.Navigator
            initialRouteName={tab}
            tabBarPosition="bottom"
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={({ route }) => ({
                swipeEnabled: false, //Temporary disable for debugging
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