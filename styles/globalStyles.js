import { StyleSheet, Dimensions, Platform } from "react-native";

const fullWidth = Dimensions.get("window").width;

const globalStyles = StyleSheet.create({
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
        paddingTop: 1,
        paddingBottom: 100,
    },

    containerWhitespace: {
        width: fullWidth - fullWidth / 16,
    },

    fontSmall: {
        fontSize: 15
    },

    fontMedium: {
        fontSize: 18,
        // fontFamily: "Roboto-Regular"
    },

    fontLarge: {
        fontSize: 26
    },

    title: {
        fontSize: 22,
    },

    titleContainer: {
        marginHorizontal: 20,
        alignItems: "center",
        textAlign: "center",
        // paddingHorizontal: 20
    },

    bold: {
        fontWeight: 500
    },

    input: {
        borderRadius: 4,
        borderWidth: 1,
        borderColor: "#79747E",
        fontSize: 16,
        padding: 6
    },

    inputSmall: {
        height: 50,
        // Need to test this on emulator
        ...(Platform.OS === 'ios' && { paddingVertical: 10 }),
        ...(Platform.OS === 'android' && { textAlignVertical: 'center' }),
        // padding: 10
    },

    inputLarge: {
        // padding: 10
        height: 150,
        ...(Platform.OS === 'android' && { textAlignVertical: 'top' }),
    },

    listItemContainer: {
        paddingBottom: 30,
    },

    drawerContainer: {
		flex: 1,
		justifyContent: "space-between",
		borderRightWidth: 1,
		borderColor: "#D1E8D5",
	},

	drawerTop: {
		marginHorizontal: 20,
	},

	drawerBottom: {
		marginBottom: 10,
		marginRight: 10,
		paddingTop: 10,
		borderTopWidth: 1,
		borderColor: "gray",
		gap: 16,
		paddingBottom: 16
	},
})

export default globalStyles;