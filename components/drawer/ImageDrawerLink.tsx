import { Text, View, StyleSheet, ImageBackground } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

interface ImageDrawerLinkProps {
    variant: "romance" | "easter" | "historic" | "christmas",
    title: string,
    desciption: string,
}

export default function ImageDrawerLink(props: ImageDrawerLinkProps) {
    const { variant, title, desciption } = props;

    const gradientColors = {
        "romance": ["#FF257E", "#FF2644"],
        "easter": ["#f298f4", "#9386e6"],
        "historic": ["#f298f4", "#9386e6"],
        "christmas": ["#378b29", "#74d680"],
    }

    const images = {
        "romance": require("../../assets/images/romance-banner.png"),
        "easter": require("../../assets/images/easter-banner.png"),
        "historic": require("../../assets/images/historic-banner.png"),
        "christmas": require("../../assets/images/christmas-banner.png"),
    };

    return (
        <LinearGradient
            colors={gradientColors[variant]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <ImageBackground
                source={images[variant]}
            >
                <View style={[styles.banner]}>
                    <View style={styles.textContainer}>
                        <Text style={[styles.text, styles.title, styles.shadow]}>{title}</Text>
                        <Text style={[styles.text, styles.shadow]}>{desciption}</Text>
                    </View>
                </View>
            </ImageBackground>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 8,
        overflow: "hidden"
    },

    banner: {
        flexDirection: "row",
        alignItems: "center",
    },

    textContainer: {
        gap: 4,
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        borderRadius: 6,
        padding: 20,
        width: "100%"
    },

    text: {
        fontSize: 14,
        color: "white",
        fontWeight: "500",
    },

    title: {
        fontSize: 17,
    },

    shadow: {
        textShadowColor: "rgba(0, 0, 0, 0.45)",
        textShadowOffset: { width: 0, height: 2.5 },
        textShadowRadius: 4
    }
})