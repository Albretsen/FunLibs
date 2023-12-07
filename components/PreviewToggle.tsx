import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import FileManager from '../scripts/file_manager';

interface PreviewContextType {
    showPreview: boolean;
    setShowPreview: (newState: boolean) => Promise<void>;
}

export const PreviewContext = createContext<PreviewContextType | undefined>(undefined);

export const PreviewProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [showPreview, setShowPreview] = useState<boolean>(true);

    const handleSetShowPreview = async (newState: boolean) => {
        setShowPreview(newState);
        await FileManager._storeData("previewToggle", newState.toString());
    };

    useEffect(() => {
        async function loadInitialState() {
            const storedPreview = await FileManager._retrieveData("previewToggle");
            if (storedPreview !== null) {
                setShowPreview(storedPreview === 'true');
            }
        }
        loadInitialState();
    }, []);

    return (
        <PreviewContext.Provider value={{ showPreview, setShowPreview: handleSetShowPreview }}>
            {children}
        </PreviewContext.Provider>
    );
};

interface PreviewToggleProps {
    onStateChange?: (state: boolean) => void;
}

export const PreviewToggle: React.FC<PreviewToggleProps> = ({ onStateChange }) => {
    const context = useContext(PreviewContext);
    if (!context) {
        throw new Error('PreviewToggle must be used within a PreviewProvider');
    }
    const { showPreview, setShowPreview } = context;

    const togglePreview = () => {
        const newPreview = !showPreview;
        setShowPreview(newPreview);
        if (onStateChange) {
            onStateChange(newPreview);
        }
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
};
