import * as React from 'react';
import { Audio } from 'expo-av';

export default function AudioPlayer() {
  const [sound, setSound] = React.useState();

  async function playAudio(soundName) {
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(sounds[soundName]);
      setSound(newSound);
      await newSound.playAsync();
    } catch (error) {
      console.log("Error playing sound:", error);
    }
  }

  React.useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync().catch(error => {
            console.log("Error unloading sound:", error);
          });
        }
      : undefined;
  }, [sound]);

  return { playAudio };
}

const sounds = {
    "pop": require("../assets/audio/pop.flac"),
}