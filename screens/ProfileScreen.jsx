import React, { useState, useRef, useEffect, useContext } from "react";
import { View, Text, ScrollView, Image, StyleSheet, Dimensions, TextInput, TouchableOpacity, ActivityIndicator, Pressable } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import globalStyles from "../styles/globalStyles";
import FirebaseManager from "../scripts/firebase_manager";
import Dropdown from "../components/Dropdown";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AvatarSelect from "../components/AvatarSelect";
import ColorSelect from "../components/ColorSelect";
import { ToastContext } from "../components/Toast";
import ListManager from "../components/ListManager";
import { useNavigation } from "@react-navigation/native";
import i18n from "../scripts/i18n";
import { Drawer } from 'hallvardlh-react-native-drawer';
import { ScrollView as DrawerScrollView } from "react-native-gesture-handler";

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
            showToast(i18n.t('this_user_does_not_have_a_public_profile'));
            navigation.navigate("Browse");
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

    const [userColor, setUserColor] = useState(FirebaseManager.getRandomColor());

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
        avatarDrawerRef.current?.closeDrawer();
    }

    const avatarDrawerRef = useRef(null);
    const colorDrawerRef = useRef(null);

    const handleColorChange = (color) => {
        // handle color select here
        colorDrawerRef.current?.closeDrawer();
    }

    const blockUser = (uid, username) => {
        if (!FirebaseManager.currentUserData?.auth?.uid) {
            showToast(i18n.t('please_sign_in_to_block_users'));
            return;
        }

        if (uid === "HOv8K8Z1Q6bUuGxENrPrleECIWe2") {
            showToast(i18n.t('sad_smiley'));
            return;
        }

        FirebaseManager.blockUser(uid);

        showToast(username + " " + i18n.t('has_been_blocked'), true);
        navigation.navigate("Browse");
        FirebaseManager.RefreshList(null);
    }

    return (
        <View style={[{flex: 1, backgroundColor: "white"}, globalStyles.headerAccountedHeight]}>
            <LinearGradient
                colors={["#638BD5", "#60C195"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.background}
            />
            {yourOwnProfile && (
                <TouchableOpacity
                    style={{position: "absolute", top: 110, left: (screenWidth / 2) - 140, zIndex: 120}}
                    onPress={() => {
                        colorDrawerRef.current?.openDrawer();
                }}>
                    <MaterialIcons name="palette" size={28} style={styles.highlightColor} />
                </TouchableOpacity>
            )}
            <View style={[{overflow: "hidden", flex: 1}, globalStyles.headerAccountedHeight]}>
                <View style={styles.circleBackground} />
                <Pressable style={[styles.imageContainer, {backgroundColor: "white"}]} onPress={
                    () => {
                        if(yourOwnProfile) avatarDrawerRef.current?.openDrawer();
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
                </Pressable>
                <View style={{alignSelf: "center", zIndex: 100, paddingVertical: 10}}>
                    {editUsername ? 
                        <>
                            <TextInput
                                style={[globalStyles.fontMedium, {color: "#1D1B20", textAlign: "center", width: "100%", borderBottomWidth: 1, borderColor: "#5C9BEB"}]}
                                placeholder={i18n.t('username')}
                                value={nameValue}
                                textAlign="center"
                                onChangeText={(text) => {
                                    setNameValue(text);
                                }}
                            />
                            <TouchableOpacity style={styles.editButton} onPress={ async () => {
                                showToast({text: i18n.t('updating_username'), loading: true});
                                let result = await FirebaseManager.UpdateUsername(uid, nameValue);
                                if (result === "username-not-available") {
                                    showToast({text: i18n.t('the_username_is_not_available'), loading: false});
                                    return;
                                }
                                setEditUsername(false);
                                showToast({text: i18n.t('your_username_has_been_updated'), loading: false});
                            }}>
                                <Text style={[styles.highlightColor, {fontSize: 14}]}>{i18n.t('save_new_username')}</Text>
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
                                            name: i18n.t('block') + " " + nameValue,
                                            onPress: () => blockUser(uid, nameValue),
                                        }
                                    ]}
                                />
                            }
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
                                <Text style={[styles.userStatText, globalStyles.grayText]}>{i18n.t('likes')}</Text>
                            </View>
                            <View style={styles.userStat}>
                                <Text style={styles.userStatNum}>{userData.libsCount}</Text>
                                <Text style={[styles.userStatText, globalStyles.grayText]}>{i18n.t('libs')}</Text>
                            </View>
                        </View>
                        <Text style={globalStyles.title}>{i18n.t('about_me')}</Text>
                        {editBio ? 
                            <>
                                <TextInput
                                    placeholder={i18n.t('say_something_about_yourself')}
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
                                    showToast({text: i18n.t('updating_description'), loading: true});
                                    await FirebaseManager.UpdateDocument("users", uid, { bio: bioValue });
                                    setEditBio(false);
                                    showToast({text: i18n.t('description_updated'), loading: false});
                                }}>
                                    <Text style={[styles.highlightColor, {fontSize: 14}]}>{i18n.t('save_new_description')}</Text>
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
                                        <Text style={[styles.bio, globalStyles.grayText, {flex: 1, width: "100%"}]}>{bioValue ? bioValue : nameValue + " " + i18n.t('has_not_written_anything_about_themselves_yet')}</Text>
                                        <MaterialIcons style={[styles.highlightColor, {flexBasis: 20, marginTop: 3}]} name="edit" size={17}/>
                                    </TouchableOpacity>
                                    :
                                    <Text style={[styles.bio, globalStyles.grayText]}>{userData.bio ? userData.bio : nameValue + " " + i18n.t('has_not_written_anything_about_themselves_yet')}</Text>
                                }
                            </View>
                        }
                        <Text style={[globalStyles.title, { marginTop: 15 }]}>{i18n.t('templates_by')} {userData.username}</Text>
                        <ListManager paddingBottom={25} filterOptions={{
                            "sortBy": "newest",
                            "dateRange": "allTime",
                            "playable": true,
                            "uid": uid,
                        }}></ListManager>
                    </View>
                </ScrollView>
            </View>
            <Drawer ref={avatarDrawerRef} containerStyle={{paddingHorizontal: 8, borderBottomLeftRadius: 16, borderTopLeftRadius: 16, paddingVertical: 20}}>
                <Text style={[globalStyles.title, {textAlign: "center", marginBottom: 20}]}>{i18n.t('selected_a_new_avatar')}</Text>
                <DrawerScrollView>
                    <AvatarSelect
                        onAvatarChange={handleAvatarChange}
                        selectedDefaultIndex={avatarIndex}
                        containerIsView
                    />
                </DrawerScrollView>
            </Drawer>
            <Drawer ref={colorDrawerRef} containerStyle={{paddingHorizontal: 8, borderBottomLeftRadius: 16, borderTopLeftRadius: 16, paddingVertical: 20}}>
                <Text style={[globalStyles.title, {textAlign: "center", marginBottom: 20}]}>{i18n.t('select_a_new_color')}</Text>
                <DrawerScrollView>
                    <ColorSelect
                        onColorChange={handleColorChange}
                        selectedDefaultColor={"#ff00ff"}
                        containerIsView
                    />
                </DrawerScrollView>
            </Drawer>
            {loading && (
                <View style={globalStyles.loadingOverlay}>
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
        top: 85,
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
        marginTop: 10,
        height: imageSize + 10,
        width: imageSize + 10,
        justifyContent: "center",
        alignSelf: "center",
        backgroundColor: "white",
        borderRadius: 100,
        zIndex: 100,
        // borderWidth: 1,
        borderColor: "white",
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