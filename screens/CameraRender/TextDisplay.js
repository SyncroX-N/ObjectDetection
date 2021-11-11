import React, { useState, useEffect, useRef } from "react";
import * as Speech from "expo-speech";

import { Text, View } from "react-native";
export default function TextDisplay(props) {
  const { store, styles } = props;
  const [word, setWord] = useState("");
  setInterval(() => {
    store.prediction(true);
    setWord(store.getWord);
    setTimeout(() => {
      store.prediction(false);
    }, 400);
  }, 1000);

  const prevWordRef = useRef();
  useEffect(() => {
    prevWordRef.current = word;
  });
  const prevWord = prevWordRef.current;

  //function to produce a vocal audio output
  const onSpeak = () => {
    if (word !== prevWord) {
      Speech.speak(word, { language: "en", pitch: 1, rate: 1 });
    }
  };
  return (
    <View style={styles.predictionContainer}>
      <Text style={styles.title}>
        {onSpeak()}
        {word}
      </Text>
    </View>
  );
}
