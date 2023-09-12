import React, { useContext, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import LibsScreen from "./LibsScreen_new";
import CreateLibScreen from "./CreateLibScreen";
import TestScreen from "./TestScreen";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useTab } from "../components/TabContext";

export default function LibsHomeScreen({route}) {
    const initialTab = route.params?.initialTab ?? "Home";

    const { tab } = useTab();

    const Tab = createMaterialTopTabNavigator();

    return (
        <Tab.Navigator
            tabBarPosition="bottom"
            initialRouteName={tab}
            screenOptions={({ route }) => ({
                swipeEnabled: false, //Temporary disable for debugging
                headerShown: true,
                tabBarActiveTintColor: "gray",
                tabBarInactiveTintColor: "gray",
                tabBarLabelStyle: {
                    fontSize: 16
                },
                tabBarStyle: {
                    backgroundColor: "#F0F1EC",
                    elevation: 0, // remove shadow on Android
                    shadowOpacity: 0, // remove shadow on iOS
                    borderTopWidth: 0, // for explicit border settings
                    height: 74,
                },
                tabBarIndicatorStyle: {
                    backgroundColor: "#D1E8D5",
                }
            })}
        >
            <Tab.Screen 
                name="Fun Libs"
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
            {/* <Tab.Screen
                name="Testing"
                component={TestScreen}
                options={{
                    tabBarLabel: ({ color }) => (
                        <Text style={{color, textTransform: 'none', fontWeight: "bold", fontSize: 15, marginTop: 6}}>Testing</Text>
                    ),
                    tabBarIcon: ({ focused, color }) => {
                        return (
                            <View style={[styles.iconContainer, {backgroundColor: focused ? "#D1E8D5" : "transparent"}]}>
                                <MaterialIcons name="bug-report" size={22} color={focused ? "black" : color} />
                            </View>
                        );
                    }
                }}
            /> */}
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