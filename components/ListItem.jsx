import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import textStyles from '../styles/textStyles';
import { useNavigation } from '@react-navigation/native';
import miscStyles from '../styles/miscStyles';

export default function ListItem(props) {
    const { name, id } = props;
    const navigation = useNavigation();

    function playLib(id) {
        console.log(id)
        navigation.navigate('PlayScreen', { libId: id });
    }

    return (
        <TouchableOpacity onPress={() => playLib(id)}>
            <View style={[styles.container, miscStyles.containerWhitespace]}>
                <View style={styles.letterCircle}>
                    <Text style={textStyles.fontLarge}>{name[0]}</Text>
                </View>
                <View style={styles.textRow}>
                    <Text style={[textStyles.fontMedium, textStyles.bold]}>{name}</Text>
                    <Text style={textStyles.fontMedium}>Some text goes here...</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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