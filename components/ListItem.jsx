import React from 'react';
import { StyleSheet, Dimensions, View, Text } from 'react-native';
import textStyles from './textStyles';

export default function ListItem(props) {
    const { name } = props;
    return (
        <View style={styles.container}>
            <View style={styles.letterCircle}>
                <Text style={textStyles.fontLarge}>{name[0]}</Text>
            </View>
            <View style={styles.textRow}>
                <Text style={[textStyles.fontMedium, textStyles.bold]}>{name}</Text>
                <Text style={textStyles.fontMedium}>Some text goes here...</Text>
            </View>
        </View>
    );
}

const fullWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: fullWidth - fullWidth / 20,
        flexDirection: "row",
        gap: 10,
        paddingTop: 20
    },

    textRow: {
        flexDirection: "column",
    }, 

    letterCircle: {
        padding: 10,
        backgroundColor: "#D1E8D5",
        borderRadius: 50,
        height: 50,
        width: 50,
        justifyContent: "center",
        alignItems: "center",
    },
})