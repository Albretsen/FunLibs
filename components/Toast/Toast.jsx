import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions, Platform, TouchableOpacity } from 'react-native';
import globalStyles from '../../styles/globalStyles';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const Toast = ({ title, message, setTitle, setMessage }) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      fadeOut();
    }, 8000);
  
    return () => {
      clearTimeout(timerRef.current);
    };
  }, [fadeAnim]);

  const fadeOut = () => {
    Animated.timing(
      fadeAnim,
      {
        toValue: 0,
        duration: 500,
        useNativeDriver: true
      }
    ).start(() => {
      setTitle(null);
      setMessage(null);
    });
  };
  
  const handleClose = () => {
    clearTimeout(timerRef.current);
    fadeOut();
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }, isKeyboardVisible ? {bottom: 10} : {bottom: 90}]}>
      <View style={{justifyContent: "center", width: "86%"}}>
        <Text allowFontScaling style={[styles.text, {fontSize: 18}, globalStyles.bold]}>{title}</Text>
        <Text allowFontScaling style={[styles.text, {fontSize: 16, flexWrap: "wrap"}]}>{message}</Text>
      </View>
      <TouchableOpacity onPress={handleClose} style={{justifyContent: "center", flex: 1}}>
        <MaterialIcons style={{color: "white", alignSelf: "flex-end"}} name="close" size={34} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    // bottom: 90,
    flexDirection: "row",
    backgroundColor: '#322F35',
    padding: 20,
    borderRadius: 12,
    alignSelf: 'center',
    alignContent: "center",
    marginHorizontal: Dimensions.get('window').width * 0.05,
    width: Dimensions.get('window').width * 0.9,
    // For debugging, fixes offscreen issue only on web
    // left: -400
  },

  text: {
    color: 'white',
  }
});

export default Toast;