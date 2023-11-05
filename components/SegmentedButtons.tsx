import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

interface SegmentedButtonsProps {
    buttons: Array<{
        label: string;
        id: string;
        onPress: () => void;
    }>
}

export default function SegmentedButtons({buttons}: SegmentedButtonsProps) {
    const [activeButton, setActiveButton] = useState(0);
    return(
        <View style={styles.container}>
            {buttons.map((button, index) => {
                const activeGradient = ["#638BD5", "#60C195"];
                const inactiveGradient = [segmentedButtonsBackgroundColor, segmentedButtonsBackgroundColor];
                const active = activeButton == index;
                return(
                    <LinearGradient
                        colors={active ? activeGradient : inactiveGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.buttonContainer}
                        key={index}
                    >
                        <Pressable style={styles.buttonInnerContainer} onPress={() => {
                            button.onPress();
                            setActiveButton(index);
                        }}>
                            <View style={styles.labelContainer}>
                                {active && (
                                    <MaterialIcons name="check" size={20} color="white" />
                                )}
                                <Text style={[styles.label, {color: active ? 'white' : 'black'}]}>{button.label}</Text>
                            </View>
                        </Pressable>
                    </LinearGradient>
                )
            })}
        </View>
    )
}

const segmentedButtonsBackgroundColor = 'white';

const styles = StyleSheet.create({
    buttonContainer: {
        flex: 1,
    },

    buttonInnerContainer: {
        height: 40,
        justifyContent: 'center',
        alignItems: "center"
    },

    container: {
        minHeight: 40,
        borderRadius: 20,
        flex: 1,
        flexDirection: 'row',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#79747E',
        columnGap: 1,
        backgroundColor: '#79747E'
    },

    labelContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5
    },

    label: {
        fontSize: 14,
        color: 'white',
        // Avoid whitespace above text
        lineHeight: 0
    }
})