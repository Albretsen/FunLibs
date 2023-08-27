import React, { Animated, Easing, Dimensions, Modal, StyleSheet, View, Text, TouchableOpacity, Platform } from "react-native";
import { forwardRef, useEffect, useRef, useState, useImperativeHandle, createContext, useContext } from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { PanGestureHandler, State } from "react-native-gesture-handler";

const Drawer = forwardRef((props, ref) => {
    const { isVisible, closeDrawer, children, side = "right", title, onShare } = props;
    const windowWidth = Dimensions.get("window").width;
    const drawerWidth = Dimensions.get("window").width - (0.1 * Dimensions.get("window").width);
    const initialSlideValue = side === "left" ? -drawerWidth : windowWidth;

    const slideAnim = useRef(new Animated.Value(initialSlideValue)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const onSwipeHandler = (event) => {
        if (event.nativeEvent.state === State.END) {
            if (event.nativeEvent.translationX > 50) {
                closeDrawer();
            }
        }
    };

    const animateDrawer = (visible, callback) => {
        const targetValue = side === "right"
        ? (visible ? (windowWidth - (drawerWidth - 0)) : windowWidth)
        : (visible ? 0 : -drawerWidth);
      
        const targetFadeValue = visible ? 1 : 0;
      
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: targetValue,
                duration: 400,
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

    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={isVisible}
            onRequestClose={closeDrawer}
        >
            <Animated.View style={{ flex: 1, backgroundColor }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    {/* Mask view which when clicked closes the drawer, appears outside of the drawer */}
                    <TouchableOpacity style={{ flex: 1 }} onPress={closeDrawer}></TouchableOpacity>
                    <PanGestureHandler
                        onHandlerStateChange={onSwipeHandler}
                        minDeltaX={10}
                    >
                        <Animated.View
                            onStartShouldSetResponder={() => true}
                            style={{
                                borderRadius: 10,
                                backgroundColor: "white",
                                width: drawerWidth,
                                transform: [{ translateX: slideAnim }]
                            }}
                        >
                            <View style={[styles.topBar, onShare ? { justifyContent: "space-between" } : { justifyContent: "flex-start" }]}>
                                <TouchableOpacity onPress={closeDrawer}>
                                <MaterialIcons name="arrow-back" size={30} />
                                </TouchableOpacity>
                                <Text style={styles.title}>{title}</Text>
                                {onShare && (
                                <TouchableOpacity onPress={onShare}>
                                    <MaterialIcons name="share" size={30} />
                                </TouchableOpacity>
                                )}
                            </View>
                            {children}
                        </Animated.View>
                    </PanGestureHandler>
                </View>
            </Animated.View>
        </Modal>
    );
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
    const [drawerContent, setDrawerContent] = useState(null);
    const drawerRef = useRef();

    const openDrawer = (content) => {
        setDrawerContent(content);
        setIsVisible(true);
    };

    const closeDrawer = () => {
        drawerRef.current.closeDrawer(() => setIsVisible(false));
    };

    return (
        <DrawerContext.Provider value={{ openDrawer, closeDrawer, drawerRef }}>
            {children}
            <Drawer ref={drawerRef} isVisible={isVisible} closeDrawer={closeDrawer}>
            {drawerContent}
            </Drawer>
        </DrawerContext.Provider>
    );
};


const styles = StyleSheet.create({
    topBar: {
        height: 75,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
        marginHorizontal: 10,
        width: (Dimensions.get("window").width - (0.15 * Dimensions.get("window").width)) - 20,
        ...(Platform.OS === "ios" && { marginTop: 25 })
    },
    title: {
        fontSize: 24,
    }
});