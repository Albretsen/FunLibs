import { StyleSheet, Text, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import globalStyles from '../styles/globalStyles';
import { HeaderBackButton } from '@react-navigation/stack';

export default function Header({ scene, previous, navigation, leftIcon }) {
    // const { options } = scene.descriptor;
    // const title =
    //   options.headerTitle !== undefined
    //     ? options.headerTitle
    //     : options.title !== undefined
    //     ? options.title
    //     : scene.route.name;

    return (
      <View style={styles.headerContainer}>
        {leftIcon === "Backbutton" ? <HeaderBackButton onPress={() => navigation.goBack()} /> :
        <MaterialIcons name="menu" size={34} onPress={() => navigation.openDrawer()} />}
        <Text style={globalStyles.fontLarge}>Fun Libs</Text>
        <MaterialIcons name="account-circle" size={26} />
      </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: "row",
        alignContent: "center",
        alignItems: "center",
        justifyContent: "space-between",
        height: 50,
        paddingHorizontal: 10,
        backgroundColor: "white"
    }
})