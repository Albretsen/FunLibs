import React from "react";
import { View, Dimensions, ImageRequireSource } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import BigButton from "./BigButton";

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
            <BigButton
                label={`${item.title}`}
                description={item.description}
                image={item.image}
                imageHeight={110}
                imageWidth={110}
                onPress={item.onPress}
                width={itemWidth}
                height={200}
                flexDirection="row"
                containerStyle={{width: itemWidth}}
                usePressable
                colorStart="white"
                colorEnd="#E3E5E8"
                // containerStyle={{width: itemWidth - 10, paddingHorizontal: 20}}
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
