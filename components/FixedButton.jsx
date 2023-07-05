import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import miscStyles from '../styles/miscStyles'

export default function FixedButton({ onPress = () => console.log('Default onPress') }) {
    return (
      <View style={[styles.buttonContainer, miscStyles.dropShadow]}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={onPress}
        > 
          <MaterialIcons name="add" size={36} />
        </TouchableOpacity>
      </View>
    );
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  buttonContainer: {
    position: 'absolute', // Here is the trick
    bottom: 20, // Position from bottom
    right: 20, // Position almost entirely to the right
    backgroundColor: "#D1E8D5",
    padding: 12,
    borderRadius: 16,
    zIndex: 100
  },
});