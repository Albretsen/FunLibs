import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function StyledInput() {
  const [text, setText] = useState('');

  const parseText = (text) => {
    return text.split(/(".*?")/).map((segment, index) => {
      if (/^".*"$/.test(segment)) {
        return (
          <Text key={index} style={styles.styledText}>
            {segment}
          </Text>
        );
      }
      return segment;
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.textInputContainer}>
        <Text style={styles.baseText}>{parseText(text)}</Text>
        <TextInput
          style={[styles.input, styles.overlayInput]}
          onChangeText={setText}
          value={text}
          multiline
          underlineColorAndroid="transparent"
          placeholder="Type here..."
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    height: 100
  },
  textInputContainer: {
    position: 'relative',
    borderColor: 'gray',
    borderWidth: 1,
    height: 100
  },
  baseText: {
    padding: 10,
    height: 100
  },
  input: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    padding: 10,
    color: 'transparent',
    zIndex: 1,
    backgroundColor: 'transparent',
    height: 100
  },
  overlayInput: {
    color: 'transparent',
  },
  styledText: {
    color: 'green',
    fontStyle: 'italic',
  },
});