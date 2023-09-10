import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Menu } from 'react-native-paper';
import globalStyles from '../styles/globalStyles';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default function Dropdown( props ) {
    const { options } = props;
    const [visible, setVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState("Official libs");

    const rotateAnim = useRef(new Animated.Value(0)).current;

    const openMenu = () => {
        setVisible(true);
        Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
        }).start();
    };
    
    const closeMenu = () => {
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
        <View style={[styles.container]}>
            <Menu
                style={{width: 200}}
                visible={visible}
                onDismiss={closeMenu}
                anchor={
                    <TouchableOpacity
                        style={{flexDirection: "row", alignItems: "center", gap: 5}}
                        onPress={openMenu}
                    >
                        <Text style={[{fontSize: 14}, globalStyles.bold]}>
                            {selectedOption}
                        </Text>
                        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                            <MaterialIcons
                                name="expand-less"
                                size={20}
                            />
                        </Animated.View>
                    </TouchableOpacity>
                }
                contentStyle={{backgroundColor: "white", marginTop: 30}}
            >
                {options.map((options, index) => (
                    <View key={index}>
                        <Menu.Item
                        style={{backgroundColor: "white"}}
                        onPress={() => {
                            handleOptionSelect(options.name);
                            options.onPress();
                        }}
                        title={options.name} />
                    </View>
                ))}
            </Menu>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignSelf: "flex-start",
        justifyContent: "center",
        marginLeft: 6,
        height: 40
    },
})