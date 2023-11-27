import React from "react";
import { View, Dimensions, ImageRequireSource } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import PackCard from "./PackCard";

type dataObj = {
    title: string;
    key: string;
    image?: ImageRequireSource;
}

interface PackCarouselProps {
    data: Array<dataObj>
}

export default function PackCarousel({data}: PackCarouselProps) {

    // Width of the whole carosel, takes up whole window width
    const sliderWidth = Dimensions.get('window').width;
    // Width of each individual slide
    // const itemWidth = 170;
    const itemWidth = sliderWidth - sliderWidth / 6
    

    const renderItem = ({ item }: any) => (
        <View>
            <PackCard
                title={`${item.title}`}
                description={item.description}
                image={item.image}
                imageHeight={110}
                imageWidth={110}
                onPress={item.onPress}
                containerStyle={{width: itemWidth}}
                colorStart="white"
                colorEnd="#E3E5E8"
            />
        </View>
    );

    return (
        <Carousel
            data={data}
            renderItem={renderItem}
            sliderWidth={sliderWidth}
            itemWidth={itemWidth}
            firstItem={0}
            autoplay={true}
            lockScrollWhileSnapping={true}
            inactiveSlideOpacity={1}
            inactiveSlideScale={1}
            // layout="stack"
            layout="tinder"
            loop={true}
        />
    );
}
