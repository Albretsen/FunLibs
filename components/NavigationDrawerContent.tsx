import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import DrawerContents from './DrawerContents';
import i18n from '../scripts/i18n';

type RootStackParamList = {
    Home: undefined;
    Create: undefined;
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
            sections={
                [
                    {
                        title: i18n.t("browse"),
                        links: [
                            {
                                title: i18n.t("home"),
                                icon: "home",
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
                                onPress: () => { 
                                    // Navigation code goes here
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
                    }
                ]
            }
        />
    )
}