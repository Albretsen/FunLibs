import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Menu } from 'react-native-paper';
import globalStyles from '../styles/globalStyles';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default function FilterToggle({ open, close, isOpen }) {
    const [visible, setVisible] = useState(false);

    const rotateAnim = useRef(new Animated.Value(0)).current;

    function animate(value) {
        Animated.timing(rotateAnim, {
            toValue: value,
            duration: 150,
            useNativeDriver: true,
        }).start();
    }

    useEffect(() => {
        if (isOpen) {
          // Animation for opening
          animate(1);
          setVisible(true);
        } else {
          // Animation for closing
          animate(0);
          setVisible(false);
        }
      }, [isOpen]);

    const openMenu = () => {
        if(visible) {
            closeMenu();
        } else {
            open();
            setVisible(true);
            animate(1);
        }
    };
    
    const closeMenu = () => {
        close();
        setVisible(false);
        animate(0);
    }

    const rotation = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['180deg', '0deg']
    });

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={{flexDirection: "row", alignItems: "center", gap: 6}}
                onPress={openMenu}
            >
                <Text style={[{fontSize: 14}, globalStyles.bold]}>
                    Sort by
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

})