import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// Import any icons you want to use, for example, from react-native-vector-icons
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const CustomDrawerContent = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => navigation.navigate('Home')}
      >
        {/* Add your icon here; assuming you're using MaterialIcons */}
        {/* <MaterialIcons name="home" size={24} color="#333" /> */}
        <Text style={styles.drawerItemText}>Home</Text>
      </TouchableOpacity>
      {/* Add more items here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  drawerItemText: {
    marginLeft: 16,
    fontSize: 16,
  },
});

export default CustomDrawerContent;