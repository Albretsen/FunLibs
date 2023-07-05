/**
 * @component
 * @name Drawer
 * 
 * @description
 * An animated drawer component that can be shown and hidden. It is a modal that slides from the right side of the screen.
 * The component where it is used must have const drawerRef = useRef();
 * drawerRef.current.openDrawer() is called to show the drawer
 *
 * @prop {object} props - The props for the Drawer component.
 * @prop {ReactNode} props.children - The children components to render inside the Drawer.
 * @prop {object} ref - The ref object to interact with the Drawer, providing methods to open and close it.
 *
 * @example
 * import React, { useRef } from 'react';
 * import Drawer from './Drawer';
 * 
 * const MyComponent = () => {
 *   const drawerRef = useRef();
 *
 *   return (
 *     <>
 *       <button onClick={() => drawerRef.current.openDrawer()}>Open Drawer</button>
 *       <Drawer ref={drawerRef}>
 *         <p>This is content inside the drawer.</p>
 *       </Drawer>
 *     </>
 *   );
 * }
 *
 * @requires React
 * @requires useState, useEffect, useRef, forwardRef, useImperativeHandle from 'react'
 * @requires Animated, Dimensions, Modal, StyleSheet, View, Text, TouchableOpacity from 'react-native'
 * @requires MaterialIcons from 'react-native-vector-icons/MaterialIcons'
 */

import React, { useState, useRef, forwardRef, useImperativeHandle, useEffect, Component } from 'react';
import { Animated, Dimensions, Modal, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Drawer = forwardRef((props, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const slideAnim = useRef(new Animated.Value(Dimensions.get('window').width)).current;

    const { title } = props;

    const animateDrawer = (isVisible) => {
        Animated.timing(slideAnim, {
            toValue: isVisible ? (0.15 * Dimensions.get("window").width) : Dimensions.get('window').width,
            duration: 350,
            useNativeDriver: false,
        }).start(() => {
            // This will be called once animation is done
            setIsModalVisible(isVisible);
        });
    };

    useEffect(() => {
        if (isVisible) {
            setIsModalVisible(true);
        }
            animateDrawer(isVisible);
    }, [isVisible]);

    useImperativeHandle(ref, () => ({
        openDrawer: () => {
            setIsVisible(true);
        },
        closeDrawer: () => {
            setIsVisible(false);
        }
    }));

  return (
        <Modal
            animationType="none"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => setIsVisible(false)}
        >
            <Animated.View style={{
                flex: 1,
                backgroundColor: 'white',
                width: Dimensions.get("window").width - (0.15 * Dimensions.get("window").width),
                transform: [{ translateX: slideAnim }],
            }}>
                <View style={styles.topBar}>
                <TouchableOpacity onPress={() => ref.current.closeDrawer()}>
                    <MaterialIcons name="arrow-back" size={30} />
                </TouchableOpacity>
                    <Text style={styles.title}>{title}</Text>
                </View>
                {props.children}
            </Animated.View>
        </Modal>
    );
});

export default Drawer;

const styles = StyleSheet.create({
    topBar: {
        height: 75,
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },
    title: {
        fontSize: 24
    }
})