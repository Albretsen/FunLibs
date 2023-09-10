import * as React from 'react';
import { Audio } from 'expo-av';
import { Asset } from 'expo-asset';

export default function AudioPlayer() {
  const [sound, setSound] = React.useState();

  async function playAudio(soundName) {
    try {
      const asset = Asset.fromModule(sounds[soundName]);
      await asset.downloadAsync();
      const { sound: newSound } = await Audio.Sound.createAsync(asset);
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
    "pop": Asset.fromModule(require("../assets/audio/pop.mp3")),
}