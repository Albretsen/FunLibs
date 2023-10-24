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
        // paddingTop: 1,
        // paddingBottom: 100,
        flexDirection: "column",
        // maxHeight: fullHeight - 140
    },

    standardWhitespace: {
        marginHorizontal: fullWidth / 20,
        width: fullWidth - fullWidth / 10,
        maxWidth: 700
    },

    standardHeight: {
        height: fullHeight - 64,
        maxHeight: fullHeight - 64,
    },

    standardHeightBottomNav: {
        height: fullHeight - (64 + 74),
        maxHeight: fullHeight - (64 + 74),
    },

    containerWhitespace: {
        width: fullWidth - fullWidth / 10,
        maxWidth: 700
    },

    containerWhitespacePadding: {
        paddingHorizontal: fullWidth / 20,
        width: "100%",
        maxWidth: 700
    },

    bigWhitespace: {
        width: fullWidth - fullWidth / 6,
        maxWidth: 700
    },

    bigWhitespacePadding: {
        paddingHorizontal: fullWidth / 12,
        width: "100%",
        maxWidth: 700
    },

    headerAccountedHeight: {
        maxHeight: Dimensions.get("window").height - 64,
    },

    defaultFont: {
        fontFamily: "Roboto-Regular",
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

    touchableText: {
        color: "#5C9BEB",
    },

    grayText: {
        color: "#635f6a"
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
        // height: 150,
        // borderWidth: 0,
        borderColor: "white",
        ...(Platform.OS === 'android' && { textAlignVertical: 'top' }),
    },

    listItemContainer: {
        // Top bar height: 64
        // Segmented button and filter button height: 40
        // Dropdown height: 40
        // Tab bar height: 74
        // +2 to be sure
        //maxHeight: fullHeight - (64 + 40 + 40 + 74 + 2 + 60 + 40),
        // Explicitly setting height, to have loading indicator be centered vertically
        //height: fullHeight - (64 + 40 + 40 + 74 + 2 + 60 + 40),
        flex: 1
        // lol
    },

    drawerTitle: {
        fontSize: 24
    },

    drawerContainer: {
		flex: 1,
        flexGrow: 1,
		justifyContent: "space-between",
		borderRightWidth: 1,
		borderColor: "#D1E8D5",
	},

	drawerTop: {
		// marginHorizontal: 20,
        marginBottom: 10,
	},

    // The style that should be applied to every drawer in the app
    standardDrawer: {
        paddingHorizontal: 26,
        borderBottomLeftRadius: 16,
        borderTopLeftRadius: 16,
    },

    buttonDefault: {
		borderRadius: 40,
		backgroundColor: "white",
		borderWidth: 1,
		borderColor: "gray",
		padding: 10,
		paddingHorizontal: 20,
		minWidth: 100,
		height: 50,
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "row",
		gap: 10
	},

	buttonContainerDefault: {
		flexDirection: "row",
		justifyContent: "flex-end",
		flexWrap: "wrap",
		gap: 10,
		marginTop: 10,
        marginBottom: 10,
	},

    shadow: {
        shadowColor: '#CACACA',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 20,  
        elevation: 5, // for Android
    },

    form: {
        gap: 25,
        alignItems: "center"
    },

    formField: {
        gap: 6,
        height: 68
    },

    formSupportText: {
        marginLeft: 14,
        height: 20
    },

    formErrorText: {
        color: "red"
    },

    formButton: {
        borderRadius: 50,
        backgroundColor: "#D1E8D5",
        padding: 12
    },

    formButtonLabel: {
        alignSelf: "center",
        fontSize: 15,
        fontWeight: 600,
    },

    formBottomText: {
        position: "absolute",
        bottom: 150,
        alignSelf: "center",
        textAlign: "center",
        color: "#8f8f8f",
        fontSize: 15,
        letterSpacing: 1
    },

    formBottomTextHighlight: {
        color: "#3975EA"
    },

    // For icons placed within a material paper outlined input field
    inputRightIcon: {
        position: "absolute",
        right: 15,
        top: 20
    },

    dialogTitle: {
        fontWeight: "bold",
        fontSize: 16
    },

    dialogText: {
        fontSize: 15
    },

    title: {
        fontSize: 20,
        textAlign: "left",
        width: "100%",
        fontWeight: 500
    },
})

export default globalStyles;