import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Menu } from 'react-native-paper';
import globalStyles from '../styles/globalStyles';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useFocusEffect } from '@react-navigation/native';
import i18n from "../scripts/i18n";

export default function Dropdown( props ) {
    const { options, selected, anchor, anchorStyle, containerStyle, title, titleStyle } = props;
    const [visible, setVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState(selected || i18n.t('official_templates'));

    const rotateAnim = useRef(new Animated.Value(0)).current;

    useFocusEffect(
        React.useCallback(() => {
            // Force a state update or any other logic when the screen comes into focus
            switch (selected) {
                case "official":
                    setSelectedOption(i18n.t('official_templates'));
                    break;
                case "all":
                    setSelectedOption("Community");
                    break;
                case "All":
                    setSelectedOption("Community");
                    break;
                case "myFavorites":
                    setSelectedOption("Favorite libs");
                    break;
                case "myContent":
                    setSelectedOption("My libs");
                    break;
                case "offline":
                    setSelectedOption("Offline libs");
                    break;
                default:
                    setSelectedOption(selected);
                    break;
            }
        }, [selected])
    );

    useEffect(() => {
        switch (selected) {
            case "official":
                setSelectedOption("Official libs");
                break;
            case "all":
                setSelectedOption("Community libs");
                break;
            case "All":
                setSelectedOption("Community libs");
                break;
            case "myFavorites":
                setSelectedOption("Favorite libs");
                break;
            case "myContent":
                setSelectedOption("My libs");
                break;
            case "offline":
                setSelectedOption("Offline libs");
                break;
            default:
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

    let anchorContent = (
        <>
            <Text style={[{fontSize: 14}, globalStyles.bold]}>
                {selectedOption}
            </Text>
            <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                <MaterialIcons
                    name="expand-less"
                    size={20}
                />
            </Animated.View>
        </>
    )

    if(title) {
        anchorContent = (
            <>
                <Text style={[{fontSize: 14}, globalStyles.bold, titleStyle]}>
                    {title}
                </Text>
                <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                    <MaterialIcons
                        name="expand-less"
                        size={20}
                    />
                </Animated.View>
            </>
        )
    }

    if(anchor) {
        anchorContent = anchor;
    }

    let anchorContainerStyle = {flexDirection: "row", alignItems: "center", gap: 5}

    if(anchorStyle) {
        anchorContainerStyle = anchorStyle;
    }

    return (
        <View style={[styles.container, containerStyle]}>
            <Menu
                style={{width: 200}}
                visible={visible}
                onDismiss={closeMenu}
                anchor={
                    <TouchableOpacity
                        style={anchorContainerStyle}
                        onPress={openMenu}
                    >
                        {anchorContent}
                    </TouchableOpacity>
                }
                contentStyle={{backgroundColor: "white", marginTop: ((screenHeight/screenWidth) * 17)}}
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