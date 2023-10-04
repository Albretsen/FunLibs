import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import globalStyles from "../styles/globalStyles";
import { useNavigation } from "@react-navigation/native";
import { ToastContext } from "../components/Toast";
import FirebaseManager from "../scripts/firebase_manager";
import IAP from "../components/IAP";

export default function FeedbackScreen() {
    const showToast = useContext(ToastContext);
    const navigation = useNavigation();

    return(
        <View style={[globalStyles.screenStandard]}>
            <IAP></IAP>
        </View>
    )
}
