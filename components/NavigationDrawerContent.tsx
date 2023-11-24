import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import DrawerContents from './DrawerContents';
import i18n from '../scripts/i18n';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

type RootStackParamList = {
    Home: undefined;
    Create: undefined;
    Pack: undefined
    // ... other screens
};

type NavigationDrawerContentNavigationProp = StackNavigationProp<
    RootStackParamList,
    "Home",
    "Create"
>;

interface NavigationDrawerContentProps {
    navigation: NavigationDrawerContentNavigationProp;
    closeDrawer: () => void;
}

export default function NavigationDrawerContent({ navigation, closeDrawer}: NavigationDrawerContentProps) {
    return(
        <DrawerContents
            title={i18n.t("fun_libs")}
            containerStyle={{paddingHorizontal: 26}}
            sections={
                [
                    {
                        title: i18n.t("browse"),
                        links: [
                            {
                                title: i18n.t("home"),
                                icon: "home",
                                iconColor: "#638BD5",
                                textColor: "#638BD5",
                                onPress: () => { 
                                    navigation.navigate("Home");
                                    closeDrawer();
                                }
                            },
                            {
                                title: i18n.t("official_stories"),
                                icon: "verified",
                                onPress: () => { 
                                    // Navigation code goes here
                                    closeDrawer();
                                }
                            },
                            {
                                title: i18n.t("community_stories"),
                                icon: "public",
                                onPress: () => { 
                                    // Navigation code goes here
                                    closeDrawer();
                                }
                            },
                            {
                                title: i18n.t("story_packs"),
                                icon: "auto-stories", // Feel free to put a better icon here
                                iconColor: "#95691B",
                                textColor: "#95691B",
                                onPress: () => {
                                    navigation.navigate("Pack")
                                    closeDrawer();
                                }
                            },
                        ]
                    },
                    {
                        title: i18n.t("my_fun_libs"),
                        links: [
                            {
                                title: i18n.t("create_a_story"),
                                icon: "edit",
                                onPress: () => { 
                                    navigation.navigate("Create");
                                    closeDrawer();
                                }
                            },
                            {
                                title: i18n.t("my_stories"),
                                icon: "face",
                                onPress: () => { 
                                    // Navigation code goes here
                                    closeDrawer();
                                }
                            },
                            {
                                title: i18n.t("read_stories"),
                                icon: "local-library",
                                onPress: () => { 
                                    // Navigation code goes here
                                    closeDrawer();
                                }
                            },
                        ]
                    },
                    {
                        title: i18n.t("packs"),
                        links: [
                            {
                                title: i18n.t("romance"),
                                iconComponent: (
                                    <MaterialCommunityIcons name="hand-heart-outline" size={20} color="#95691B" />
                                ),
                                textColor: "#95691B",
                                onPress: () => {
                                    navigation.navigate("Pack")
                                    closeDrawer();
                                }
                            },
                            {
                                title: i18n.t("christmas"),
                                iconComponent: (
                                    <FontAwesome5 name="candy-cane" size={20} color="#95691B" />
                                ),
                                textColor: "#95691B",
                                onPress: () => {
                                    navigation.navigate("Pack")
                                    closeDrawer();
                                }
                            },
                            {
                                title: i18n.t("historical_events"),
                                icon: "history-edu",
                                iconColor: "#95691B",
                                textColor: "#95691B",
                                onPress: () => {
                                    navigation.navigate("Pack")
                                    closeDrawer();
                                }
                            },
                        ]
                    }
                ]
            }
        />
    )
}