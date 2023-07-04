import React, { useState, useRef, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Animated, Dimensions, Modal } from 'react-native';

const DrawerComponent = forwardRef((props, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(Dimensions.get('window').width)).current;

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
        {props.children}
      </Animated.View>
    </Modal>
  );
});

export default DrawerComponent;