import React from "react";
import { View } from "react-native";
import { TextInput } from "react-native-paper";

export default function SignInScreen() {
    <TextInput
        label={email}
        value={null}
        onChangeText={() => console.log("Implement input field functionality!")}
        mode="outlined"
        theme={{
            colors: {
                primary: '#49454F', // For the outline/border color
            },
        }}
    />
}
