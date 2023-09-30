import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import globalStyles from "../styles/globalStyles";
export default function FeedbackScreen() {
    return(
        <View style={[globalStyles.screenStandard]}>
            <View style={[globalStyles.bigWhitespace, {marginTop: 40}]}>
                <Text style={{fontSize: 26, fontWeight: 600, marginBottom: 30}}>Feedback</Text>
                <View style={globalStyles.form}>
                    <TextInput
                        placeholder="Provide your feedback here..."
                        placeholderTextColor={"gray"}
                        multiline
                        textAlignVertical="top"
                        style={{ height: 300, color: "#505050", width: "100%" }}
                    />
                    <TouchableOpacity style={[globalStyles.bigWhitespace, globalStyles.formButton]} onPress={null}>
                        <Text style={globalStyles.formButtonLabel}>Send feedback</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}