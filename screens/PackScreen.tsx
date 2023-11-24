import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import globalStyles from "../styles/globalStyles";
import Buttons from "../components/Buttons";
import i18n from "../scripts/i18n";

export default function PackScreen() {
    return(
        <View style={[globalStyles.screenStandard]}>
            <View style={[globalStyles.standardHeight, globalStyles.containerWhitespacePadding]}>
                <View style={styles.titleSection}>
                    <View>
                        <Text style={styles.titleText}>The</Text>
                        <Text style={[styles.titleText, {fontWeight: "600"}]}>Romance</Text>
                        <Text style={styles.titleText}>Pack</Text>
                        <Text style={styles.premiumText}>Premium</Text>
                    </View>
                    <Image
                        style={{ height: 106, width: 102 }}
                        source={require("../assets/images/romance.png")}
                    />
                </View>
                <TouchableOpacity style={styles.buyButton}>
                    <Text style={styles.buyButtonText}>Buy Pack $3.99</Text>
                </TouchableOpacity>
                <View>
                    <Text style={styles.description}>
                        Ten <Text style={globalStyles.highlightText}>high quality Libs</Text> about romance, written with love by the Fun Libs Team!
                        Stories include <Text style={globalStyles.highlightText}>Romeo and Juliet</Text>, <Text style={globalStyles.highlightText}>Twilight</Text> and many more heartwarming stories!
                    </Text>
                </View>
                <View>
                    <Text style={styles.title}>Other packs</Text>
                    <Buttons
                        buttons={
                            [{
                                label: i18n.t('gaming'),
                                icon: "sports-esports",
                                iconColor: "#6294C9",
                                onPress: () => {
                                }
                            },
                            {
                                label: i18n.t('animals'),
                                icon: "pets",
                                iconColor: "#6294C9",
                                onPress: () => {
                                }
                            },
                            {
                                label: i18n.t('romance'),
                                icon: "favorite",
                                iconColor: "#6294C9",
                                onPress: () => {
                                }
                            },
                            ]
                        }
                        buttonStyle={{ borderRadius: 10, borderColor: "#6294C9", borderWidth: 2, borderStyle: "dashed", backgroundColor: "white", minWidth: 30, height: 44 }}
                        containerStyle={{ justifyContent: "flex-start" }}
                        labelStyle={{ fontSize: 17, fontWeight: 500 }}
                        sideScroll={true}
                    />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    titleSection: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    titleText: {
        fontSize: 24
    },

    premiumText: {
        // Gold!
        color: "#95691B",
        fontSize: 11,
    },

    buyButton: {
        borderWidth: 2,
        borderStyle: "dashed",
        borderColor: "#95691B",
        borderRadius: 10,
        padding: 10,
        textAlign: "center",
        marginTop: 10,
    },

    buyButtonText: {
        fontSize: 20,
        color: "#95691B",
        fontWeight: "600"
    },

    description: {
        fontSize: 14,
        lineHeight: 26,
        marginVertical: 10,
        color: "#49454F"
    },

    title: {
        fontSize: 20,
        fontWeight: "600",
        textAlign: "left",
    }
})