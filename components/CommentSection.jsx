import React, {useState} from "react";
import { View, Text, TouchableOpacity, Image, TextInput, ScrollView, StyleSheet, Dimensions } from "react-native";
import FirebaseManager from "../scripts/firebase_manager";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import globalStyles from "../styles/globalStyles";

export default function CommentSection(props) {
    const {comments, username, avatarID} = props;

    // Default, min, and max heights for the TextInput
    const defaultHeight = 30;
    const minHeight = 30;
    const maxHeight = 120; // Adjust this value based on your design

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
                <TouchableOpacity style={styles.commentActions}>
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
                                    {comment.isOP ? <Text style={{color: "#419764"}}> | Author</Text> : null}
                                </Text>
                                <Text style={styles.commentText}>
                                    {comment.content}
                                </Text>
                            </View>
                            <TouchableOpacity style={styles.commentActions}>
                                <TouchableOpacity style={styles.commentAction}>
                                    <MaterialIcons style={{ color: "#49454F" }} name="more-vert" size={16} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.commentAction}>
                                    <MaterialIcons style={{ color: "#49454F" }} name="reply" size={28} />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        </View>
                        {comment.replies && comment.replies.map((reply, replyIndex) => (
                            <View key={replyIndex} style={[styles.comment, styles.reply]}>
                                <View style={styles.commentAvatar}>
                                    <Image
                                        style={styles.avatar}
                                        source={FirebaseManager.avatars[reply.avatarID]}
                                    />
                                </View>
                                <View style={[styles.commentCenter, styles.replyCenter]}>
                                    <Text style={styles.username}>
                                        {reply.author}
                                        {reply.isOP ? <Text style={{color: "#419764"}}> | Author</Text> : null}
                                    </Text>
                                    <Text style={styles.commentText}>
                                        {reply.content}
                                    </Text>
                                </View>
                                <TouchableOpacity style={styles.commentActions}>
                                    <TouchableOpacity style={styles.commentAction}>
                                        <MaterialIcons style={{ color: "#49454F" }} name="more-vert" size={16} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.commentAction}>
                                        <MaterialIcons style={{ color: "#49454F" }} name="reply" size={28} />
                                    </TouchableOpacity>
                                </TouchableOpacity>
                            </View>
                        ))}
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

    reply: {
        paddingLeft: 25
    },

    commentAvatar: {
        width: 45,
        alignItems: "flex-start",
    },

    commentCenter: {
        width: (fullWidth * 0.8) - (45 + 16 + 6),
        paddingLeft: 16,
        paddingRight: 6,
        gap: 5
    },

    replyCenter: {
        width: (fullWidth * 0.8) - (45 + 16 + 6 + 25),
    },

    commentActions: {
        width: "20%",
        // height: 45,
        // alignItems: "center"
        justifyContent: "flex-start",
        gap: 7
    },

    commentAction: {
        // Make touchable opacity bigger, for ease of clicking
        height: 24,
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