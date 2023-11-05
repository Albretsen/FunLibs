import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function LikeButton({ onPressed, filled = false, disabled = false, onDisabledPress }) {
    const [isFilled, setisFilled] = useState(filled);
    const scaleValue = useRef(new Animated.Value(0)).current;

    const animateScale = () => {
        scaleValue.setValue(0);
        Animated.timing(scaleValue, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const handlePress = () => {
        console.log(disabled)
        if(!disabled) {
            setisFilled(!isFilled);
            animateScale();
            onPressed();
        } else {
            onDisabledPress();
        }
    };

    const scale = scaleValue.interpolate({
        inputRange: [0, 0.5, 0.8, 1],
        outputRange: [1, 0.8, 1.1, 1],
    });

    return (
        <View>
            <AnimatedTouchableOpacity onPress={handlePress} style={[styles.container, { transform: [{ scale }] }]}>
                <Icon name={isFilled ? 'favorite' : 'favorite-outline'} size={25} color={isFilled ? '#6294C9' : '#6294C9'} />
            </AnimatedTouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "flex-start",
        alignSelf: "flex-start",
        flex: 1,
        marginTop: 6,
        paddingRight: 20
    },
})