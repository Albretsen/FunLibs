import React, { useEffect, useRef } from 'react';
import { Text, Animated, StyleSheet } from 'react-native';
import textStyles from '../../styles/textStyles';

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
      <Text style={[styles.text, textStyles.fontLarge]}>{title}</Text>
      <Text style={[styles.text, textStyles.fontMedium]}>{message}</Text>
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