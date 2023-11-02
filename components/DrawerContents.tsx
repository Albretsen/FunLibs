import React from 'react';
import { View, Text, TouchableOpacity, ImageRequireSource, Image, StyleProp, ImageStyle, StyleSheet } from 'react-native';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Divider } from '@rneui/themed';

interface DrawerContentsProps {
    title: string;
    imageSrc?: ImageRequireSource;
    imageStyle?: StyleProp<ImageStyle>
    sections: Array<{
        title?: string;
        links: Array<{
            title: string;
            icon?: string;
            iconColor?: string;
            textColor?: string;
            onPress: () => void;
        }>;
    }>;
}

export default function DrawerContents({title, imageSrc, imageStyle, sections}: DrawerContentsProps) {
    return(
        <View>
            <View style={styles.topSection}>
                <Text style={styles.text}>{title}</Text>
                {imageSrc && (
                    <Image
                        style={[styles.image, imageStyle]}
                        source={imageSrc}
                    />
                )}
            </View>

            {sections.map((section, index) => (
                <View key={index} style={styles.linkGroup}>
                    <Text style={styles.text}>{section.title}</Text>
                    {section.links.map((link, linksIndex) => (
                        <TouchableOpacity
                            key={linksIndex}
                            style={styles.linkSection}
                            onPress={link.onPress}
                        >
                            <MaterialIcons
                                style={{ color: link.iconColor ? link.iconColor : "#49454F" }}
                                name={link.icon ? link.icon : "trip-origin"}
                                size={20}
                            />
                            <Text style={[styles.text, link.textColor ? {color: link.textColor} : null]}>{link.title}</Text>
                        </TouchableOpacity>
                    ))}
                <Divider color="#CAC4D0" style={{ marginBottom: 20 }} />
                </View>
            ))}
        </View>
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
        gap: 34
    },

    linkSection: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },

    text: {
        fontSize: 15,
        color: "#49454F",
        fontWeight: "600",
        lineHeight: 0
    }
})