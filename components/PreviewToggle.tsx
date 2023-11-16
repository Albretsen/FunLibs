import React from "react"
import { View, Text, TouchableOpacity } from "react-native"
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function PreviewToggle() {
    return(
        <TouchableOpacity>
        <View style={{flexDirection: "row", gap: 6, padding: 6, alignItems: "center"}}>
            <Text style={{fontSize: 15, fontWeight: "600", color: "#6294C9", lineHeight: 20}}>Hide lib preview</Text>
            <MaterialCommunityIcons name="eye" size={16} color="#6294C9" />
        </View>
    </TouchableOpacity>
    )
}