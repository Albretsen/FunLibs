import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

function PlayScreen() {
  // Array of prompts for user
  const prompts = ['Prompt 1', 'Prompt 2', 'Prompt 3', 'Prompt 4'];

  // Keep track of current prompt index, user responses and current input
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [currentInput, setCurrentInput] = useState('');

  const handleSubmit = () => {
    // Add the current response to the responses array
    setResponses((prevResponses) => {
      const newResponses = [...prevResponses];
      newResponses[currentPromptIndex] = currentInput;
      return newResponses;
    });

    if (currentPromptIndex < prompts.length - 1) {
      // If there are more prompts, show the next one
      setCurrentPromptIndex(currentPromptIndex + 1);
    } else {
      // If there are no more prompts, show the finished state
      console.log('Finished, responses:', responses);
      // Here you could navigate to a different screen or update the UI in some other way
    }
    // Clear current input
    setCurrentInput('');
  };

  const handleBack = () => {
    if (currentPromptIndex > 0) {
      // If there are previous prompts, show the previous one
      setCurrentPromptIndex(currentPromptIndex - 1);
      // Set current input to previous response
      setCurrentInput(responses[currentPromptIndex - 1]);
    }
  };

  return (
    <View>
      <Text>{prompts[currentPromptIndex]}</Text>
      <TextInput
        value={currentInput}
        onChangeText={setCurrentInput}
      />
      <Button title="Back" onPress={handleBack} />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
}

export default PlayScreen;