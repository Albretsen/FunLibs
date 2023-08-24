import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Menu } from 'react-native-paper';
import globalStyles from '../styles/globalStyles';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default function FilterToggle({ options, open, close }) {
    const [visible, setVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');

    const rotateAnim = useRef(new Animated.Value(0)).current;

    const openMenu = () => {
        if(visible) {
            closeMenu();
        } else {
            open();
            setVisible(true);
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            }).start();
        }
    };
    
    const closeMenu = () => {
        close();
        setVisible(false);
        Animated.timing(rotateAnim, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
        }).start();
    }

    const rotation = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg']
    });
    

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        closeMenu();
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={{flexDirection: "row", alignItems: "center", gap: 6}}
                onPress={openMenu}
            >
                <Text style={[{fontSize: 14}, globalStyles.bold]}>
                    Filters
                </Text>
                <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                    <MaterialIcons
                        name="expand-less"
                        size={18}
                    />
                </Animated.View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // alignSelf: "flex-start",
        // marginLeft: 34
    },
})