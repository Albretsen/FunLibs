import React, { useRef, useState } from 'react';
import { Image, Dimensions, Animated } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import FirebaseManager from '../scripts/firebase_manager';
import AudioPlayer from "../scripts/audio";

const AvatarCarousel = ({ initialActiveIndex = 1, onAvatarChange, inDrawer }) => {
	const scrollAnim = useRef(new Animated.Value(initialActiveIndex * 100)).current;

	let avatars = Array.from({ length: 30 }, (_, index) => ({
		uri: FirebaseManager.avatars[index],
	}));

	// avatars.splice(14, 0, {uri: require(`../assets/images/avatars/no-avatar.png`)});

	avatars.unshift({uri: FirebaseManager.avatars["carousel-padding"]});
	avatars.push({uri: FirebaseManager.avatars["carousel-padding"]});

	const renderItem = ({ item, index }) => {
		const inputRange = [
			(index - 1) * 100,
			index * 100,
			(index + 1) * 100,
		];
	
		const scaleOutputRange = [0.7, 1, 0.7];
		const opacityOutputRange = [0.8, 1, 0.8];
	
		const scale = scrollAnim.interpolate({
			inputRange,
			outputRange: scaleOutputRange,
			extrapolate: 'clamp',
		});
	
		const opacity = scrollAnim.interpolate({
			inputRange,
			outputRange: opacityOutputRange,
			extrapolate: 'clamp',
		});
	
		return (
			<Animated.View style={{ transform: [{ scale }], opacity }}>
				<Image source={item.uri} style={{ width: 100, height: 100 }} />
			</Animated.View>
		);
	};
	
	const { playAudio } = AudioPlayer();
	
	const handleSnapToItem = (index) => {
		if (onAvatarChange) onAvatarChange(index);
		playAudio("pop");
	}

	return (
		<Carousel
			data={avatars}
			renderItem={renderItem}
			sliderWidth={
				// If the carousel appears within a drawer, the width needs to be adjusted, because the drawer
				// does not fill the whole width of the screeen
				// In this case the width is set to screen width minus 15% of screen width, because that is
				// the standard with used by drawers in the app
				// Ideally, this nunber would not be hardcoded
				inDrawer ? Dimensions.get("window").width - ((15 / 100) * Dimensions.get("window").width) : Dimensions.get("window").width}
			itemWidth={100}
			firstItem={initialActiveIndex}
			onSnapToItem={handleSnapToItem}
			onScroll={Animated.event(
				[{ nativeEvent: { contentOffset: { x: scrollAnim } } }],
				{ useNativeDriver: true }
			)}
			enableMomentum={true}
		/>
	);
};

export default AvatarCarousel;
