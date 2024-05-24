import { TouchableOpacity, Linking, View, Image, Text, StyleProp, ViewStyle } from "react-native";

interface DailyJokesBannerProps {
    style?: StyleProp<ViewStyle>;
    showText?: boolean;
}

export default function DailyJokesBanner({ style, showText }: DailyJokesBannerProps) {
    return (
        <TouchableOpacity onPress={() => {
            Linking.openURL("https://play.google.com/store/apps/details?id=com.asgalb.DailyJokes");
        }}>
            <View style={style}>
                <Image
                    style={{ width: "100%", height: 100, borderRadius: 8, }}
                    source={require("../assets/images/daily-jokes-banner.png")}
                />
                {showText && (
                    <Text style={{ lineHeight: 24, fontSize: 14, marginLeft: 20 }}>{"Laugh, vote & win in our newest app Daily Jokes!"}</Text>

                )}
            </View>
        </TouchableOpacity>
    )
}