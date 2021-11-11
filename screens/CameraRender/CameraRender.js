import React, { useState, useEffect } from "react";

//react native
import {
  Text,
  View,
  StyleSheet,
  Platform,
  Dimensions,
  SafeAreaView,
} from "react-native";

import TextDisplay from "./TextDisplay";

//Expo
import { Camera } from "expo-camera";

//Tensorflow
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import { cameraWithTensors } from "@tensorflow/tfjs-react-native";

//MobX
import { makeObservable, observable, action, computed } from "mobx";

//disable yellow warnings on EXPO client!
console.disableYellowBox = true;

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

// Class to update the global state
class WordPrediction {
  word = "";
  showPrediction = false;
  constructor() {
    makeObservable(this, {
      word: observable,
      toggle: action,
      getWord: computed,
      getShowPrediction: computed,
      prediction: action,
      showPrediction: observable,
    });
  }
  get getWord() {
    return this.word;
  }

  get getShowPrediction() {
    return this.showPrediction;
  }

  toggle(word) {
    this.word = word;
  }

  prediction(val) {
    this.showPrediction = val;
  }
}

export default function CameraRender() {
  //------------------------------------------------
  //state variables
  //------------------------------------------------
  const store = new WordPrediction();
  const [word, setWord] = useState("");
  const [predictionFound, setPredictionFound] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);

  //Tensorflow and Permissions
  const [mobileNet, setMobileNet] = useState(null);
  const [tensorFlowReady, setTensorFlowReady] = useState(false);

  //TF Camera Decorator
  const TensorCamera = cameraWithTensors(Camera);

  let requestAnimationFrameId = 0;

  const textureDims =
    Platform.OS === "ios"
      ? { width: 1080, height: 1920 }
      : { width: 1600, height: 1200 };
  const tensorDims = { width: 152, height: 200 };

  //-----------------------------
  // Check camera permissions and load MovileNet Model
  //-----------------------------
  useEffect(() => {
    if (!tensorFlowReady) {
      (async () => {
        //check permissions
        const { status } = await Camera.requestPermissionsAsync();
        console.log(`permissions status: ${status}`);
        setHasPermission(status === "granted");

        //wait TensorFlow API
        await tf.ready();

        //load MobileNet
        setMobileNet(await loadmobileNet());

        setTensorFlowReady(true);
      })();
    }
  }, [tensorFlowReady]);

  //--------------------------
  // To avoid leaks
  //--------------------------
  useEffect(() => {
    return () => {
      cancelAnimationFrame(requestAnimationFrameId);
    };
  }, [requestAnimationFrameId]);

  //-----------------------------------------------------------------
  // Loads MobileNet Model version 2, and alpha 1
  //

  const loadmobileNet = async () => {
    const model = await mobilenet.load({ version: 2, alpha: 1 });
    return model;
  };

  //----------------------------------------------------------------------------------------
  // Classify functions
  //----------------------------------------------------------------------------------------
  const classifyObject = async (tensor) => {
    if (!tensor && tensor != null && !store.getShowPrediction) return;

    //Get the first prediction
    const prediction = await mobileNet.classify(tensor, 1);

    if (!prediction || prediction.length === 0) {
      return;
    }
    //Store in the class only if probability is at least 60%
    if (prediction[0].probability > 0.6) {
      //store in the class
      store.toggle(prediction[0].className);
    }
  };

  //----------------------------------------------------------------------------------------
  // Recursive Asynchronous function to loop the cameraview and collect tensors
  //----------------------------------------------------------------------------------------
  const loopCameraPreview = (tensors) => {
    const loop = async () => {
      const nextTensor = await tensors.next().value;
      await classifyObject(nextTensor);
      requestAnimationFrameId = requestAnimationFrame(loop);
    };
    loop();
  };

  //--------------------------------------------------------------------------------
  //Camera Component
  //--------------------------------------------------------------------------------
  const cameraPreview = () => {
    return (
      <>
        <View style={styles.cameraView}>
          <TensorCamera
            style={styles.camera}
            type={Camera.Constants.Type.back}
            zoom={0}
            cameraTextureHeight={textureDims.height}
            cameraTextureWidth={textureDims.width}
            resizeHeight={tensorDims.height}
            resizeWidth={tensorDims.width}
            resizeDepth={3}
            onReady={loopCameraPreview}
            autorender={true}
          />
        </View>
        <View style={styles.bottomContainer}>
          <TextDisplay store={store} styles={styles} />
        </View>
      </>
    );
  };
  return tensorFlowReady ? (
    cameraPreview()
  ) : (
    <SafeAreaView styles={styles.loading}>
      <Text>Loading Model</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  predictionContainer: {
    backgroundColor: "rgba(52, 52, 52, 0.5)",
    width: "100%",
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  title: {
    margin: 10,
    fontSize: 45,
    fontWeight: "bold",
    textAlign: "center",
    color: "#ffffff",
  },
  loading: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraView: {
    display: "flex",
    flex: 1,
    width: "100%",
    height: "100%",
  },
  camera: {
    height: windowHeight,
    width: windowWidth,
    zIndex: 1,
    borderWidth: 0,
    borderRadius: 0,
  },
});
