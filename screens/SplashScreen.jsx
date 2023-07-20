import { ScrollView, StyleSheet, View, Text, Image, Dimensions } from 'react-native';
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
        <View style={[globalStyles.screenStandard, styles.background]}>
            <View style={styles.container}>
				<Image
				style={styles.image}
				source={require('../assets/images/splash.png')}
                resizeMode='stretch'
				/>
			</View>
        </View>
    );
}
  
const styles = StyleSheet.create({
    background: {
        backgroundColor: "#006d40",
    },
    container: {
        flex: 1,
        position: 'relative', // Ensure it covers the whole screen
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    image: {
        flex: 1,
        width: null,
        height: null,
    },
})