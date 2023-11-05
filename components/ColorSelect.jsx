import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity, StyleSheet} from 'react-native';

const defaultColors = [
    "#ff1a1a", // Red
    "#ff8000", // Orange
    "#ffff00", // Yellow
    "#00ff40", // Green
    "#0066ff", // Blue
    "#ff00ff", // Pink
    "#8000ff"  // Purple
];

const circleSize = 70;
const gapSize = 10;

export default function ColorSelect({ onColorChange, containerStyle, selectedDefaultColor = "#ff1a1a", containerIsView, colors = defaultColors }) {

    const [selectedColor, setSelectedColor] = useState(selectedDefaultColor);

    let ContainerTag = ScrollView;
    if(containerIsView) ContainerTag = View;
    return (
        <ContainerTag style={[styles.selectorContainer, containerStyle ? containerStyle : null]}>
            <View style={styles.container}>
                {colors.map((color, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => {
                            onColorChange(color);
                            setSelectedColor(color);
                        }}
                        style={[styles.colorCircle, {backgroundColor: color}, color == selectedColor ? styles.selectedColor : null]}
                    />         
                ))}
            </View>
        </ContainerTag>
    )
}

const styles = StyleSheet.create({
    selectorContainer: {
        flexShrink: 0
    },

    container: {
        justifyContent: "center",
        flexDirection: "row",
        width: "100%",
        flexWrap: "wrap",
        gap: gapSize
    },
    
    selectedColor: {
        borderRadius: 40,
        borderWidth: 4,
        borderColor: "black"
    },
    
    colorCircle: {
        borderRadius: 100,
        width: circleSize,
        height: circleSize,
    }
});