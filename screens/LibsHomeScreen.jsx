import React from "react";
import { View } from "react-native";
import LibsScreen from "./LibsScreen";
import StoriesScreen from "./StoriesScreen";
import YourLibsScreen from "./YourLibsScreen";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

export default function LibsHomeScreen({route}) {
    const initialTab = route.params?.initialTab ?? "Libs";

    const Tab = createMaterialTopTabNavigator();

    return (
        <Tab.Navigator
            tabBarPosition="bottom"
            initialRouteName={initialTab}
            screenOptions={({ route }) => ({
            swipeEnabled: true,
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => {
                let iconName;
    
                iconName = focused ? "radio-button-checked" : "radio-button-unchecked";
    
                // You can return any component here
                return (
                <View
                    style={{
                        height: 30,
                        width: 60,
                        backgroundColor: focused ? "#abc" : "transparent",
                        borderRadius: 16,
                        justifyContent: "center",
                        alignItems: "center",
                        alignSelf: "center",
                    }}
                >
                    <MaterialIcons name={iconName} size={18} color={focused ? "#49454F" : color} />
                </View>
                );
            },
            tabBarActiveTintColor: "gray",
            tabBarInactiveTintColor: "gray",
            tabBarLabelStyle: {
                fontSize: 16
            },
            tabBarStyle: {
                paddingVertical: 1,
                paddingBottom: 10,
                backgroundColor: "#F0F1EC",
                elevation: 0, // remove shadow on Android
                shadowOpacity: 0, // remove shadow on iOS
                borderTopWidth: 0, // for explicit border settings
                height: 74
            }
            })}
        >
            <Tab.Screen name="Libs" component={LibsScreen} />
            <Tab.Screen name="Stories" component={StoriesScreen} />
            <Tab.Screen name="Your Libs" component={YourLibsScreen} />
        </Tab.Navigator>
    );
}