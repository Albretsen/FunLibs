import React, { useState, useRef } from 'react';
import { View, Pressable, Animated, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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
            <AnimatedPressable onPress={handlePress} style={[{ transform: [{ scale }] }]}>
                <Icon name={isFilled ? 'favorite' : 'favorite-outline'} size={18} color={isFilled ? '#6294C9' : '#6294C9'} />
            </AnimatedPressable>
        </View>
    );
}

const styles = StyleSheet.create({

})