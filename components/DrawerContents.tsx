import React from 'react';
import { View, Text, TouchableOpacity, ImageRequireSource } from 'react-native';

interface DrawerContentsProps {
    title: string;
    imageSrc: ImageRequireSource;
    sections: Array<{
        title: string;
        links: Array<{
            title: string;
            onPress: () => void;
        }>;
    }>;
}

export default function DrawerContents({title, imageSrc, sections}: DrawerContentsProps) {
    return(
        <View>
            
        </View>
    )
}