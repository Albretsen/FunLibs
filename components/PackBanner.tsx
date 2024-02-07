import React, {createContext, useContext, useState, useEffect } from "react";
import FileManager from "../scripts/file_manager";
import { Text, View, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import PulseAnimation from "./PulseAnimation";
import { Feather } from '@expo/vector-icons';
import { useNavigation, NavigationProp, ParamListBase } from "@react-navigation/native";
import { season } from "../scripts/seasons";
import IAP from "../scripts/IAP";
import PackManager from "../scripts/PackManager";

interface PackBannerContextType {
    showPackBanner: boolean;
    setShowPackBanner: (newState: boolean) => Promise<void>;
    lastClosedSeason: string;
    setLastClosedSeason: (season: string) => Promise<void>;
}

export const PackBannerContext = createContext<PackBannerContextType | undefined>(undefined);

export const PackBannerProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [showPackBanner, setShowPackBanner] = useState<boolean>(false);
    const [lastClosedSeason, setLastClosedSeasonState] = useState<string>("");

    const handleSetShowPackBanner = async (newState: boolean) => {
        setShowPackBanner(newState);
        await FileManager._storeData("PackBannerState", newState.toString());
    };

    const setLastClosedSeason = async (season: string) => {
        setLastClosedSeasonState(season);
        await FileManager._storeData("LastClosedSeason", season);
    };

    useEffect(() => {
        async function loadInitialState() {
            const storedPackBannerState = await FileManager._retrieveData("PackBannerState");
            const storedLastClosedSeason = await FileManager._retrieveData("LastClosedSeason");

            console.log("storedPackBannerState: " + storedPackBannerState);
            console.log("storedLastClosedSeason: " + storedLastClosedSeason);
            
            setShowPackBanner(false);
            setLastClosedSeasonState(storedLastClosedSeason + "");
        }
        loadInitialState();
    }, []);

    return (
        <PackBannerContext.Provider value={{ showPackBanner, setShowPackBanner: handleSetShowPackBanner, lastClosedSeason, setLastClosedSeason }}>
            {children}
        </PackBannerContext.Provider>
    );
};

export function PackBanner() {
    const navigation = useNavigation<NavigationProp<ParamListBase>>();
    const context = useContext(PackBannerContext);
    if (!context) {
        throw new Error('PackBanner must be used within a PackBannerProvider');
    }
    const { showPackBanner, setShowPackBanner, lastClosedSeason, setLastClosedSeason } = context;

    const currentDate = new Date();
    const year = currentDate.getFullYear();

    const hidePackBanner = () => {
        setShowPackBanner(false);
        setLastClosedSeason(season() + year);
    };

    interface BannerContent {
        packName: "default_pack" | "romance_pack" | "easter_pack" | "christmas_pack";
        title?: string;
        message?: string;
        discountText?: string;
        colors: string[]; // An array of strings for the gradient colors
        onPress?: () => null;
    }

    const [bannerContent, setBannerContent] = useState<BannerContent>({
        packName: "default_pack",
        title: "Lib Packs 📚",
        message: "Check out our selection of premium libs!",
        colors: ["#4C669F", "#3B5998"], // Default gradient colors
    })

    interface BannerContentLookupTypes {
        [id: string] : any;
        "romance_pack": {};
        "easter_pack": {};
        "christmas_pack": {};
        "default_pack": {};
    }

    const BannerContentLookup: BannerContentLookupTypes = {
        "default_pack": {
            packName: "default_pack",
            title: "Lib Packs 📚",
            message: "Check out our selection of premium libs!",
            colors: ["#4C669F", "#3B5998"],
        },

        "romance_pack": {
            packName: "romance_pack",
            title: "Happy Valentines!",
            message: "Celebrate the season of love with the Romance Pack!",
            colors: ["#FF257E", "#FF2644"],
        },

        "easter_pack": {
            packName: "easter_pack",
            title: "Happy Easter!",
            message: "Celebrate with the Easter Pack!",
            colors: ["#f298f4", "#9386e6"],
        },

        "christmas_pack": {
            packName: "christmas_pack",
            title: "Merry Christmas!",
            message: "Celebrate the holly season with the Christmas Pack!",
            colors: ["#378b29", "#74d680"],
        },
    }


    useEffect(() => {
        const fetch = async () => {
            let discountedPack: string = season();

            const currentDate = new Date();
            const year = currentDate.getFullYear();

            if (lastClosedSeason === season() + year) {
                setShowPackBanner(false);
                return;
            };

            let alreadyPurchased = await PackManager.verifyPurchase(discountedPack);
            if (alreadyPurchased) {
                setShowPackBanner(false);
                return;
            };;
    
            let discountedPackInfo: any = await IAP.getDiscountedProductInfo();

            console.log(discountedPack, "HERE!")
            if (discountedPack && (discountedPack === discountedPackInfo.discountedProductId) && lastClosedSeason !== discountedPack + year) {
                let bannerContent = BannerContentLookup[discountedPack];
                bannerContent.discountText = "Enjoy " + discountedPackInfo.discountPercentage + "% off";
                bannerContent.onPress = () => {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: "Pack", params: { packName: discountedPack.split("_")[0] } }],
                    });
                };

                setShowPackBanner(true);
                setBannerContent(bannerContent);
            } else {
                setShowPackBanner(false);
            }
        };

        setShowPackBanner(false);
        fetch();
    }, [])

    const images = {
        "default_pack": require("../assets/images/romance-banner.png"),
        "romance_pack": require("../assets/images/romance-banner.png"),
        "easter_pack": require("../assets/images/easter-banner.png"),
        "christmas_pack": require("../assets/images/christmas-banner.png"),
    };

    return(
        <>
            {showPackBanner && (

                <LinearGradient
                    colors={bannerContent.colors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.container}
                >
                    <ImageBackground
                        source={images[bannerContent.packName]}
                    >
                        <View style={[styles.banner, styles.overlay]}>
                            <View style={styles.textContainer}>
                                <Text style={[styles.title, styles.text]}>{bannerContent.title}</Text>
                                <Text style={styles.text}>{bannerContent.message}</Text>
                                <PulseAnimation duration={3000}>
                                    <Text style={styles.text}>{bannerContent.discountText}</Text>
                                </PulseAnimation>
                                <TouchableOpacity style={styles.goToButton} onPress={() => {
                                    bannerContent.onPress && bannerContent.onPress();
                                }}>
                                    <Text style={styles.goToButtonText}>🎉 Go to pack 🎉</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity style={styles.close} onPress={hidePackBanner}>
                                <Feather name="x" size={30} color="white" />
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>
                </LinearGradient>
            )}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 8,
        marginTop: 10,
        marginHorizontal: 4,
        overflow: "hidden"
    },

    overlay: {
        borderRadius: 8,
        // Makes the background image slightly less pronounced
        backgroundColor: "rgba(0, 0, 0, 0.15)",
    },

    banner: {
        flexDirection: "row",
        padding: 10,
        justifyContent: "center",
        alignItems: "center"
    },

    close: {
        position: "absolute",
        top: 4,
        right: 4,
    },

    textContainer: {
        gap: 4,
        justifyContent: "center",
        alignItems: "center",
    },

    text: {
        fontSize: 14,
        padding: 4,
        borderRadius: 6,
        color: "white",
        fontWeight: "500",
        textAlign: "center",
        backgroundColor: "rgba(0, 0, 0, 0.35)",
    },

    title: {
        fontSize: 16,
    },

    goToButton: {
        width: "90%",
        paddingVertical: 10,
        backgroundColor: "rgba(0, 0, 0, 0.45)",
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center"
    },

    goToButtonText: {
        color: "white",
        fontSize: 16,
        textAlign: "center",
        fontWeight: "600",
    }
})