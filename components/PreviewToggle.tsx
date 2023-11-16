import React, {useState} from "react"
import { View, Text, TouchableOpacity } from "react-native"
import { MaterialCommunityIcons } from '@expo/vector-icons';
import FileManager from "../scripts/file_manager";

export default function PreviewToggle() {
    const [showPreview, setShowPreview] = useState("test");
    return(
        <TouchableOpacity onPress={async () => {
            let previewToggle: string | boolean | null | undefined = await FileManager._retrieveData("previewToggle");
            console.log("1" + previewToggle);
            previewToggle = !previewToggle;
            console.log("2"  + previewToggle);
            console.log("3"  + !previewToggle);
            if(previewToggle) {
                setShowPreview(`${previewToggle}`);
            }
            FileManager._storeData("previewToggle", previewToggle);
        }}>
        <View style={{flexDirection: "row", gap: 6, padding: 6, alignItems: "center"}}>
            <Text style={{fontSize: 15, fontWeight: "600", color: "#6294C9", lineHeight: 20}}>{showPreview ? "Hide lib preview" : "Show lib preview"}</Text>
            <MaterialCommunityIcons name="eye" size={16} color="#6294C9" />
        </View>
    </TouchableOpacity>
    )
}