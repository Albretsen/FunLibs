import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Menu } from 'react-native-paper';
import globalStyles from '../styles/globalStyles';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { ScreenHeight, ScreenWidth } from '@rneui/base';
import { useFocusEffect } from '@react-navigation/native';

export default function Dropdown( props ) {
    const { options, selected } = props;
    const [visible, setVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState(selected || "Official libs");

    const rotateAnim = useRef(new Animated.Value(0)).current;

    useFocusEffect(
        React.useCallback(() => {
            // Force a state update or any other logic when the screen comes into focus
            switch (selected) {
                case "official":
                    setSelectedOption("Official libs");
                    break;
                case "all":
                    setSelectedOption("All libs");
                    break;
                case "All":
                    setSelectedOption("All libs");
                    break;
                case "myFavorites":
                    setSelectedOption("Favorite libs");
                    break;
                case "myContent":
                    setSelectedOption("My libs");
                    break;
                default:
                    console.log("USEFOCUESFEFET DEFUALT \n\n\n")
                    setSelectedOption(selected);
                    break;
            }
        }, [selected])
    );

    useEffect(() => {
        console.log("SETTING TO: " + selected);
        switch (selected) {
            case "official":
                setSelectedOption("Official libs");
                break;
            case "all":
                setSelectedOption("All libs");
                break;
            case "All":
                setSelectedOption("All libs");
                break;
            case "myFavorites":
                setSelectedOption("Favorite libs");
                break;
            case "myContent":
                setSelectedOption("My libs");
                break;
            default:
                console.log("\n\n\n USE EFFECT DAFAITL");
                setSelectedOption(selected);
                break;
        }
    }, [selected]);

    const openMenu = () => {
        setVisible(true);
        Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
        }).start();
    };
    
    const closeMenu = () => {
        setVisible(false);
        Animated.timing(rotateAnim, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
        }).start();
    }

    const rotation = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['180deg', '0deg']
    });
    

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        closeMenu();
    }

    const screenHeight = Dimensions.get("window").height;
    const screenWidth = Dimensions.get("window").width;

    return (
        <View style={[styles.container]}>
            <Menu
                style={{width: 200}}
                visible={visible}
                onDismiss={closeMenu}
                anchor={
                    <TouchableOpacity
                        style={{flexDirection: "row", alignItems: "center", gap: 5}}
                        onPress={openMenu}
                    >
                        <Text style={[{fontSize: 14}, globalStyles.bold]}>
                            {selectedOption}
                        </Text>
                        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                            <MaterialIcons
                                name="expand-less"
                                size={20}
                            />
                        </Animated.View>
                    </TouchableOpacity>
                }
                contentStyle={{backgroundColor: "white", marginTop: ((ScreenHeight/ScreenWidth)*17)}}
            >
                {options.map((options, index) => (
                    <View key={index}>
                        <Menu.Item
                        style={{backgroundColor: "white"}}
                        onPress={() => {
                            handleOptionSelect(options.name);
                            options.onPress();
                        }}
                        title={options.name} />
                    </View>
                ))}
            </Menu>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignSelf: "flex-start",
        justifyContent: "center",
        marginLeft: 6,
        height: 40
    },
})