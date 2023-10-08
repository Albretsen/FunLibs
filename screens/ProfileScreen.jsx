import React, { useState, useRef, useEffect, useContext } from "react";
import { View, Text, ScrollView, Image, StyleSheet, Dimensions, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import ListItem from "../components/ListItem";
import { LinearGradient } from 'expo-linear-gradient';
import globalStyles from "../styles/globalStyles";
import FirebaseManager from "../scripts/firebase_manager";
import Dropdown from "../components/Dropdown";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AvatarSelect from "../components/AvatarSelect";
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import CustomBackground from "../components/CustomBackground";
import { ToastContext } from "../components/Toast";
import ListManager from "../components/ListManager";
import { useNavigation } from "@react-navigation/native";

export default function ProfileScreen({ route }) {
    const uid = route.params.uid;

    const showToast = useContext(ToastContext);

    const [loading, setLoading] = useState(true);

    const navigation = useNavigation();

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
            showToast("This user does not have a public profile.");
            navigation.navigate("Home");
            setLoading(false);
            return;
        }
        if (!data.memberSince) { data.memberSince = ""; } 
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
    const [editBio, setEditBio] = useState(false);

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
		bottomSheetRef.current?.snapToIndex(1);
	};

	const closeBottomSheet = () => {
		bottomSheetRef.current?.close();
	};

    const blockUser = (uid, username) => {
        if (!FirebaseManager.currentUserData?.auth?.uid) {
            showToast("Please log in to block users.");
            return;
        }

        if (uid === "HOv8K8Z1Q6bUuGxENrPrleECIWe2") {
            showToast(":(");
            return;
        }

        FirebaseManager.blockUser(uid);

        showToast(username + " has been blocked.", true);
        navigation.navigate("Home");
        FirebaseManager.RefreshList(null);
    }

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
                            <MaterialIcons name="add" size={20} style={{color: "white", alignSelf: "center"}} />
                        </View>
                    )}
                </TouchableOpacity>
                <View style={{alignSelf: "center", zIndex: 100, paddingVertical: 10}}>
                    {editUsername ? 
                        <>
                            <TextInput
                                style={[globalStyles.fontMedium, {color: "#1D1B20", textAlign: "center", width: "100%", borderBottomWidth: 1, borderColor: "#5C9BEB"}]}
                                placeholder="Username..."
                                value={nameValue}
                                onChangeText={(text) => {
                                    setNameValue(text);
                                }}
                            />
                            <TouchableOpacity style={styles.editButton} onPress={ async () => {
                                showToast({text: "Updating username...", loading: true});
                                let result = await FirebaseManager.UpdateUsername(uid, nameValue);
                                if (result === "username-not-available") {
                                    showToast({text: "Username is not available.", loading: false});
                                    return;
                                }
                                setEditUsername(false);
                                showToast({text: "Username has been updated.", loading: false});
                            }}>
                                <Text style={[styles.highlightColor, {fontSize: 14}]}>Save new username</Text>
                                <MaterialIcons style={styles.highlightColor} name="check" size={15} color="#333" />
                            </TouchableOpacity>
                        </>
                        :
                        <View>
                            {yourOwnProfile ? 
                                <TouchableOpacity
                                    onPress={() => setEditUsername(true)}
                                    style={{flexDirection: "row", gap: 6, alignItems: "center"}}
                                >
                                    <Text style={[globalStyles.fontMedium, {color: "#1D1B20"}]}>{nameValue}</Text>
                                    <MaterialIcons style={styles.highlightColor} name="edit" size={17} color="#333" />
                                </TouchableOpacity>
                            :
                                <Dropdown
                                    title={nameValue}
                                    titleStyle={[globalStyles.fontMedium, {color: "#1D1B20"}]}
                                    containerStyle={{alignSelf: "center", height: "auto"}}
                                    options={[
                                        {
                                            name: "Block " + nameValue,
                                            onPress: () => blockUser(uid, nameValue),
                                        }
                                    ]}
                                />
                            }
                        </View>
                    }
                </View>
                <ScrollView contentContainerStyle={{paddingBottom: 50}}>
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
                        {editBio ? 
                            <>
                                <TextInput
                                    placeholder="Say something about yorself..."
                                    placeholderTextColor={"#505050"}
                                    multiline
                                    textAlignVertical="top"
                                    style={[styles.bio, {height: inputHeight, width: "100%", borderBottomWidth: 1, borderColor: "#5C9BEB"}]}
                                    onChangeText={(text) => {
                                        setBioValue(text);
                                    }}
                                    value={bioValue}
                                    onContentSizeChange={(e) => {
                                        const newHeight = e.nativeEvent.contentSize.height;
                                        setInputHeight(Math.max(minHeight, Math.min(newHeight, maxHeight)));
                                    }}
                                />
                                <TouchableOpacity style={styles.editButton} onPress={ async () => {
                                    showToast({text: "Updating description...", loading: true});
                                    await FirebaseManager.UpdateDocument("users", uid, { bio: bioValue });
                                    setEditBio(false);
                                    showToast({text: "Description updated", loading: false});
                                }}>
                                    <Text style={[styles.highlightColor, {fontSize: 14}]}>Save new description</Text>
                                    <MaterialIcons style={styles.highlightColor} name="check" size={15} color="#333" />
                                </TouchableOpacity>
                            </>
                        :
                            <View style={{width: "100%"}}>
                                {yourOwnProfile ?
                                    <TouchableOpacity
                                        style={{flexDirection: "row"}}
                                        onPress={() => {
                                            setEditBio(true);
                                        }}
                                    >
                                        <Text style={[styles.bio, globalStyles.grayText, {flex: 1, width: "100%"}]}>{bioValue ? bioValue : nameValue + " has not written anything about themself yet..."}</Text>
                                        <MaterialIcons style={[styles.highlightColor, {flexBasis: 20, marginTop: 3}]} name="edit" size={17}/>
                                    </TouchableOpacity>
                                    :
                                    <Text style={[styles.bio, globalStyles.grayText]}>{userData.bio ? userData.bio : nameValue + " has not written anything about themself yet..."}</Text>
                                }
                            </View>
                        }
                        <Text style={[globalStyles.title, { marginTop: 15 }]}>Templates by {userData.username}</Text>

                        {/* <Text style={[globalStyles.title, {marginTop: 15}]}>Templates by {userData.username}</Text> */}
                        <View>
                            <ListManager filterOptions={{
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
                snapPoints={['50%', '80%', '90%']}
                enablePanDownToClose={true} // Needs to be false to allow scrollView to work normally
                style={[globalStyles.bigWhitespacePadding, {justifyContent: "center", alignItems: "center"}]}
                backgroundComponent={CustomBackground}
                // onChange={handleBottomSheetChange}
            >
                <Text style={[globalStyles.title, {marginBottom: 20}]}>Select a new avatar</Text>
                <BottomSheetScrollView>
                    <AvatarSelect
                        onAvatarChange={handleAvatarChange}
                        selectedDefaultIndex={avatarIndex}
                        height={9}
                        bottomSheet={true}
                        containerStyle={{paddingVertical: 20}}
                    />
                </BottomSheetScrollView>
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
const extraBgWidth = screenWidth * 2;
// Calculate the amount of width in order to center it by placing it half of itself to the left
const leftPercentage = -(extraBgWidth / 2 / screenWidth) * 100;

const styles = StyleSheet.create({
    circleBackground: {
        position: 'absolute',
        left: `${leftPercentage}%`,
        top: 75,
        height: screenWidth + extraBgWidth,
        borderRadius: (screenWidth + extraBgWidth) / 2, // USED TO BE "50%"
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
        borderRadius: 100, // "100%"
        zIndex: 100
    },

    addImage: {
        position: "absolute",
        right: 10,
        top: imageSize - 25,
        borderRadius: 100, // "100%"
        height: 30,
        width: 30,
        backgroundColor: "#3E99ED",
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
    },

    editButton: {
        flexDirection: "row",
        paddingVertical: 10,
        paddingTop: 4,
        alignItems: "center",
        justifyContent: "center",
        gap: 4
    },

    highlightColor: {
        color: "#3E99ED",
    },
})