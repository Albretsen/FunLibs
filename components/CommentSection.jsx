import React, {useState} from "react";
import { View, Text, TouchableOpacity, Image, TextInput, ScrollView, StyleSheet, Dimensions } from "react-native";
import FirebaseManager from "../scripts/firebase_manager";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import globalStyles from "../styles/globalStyles";

export default function CommentSection(props) {
    const {comments, username, avatarID} = props;

    // Default, min, and max heights for the TextInput
    const defaultHeight = 20;
    const minHeight = 20;
    const maxHeight = 120;  // Adjust this value based on your design

    // State variable to store the height of the TextInput.
    const [inputHeight, setInputHeight] = useState(defaultHeight);

    return (
        <View>
            <View style={[styles.comment, {paddingBottom: 6}]}>
                <View style={styles.commentAvatar}>
                    <Image
                        style={styles.avatar}
                        source={FirebaseManager.avatars[avatarID]}
                    />
                </View>
                <View style={styles.commentCenter}>
                    <Text style={styles.username}>
                        {username}
                    </Text>
                    <TextInput
                        placeholder="New comment..."
                        placeholderTextColor={"gray"}
                        multiline
                        textAlignVertical="top"
                        style={{ height: inputHeight, color: "#505050" }}
                        onContentSizeChange={(e) => {
                            const newHeight = e.nativeEvent.contentSize.height;
                            setInputHeight(Math.max(minHeight, Math.min(newHeight, maxHeight)));
                            console.log(newHeight)
                        }}
                    />
                </View>
                <TouchableOpacity style={styles.commentAction}>
                    <MaterialIcons style={{ color: "#49454F" }} name="send" size={28} />
                </TouchableOpacity>
            </View>
            <ScrollView>
                {comments.map((comment, index) => (
                    <View key={index}>
                        <View style={styles.comment}>
                            <View style={styles.commentAvatar}>
                                <Image
                                    style={styles.avatar}
                                    source={FirebaseManager.avatars[comment.avatarID]}
                                />
                            </View>
                            <View style={styles.commentCenter}>
                                <Text style={styles.username}>
                                    {comment.author}
                                    {comment.isOP ? <Text> | Author</Text> : null}
                                </Text>
                                <Text style={styles.commentText}>
                                    {comment.content}
                                </Text>
                            </View>
                            <TouchableOpacity style={styles.commentAction}>
                                <Text style={globalStyles.touchableText}>Reply</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    )
}

const fullWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
    comment: {
        flexDirection: "row",
        borderBottomColor: "#dfdfdf",
        borderBottomWidth: 1,
        minHeight: 60,
        height: "auto",
        // alignItems: "center"
        paddingVertical: 25
    },

    commentAvatar: {
        width: 45,
        alignItems: "flex-start",
    },

    commentCenter: {
        width: (fullWidth * 0.8) - (45 + 16),
        paddingLeft: 16,
        color: "gray",
        gap: 5
    },

    commentAction: {
        width: "20%",
        height: 45,
        // alignSelf: "center",
        // alignItems: "center"
        justifyContent: "center"
    },

    avatar: {
        height: 45,
        width: 45,
        justifyContent: "center",
        marginTop: 2
    },

    username: {
        fontWeight: 500,
        color: "#505050"
    },

    content: {
        color: "#505050"
    },

    commentText: {
        lineHeight: 24
    }

})