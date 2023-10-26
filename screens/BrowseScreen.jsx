import React, { useContext, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import LibsScreen from "./LibsScreen";
import CreateLibScreen from "./CreateLibScreen";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
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
                options={{
                    tabBarLabel: ({ color }) => (
                        <Text style={{color, textTransform: 'none', fontWeight: "bold", fontSize: 15, marginTop: 6}}>Home</Text>
                    ),
                    tabBarIcon: ({ focused, color }) => {
                        return (
                            <View style={[styles.iconContainer, {backgroundColor: focused ? "#D1E8D5" : "transparent"}]}>
                                <MaterialIcons name="home" size={22} color={focused ? "black" : color} />
                            </View>
                        );
                    },
                }}
            />
            <Tab.Screen
                name="Create"
                component={CreateLibScreen}
                options={{
                    tabBarLabel: ({ color }) => (
                        <Text style={{color, textTransform: 'none', fontWeight: "bold", fontSize: 15, marginTop: 6}}>Create</Text>
                    ),
                    tabBarIcon: ({ focused, color }) => {
                        return (
                            <View style={[styles.iconContainer, {backgroundColor: focused ? "#D1E8D5" : "transparent"}]}>
                                <MaterialIcons name="edit" size={22} color={focused ? "black" : color} />
                            </View>
                        );
                    }
                }}
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