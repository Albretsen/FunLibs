import React, { useRef } from 'react';
import { Image, Dimensions, Animated } from 'react-native';
import Carousel from 'react-native-snap-carousel';

const AvatarCarousel = ({ initialActiveIndex = 29 }) => {
	const scrollAnim = useRef(new Animated.Value(initialActiveIndex * 100)).current;

	const avatars = Array.from({ length: 30 }, (_, index) => ({
		uri: require(`../assets/images/avatars/${index}.png`),
	}));

	const renderItem = ({ item, index }) => {
		const inputRange = [
			(index - 1) * 100,
			index * 100,
			(index + 1) * 100,
		];

		const outputRange = [0.7, 1, 0.7];
		const scale = scrollAnim.interpolate({
			inputRange,
			outputRange,
			extrapolate: 'clamp',
		});

		return (
			<Animated.View style={{ transform: [{ scale }], opacity: 1 }}>
				<Image source={item.uri} style={{ width: 100, height: 100 }} />
			</Animated.View>
		);
	};

	const handleSnapToItem = (index) => {
		console.log("Snapped to item:", index);
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
			scrollEventThrottle={16}
		/>
	);
};

export default AvatarCarousel;
