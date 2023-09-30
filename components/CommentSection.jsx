import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, Image, TextInput, ScrollView, StyleSheet, Dimensions } from "react-native";
import FirebaseManager from "../scripts/firebase_manager";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { ToastContext } from "../components/Toast";
import globalStyles from "../styles/globalStyles";
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';

export default function CommentSection(props) {
    const { comments, username, avatarID, onCommentChange, onSubmitComment } = props;

    // Default, min, and max heights for the TextInput
    const defaultHeight = 30;
    const minHeight = 30;
    const maxHeight = 120; // Adjust this value based on your design

    // State variable to store the height of the TextInput.
    const [inputHeight, setInputHeight] = useState(defaultHeight);

    const [textValue, setTextValue] = useState("");
    const [replyTextValue, setReplyTextValue] = useState("");

    const [atUser, setAtUser] = useState("");

    const [commentList, setCommentList] = useState(comments);

    const [replyingToCommentIndex, setReplyingToCommentIndex] = useState(null);

    const [shownPopupIndex, setShownPopupIndex] = useState(null);
    const [shownPopupType, setShownPopupType] = useState("");

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const showToast = useContext(ToastContext);

    const handleSubmitComment = (content, replyingToCommentIndex) => {
        if (!FirebaseManager.currentUserData?.firestoreData?.username) {
            showToast("Please sign in to comment.");
            return;
        }
        let comment = {
            username: FirebaseManager.currentUserData.firestoreData.username,
            uid: FirebaseManager.currentUserData.auth.uid,
            avatarID: FirebaseManager.currentUserData.firestoreData.avatarID,
            date: new Date(),
            content: content,
            replies: []
        };

        if (atUser?.uid) comment.atuid = atUser.uid;

        // Update the commentList state
        if (replyingToCommentIndex == null) {
            setCommentList(prevComments => [...prevComments, comment]);
            onSubmitComment(comment, replyingToCommentIndex);
            setTextValue("");
            setReplyingToCommentIndex(null);
        } else {
            setReplyingToCommentIndex(null);
            setReplyTextValue("");
            setCommentList(prevComments => {
                const updatedComments = prevComments.map((commentItem, index) =>
                    index === replyingToCommentIndex
                        ? { ...commentItem, replies: [...commentItem.replies, comment] }
                        : commentItem // If you don't want this line, you can remove it
                );
                onSubmitComment(updatedComments, replyingToCommentIndex);
                return updatedComments; // Return the updated comments to update the state
            });
        }
    };

    /**
     * handleDeleteComment
     * 
     * Deletes a comment or a reply from the commentList locally. After deletion, it updates the component state
     * and calls the onSubmitComment prop function to reflect the deletion.
     * 
     * @function
     * @param {number} commentIndex - The index of the comment in the commentList.
     * @param {number} [replyIndex=null] - The index of the reply in the comment's replies array. If null, it indicates a main comment is being deleted.
     */
    const handleDeleteComment = (commentIndex, replyIndex = null) => {
        setCommentList(prevComments => {
            const updatedComments = [...prevComments];

            // If it's a reply that we're deleting
            if (replyIndex !== null) {
                updatedComments[commentIndex].replies.splice(replyIndex, 1);
            } else {
                // If it's a main comment that we're deleting
                updatedComments.splice(commentIndex, 1);
            }

            onSubmitComment(updatedComments, 1);
            return updatedComments;
        });
    };

    return (
        <View>
            <View style={[styles.comment, { paddingBottom: 6 }]}>
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
                        onChangeText={(text) => {
                            setTextValue(text);
                        }}
                        value={textValue}
                        onContentSizeChange={(e) => {
                            const newHeight = e.nativeEvent.contentSize.height;
                            setInputHeight(Math.max(minHeight, Math.min(newHeight, maxHeight)));
                            console.log(newHeight)
                        }}
                    />
                </View>
                <TouchableOpacity style={styles.commentActions} onPress={() => handleSubmitComment(textValue)}>
                    <MaterialIcons style={{ color: "#49454F" }} name="send" size={28} />
                </TouchableOpacity>
            </View>
            <ScrollView>
                {commentList.map((comment, index) => (
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
                                    {comment.username}
                                    {comment.isOP ? <Text style={{ color: "#419764" }}> | Author</Text> : null}
                                </Text>
                                <Text style={styles.commentText}>
                                    {comment.content}
                                </Text>
                            </View>
                            <TouchableOpacity style={styles.commentActions}>
                                <TouchableOpacity style={styles.commentAction} onPress={() => handleDeleteComment(index)}>
                                    <MaterialIcons style={{ color: "#49454F" }} name="more-vert" size={16} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.commentAction} onPress={() => {
                                    setReplyingToCommentIndex(index);
                                    setReplyTextValue("");
                                    setAtUser({});
                                }}>
                                    <MaterialIcons style={{ color: "#49454F" }} name="reply" size={28} />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        </View>

                        {replyingToCommentIndex === index && (
                            <View style={[styles.comment, styles.reply, { paddingBottom: 6 }]}>
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
                                        placeholder="New reply..."
                                        placeholderTextColor={"gray"}
                                        multiline
                                        textAlignVertical="top"
                                        style={{ height: inputHeight, color: "#505050" }}
                                        onChangeText={(text) => {
                                            if (atUser?.username) {
                                                if (!text.startsWith("@" + atUser?.username)) {
                                                    // Reset to the original prefix if user tries to backspace away @username
                                                    setReplyTextValue("@" + atUser?.username + " ");
                                                } else {
                                                    setReplyTextValue(text);
                                                }
                                            } else {
                                                setReplyTextValue(text);
                                            }
                                        }}
                                        value={replyTextValue}
                                        onContentSizeChange={(e) => {
                                            const newHeight = e.nativeEvent.contentSize.height;
                                            setInputHeight(Math.max(minHeight, Math.min(newHeight, maxHeight)));
                                        }}
                                    />
                                </View>
                                <TouchableOpacity style={styles.commentActions} onPress={() => handleSubmitComment(replyTextValue, replyingToCommentIndex)}>
                                    <MaterialIcons style={{ color: "#49454F" }} name="send" size={28} />
                                </TouchableOpacity>
                            </View>)}
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
                                        {reply.username}
                                        {reply.isOP ? <Text style={{ color: "#419764" }}> | Author</Text> : null}
                                    </Text>
                                    <Text style={styles.commentText}>
                                        {reply.content}
                                    </Text>
                                </View>
                                <TouchableOpacity style={styles.commentActions}>
                                    <TouchableOpacity style={styles.commentAction} onPress={() => handleDeleteComment(index, replyIndex)}>
                                        <MaterialIcons style={{ color: "#49454F" }} name="more-vert" size={16} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.commentAction} onPress={() => {
                                        setReplyingToCommentIndex(index);
                                        setReplyTextValue("@" + reply.username + " ");
                                        setAtUser({
                                            username: reply.username,
                                            uid: reply.uid,
                                        });
                                    }}>
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
    popupMenu: {
        position: "absolute",
        right: 0,
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "#dfdfdf",
        padding: 10,
        zIndex: 1,
        elevation: 1,
    },

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