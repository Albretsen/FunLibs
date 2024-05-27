import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";

interface ButtonProps {
    onPress?: () => void;
    filled?: boolean;
    label: string;
    icon?: ReactNode;
    disabled?: boolean;
}

export default function Button(props: ButtonProps) {
    const { onPress, filled, label, icon } = props;

    return (
        <TouchableOpacity onPress={onPress}>
            <LinearGradient
                colors={["#638BD5", "#60C195"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.button}
            >
                {icon && (
                    <>{icon}</>
                )}
                <Text style={[styles.label, { color: "white" }]}>
                    {label}
                </Text>
            </LinearGradient>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        flexDirection: "row",
        gap: 8,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#6294C9",
        borderStyle: "solid",
        padding: 6,
        alignItems: "center",
        minHeight: 34
    },

    label: {
        fontSize: 15,
        fontWeight: "600",
        color: "#6294C9",
        lineHeight: 20
    },
})