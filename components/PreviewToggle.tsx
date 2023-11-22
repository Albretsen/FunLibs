import React, { useState, useEffect } from "react"
import { View, Text, TouchableOpacity } from "react-native"
import { MaterialCommunityIcons } from '@expo/vector-icons';
import FileManager from "../scripts/file_manager";


export default function PreviewToggle() {
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        async function fetchData() {
            const storedPreview = await FileManager._retrieveData("previewToggle");
            setShowPreview(storedPreview === 'true');
        }
        fetchData();
    }, []);

    const togglePreview = async () => {
        let currentPreview = await FileManager._retrieveData("previewToggle");
        let newPreview = currentPreview !== 'true';
        await FileManager._storeData("previewToggle", newPreview.toString());
        setShowPreview(newPreview);
    }

    return (
        <TouchableOpacity onPress={togglePreview}>
            <View style={{ flexDirection: "row", gap: 6, padding: 6, alignItems: "center" }}>
                <Text style={{ fontSize: 15, fontWeight: "600", color: "#6294C9", lineHeight: 20 }}>
                    {showPreview ? "Hide lib preview" : "Show lib preview"}
                </Text>
                <MaterialCommunityIcons name="eye" size={16} color="#6294C9" />
            </View>
        </TouchableOpacity>
    );
}