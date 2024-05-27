import { View, Image, Pressable, StyleSheet, ViewStyle, StyleProp } from "react-native";

export const AVATAR_AMOUNT = 19;

// As there are only 19 new avatars, and there used to be 30,
// The remaining 11 are copies of the 11 first avatars.
// These last 11 are not possible to pick in the avatar selector.
type AvatarSource = ReturnType<typeof require>;
const avatars: Record<number | string, AvatarSource> = {
    0: require("../assets/avatars/0.png"),
    1: require("../assets/avatars/1.png"),
    2: require("../assets/avatars/2.png"),
    3: require("../assets/avatars/3.png"),
    4: require("../assets/avatars/4.png"),
    5: require("../assets/avatars/5.png"),
    6: require("../assets/avatars/6.png"),
    7: require("../assets/avatars/7.png"),
    8: require("../assets/avatars/8.png"),
    9: require("../assets/avatars/9.png"),
    10: require("../assets/avatars/10.png"),
    11: require("../assets/avatars/11.png"),
    12: require("../assets/avatars/12.png"),
    13: require("../assets/avatars/13.png"),
    14: require("../assets/avatars/14.png"),
    15: require("../assets/avatars/15.png"),
    16: require("../assets/avatars/16.png"),
    17: require("../assets/avatars/17.png"),
    18: require("../assets/avatars/18.png"),
    19: require("../assets/avatars/0.png"),
    20: require("../assets/avatars/1.png"),
    21: require("../assets/avatars/2.png"),
    22: require("../assets/avatars/3.png"),
    23: require("../assets/avatars/4.png"),
    24: require("../assets/avatars/5.png"),
    25: require("../assets/avatars/6.png"),
    26: require("../assets/avatars/7.png"),
    27: require("../assets/avatars/8.png"),
    28: require("../assets/avatars/9.png"),
    29: require("../assets/avatars/3.png"),
    "no-avatar-24": require("../assets/avatars/no-avatar-24.png"),
    "no-avatar-48": require("../assets/avatars/no-avatar-48.png"),
}

interface AvatarProps {
    id: number;
    noAvatar?: "24" | "48";
    backgroundColor?: string;
    size?: number;
    style?: StyleProp<ViewStyle>;
}

export default function Avatar(props: AvatarProps) {
    const { id, noAvatar, backgroundColor = "#638BD5", size = 45, style } = props;

    if (noAvatar == "24" || noAvatar == "48") {
        return (
            <View style={style}>
                <Image
                    style={[
                        {
                            height: size,
                            width: size,
                            tintColor: "#5f6368",
                        }
                    ]}
                    source={avatars["no-avatar-" + noAvatar]} />
            </View>
        )
    }

    return (
        <View style={[
            styles.fullCircle,
            {
                backgroundColor: backgroundColor,
                height: size - 6 / 100 * size,
                width: size - 6 / 100 * size
            },
            style
        ]}>
            <View style={[
                styles.lowerCircle,
                {
                    height: size + 20, // Allows room for image overflow without cutoff
                    width: size - 6 / 100 * size
                }
            ]}>
                <Image style={[
                    styles.image,
                    {
                        height: size,
                        width: size,
                    }
                ]} source={avatars[id]} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    fullCircle: {
        borderRadius: 100,
        justifyContent: "flex-end",
        alignItems: "center",
    },

    lowerCircle: {
        borderBottomRightRadius: 100,
        borderBottomLeftRadius: 100,
        overflow: "hidden",
        alignItems: "center",
    },

    image: {
        position: "absolute",
        bottom: 0,
    }
})