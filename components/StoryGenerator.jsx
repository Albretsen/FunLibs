import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import axios from 'axios';

const StoryGenerator = () => {
    const [prompt, setPrompt] = useState('');
    const [story, setStory] = useState('');

    const generateStory = async () => {
        try {
            const response = await axios.post('https://us-central1-fun-libs.cloudfunctions.net/generateStory', { prompt });
            setStory(response.data.story);
        } catch (error) {
            console.error('Error generating story:', error);
        }
    }

    return (
        <View style={styles.container}>
            <TextInput 
                value={prompt}
                onChangeText={setPrompt}
                placeholder="Enter story prompt"
                style={styles.input}
            />
            <Button title="Generate Story" onPress={generateStory} />
            <Text style={styles.storyText}>{story}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        justifyContent: 'center',
    },
    input: {
        borderColor: 'gray',
        borderWidth: 1,
        padding: 10,
        marginBottom: 20,
    },
    storyText: {
        marginTop: 20,
        fontSize: 16,
    }
});

export default StoryGenerator;