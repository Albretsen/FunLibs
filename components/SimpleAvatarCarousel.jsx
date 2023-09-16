import React, { useRef, useState, useEffect } from 'react';
import { ScrollView, Image, TouchableOpacity, StyleSheet, View } from 'react-native';
import FirebaseManager from '../scripts/firebase_manager';
import { Dimensions } from 'react-native';

const avatarKeys = Object.keys(FirebaseManager.avatars).filter(key => !isNaN(key));

const SimpleAvatarCarousel = ({ onAvatarChange }) => {
    const scrollViewRef = useRef(null);
    const middleAvatarIndex = Math.floor(avatarKeys.length / 2);
    const [currentCenteredAvatar, setCurrentCenteredAvatar] = useState(avatarKeys[middleAvatarIndex]);
    const [selectedAvatar, setSelectedAvatar] = useState(null);

    const avatarWidth = 80 + 20; // image width + marginHorizontal

    useEffect(() => {
        const initialScrollToPosition = middleAvatarIndex * avatarWidth;
        scrollViewRef.current?.scrollTo({ x: initialScrollToPosition, animated: false });
    }, []);  // This will run only once after the component is mounted

    // Set middle avatar to be the selected avatar
    useEffect(() => {
        if (currentCenteredAvatar !== null) {
            //onAvatarChange(Number(currentCenteredAvatar));
        }
    }, [currentCenteredAvatar]);

    useEffect(() => {
        if (selectedAvatar !== null) {
            onAvatarChange(Number(selectedAvatar));
        }
    }, [selectedAvatar]);

    const handleScroll = (event) => {
        const scrollX = event.nativeEvent.contentOffset.x;
        const visibleWidth = Dimensions.get('window').width;
        const centeredAvatarIndex = Math.round((scrollX + (visibleWidth / 2) - (avatarWidth / 2)) / avatarWidth);
        setCurrentCenteredAvatar(avatarKeys[centeredAvatarIndex]);
    };

    const handleMomentumScrollEnd = () => {
        if (currentCenteredAvatar !== null) {
            const centeredAvatarIndex = avatarKeys.indexOf(currentCenteredAvatar);
            const scrollToPosition = centeredAvatarIndex * avatarWidth;
            scrollViewRef.current?.scrollTo({ x: scrollToPosition, animated: true });
        }
    };

    return (
        <ScrollView
            ref={scrollViewRef}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={true}
            directionalLockEnabled={true}
            onScroll={handleScroll}
            onMomentumScrollEnd={handleMomentumScrollEnd}
            scrollEventThrottle={16}
            decelerationRate="fast"
            snapToInterval={avatarWidth}  // This will assist in the snapping effect
            style={styles.carousel}
        >
            {avatarKeys.map((key, index) => (
                <TouchableOpacity
                    key={index}
                    onPress={() => {
                        setSelectedAvatar(key);
                    }}
                    style={styles.avatarContainer}  // This is the wrapper around the image
                >
                    <View style={key === selectedAvatar ? styles.selectedAvatar : null}>
                        <Image source={FirebaseManager.avatars[key]} style={styles.avatarImage} />
                    </View>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    carousel: {
        flexDirection: 'row',
        height: 100,
        width: screenWidth,
        overflow: 'hidden',
    },
    avatarContainer: {
        width: 80 + 20,  // image width + marginHorizontal
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 5
    },
    
    selectedAvatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.6,
        shadowRadius: 6,
        elevation: 8,  // for Android
        overflow: 'hidden',  // Ensure shadow respects the circular shape
        marginVertical: 5,  // Added padding to give space for the shadow
    },
    
    avatarImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
});

export default SimpleAvatarCarousel;
