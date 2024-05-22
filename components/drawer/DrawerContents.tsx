import React, { ReactNode } from 'react';
import { View, Text, TouchableOpacity, ImageRequireSource, Image, StyleProp, ViewStyle, ImageStyle, StyleSheet } from 'react-native';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Divider } from '@rneui/themed';
import { ScrollView as DrawerScrollView } from "react-native-gesture-handler";

interface DrawerContentsProps {
    title: string;
    imageSrc?: ImageRequireSource;
    imageStyle?: StyleProp<ImageStyle>
    containerStyle?: StyleProp<ViewStyle>
    sections: Array<{
        title?: string;
        links: Array<{
            title?: string;
            description?: string;
            icon?: string;
            iconColor?: string;
            iconComponent?: ReactNode
            textColor?: string;
            onPress: () => void;
            component?: ReactNode;
        }>;
    }>;
}

export default function DrawerContents({ title, imageSrc, imageStyle, containerStyle, sections }: DrawerContentsProps) {
    return (
        <DrawerScrollView contentContainerStyle={containerStyle}>
            <View style={styles.topSection}>
                <Text style={[styles.text, { fontSize: 20 }]}>{title}</Text>
                {imageSrc && (
                    <Image
                        style={[styles.image, imageStyle]}
                        source={imageSrc}
                    />
                )}
            </View>

            {sections.map((section, index) => (
                <View key={index + "1"}>
                    <View key={index} style={styles.linkGroup}>
                        <Text style={[styles.text, { fontSize: 17 }]}>{section.title}</Text>
                        {section.links.map((link, linksIndex) => (
                            <TouchableOpacity
                                key={linksIndex}
                                onPress={link.onPress}
                            >
                                {link.component ? (
                                    <>
                                        {link.component}
                                    </>
                                ) : (

                                    <View style={styles.linkSection}>
                                        <View style={styles.linkTextContainer}>
                                            <View style={styles.linkTitleContainer}>
                                                {link.iconComponent ? (
                                                    <>
                                                        {link.iconComponent}
                                                    </>
                                                ) : (
                                                    <MaterialIcons
                                                        style={{ color: link.iconColor ? link.iconColor : "#49454F" }}
                                                        name={link.icon ? link.icon : "trip-origin"}
                                                        size={20}
                                                    />
                                                )}
                                                <Text style={[styles.text, link.textColor ? { color: link.textColor } : null]}>{link.title}</Text>
                                            </View>
                                            {link.description && (
                                                <View style={styles.linkDescription}>
                                                    <Text style={{ lineHeight: 24, fontSize: 14 }}>{link.description}</Text>
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Divider color="#CAC4D0" style={{ marginBottom: 15, marginTop: 14 }} />
                </View>
            ))}
        </DrawerScrollView>
    )
}

const styles = StyleSheet.create({
    topSection: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: 100
    },

    image: {
        height: 48,
        width: 48,
        justifyContent: "center",
        alignSelf: "center"
    },

    linkGroup: {
        gap: 18
    },

    linkSection: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },

    text: {
        fontSize: 15,
        color: "#49454F",
        fontWeight: "600",
    },

    linkTextContainer: {
        flexDirection: "column",
    },

    linkTitleContainer: {
        gap: 6,
        flexDirection: "row",
    },

    linkDescription: {
        marginLeft: 26,
    }
})