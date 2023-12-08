/**
 * @component Toast
 *
 * @overview
 * Renders a toast on the bottom of the screen.
 * Can be used anywhere in the application, as long as the app is wrapped in the provider
 * 
 * @param message {String, Object} the message that is shown by the toast (Not recommended, always call with object)
 * @param noBottomMargin {Bool} toast has 150 bottom margin by default which places it above the bottom navigation. Setting this to true lowers the bottom margin to 50, used when there is no bottom navigation on screen
 * @param message.text {String} same as message
 * @param message.noBottomMargin {Bool} same as noBottomMargin
 * @param message.loading {Bool} will display a loading animation on the toast, can be cancelled by calling the toast with this bool as false
 * 
 * @example initialization in App.js
 * import { ToastProvider } from "path/Toast";
 * export default function App() {
 * 		return(
 * 			<ToastProvider>
 * 				{children}
 * 			</ToastProvider>
 * 		)
 * }
 * 
 * @example showToast
 * import { ToastContext } from "path/Toast";
 * function myComponent() {
 * 		const showToast = useContext(ToastContext);
 * 
 * 		showToast("Here's a toast!");
 * 		showToast({text: "Here's another toast, it has a loading animation!", loading: true});
 * 		showToast({text: "This toast tells you that loading has ended.", loading: false});
 * }
 * 
 */

import React, { useEffect, useRef, useState, createContext } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions, Platform, TouchableOpacity, KeyboardAvoidingView, Easing, Keyboard, KeyboardEvent } from 'react-native';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export const ToastContext = createContext();

const toastWidth = Dimensions.get('window').width * 0.9;

const Toast = ({ message, setMessage, noBottomMargin, keyboardHeight, showLoading }) => {
	const fadeAnim = useRef(new Animated.Value(0)).current;
	const translateYAnim = useRef(new Animated.Value(Dimensions.get('window').height)).current; // Using screen height
	const scaleAnim = useRef(new Animated.Value(0.8)).current; // For playful scaling effect
	const loadingAnim = useRef(new Animated.Value(0)).current;
	const [isKeyboardVisible, setKeyboardVisible] = useState(false);
	const [isToastVisible, setIsToastVisible] = useState(false);
	const [hasToastAnimated, setHasToastAnimated] = useState(false);

    useEffect(() => {
        let anim;
        if (showLoading) {
            anim = Animated.loop(
                Animated.sequence([
                    Animated.timing(loadingAnim, {
                        toValue: 1,
                        duration: 1500,
                        useNativeDriver: false,
                    }),
                    Animated.timing(loadingAnim, {
                        toValue: 0,
                        duration: 0,
                        useNativeDriver: false,
                    }),
                ])
            ).start();
        }
        return () => anim && anim.stop();
    }, [showLoading]);

	const timerRef = useRef(null);

	useEffect(() => {
		if (message) {
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
					duration: 500,
					easing: Easing.bounce, // Bouncy scaling
					useNativeDriver: true
				})
			]).start(() => {
				setIsToastVisible(true);  // set toast visibility to true after the animation
				setTimeout(() => {
					setHasToastAnimated(true);
				}, 600);
			});

			timerRef.current = setTimeout(() => {
				fadeOut();
			}, 8000);
		}

		return () => {
			clearTimeout(timerRef.current);
		};
	}, [message, fadeAnim]);

	useEffect(() => {
		if (isToastVisible && hasToastAnimated && (message)) {
			Animated.sequence([
				Animated.timing(scaleAnim, {
					toValue: 1.1,
					duration: 100,
					useNativeDriver: true
				}),
				Animated.timing(scaleAnim, {
					toValue: 1,
					duration: 200,
					useNativeDriver: true
				})
			]).start();
		}
	}, [message]);

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
			setMessage(null);
			setIsToastVisible(false);  // set toast visibility to false after fade out
			setHasToastAnimated(false);
		});
	};

	const handleClose = () => {
		clearTimeout(timerRef.current);
		fadeOut();
	};

	let bottomMargin = 150;
	if (noBottomMargin) {
		bottomMargin = 50;
	}

	return (
		<Animated.View style={[
            styles.container,
            {
                opacity: fadeAnim,
                transform: [{ translateY: translateYAnim }, { scale: scaleAnim }],
                bottom: keyboardHeight !== 0 ? (50 + keyboardHeight) : bottomMargin  // Adjust bottom margin based on keyboard height
            },
        ]}>
			<View style={{ justifyContent: "center", width: "86%" }}>
				<Text allowFontScaling style={[styles.text, { fontSize: 16, flexWrap: "wrap" }]}>{message}</Text>
			</View>
			<TouchableOpacity onPress={handleClose} style={{ justifyContent: "center", flex: 1 }}>
				<MaterialIcons style={{ color: "white", alignSelf: "flex-end" }} name="close" size={24} />
			</TouchableOpacity>
			{showLoading && (
                <Animated.View style={[styles.loadingBar, {
                    left: loadingAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-50, toastWidth]
                    })
                }]} />
            )}
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		flexDirection: "row",
		backgroundColor: '#322F35',
		padding: 20,
		borderRadius: 12,
		alignSelf: 'center',
		alignContent: "center",
		marginHorizontal: Dimensions.get('window').width * 0.05,
		width: toastWidth,
		overflow: "hidden",
		maxWidth: 600,
	},

	text: {
		color: 'white',
	},

	loadingBar: {
        height: 4,
        backgroundColor: "#6294C9",
        position: "absolute",
        bottom: 0,
        left: 0,
		width: 50
    },
});

export default Toast;

export const ToastProvider = ({ children }) => {
	const [message, setMessage] = useState(null);
	const [bottomMarginBool, setBottomMarginBool] = useState(false);
	const [showLoading, setShowLoading] = useState(false);

	const toastTimerRef = useRef(null);

	const [keyboardHeight, setKeyboardHeight] = useState(0);

    useEffect(() => {
        function onKeyboardDidShow(e) {
			console.log("KEYBOARD HEIGHT: " + e.endCoordinates.height);
            setKeyboardHeight(e.endCoordinates.height);
        }

        function onKeyboardDidHide() {
            setKeyboardHeight(0);
        }

        const showSubscription = Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
        const hideSubscription = Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);
        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

	const showToast = (message, noBottomMargin) => {
		// Message can be passed as a string simply containing the text of the toast, or as an object to allow for settings
		if(typeof message === "string") {
			setMessage(message);
		} else {
			setMessage(message.text);
			setBottomMarginBool(message?.noBottomMargin);
			setShowLoading(message?.loading);
		}

		// To avoid refactoring, noBottomMargin can still be called as a separate argument
		if(noBottomMargin) {
			setBottomMarginBool(noBottomMargin);
		}

		if (toastTimerRef.current) {
			clearTimeout(toastTimerRef.current);
		}

		toastTimerRef.current = setTimeout(() => {
			setMessage(null);
			setBottomMarginBool(false);
		}, 8000);
	};

	return (
		<ToastContext.Provider value={showToast}>
			{children}
			{message && <Toast keyboardHeight={keyboardHeight} message={message} setMessage={setMessage} noBottomMargin={bottomMarginBool} showLoading={showLoading} />}
		</ToastContext.Provider>
	);
};