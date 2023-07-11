import React, { useEffect, useRef } from 'react';
import { Text, Animated, StyleSheet } from 'react-native';
import globalStyles from '../../styles/globalStyles';

const Toast = ({ title, message }) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(
        fadeAnim,
        {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true
        }
      ).start();
    }, 6000); // The message will be displayed for 6 seconds before starting the fade out

    // Cleanup function to clear the timeout when the component unmounts
    return () => clearTimeout(timer);
  }, [fadeAnim]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text allowFontScaling style={[styles.text, {fontSize: 16}]}>{title}</Text>
      <Text allowFontScaling style={[styles.text, globalStyles.fontMedium]}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 90,
    marginHorizontal: 25,
    backgroundColor: '#3B6470',
    padding: 20,
    borderRadius: 12,
    alignSelf: 'center',
  },

  text: {
    color: 'white',
  }
});

export default Toast;