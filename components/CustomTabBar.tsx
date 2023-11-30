import React, { useRef, useEffect } from 'react';
import { View, TouchableOpacity, Pressable, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { LinearGradient } from 'expo-linear-gradient';

interface CustomTabBarProps {
    state: {
        index: number;
        routes: Array<{
            key: string;
            name: string;
        }>;
    };
    navigation: {
        navigate: (name: string) => void;
    };
}

const windowWidth = Dimensions.get('window').width
const tabBarGap = 20;
const indicatorWidthCrop = windowWidth * 0.1
const indicatorWidth = ((windowWidth / 2) - indicatorWidthCrop) - tabBarGap;

export default function CustomTabBar({ state, navigation }: CustomTabBarProps) {
    const indicatorPositions = [0, (windowWidth / 2 + indicatorWidthCrop) + tabBarGap];
    const indicatorPosition = useRef(new Animated.Value(indicatorPositions[state.index])).current;

    useEffect(() => {
        Animated.timing(indicatorPosition, {
            toValue: indicatorPositions[state.index],
            duration: 250,
            useNativeDriver: true,
        }).start();
    }, [state.index]);

    return (
        <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
            const activeGradient = ["#638BD5", "#60C195"];
            const inactiveGradient = [tabBarBackgroundColor, tabBarBackgroundColor];

            const focused = state.index === index;

            const iconNames = ["verified", "public"];

            return (
                <React.Fragment key={route.key}>
                    {index === 1 && (
                    <TouchableOpacity onPress={() => {
                        navigation.navigate("Create");
                    }}>
                        <LinearGradient
                            colors={activeGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.centerButton}
                        >
                            <MaterialIcons name="add" size={26} color="white" />
                        </LinearGradient>
                    </TouchableOpacity>
                    )}
                    <Pressable style={styles.tabContainer} onPress={() => navigation.navigate(route.name)}>
                        <LinearGradient
                            colors={focused ? activeGradient : inactiveGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={[styles.iconContainer]}
                        >
                            <MaterialIcons name={iconNames[index]} size={17} color={focused ? "white" : "#4264A2"} />
                        </LinearGradient>
                        <Text style={{color: "black", textTransform: 'none', fontWeight: "600", fontSize: 14, marginTop: 6, textAlign: "center"}}>{route.name}</Text>
                    </Pressable>
                </React.Fragment>
            );
        })}

            <Animated.View
                style={[
                    styles.indicator,
                    {
                        transform: [
                            {
                                translateX: indicatorPosition
                            }
                        ]
                    }
                ]}
            >
                <LinearGradient
                    colors={["#638BD5", "#60C195"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.indicator}
                />
            </Animated.View>
        </View>
    );
}

const tabBarBackgroundColor = '#E4EEF2';
const styles = StyleSheet.create({
    tabBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        alignContent: "center",
        backgroundColor: tabBarBackgroundColor,
        paddingHorizontal: 10,
        height: 74,
        gap: tabBarGap
    },

    tabContainer: {
        width: indicatorWidth,
        textAlign: "center",
    },

    iconContainer: {
        height: 26,
        width: 50,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
    },

    centerButton: {
        height: 55,
        width: 55,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
    },

    indicator: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: indicatorWidth,
        height: 2,
        backgroundColor: 'white',
    }
});