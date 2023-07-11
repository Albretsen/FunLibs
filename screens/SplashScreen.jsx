import { ScrollView, StyleSheet, View, Text } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import globalStyles from "../styles/globalStyles";
import LibManager from '../scripts/lib_manager';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

export default function SplashScreen() {
    const navigation = useNavigation(); // Get the navigation prop via hook

    useEffect(() => {
        const checkDataAndNavigate = async () => {
            await LibManager.initialize(); // Call your data loading function

            navigation.navigate('LibsHomeScreen');
            
        };

        checkDataAndNavigate();
    }, [navigation]); // Include navigation in the dependency array

    return (
        <View style={[globalStyles.screenStandard]}>
            <Text>Splash Screen</Text>
        </View>
    );
}
  
const styles = StyleSheet.create({

})