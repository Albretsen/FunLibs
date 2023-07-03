import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import * as Progress from 'react-native-progress';
import data from '/libs.json';
import miscStyles from './miscStyles';
import textStyles from './textStyles';

function PlayScreen({ route }) {
  // The id passed from ListItem component is received here
  const libId = route.params.libId;
  // Find the right lib from data
  const currentLib = data.find(lib => lib.id === libId);

  // Extract prompts from the current lib
  const prompts = currentLib ? currentLib.suggestions : [];

  // Keep track of current prompt index, user responses and current input
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [currentInput, setCurrentInput] = useState('');

  // Calculate progress
  const progress = (currentPromptIndex + 1) / prompts.length;

  const handleNext = () => {
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
    <View style={[miscStyles.screenStandard]}>
      <View style={[styles.promptContainer, miscStyles.containerWhitespace]}>
        <Text style={[textStyles.fontMedium, styles.leftPadding]}>{prompts[currentPromptIndex]}</Text>
        <TextInput
          style={[styles.input, textStyles.fontMedium]}
          value={currentInput}
          onChangeText={setCurrentInput}
          placeholder={`Write your word here...`}
        />
        <Text style={[styles.leftPadding, textStyles.fontSmall, styles.explanation]}>Explanation of word here.</Text>
        <Progress.Bar
          progress={progress}
          width={null}
          color='#006D40'
          unfilledColor='#D1E8D5'
          borderWidth={0}
          borderRadius={0}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleBack}>
            <Text style={[styles.buttonText, textStyles.bold, textStyles.fontMedium]}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.buttonNext]} onPress={handleNext}>
            <Text style={[textStyles.bold, textStyles.fontMedium]}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default PlayScreen;

const styles = StyleSheet.create({
  promptContainer: {
    borderRadius: 10,
    borderColor: "gray",
    borderWidth: 1,
    padding: 20,
    rowGap: 10,
  },

  input: {
    height: 60,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 6,
    padding: 10,
    paddingLeft: 16
  },

  leftPadding: {
    paddingLeft: 16
  },

  explanation: {
    marginTop: -6
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 10
  },

  button: {
    borderRadius: 40,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    minWidth: 85,
    alignItems: "center",
    justifyContent: "center"
  },

  buttonNext: {
    backgroundColor: "#D1E8D5",
    borderColor: "#D1E8D5",
  }
})