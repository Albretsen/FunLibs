import React, { forwardRef, useRef, useState, useImperativeHandle, ReactNode } from "react";
import { Animated, Easing, Dimensions, Modal, View, Pressable, SafeAreaView, StyleProp, ViewStyle } from "react-native";
import { PanGestureHandler, State, GestureHandlerRootView } from "react-native-gesture-handler";

interface DrawerProps {
    children?: ReactNode;
    side?: "left" | "right";
    width?: string;
    containerStyle?: StyleProp<ViewStyle>;
    maxWidth?: string;
    backgroundColor?: string;
    onStateChange?: (isOpen: boolean) => void;
}

const Drawer = forwardRef((props: DrawerProps, ref) => {
    const {children, side = "right", width = "85%", maxWidth = "500px", containerStyle, backgroundColor = "white", onStateChange } = props;

    const [isVisible, setIsVisible] = useState(false);

    const windowWidth = Dimensions.get("window").width;

    let isPx = (str: string) => {
        // If the last two letters in the width are "p" and "x", we've got a measurement in pixels
        return str.charAt(str.length - 2) === "p" && str.charAt(str.length - 1) === "x"
    }

    let isPerc = (str: string) => {
        return str.charAt(str.length - 1) === "%"
    }


    let drawerWidth: number;
    // Set windowWidth
    if(isPx(width)) {
        // Strip the px-suffix from width
        const pxValue = parseInt(width.slice(0, -2), 10);
        // The drawer width will be the minimum between the provided pixel value and the window width.
        drawerWidth = Math.min(pxValue, windowWidth);
    } else if(isPerc(width)) {
        drawerWidth = (parseInt(width.toString()) / 100) * windowWidth;
    } else {
        throw 'Drawer width must end in either "px" or "%".';
    }

    let drawerMaxWidth: number;
    if(isPx(maxWidth)) {
        const pxValue = parseInt(maxWidth.slice(0, -1), 10);
        drawerMaxWidth = Math.min(pxValue, windowWidth);
    } else if(isPerc(maxWidth)) {
        drawerMaxWidth = (parseInt(maxWidth.toString()) / 100) * windowWidth;
    } else if(maxWidth === "none") {
        drawerMaxWidth = windowWidth;
    } else {
        throw 'Drawer maxWidth must end in either "px" or "%".';
    }

    // Limit drawer width based on the set maxWidth
    // This is intended to avoid absurdly long drawers, unless that is desired, of course
    if (drawerWidth >= drawerMaxWidth) drawerWidth = drawerMaxWidth;
    // Determine the width of the mask, the mask taking up the remaining space of the screen after the drawer,
    // Having this allows the user to click anywhere outside the drawer to close, as the mask is a pressable
    const maskWidth = windowWidth - drawerWidth;
    // Determine where the drawer slides from
    const initialSlideValue = side === "left" ? -windowWidth : windowWidth;

    const slideAnim = useRef(new Animated.Value(initialSlideValue)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;


    const lastOffset = useRef({ x: initialSlideValue }).current;

    const onSwipeHandler = (event: any) => {
        // If the swipe gesture has ended
        if (event.nativeEvent.state === State.END) {
            // Get the distance the user has swiped (in pixels)
            const swipeDistance = event.nativeEvent.translationX;

            // If the swipe distance is more than half the drawer's width, close the drawer
            let shouldClose = side === "right" 
                ? swipeDistance > drawerWidth / 2
                : swipeDistance < -drawerWidth / 2;
    
            // Decide where the drawer will land when the swipe has ended, either fully expanded or fully hidden 
            const targetValue = shouldClose ? initialSlideValue : 0;
    
            // Animate to the target value
            Animated.timing(slideAnim, {
                toValue: targetValue,
                duration: 250,
                useNativeDriver: true
            }).start(() => {
                // If we've decided to close the drawer, then set its visibility state to false
                if (shouldClose) {
                    setIsVisible(false);
                    // Notify the onStateChange callback that the drawer has closed
                    if (onStateChange) {
                        onStateChange(false); // Drawer has closed
                    }
                }
            });

            // Store the last offset value to use for future calculations or animations.
            // This is particularly useful if the user doesn't complete their swipe, so we know where to continue from.
            lastOffset.x = targetValue;
        }
    };
    
    
    // This is responsible for updating the drawer's position in real-time as the user drags it
    const gestureEvent = (event: any) => {
        // Extract the current horizontal translation (how far the user has dragged) from the event
        let translationX = event.nativeEvent.translationX;
    

        // The drawer is limited to being dragged at the max to the full width of the drawer, and at the minimum 0
        if (side === "right") { translationX = Math.min(Math.max(translationX, 0), drawerWidth) }
        if (side === "left") { translationX = Math.max(Math.min(translationX, 0), -drawerWidth) }
    
        slideAnim.setValue(translationX);
    };
    
    // This function handles the animation and setting visibility after the animation is complete
    const closeDrawerInternal = (callback?: () => void) => {
        animateDrawer(false, () => {
            setIsVisible(false);
            if (onStateChange) {
                onStateChange(false);
            }
            if (callback) callback();
        });
    };
      

    useImperativeHandle(ref, () => ({
        openDrawer: () => {
            setIsVisible(true);
            // Reset the position before animating
            slideAnim.setValue(initialSlideValue);
            animateDrawer(true, () => {
                if (onStateChange) {
                    onStateChange(true);
                }
            });
        },
        closeDrawer: closeDrawerInternal
    }));

    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={isVisible}
        >
            <GestureHandlerRootView style={{ flex: 1 }}>
                <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
                    {/* Drawer is contained in a flex view, a mask takes up the remaining space from the drawer.
                    The order of these - reverse or not - are determined by whether the drawer is right- or left aligned */}
                    <View style={{ flex: 1, flexDirection: side == 'right' ? 'row' : 'row-reverse'}}>
                        <Pressable style={{ width: maskWidth }} onPress={() => closeDrawerInternal()} />
                        <PanGestureHandler
                            onHandlerStateChange={onSwipeHandler}
                            onGestureEvent={gestureEvent}
                        >
                            <View
                                style={[{
                                    backgroundColor: backgroundColor,
                                    width: drawerWidth,
                                }, containerStyle]}
                            >
                                <SafeAreaView style={{flex: 1}}>
                                    {children}
                                </SafeAreaView>
                            </View>
                        </PanGestureHandler>
                    </View>
                </View>
            </GestureHandlerRootView>
        </Modal>
    );
});

export default Drawer;