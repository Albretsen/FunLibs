import React, { useState, useRef, useEffect, useContext } from "react";
import { View, Text, ScrollView, Image, StyleSheet, Dimensions, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import ListItem from "../components/ListItem";
import { LinearGradient } from 'expo-linear-gradient';
import globalStyles from "../styles/globalStyles";
import FirebaseManager from "../scripts/firebase_manager";
import Dropdown from "../components/Dropdown";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AvatarSelect from "../components/AvatarSelect";
import BottomSheet from '@gorhom/bottom-sheet';
import CustomBackground from "../components/CustomBackground";
import { ToastContext } from "../components/Toast";
import ListManager from "../components/ListManager";

export default function ProfileScreen({ route }) {
    const uid = route.params.uid;

    const showToast = useContext(ToastContext);

    const [loading, setLoading] = useState(true);

    // Simply set this to an object with the correct userdata
    const [userData, setUserData] = useState({});

    useEffect(() => {
        setLoading(true);
        fetchUserData(uid);
    }, []);

    const fetchUserData = async (uid) => {
        if (uid === FirebaseManager.currentUserData?.auth?.uid) setYourOwnProfile(true);
        let data = await FirebaseManager.fetchUserDataForProfile(uid);
        if (!data) {
            showToast("Profile was not found.");
            setLoading(false);
            return;
        }
        data.memberSince = "test";
        setUserData(data);
        setBioValue(data.bio);
        setNameValue(data.username);
        setAvatarIndex(data.avatarID);
        setLoading(false);
    }

    // True if viewing your own profile
    // Mostly turns text into input fields
    const [yourOwnProfile, setYourOwnProfile] = useState(false);

    const [editUsername, setEditUsername] = useState(false);

    // Default, min, and max heights for the TextInput
    const defaultHeight = 30;
    const minHeight = 30;
    const maxHeight = 99999;

    const [inputHeight, setInputHeight] = useState(defaultHeight);

    const [bioValue, setBioValue] = useState(userData.bio);
    const [nameValue, setNameValue] = useState(userData.username);

    // For avatar selection
    const [avatarIndex, setAvatarIndex] = useState(userData.avatarID);
    const handleAvatarChange = (index) => {
        setAvatarIndex(index);
        let uid = FirebaseManager.currentUserData?.auth?.uid;
        if (uid) FirebaseManager.UpdateAvatar(uid, index);
        closeBottomSheet();
    }

    const bottomSheetRef = useRef(null);

    const openBottomSheet = () => {
		bottomSheetRef.current?.snapToIndex(0);
	};

	const closeBottomSheet = () => {
		bottomSheetRef.current?.close();
	};

    return (
        <View style={[{flex: 1, backgroundColor: "white"}, globalStyles.headerAccountedHeight]}>
            <LinearGradient
                colors={['#19BB77', '#3E99ED']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.background}
            />
            <View style={[{overflow: "hidden"}, globalStyles.headerAccountedHeight]}>
                <View style={styles.circleBackground} />
                <TouchableOpacity style={styles.imageContainer} onPress={
                    () => {
                        if(yourOwnProfile) openBottomSheet();
                    }
                }>
                    <Image
                        style={styles.image}
                        source={FirebaseManager.avatars[avatarIndex]}
                    />
                    {yourOwnProfile && (
                        <View style={styles.addImage}>
                            <MaterialIcons name="add" size={20} style={{color: "white"}} />
                        </View>
                    )}
                </TouchableOpacity>
                <View style={{alignSelf: "center", zIndex: 100, gap: 10, paddingVertical: 10}}>
                    {editUsername ? 
                        <>
                            <TextInput
                                style={[globalStyles.fontMedium, {color: "#1D1B20", textAlign: "center", width: "100%"}]}
                                placeholder="Username..."
                                value={nameValue}
                                onChangeText={(text) => {
                                    setNameValue(text);
                                }}
                            />
                            <TouchableOpacity onPress={ async () => {
                                showToast("Updating username...")
                                let result = await FirebaseManager.UpdateUsername(uid, nameValue);
                                if (result === "username-not-available") {
                                    showToast("Username is not available.");
                                    return;
                                }
                                setEditUsername(false);
                                showToast("Username has been updated.");
                            }}>
                                <Text>Save username</Text>
                            </TouchableOpacity>
                        </>
                        :
                        <View style={{flexDirection: "row"}}>
                            <Dropdown
                                title={nameValue}
                                titleStyle={[globalStyles.fontMedium, {color: "#1D1B20"}]}
                                containerStyle={{alignSelf: "center", height: "auto"}}
                                options={[
                                    {
                                        name: "User options?",
                                        onPress: null
                                    }
                                ]}
                            />
                            {yourOwnProfile ? 
                                <TouchableOpacity onPress={() => setEditUsername(true)}>
                                    <MaterialIcons name="edit" size={20} color="#333" />
                                </TouchableOpacity>
                            : null}
                        </View>
                    }
                </View>
                <ScrollView>
                    <View style={[globalStyles.screenStandard, globalStyles.bigWhitespacePadding, {gap: 10, alignSelf: "center", marginTop: 5}]}>
                        <Text style={[globalStyles.grayText]}>
                            {userData.memberSince}
                        </Text>
                        <View style={styles.userStats}>
                            <View style={styles.userStat}>
                                <Text style={styles.userStatNum}>{userData.likesCount}</Text>
                                <Text style={[styles.userStatText, globalStyles.grayText]}>likes</Text>
                            </View>
                            <View style={styles.userStat}>
                                <Text style={styles.userStatNum}>{userData.libsCount}</Text>
                                <Text style={[styles.userStatText, globalStyles.grayText]}>libs</Text>
                            </View>
                        </View>
                        <Text style={globalStyles.title}>About me</Text>
                        {yourOwnProfile ?
                            <>
                                <TextInput
                                    placeholder="Say something about yorself..."
                                    placeholderTextColor={"#505050"}
                                    multiline
                                    textAlignVertical="top"
                                    style={[styles.bio, {height: inputHeight, width: "100%"}]}
                                    onChangeText={(text) => {
                                        setBioValue(text);
                                    }}
                                    value={bioValue}
                                    onContentSizeChange={(e) => {
                                        const newHeight = e.nativeEvent.contentSize.height;
                                        setInputHeight(Math.max(minHeight, Math.min(newHeight, maxHeight)));
                                    }}
                                />
                                <TouchableOpacity onPress={ async () => {
                                    await FirebaseManager.UpdateDocument("users", uid, { bio: bioValue });
                                    showToast("Bio updated.")
                                }}>
                                    <Text>Save description</Text>
                                </TouchableOpacity>
                            </>
                            :
                            <Text style={[styles.bio, globalStyles.grayText]}>{userData.bio}</Text>
                        }
                        <Text style={[globalStyles.title, { marginTop: 15 }]}>Templates by {userData.username}</Text>
                        <View>
                            <ListManager filterOptions={{
                                "category": "all",
                                "sortBy": "newest",
                                "dateRange": "allTime",
                                "playable": true,
                                "uid": uid,
                            }}></ListManager>
                        </View>
                    </View>
                </ScrollView>
            </View>
            <BottomSheet
                ref={bottomSheetRef}
                index={-1}
                snapPoints={['80%']}
                // enablePanDownToClose={true} // Needs to be false to allow scrollView to work normally
                style={[globalStyles.bigWhitespacePadding]}
                backgroundComponent={CustomBackground}
                // onChange={handleBottomSheetChange}
            >
                <Text style={[globalStyles.title, {marginBottom: 20}]}>Select a new avatar</Text>
                <AvatarSelect
                    onAvatarChange={handleAvatarChange}
                    selectedDefaultIndex={avatarIndex}
                    height={8}
                    bottomSheet={true}
                    containerStyle={{paddingVertical: 20}}
                />
            </BottomSheet>
            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#006D40" />
                </View>
			)}
        </View>
    )
}

const imageSize = 120;
const screenWidth = Dimensions.get("window").width;
// Width added to background circle, in this case 30 percent of the screen width
// I'm adding extra width to it in order to get a smoother border radius as a background
const extraBgWidth = screenWidth * 0.3;
// Calculate the amount of width in order to center it by placing it half of itself to the left
const leftPercentage = -(extraBgWidth / 2 / screenWidth) * 100;

const styles = StyleSheet.create({
    circleBackground: {
        position: 'absolute',
        left: `${leftPercentage}%`,
        top: 75,
        height: 200,
        borderRadius: "50%",
        backgroundColor: "white",
        width: screenWidth + extraBgWidth
    },

    image: {
        height: imageSize,
        width: imageSize,
        justifyContent: "center",
        alignSelf: "center",
    },

    imageContainer: {
        position: "relative",
        height: imageSize + 6,
        width: imageSize + 6,
        justifyContent: "center",
        alignSelf: "center",
        backgroundColor: "white",
        borderRadius: "100%",
        zIndex: 100
    },

    addImage: {
        position: "absolute",
        right: 10,
        top: imageSize - 25,
        borderRadius: "100%",
        height: 24,
        width: 24,
        backgroundColor: "#19BB77",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 3,
        borderColor: "white",
    },

    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        // This makes the background go to the top of the page, behind the header which is 64px tall
        top: -64,
        height: 64 + 75 + 100,
    },

    userStats: {
        flexDirection: "row",
        gap: 75,
        marginTop: 10,
        marginBottom: 20
    },

    userStat: {
        alignItems: "center"
    },

    userStatNum: {
        fontWeight: 500,
        fontSize: 15
    },

    userStatText: {

    },

    bio: {
        lineHeight: 26,
        color: "#505050"
    },

    loadingOverlay: {
        position: 'absolute',
        top: -64,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    }
})