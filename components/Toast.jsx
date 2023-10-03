import React, { useEffect, useRef, useState, createContext } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions, Platform, TouchableOpacity, KeyboardAvoidingView, Easing } from 'react-native';
import globalStyles from '../styles/globalStyles';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export const ToastContext = createContext();

const Toast = ({ title, message, setTitle, setMessage, noBottomMargin }) => {
	const fadeAnim = useRef(new Animated.Value(0)).current;
	const translateYAnim = useRef(new Animated.Value(Dimensions.get('window').height)).current; // Using screen height
	const scaleAnim = useRef(new Animated.Value(0.8)).current; // For playful scaling effect
	const [isKeyboardVisible, setKeyboardVisible] = useState(false);

	const timerRef = useRef(null);

	useEffect(() => {
		Animated.parallel([ // Animate opacity, translationY, and scale simultaneously
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 200,
				easing: Easing.out(Easing.back(0.5)), // Bouncy effect
				useNativeDriver: true
			}),
			Animated.timing(translateYAnim, {
				toValue: 0,
				duration: 500,
				easing: Easing.out(Easing.back(0.5)), // Bouncy effect
				useNativeDriver: true
			}),
			Animated.timing(scaleAnim, {
				toValue: 1,
				duration: 600,
				easing: Easing.bounce, // Bouncy scaling
				useNativeDriver: true
			})
		]).start();

		timerRef.current = setTimeout(() => {
			fadeOut();
		}, 8000);

		return () => {
			clearTimeout(timerRef.current);
		};
	}, [fadeAnim]);

	const fadeOut = () => {
		Animated.parallel([
			Animated.timing(fadeAnim, {
				toValue: 0,
				duration: 400,
				useNativeDriver: true
			}),
			Animated.timing(translateYAnim, {
				toValue: Dimensions.get('window').height, // Ensure it's off-screen
				duration: 400,
				useNativeDriver: true
			}),
			Animated.timing(scaleAnim, {
				toValue: 0.8,
				duration: 400,
				useNativeDriver: true
			})
		]).start(() => {
			setTitle(null);
			setMessage(null);
		});
	};

	const handleClose = () => {
		clearTimeout(timerRef.current);
		fadeOut();
	};

	let bottomMargin = 130;
	if (noBottomMargin) {
		bottomMargin = 50;
	}

	return (
		<Animated.View style={[
			styles.container,
			{
				opacity: fadeAnim,
				transform: [{ translateY: translateYAnim }, { scale: scaleAnim }] // Apply transformations
			},
			isKeyboardVisible ? { bottom: 50 } : { bottom: bottomMargin }
		]}>
			<View style={{ justifyContent: "center", width: "86%" }}>
				{/* Quickly removed title to make sure text is centered on Android */}
				{/* <Text allowFontScaling style={[styles.text, {fontSize: 18}, globalStyles.bold]}>{title}</Text> */}
				<Text allowFontScaling style={[styles.text, { fontSize: 16, flexWrap: "wrap" }]}>{message}</Text>
			</View>
			<TouchableOpacity onPress={handleClose} style={{ justifyContent: "center", flex: 1 }}>
				<MaterialIcons style={{ color: "white", alignSelf: "flex-end" }} name="close" size={24} />
			</TouchableOpacity>
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		// bottom: 90,
		flexDirection: "row",
		backgroundColor: '#322F35',
		padding: 20,
		borderRadius: 12,
		alignSelf: 'center',
		alignContent: "center",
		marginHorizontal: Dimensions.get('window').width * 0.05,
		width: Dimensions.get('window').width * 0.9,
	},

	text: {
		color: 'white',
	}
});

export default Toast;

export const ToastProvider = ({ children }) => {
	const [message, setMessage] = useState(null);
	const [title, setTitle] = useState(null);
	const [bottomMarginBool, setBottomMarginBool] = useState(false);

	const toastTimerRef = useRef(null);

	const showToast = (message, noBottomMargin, title) => {
		setTitle(title);
		setMessage(message);
		setBottomMarginBool(noBottomMargin);

		if (toastTimerRef.current) {
			clearTimeout(toastTimerRef.current);
		}

		toastTimerRef.current = setTimeout(() => {
			setTitle(null);
			setMessage(null);
			setBottomMarginBool(false);
		}, 8000);
	};

	return (
		<ToastContext.Provider value={showToast}>
			{children}
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'position' : undefined}
			>
				{message && <Toast title={title} message={message} setTitle={setTitle} setMessage={setMessage} noBottomMargin={bottomMarginBool} />}
			</KeyboardAvoidingView>
		</ToastContext.Provider>
	);
};