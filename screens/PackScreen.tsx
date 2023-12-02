import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import globalStyles from "../styles/globalStyles";
import Buttons from "../components/Buttons";
import i18n from "../scripts/i18n";
import ListManager from "../components/ListManager";
import PackManager from "../scripts/PackManager";
import { ScrollView } from "react-native-gesture-handler";
import { RouteProp } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { DialogTrigger } from "../components/Dialog";

type PackScreenRouteParams = {
    packName: string;
}

type Props = {
    route: RouteProp<{ params: PackScreenRouteParams }, 'params'>;
}
  

export default function PackScreen({ route } : Props) {
    const { packName } = route.params;
    console.log(packName)
    const [packData, setPackdata] = useState((PackManager.packs as any)[packName]);
    const [name, setName] = useState(packData.name);
    const [description, setDescription] = useState(packData.description)
    const [imageName, setImageName] = useState(packData.image);
    const [price, setPrice] = useState("");

    const [pack, setPack] = useState(packName);
    const [showBuyButton, setShowBuyButton] = useState(false);

    type ImageMap = {
        [key: string]: ReturnType<typeof require>;
    };

    const imageMap: ImageMap = {
        'christmas': require('../assets/images/christmas.png'),
        'historic': require('../assets/images/historic.png'),
        'romance': require('../assets/images/romance.png'),
    };

    const imageSource = imageMap[imageName] || require('../assets/images/historic.png');
    
    useEffect(() => {
        const checkPrice = async () => {
            try {
                const price = await PackManager.getPackPrice(pack + "_pack");
                console.log("Price: ", price, "for pack: ", pack + "_pack");
                setPrice(price);
            } catch (error) {
                console.error("Error retrieving price:", error);
                // Optionally, handle the error case (e.g., by showing an error message)
            }
        };

        checkPrice();
    }, []);

    // Runs whenever the user clicks the "other packs" button
     useEffect(() => {
        setPackdata((PackManager.packs as any)[pack]);

        const checkPurchase = async () => {
            try {
                setShowBuyButton(true);
                const purchaseVerified = await PackManager.verifyPurchase(pack + "_pack");
                console.log("Purchase verified: ", purchaseVerified);
                setShowBuyButton(!purchaseVerified);
            } catch (error) {
                console.error("Error verifying purchase:", error);
                // Optionally, handle the error case (e.g., by showing an error message)
            }
        };

        checkPurchase();
    }, [pack])

    useEffect(() => {
        setName(packData.name);
        setDescription(packData.description);
        setImageName(packData.image);
    }, [packData]);
    
    let purchasePack = async () => {
        console.log("Buying pack: ", pack + "_pack");
        try {
            const purchaseVerified = await PackManager.verifyPurchase(pack);
            if(purchaseVerified) {
                console.log("Purchase already verified");
                return;
            }
            const purchaseSuccessful = await PackManager.buyPack(pack + "_pack");
            if(purchaseSuccessful) {
                setShowBuyButton(false);
                setShowDialogConfirmation(true);
            }
        } catch (error) {
            console.error("Error buying pack:", error);
            // Optionally, handle the error case (e.g., by showing an error message)
        }
    }

    const [showDialogConfirmation, setShowDialogConfirmation] = useState(false);

    return(
        <View style={[globalStyles.screenStandard]}>
            <View style={[globalStyles.standardHeight, globalStyles.containerWhitespacePadding]}>
                <View style={styles.titleSection}>
                    <View>
                        <Text style={styles.titleText}>The</Text>
                        <Text style={[styles.titleText, {fontWeight: "600"}]}>{name}</Text>
                        <Text style={styles.titleText}>Pack</Text>
                        <Text style={styles.premiumText}>Premium</Text>
                    </View>
                    <Image
                        style={{ height: 106, width: 102 }}
                        source={imageSource}
                    />
                </View>
                {showBuyButton && (
                    <TouchableOpacity onPress={purchasePack} style={styles.buyButton}>
                        <Text style={styles.buyButtonText}>🎉 Buy Pack {price} 🎉</Text>
                    </TouchableOpacity>
                )}
                <ScrollView>
                    <View>
                        <Text style={styles.description}>
                            {description}
                        </Text>
                    </View>
                    <View>
                        <Text style={styles.title}>Other packs</Text>
                        <Buttons
                            buttons={[
                                // [{
                                //     label: i18n.t('gaming'),
                                //     icon: "sports-esports",
                                //     iconColor: "#6294C9",
                                //     onPress: () => {
                                //         setPack("gaming_pack");
                                //     }
                                // },
                                // {
                                //     label: i18n.t('animals'),
                                //     icon: "pets",
                                //     iconColor: "#6294C9",
                                //     onPress: () => {
                                //         setPack("animals_pack");
                                //     }
                                // },
                                {
                                    label: i18n.t('romance'),
                                    iconComponent: <MaterialCommunityIcons name="hand-heart-outline" size={20} color="#6294C9" />,
                                    onPress: () => {
                                        setPack("romance");
                                    }
                                },
                                {
                                    label: i18n.t('christmas'),
                                    iconComponent: <FontAwesome5 name="candy-cane" size={20} color="#6294C9" />,
                                    onPress: () => {
                                        setPack("christmas");
                                    }
                                },
                                {
                                    label: i18n.t('historical_events'),
                                    icon: "history-edu",
                                    iconColor: "#6294C9",
                                    onPress: () => {
                                        setPack("historic");
                                    }
                                },
                            ]}
                            buttonStyle={{ borderRadius: 10, borderColor: "#6294C9", borderWidth: 1, backgroundColor: "white", minWidth: 30, height: 44 }}
                            containerStyle={{ justifyContent: "flex-start" }}
                            labelStyle={{ fontSize: 17, fontWeight: "500" }}
                            sideScroll={true}
                        />
                        <Text style={styles.title}>{name} libs</Text>
                    </View>
                    <>
                        <ListManager paddingBottom={25} showPreview={true} pack={pack + "_pack"} locked={showBuyButton}></ListManager>
                    </>
                </ScrollView>
            </View>
            <DialogTrigger
                id="dialogConfirmation"
                show={showDialogConfirmation}
                // onCancel={() => setShowDialogConfirmation(false)}
                onConfirm={() => setShowDialogConfirmation(false)}
                cancelLabel=" "
            >
                <Text style={{fontSize: 14, fontWeight: "600"}}>Thank you for buying the {name} pack!</Text>
            </DialogTrigger>
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
        // borderStyle: "dashed",
        borderColor: "#95691B",
        borderRadius: 10,
        padding: 10,
        textAlign: "center",
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: "#fffbeb"
    },

    buyButtonText: {
        fontSize: 20,
        color: "#95691B",
        fontWeight: "600",
        textAlign: "center"
    },

    description: {
        fontSize: 14,
        lineHeight: 26,
        marginBottom: 10,
        color: "#49454F"
    },

    title: {
        fontSize: 20,
        fontWeight: "600",
        textAlign: "left",
    }
})