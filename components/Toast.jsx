import React, { useEffect, useRef, useState, createContext } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions, Platform, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import globalStyles from '../styles/globalStyles';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export const ToastContext = createContext();

const Toast = ({ title, message, setTitle, setMessage }) => {
	const fadeAnim = useRef(new Animated.Value(1)).current;
	const [isKeyboardVisible, setKeyboardVisible] = useState(false);

	const timerRef = useRef(null);

	useEffect(() => {
		timerRef.current = setTimeout(() => {
			fadeOut();
		}, 8000);
	
		return () => {
			clearTimeout(timerRef.current);
		};
	}, [fadeAnim]);

	const fadeOut = () => {
		Animated.timing(
		fadeAnim,
		{
			toValue: 0,
			duration: 500,
			useNativeDriver: true
		}
		).start(() => {
			setTitle(null);
			setMessage(null);
		});
	};
	
	const handleClose = () => {
		clearTimeout(timerRef.current);
		fadeOut();
	};

	return (
		<Animated.View style={[styles.container, { opacity: fadeAnim }, isKeyboardVisible ? {bottom: 10} : {bottom: 90}]}>
		<View style={{justifyContent: "center", width: "86%"}}>
			<Text allowFontScaling style={[styles.text, {fontSize: 18}, globalStyles.bold]}>{title}</Text>
			<Text allowFontScaling style={[styles.text, {fontSize: 16, flexWrap: "wrap"}]}>{message}</Text>
		</View>
		<TouchableOpacity onPress={handleClose} style={{justifyContent: "center", flex: 1}}>
			<MaterialIcons style={{color: "white", alignSelf: "flex-end"}} name="close" size={34} />
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

	const toastTimerRef = useRef(null);

	const showToast = (message, title) => {
		setTitle(title);
		setMessage(message);
	
		if (toastTimerRef.current) {
			clearTimeout(toastTimerRef.current);
		}
	
		toastTimerRef.current = setTimeout(() => {
			setTitle(null);
			setMessage(null);
		}, 8000);
	};

	return (
		<ToastContext.Provider value={showToast}>
			{children}
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'position' : undefined}
			>
				{message && <Toast title={title} message={message} setTitle={setTitle} setMessage={setMessage} />}
			</KeyboardAvoidingView>
		</ToastContext.Provider>
	);
};