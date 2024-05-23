import React, { ReactNode } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import DrawerContents from './DrawerContents';
import i18n from '../../scripts/i18n';
import { MaterialCommunityIcons, FontAwesome5, FontAwesome } from '@expo/vector-icons';
import { Platform, ViewStyle, Image, View, Text, Linking, TouchableOpacity } from 'react-native'; // Import Platform and ViewStyle module for containerStyle
import ImageDrawerLink from './ImageDrawerLink';

// Define the types for the navigation parameters
type RootStackParamList = {
    Home: undefined;
    Create: undefined;
    Pack: { packName?: string };
    Browse: { initialTab?: string, category?: string };
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
    title?: string;
    links: Link[];
}

interface Link {
    title?: string;
    description?: string;
    icon?: string; // Optional because some links use iconComponent instead
    iconComponent?: JSX.Element; // For custom icons not part of a library
    iconColor?: string;
    textColor?: string;
    onPress: () => void;
    component?: ReactNode;
}

const NavigationDrawerContent: React.FC<NavigationDrawerContentProps> = ({ navigation, closeDrawer }) => {
    const sections: LinkSection[] = [
        {
            title: i18n.t("browse"),
            links: [
                {
                    title: i18n.t("home"),
                    description: "An overview of the Fun Libs app.",
                    icon: "home",
                    iconColor: "#6294C9",
                    onPress: () => {
                        navigation.navigate("Home");
                        closeDrawer();
                    }
                },
                {
                    title: i18n.t("official_stories"),
                    description: "Browse official libs written by the Fun Libs team.",
                    icon: "verified",
                    iconColor: "#6294C9",
                    onPress: () => {
                        navigation.navigate("Browse", { initialTab: "Official" });
                        closeDrawer();
                    }
                },
                {
                    title: i18n.t("community_stories"),
                    description: "Browse custom libs written by the Fun Libs community.",
                    icon: "public",
                    iconColor: "#6294C9",
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
                    description: "Write your own lib and publish it for others to play!",
                    icon: "edit",
                    iconColor: "#6294C9",
                    onPress: () => {
                        navigation.navigate("Create");
                        closeDrawer();
                    }
                },
                {
                    title: i18n.t("my_libs"),
                    description: "Browse all the libs you're written.",
                    icon: "face",
                    iconColor: "#6294C9",
                    onPress: () => {
                        navigation.navigate("Browse", { initialTab: "Community", category: "myContent" });
                        closeDrawer();
                    }
                },
                {
                    title: i18n.t("read_libs"),
                    description: "Read the libs you've played again.",
                    icon: "local-library",
                    iconColor: "#6294C9",
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
                        component: (
                            <ImageDrawerLink
                                variant="romance"
                                title={i18n.t("romance_pack")}
                                desciption="Dive into a world of romance with heartwarming libs about love!"
                            />
                        ),
                        onPress: () => {
                            navigation.navigate("Pack", { packName: "romance" });
                            closeDrawer();
                        }
                    },
                    {
                        component: (
                            <ImageDrawerLink
                                variant="christmas"
                                title={i18n.t("christmas_pack")}
                                desciption="Get into the festive spirit with magical Christmas libs!"
                            />
                        ),
                        onPress: () => {
                            navigation.navigate("Pack", { packName: "christmas" });
                            closeDrawer();
                        }
                    },
                    {
                        component: (
                            <ImageDrawerLink
                                variant="historic"
                                title={"Historic pack"}
                                desciption="Immerse yourself in history with historical libs!"
                            />
                        ),
                        onPress: () => {
                            navigation.navigate("Pack", { packName: "historic" });
                            closeDrawer();
                        }
                    },
                    {
                        component: (
                            <ImageDrawerLink
                                variant="easter"
                                title={i18n.t("easter_pack")}
                                desciption="Explore the vibrant joy of Easter with enchanting Easter-themed libs!"
                            />
                        ),
                        onPress: () => {
                            navigation.navigate("Pack", { packName: "easter" });
                            closeDrawer();
                        }
                    },
                ]
            }
        );
    }

    return (
        <DrawerContents
            topComponent={
                <TouchableOpacity onPress={() => {
                    Linking.openURL("https://play.google.com/store/apps/details?id=com.asgalb.DailyJokes");
                }}>
                    <View style={{ marginTop: -25, marginBottom: -10, gap: 5, }}>
                        <Image
                            style={{ width: "100%", height: 100, borderRadius: 8, }}
                            source={require("../../assets/images/daily-jokes-banner.png")}
                        />
                        <Text style={{ lineHeight: 24, fontSize: 14, marginLeft: 20 }}>{"Laugh, vote & win in our newest app Daily Jokes!"}</Text>
                    </View>
                </TouchableOpacity>
            }
            title={i18n.t("fun_libs")}
            containerStyle={{ paddingHorizontal: 26 } as ViewStyle} // Explicitly cast to ViewStyle to avoid type errors
            sections={sections}
        />
    );
};

export default NavigationDrawerContent;
