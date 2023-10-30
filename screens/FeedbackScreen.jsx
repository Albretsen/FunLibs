import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import globalStyles from "../styles/globalStyles";
import { useNavigation } from "@react-navigation/native";
import { ToastContext } from "../components/Toast";
import FirebaseManager from "../scripts/firebase_manager";
import i18n from "../scripts/i18n";

export default function FeedbackScreen() {
    const showToast = useContext(ToastContext);
    const navigation = useNavigation();
    
    const [feedbackText, setFeedbackText] = useState(''); // Create a state variable for feedbackText

    return(
        <View style={[globalStyles.screenStandard]}>
            <View style={[globalStyles.bigWhitespace, {marginTop: 40}]}>
                <Text style={{fontSize: 26, fontWeight: 600, marginBottom: 30}}>{i18n.t('feedback')}</Text>
                <View style={globalStyles.form}>
                    <TextInput
                        placeholder={i18n.t('provide_your_feedback_here')}
                        placeholderTextColor={"gray"}
                        multiline
                        textAlignVertical="top"
                        style={{ height: 150, color: "#505050", width: "100%" }}
                        value={feedbackText} // Set the value prop to feedbackText
                        onChangeText={text => setFeedbackText(text)} // Update feedbackText state when the value of the TextInput changes
                    />
                    <TouchableOpacity style={[globalStyles.bigWhitespace, globalStyles.formButton]} onPress={() => {
                        showToast({text: i18n.t('thank_you_for_your_feedback'), noBottomMargin: true});
                        navigation.navigate("Browse");
                        try {
                            let feedback = {
                                feedback: feedbackText,
                                date: new Date(),
                                username: "User was not signed in"
                            }
                            if (FirebaseManager.currentUserData?.firestoreData?.username) feedback.username = FirebaseManager.currentUserData.firestoreData.username;
                            if (FirebaseManager.currentUserData?.firestoreData?.uid) feedback.username = FirebaseManager.currentUserData.firestoreData.uid; // This line seems to have a mistake. It should probably be: feedback.uid = FirebaseManager.currentUserData.firestoreData.uid;
                            FirebaseManager.AddDocumentToCollection("feedback", feedback)
                        } catch {

                        }
                    }}>
                        <Text style={globalStyles.formButtonLabel}>{i18n.t('send_feedback')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}
