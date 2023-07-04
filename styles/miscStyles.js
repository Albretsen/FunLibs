import { StyleSheet, Dimensions } from "react-native";

const fullWidth = Dimensions.get("window").width;

const miscStyles = StyleSheet.create({
    dropShadow: {
        // iOS shadow properties
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        // Android shadow properties
        elevation: 5,
    },

    screenStandard: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        // justifyContent: 'center',
        paddingTop: 10
    },

    containerWhitespace: {
        width: fullWidth - fullWidth / 16,
    }
})

export default miscStyles;