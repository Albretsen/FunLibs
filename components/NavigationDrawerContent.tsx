import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import DrawerContents from './DrawerContents';
import i18n from '../scripts/i18n';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { Platform, ViewStyle } from 'react-native'; // Import Platform and ViewStyle module for containerStyle

// Define the types for the navigation parameters
type RootStackParamList = {
    Home: undefined;
    Create: undefined;
    Pack: { packName?: string };
    Browse: { initialTab?: string, category?: string};
    Read: undefined;
};

// Type for the navigation prop specific to this component
type NavigationDrawerContentNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

// Props interface
interface NavigationDrawerContentProps {
    navigation: NavigationDrawerContentNavigationProp;
    closeDrawer: () => void;
}

// Link Section interface
interface LinkSection {
    title: string;
    links: Link[];
}

interface Link {
    title: string;
    icon?: string; // Optional because some links use iconComponent instead
    iconComponent?: JSX.Element; // For custom icons not part of a library
    iconColor?: string;
    textColor?: string;
    onPress: () => void;
}

const NavigationDrawerContent: React.FC<NavigationDrawerContentProps> = ({ navigation, closeDrawer }) => {
    const sections: LinkSection[] = [
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
                        navigation.navigate("Browse", { initialTab: "Official" });
                        closeDrawer();
                    }
                },
                {
                    title: i18n.t("community_stories"),
                    icon: "public",
                    onPress: () => { 
                        navigation.navigate("Browse", { initialTab: "Community" });
                        closeDrawer();
                    }
                },
            ]
        },
        {
            title: i18n.t("my_fun_libs"),
            links: [
                {
                    title: i18n.t("create_a_lib"),
                    icon: "edit",
                    onPress: () => { 
                        navigation.navigate("Create");
                        closeDrawer();
                    }
                },
                {
                    title: i18n.t("my_libs"),
                    icon: "face",
                    onPress: () => {
                        navigation.navigate("Browse", { initialTab: "Community", category: "myContent" });
                        closeDrawer();
                    }
                },
                {
                    title: i18n.t("read_libs"),
                    icon: "local-library",
                    onPress: () => { 
                        navigation.navigate("Read");
                        closeDrawer();
                    }
                },
            ]
        }
    ];

    // Exclude packs on iOS
    if (Platform.OS !== 'ios') {
        sections.push(
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
                            navigation.navigate("Pack", {packName: "romance"});
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
                            navigation.navigate("Pack", {packName: "christmas"});
                            closeDrawer();
                        }
                    },
                    {
                        title: i18n.t("historical_events"),
                        icon: "history-edu",
                        iconColor: "#95691B",
                        textColor: "#95691B",
                        onPress: () => {
                            navigation.navigate("Pack", {packName: "historic"});
                            closeDrawer();
                        }
                    },
                    {
                        title: i18n.t("easter"),
                        iconComponent: (
                            <MaterialCommunityIcons name="egg-easter" size={20} color="#95691B" />
                        ),
                        textColor: "#95691B",
                        onPress: () => {
                            navigation.navigate("Pack", {packName: "easter"});
                            closeDrawer();
                        }
                    },
                ]
            }
        );
    }

    return (
        <DrawerContents
            title={i18n.t("fun_libs")}
            containerStyle={{ paddingHorizontal: 26 } as ViewStyle} // Explicitly cast to ViewStyle to avoid type errors
            sections={sections}
        />
    );
};

export default NavigationDrawerContent;
