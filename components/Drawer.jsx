import React, { Animated, Easing, Dimensions, Modal, StyleSheet, View, Text, TouchableOpacity, Platform } from "react-native";
import { forwardRef, useEffect, useRef, useState, useImperativeHandle, createContext, useContext } from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { PanGestureHandler, State } from "react-native-gesture-handler";

const Drawer = forwardRef((props, ref) => {
    const { isVisible, closeDrawer, component, header = {}, side = "right", onShare, width = 85, containerStyle, closeButton = true, closeSide = {left: true} } = props;
    const windowWidth = Dimensions.get("window").width;
    const drawerWidth = (parseInt(width) / 100) * windowWidth;
    const maskWidth = windowWidth - drawerWidth;
    const initialSlideValue = side === "left" ? -windowWidth : windowWidth;

    const slideAnim = useRef(new Animated.Value(initialSlideValue)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // if()

    const onSwipeHandler = (event) => {
        if (event.nativeEvent.state === State.END) {
            if (event.nativeEvent.translationX > 50) {
                closeDrawer();
            }
        }
    };

    const animateDrawer = (visible, callback) => {
        const targetValue = side === "right"
        ? (visible ? 0 : windowWidth)
        : (visible ? 0 : -windowWidth);
      
        const targetFadeValue = visible ? 1 : 0;
      
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: targetValue,
                duration: 350,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true
            }),
            Animated.timing(fadeAnim, {
                toValue: targetFadeValue,
                duration: 350,
                useNativeDriver: false
            })
        ]).start(callback);
    };
      

    useEffect(() => {
        // Reset the position before animating
        slideAnim.setValue(initialSlideValue);
        animateDrawer(isVisible);
    }, [isVisible]);

    useImperativeHandle(ref, () => ({
        openDrawer: () => {
            animateDrawer(true);
        },
        closeDrawer: (callback) => {
            animateDrawer(false, callback);
        }
    }));

    const backgroundColor = fadeAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["transparent", "rgba(0, 0, 0, 0.4)"],
    });

    const CloseComponent = ({ iconName }) => {
        return(
            <TouchableOpacity onPress={closeDrawer}>
                <MaterialIcons name={iconName} size={30} />
            </TouchableOpacity>
        )
    }

    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={isVisible}
            onRequestClose={closeDrawer}
        >
            <Animated.View style={{ flex: 1, backgroundColor }}>
                <View style={{ flex: 1, flexDirection: 'row'}}>
                    {/* Mask view which when clicked closes the drawer, appears outside of the drawer */}
                    <TouchableOpacity style={{ width: maskWidth }} onPress={closeDrawer} />
                    <PanGestureHandler
                        onHandlerStateChange={onSwipeHandler}
                        minDeltaX={10}
                    >
                        <Animated.View
                            onStartShouldSetResponder={() => true}
                            style={[
                                {
                                    borderBottomLeftRadius: 16,
                                    borderTopLeftRadius: 16,
                                    backgroundColor: "white",
                                    width: drawerWidth,
                                    transform: [{ translateX: slideAnim }],
                                },
                                containerStyle ? containerStyle : null
                            ]
                        }
                        >
                            {/* If a custom header component has been defined, render it instead */}
                            {/* Else, render default header */}
                            {header &&
                                header.component ? (
                                    <View style={{flex: 1}}>
                                        {header.component}
                                    </View>
                                    ) : (
                                    <View style={[
                                        styles.header,
                                        header.headerStyle ? header.headerStyle : null,
                                        header.rightComponent ? { justifyContent: "space-between" } : { justifyContent: "flex-start" }
                                    ]}>
                                        {header.leftComponent ? header.leftComponent : (
                                            <>
                                                {closeSide.left && (
                                                    <CloseComponent iconName={closeSide.leftIcon ? closeSide.leftIcon : "close"} />
                                                )}
                                            </>
                                        )}
                                        <Text style={[styles.title, {flex: 1}, header.titleStyle ? header.titleStyle : null]}>{header.title ? header.title: null}</Text>
                                        {header.rightComponent ? header.rightComponent : (
                                            <>
                                                {closeSide.right ? (
                                                    <CloseComponent iconName={closeSide.rightIcon ? closeSide.rightIcon : "close"} />
                                                ) : (
                                                <TouchableOpacity onPress={onShare}>
                                                    <MaterialIcons name="share" size={30} />
                                                </TouchableOpacity>
                                                )}
                                            </>
                                        )}
                                    </View>
                                )
                            }
                            {component}
                        </Animated.View>
                    </PanGestureHandler>
                </View>
            </Animated.View>
        </Modal>
    );
});

const styles = StyleSheet.create({
    header: {
        height: 65,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginHorizontal: 10,
        // Account for iOS status bar
        ...(Platform.OS === "ios" && { marginTop: 25 })
    },
    title: {
        fontSize: 24,
    }
});


const DrawerContext = createContext();

export const useDrawer = () => {
    const context = useContext(DrawerContext);
    if (!context) {
        throw new Error("useDrawer must be used within a DrawerProvider");
    }
    return context;
};

export const DrawerProvider = ({ children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [drawerProps, setDrawerProps] = useState({});
    const drawerRef = useRef();

    const openDrawer = (props = {}) => {
        setDrawerProps(props);
        setIsVisible(true);
    };

    console.log(drawerProps, "test")

    const closeDrawer = () => {
        drawerRef.current.closeDrawer(() => setIsVisible(false));
    };

    return (
        <DrawerContext.Provider value={{ openDrawer, closeDrawer, drawerRef }}>
            {children}
            <Drawer
                ref={drawerRef}
                isVisible={isVisible}
                closeDrawer={closeDrawer}
                {...drawerProps}
            >
                {drawerProps.content}
            </Drawer>
        </DrawerContext.Provider>
    );
};