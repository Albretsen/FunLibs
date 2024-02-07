import React, { useState, useEffect, useContext } from "react";
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
import { ActivityIndicator } from "react-native-paper";
import FirebaseManager from "../scripts/firebase_manager";
import { ToastContext } from "../components/Toast";
import { ScreenContext } from "../App";
import { useIsFocused } from '@react-navigation/native';
import IAP from "../scripts/IAP";

type PackScreenRouteParams = {
    packName: string;
};
  
type PackScreenProps = {
    route: RouteProp<{ params: PackScreenRouteParams }, 'params'>;
};

export default function PackScreen({ route } : PackScreenProps) {
    const isFocused = useIsFocused();
    const { setCurrentScreenName } = useContext(ScreenContext);

    useEffect(() => {
        if (isFocused) {
            setCurrentScreenName("PackScreen");
        }
    }, [isFocused]);

    const [isLoading, setIsLoading] = useState(false);
    const showToast = useContext(ToastContext);
    const { packName } = route.params;
    const [packData, setPackdata] = useState((PackManager.packs as any)[packName]);
    const [name, setName] = useState(packData.name);
    const [description, setDescription] = useState(packData.description)
    const [imageName, setImageName] = useState(packData.image);
    const [price, setPrice] = useState("");

    const [pack, setPack] = useState(packName);
    const [showBuyButton, setShowBuyButton] = useState(false);

    const [purchaseInProgress, setPurchaseInProgress] = useState(false);
    const [purchaseProgressText, setPurchaseProgressText] = useState("Buying pack...");

    type ImageMap = {
        [key: string]: ReturnType<typeof require>;
    };

    const imageMap: ImageMap = {
        'christmas': require('../assets/images/christmas.png'),
        'historic': require('../assets/images/historic.png'),
        'romance': require('../assets/images/romance.png'),
        'easter': require('../assets/images/easter.png'),
    };

    const imageSource = imageMap[imageName] || require('../assets/images/historic.png');
    
    const checkPrice = async () => {
        try {
            const price = await PackManager.getPackPrice(pack + "_pack");
            const discountInfo: any = await IAP.getDiscountedProductInfo();
            if (discountInfo.discountedProductId == pack + "_pack") {
                setPrice(`🎉 Get ${discountInfo.discountPercentage}% Off - ${price} 🎉`);
            } else {
                setPrice(`🎉 Buy Pack ${price} 🎉`);
            }
        } catch (error) {
            console.error("Error retrieving price:", error);
        }
    };

    useEffect(() => {
        checkPrice();
    }, []);

    // Runs whenever the user clicks the "other packs" button
    useEffect(() => {
        setPackdata((PackManager.packs as any)[pack]);
        setPrice("🎉 Buy Pack 🎉")

        const checkPurchase = async () => {
            try {
                setIsLoading(true); // Start loading
                setShowBuyButton(true);
                const purchaseVerified = await PackManager.verifyPurchase(pack + "_pack");
                console.log("Purchase verified: ", purchaseVerified);
                setShowBuyButton(!purchaseVerified);
            } catch (error) {
                console.error("Error verifying purchase:", error);
                // Optionally, handle the error case
            } finally {
                setIsLoading(false); // Stop loading regardless of result
            }
        };

        checkPurchase();
        checkPrice();
    }, [pack]);

    useEffect(() => {
        setName(packData.name);
        setDescription(packData.description);
        setImageName(packData.image);
    }, [packData]);
    
    let purchasePack = async () => {
        if (!FirebaseManager.currentUserData?.auth) {
            showToast("You must be signed in to buy packs. You can sign in via the account icon in the top right.");
            return;
        }
        setPurchaseInProgress(true);
        setPurchaseProgressText("Buying pack...");
        try {
            const purchaseVerified = await PackManager.verifyPurchase(pack);
            if(purchaseVerified) {
                console.log("Purchase already verified");
                return;
            }

            const purchaseSuccessful = await PackManager.buyPack(pack + "_pack");
            if(purchaseSuccessful) {
                // Purchase was successful
                setShowBuyButton(false);
                setShowDialogConfirmation(true);
                setPurchaseInProgress(false);
                setPurchaseProgressText("Pack bought! Please wait...");
            } else {
                // Purchase was not successful
                setPurchaseInProgress(false);
                setPurchaseProgressText("Purchase failed");
                showToast("Purchase did not go through");
            }
        } catch (error) {
            // Purchase failed
            console.error("Error buying pack:", error);
            setPurchaseInProgress(false);
            setPurchaseProgressText("Purchase failed");
            showToast("Purchase did not go through");
            // Optionally, handle the error case (e.g., by showing an error message)
        }
    }

    const [showDialogConfirmation, setShowDialogConfirmation] = useState(false);

    useEffect(() => {
        if (route.params.packName) {
            const newPackName = route.params.packName;
            const newPackData = (PackManager.packs as any)[newPackName];
            setPackdata(newPackData);
    
            // Update state with new pack details
            setName(newPackData.name);
            setDescription(newPackData.description);
            setImageName(newPackData.image);
        }
    }, [route.params]);

    return(
        <View style={[globalStyles.screenStandard]}>
            <View style={[globalStyles.standardHeight]}>
                <View style={globalStyles.containerWhitespaceMargin}>
                    <View style={styles.titleSection}>
                        <View>
                            <Text style={styles.titleText}>The</Text>
                            <Text style={[styles.titleText, {fontWeight: "600"}]}>{name}</Text>
                            <Text style={styles.titleText}>Pack</Text>
                            <Text style={styles.premiumText}>Premium</Text>
                        </View>
                        <Image
                            style={{ height: 112, width: 144 }}
                            source={imageSource}
                        />
                    </View>  
                    {showBuyButton && (
                        <TouchableOpacity onPress={purchasePack} style={styles.buyButton}>
                            <Text style={styles.buyButtonText}>{price}</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <ScrollView contentContainerStyle={globalStyles.containerWhitespacePadding}>
                    <View>
                        <Text style={styles.description}>
                            {description}
                        </Text>
                    </View>
                    <View>
                        <Text style={styles.title}>Other packs</Text>
                        <Buttons
                            buttons={[
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
                                {
                                    label: i18n.t('easter'),
                                    iconComponent: <MaterialCommunityIcons name="egg-easter" size={20} color="#6294C9" />,
                                    iconColor: "#6294C9",
                                    onPress: () => {
                                        setPack("easter");
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
                        {isLoading ? (
                            <ActivityIndicator size="large" color="#6294C9" />
                        ) : <ListManager
                                paddingBottom={50}
                                showPreview={true}
                                pack={pack + "_pack"}
                                locked={showBuyButton}
                            />
                        }
                    </>
                </ScrollView>
            </View>
            <DialogTrigger
                id="dialogConfirmation"
                show={showDialogConfirmation}
                onConfirm={() => setShowDialogConfirmation(false)}
                cancelLabel=" "
            >
                <Text style={{fontSize: 14, fontWeight: "600"}}>Thank you for buying the {name} pack!</Text>
            </DialogTrigger>
            {purchaseInProgress && (
                <View style={globalStyles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#6294C9" />
                    <Text>{purchaseProgressText}</Text>
                </View>
			)}
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