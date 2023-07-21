import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import globalStyles from '../styles/globalStyles';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LibManager from '../scripts/lib_manager';

export default function ListItem(props) {
    const { name, description, id, type, drawer, onClick, length, onDelete } = props;
    const navigation = useNavigation();

    function deleteLib() {
        onDelete(id);
    }

    function playLib(id, type) {
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
                    <Text numberOfLines={1} ellipsizeMode='tail' style={[globalStyles.fontMedium, {flexShrink: 1}]}>{description}</Text>
                    <View style={styles.progressBarContainer}>
                        <View style={[styles.progressBar, {width: Dimensions.get('window').width * length}]}></View>
                    </View>
                    <MaterialIcons style={{marginLeft: 12, color: "red"}} name="delete" size={34} onPress={deleteLib} />
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
        width: "80%"
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

    progressBarContainer: {
        height: 4,
        width: Dimensions.get('window').width,
        backgroundColor: "#D1E8D5"
    },

    progressBar: {
        backgroundColor: "#006D40",
        height: 4
    }
})