import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import globalStyles from '../styles/globalStyles';
import { useNavigation } from '@react-navigation/native';

export default function ListItem(props) {
    const { name, id, type, drawer, onClick } = props;
    const navigation = useNavigation();

    function playLib(id, type) {
        console.log(id)
        if(type == "stories") {
            drawer.current.openDrawer();
            onClick({id, name, type})
        } else {
            navigation.navigate('PlayScreen', { libId: id, type: type });
        }
    }

    return (
        <TouchableOpacity onPress={() => playLib(id, type)}>
            <View style={[styles.container, globalStyles.containerWhitespace]}>
                <View style={styles.letterCircle}>
                    <Text style={globalStyles.fontLarge}>{name[0]}</Text>
                </View>
                <View style={styles.textRow}>
                    <Text style={[globalStyles.fontMedium, globalStyles.bold]}>{name}</Text>
                    <Text style={globalStyles.fontMedium}>Some text goes here...</Text>
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