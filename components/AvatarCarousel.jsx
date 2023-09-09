import React, { useRef, useState } from 'react';
import { Image, Dimensions, Animated } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import FirebaseManager from '../scripts/firebase_manager';

const AvatarCarousel = ({ initialActiveIndex = 1, onAvatarChange }) => {
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
	
	const handleSnapToItem = (index) => {
		if (onAvatarChange) onAvatarChange(index);
	}

	return (
		<Carousel
			data={avatars}
			renderItem={renderItem}
			sliderWidth={Dimensions.get("window").width}
			itemWidth={100}
			firstItem={initialActiveIndex}
			onSnapToItem={handleSnapToItem}
			onScroll={Animated.event(
				[{ nativeEvent: { contentOffset: { x: scrollAnim } } }],
				{ useNativeDriver: true }
			)}
		/>
	);
};

export default AvatarCarousel;
