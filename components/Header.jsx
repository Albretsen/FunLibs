import { StyleSheet, Text, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import textStyles from '/components/textStyles';

export default function CustomHeader({ scene, previous, navigation }) {
    // const { options } = scene.descriptor;
    // const title =
    //   options.headerTitle !== undefined
    //     ? options.headerTitle
    //     : options.title !== undefined
    //     ? options.title
    //     : scene.route.name;
  
    return (
      <View style={styles.headerContainer}>
        <MaterialIcons name="menu" size={34} onPress={() => navigation.openDrawer()} />
        <Text style={textStyles.fontLarge}>Fun Libs</Text>
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