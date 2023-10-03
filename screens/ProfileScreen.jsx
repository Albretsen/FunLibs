import React, { useState } from "react";
import { View, Text, ScrollView, Image, StyleSheet, Dimensions, TextInput, TouchableOpacity } from "react-native";
import ListItem from "../components/ListItem";
import { LinearGradient } from 'expo-linear-gradient';
import globalStyles from "../styles/globalStyles";
import FirebaseManager from "../scripts/firebase_manager";
import Dropdown from "../components/Dropdown";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default function ProfileScreen({ route }) {
    const userId = route.userId;

    // Simply set this to an object with the correct userdata
    const [userData, setUserData] = useState({
        username: "Hallvard",
        avatarID: 21,
        likesCount: 234,
        libsCount: 5,
        memberSince: "Member since 2. October 2023",
        bio: "Hey there! I'm Hallvard, Bergen's very own beanstalk. I'm so tall, I sometimes bump my head on the moon. Between my awkward dance moves and serenading my plants (yes, they're my only roommates), I also dabble in programming. Living solo means no one sees me talk to my ferns... until now. Oops!"
    });

    // True if viewing your own profile
    // Mostly turns text into input fields
    const [yourOwnProfile, setYourOwnProfile] = useState(true);

    const [editUsername, setEditUsername] = useState(false);

    // Default, min, and max heights for the TextInput
    const defaultHeight = 30;
    const minHeight = 30;
    const maxHeight = 99999;

    const [inputHeight, setInputHeight] = useState(defaultHeight);

    const defaultWidth = 60;
    const minWidth = 30;
    const maxWidth = 99999;

    const [inputWidth, setInputWidth] = useState(defaultWidth);

    const [textValue, setTextValue] = useState(userData.bio);
    const [nameValue, setNameValue] = useState(userData.username);

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
                <View style={styles.imageContainer}>
                    <Image
                        style={styles.image}
                        source={FirebaseManager.avatars[userData.avatarID]}
                    />
                </View>
                <View style={{alignSelf: "center", zIndex: 100, gap: 10, paddingVertical: 10}}>
                    {editUsername ? 
                        <TextInput
                            style={[globalStyles.fontMedium, {color: "#1D1B20", textAlign: "center", width: inputWidth}]}
                            placeholder="Username..."
                            value={nameValue}
                            onChangeText={(text) => {
                                setTextValue(text);
                            }}
                            onContentSizeChange={(e) => {
                                const newWidth = e.nativeEvent.contentSize.width;
                                setInputHeight(Math.max(minWidth, Math.min(newWidth, maxWidth)));
                            }}
                        />
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
                            <TouchableOpacity onPress={() => setEditUsername(true)}>
                                <MaterialIcons name="edit" size={20} color="#333" />
                            </TouchableOpacity>
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
                            <TextInput
                                placeholder="Say something about yorself..."
                                placeholderTextColor={"#505050"}
                                multiline
                                textAlignVertical="top"
                                style={[styles.bio, {height: inputHeight, width: "100%"}]}
                                onChangeText={(text) => {
                                    setTextValue(text);
                                }}
                                value={textValue}
                                onContentSizeChange={(e) => {
                                    const newHeight = e.nativeEvent.contentSize.height;
                                    setInputHeight(Math.max(minHeight, Math.min(newHeight, maxHeight)));
                                }}
                            />
                            :
                            <Text style={[styles.bio, globalStyles.grayText]}>{userData.bio}</Text>
                        }
                        <Text style={[globalStyles.title, {marginTop: 15}]}>Templates by {userData.username}</Text>
                        <View>
                            {/* Render List items here */}
                        </View>
                    </View>
                </ScrollView>
            </View>
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
        height: imageSize + 6,
        width: imageSize + 6,
        justifyContent: "center",
        alignSelf: "center",
        backgroundColor: "white",
        borderRadius: "100%",
        zIndex: 100
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
    }
})