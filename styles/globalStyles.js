import { StyleSheet, Dimensions, Platform } from "react-native";

const fullWidth = Dimensions.get("window").width;
const fullHeight = Dimensions.get("window").height;

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
        // paddingBottom: 100,
        flexDirection: "column"
    },

    containerWhitespace: {
        width: fullWidth - fullWidth / 16,
    },

    fontSmall: {
        fontSize: 15
    },

    fontMedium: {
        fontSize: 18,
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
        height: 60,
        ...(Platform.OS === "android" && { textAlignHorizontal: "center" }),
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
        ...(Platform.OS === 'ios' && { paddingVertical: 10 }),
        ...(Platform.OS === 'android' && { textAlignVertical: 'center' }),
    },

    inputLarge: {
        height: 150,
        ...(Platform.OS === 'android' && { textAlignVertical: 'top' }),
    },

    listItemContainer: {
        paddingBottom: 50,
        // Tab bar height: 74
        // Top text height: 60
        // Top bar height: 64
        // Plus 30 for some margin
        maxHeight: fullHeight - (74 + 60 + 64 + 30 + 50)
    },

    drawerContainer: {
		flex: 1,
        flexGrow: 1,
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