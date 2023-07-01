import React from 'react';
import { View, Button, TouchableOpacity, StyleSheet, Text } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import miscStyles from './miscStyles';

export default function FixedButton() {
  return (
    <View style={[styles.buttonContainer, miscStyles.dropShadow]}>
        {/* Using TouchableOpacity instead of Button, as TouchableOpacity allows children elements */}
      <TouchableOpacity style={styles.button} onPress={() => {}}> 
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
    // alignSelf: 'center', // Center horizontally
    right: 20,
    backgroundColor: "#D1E8D5",
    padding: 12,
    borderRadius: 16
  },
});




