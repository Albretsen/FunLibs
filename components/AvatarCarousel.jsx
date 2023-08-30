import React, { useState } from 'react';
import { View, Image } from 'react-native';
import Carousel from 'react-native-snap-carousel';

const AvatarCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0); // You can set this to the index of 'x image' you want

  const avatars = [
    { uri: "../assets/images/avatars/0.png" },
    { uri: "../assets/images/avatars/1.png" },
    { uri: "../assets/images/avatars/2.png" },
    { uri: "../assets/images/avatars/3.png" },
    { uri: "../assets/images/avatars/4.png" },
    { uri: "../assets/images/avatars/5.png" },
  ];

  const renderItem = ({ item }) => {
    return (
      <View>
        <Image source={item} style={{ width: 100, height: 100 }} />
      </View>
    );
  };

  return (
    <Carousel
      layout={'default'}
      data={avatars}
      renderItem={renderItem}
      sliderWidth={300}
      itemWidth={100}
      onSnapToItem={(index) => setActiveIndex(index)}
      firstItem={activeIndex}
    />
  );
};

export default AvatarCarousel