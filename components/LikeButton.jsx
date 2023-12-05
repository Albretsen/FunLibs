import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { View, Pressable, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const LikeButton = forwardRef(({ onPressed, filled = false, disabled = false, onDisabledPress }, ref) => {
    const [isFilled, setIsFilled] = useState(filled);
    const scaleValue = useRef(new Animated.Value(1)).current; // Initial scale set to 1

    useEffect(() => {
        Animated.timing(scaleValue, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [isFilled]); // Animation effect tied to isFilled state

    useImperativeHandle(ref, () => ({
        press: handlePress,
    }));

    const handlePress = () => {
        if (!disabled) {
            setIsFilled(!isFilled); // Toggle isFilled state
            onPressed && onPressed(); // Call onPressed if available
        } else {
            onDisabledPress && onDisabledPress(); // Call onDisabledPress if available
        }
    };

    const handlePressIn = () => {
        Animated.timing(scaleValue, {
            toValue: 0.8, // Slightly reduce the scale
            duration: 150,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.timing(scaleValue, {
            toValue: 1, // Reset the scale back to 1
            duration: 150,
            useNativeDriver: true,
        }).start();
    };

    return (
        <View>
            <Pressable onPress={handlePress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
                <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
                    <Icon name={isFilled ? 'favorite' : 'favorite-outline'} size={24} color="#6294C9" />
                </Animated.View>
            </Pressable>
        </View>
    );
});

export default LikeButton;
