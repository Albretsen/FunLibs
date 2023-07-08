import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import globalStyles from '../styles/globalStyles';
import { useNavigation } from '@react-navigation/native';

export default function FixedButton({ onPress }) {
  const navigation = useNavigation();
  
  const openCreate = () => {
    navigation.navigate('Your Libs', { openDrawer: true });
  }

  // Use openCreate if no onPress prop is provided
  const handlePress = onPress || openCreate;
  return (
    <View style={[styles.buttonContainer, globalStyles.dropShadow]}>
      <TouchableOpacity 
        style={styles.button}
        onPress={handlePress}
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