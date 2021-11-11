import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Button,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import {} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SMS from "expo-sms";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";

export default function SmartLocationPage({ route }) {
  //state variables
  const [value, onChangeValue] = React.useState(undefined);
  const [actualValue, setActualValue] = React.useState();
  const [location, setLocation] = useState({
    accuracy: 65,
    altitude: 191.6548080444336,
    altitudeAccuracy: 10,
    heading: -1,
    latitude: 36.824697644378375,
    longitude: 14.937180180095275,
    speed: -1,
  });
  const [errorMsg, setErrorMsg] = useState(null);
  const [contact, setContact] = useState("");
  const navigation = useNavigation();

  //update emergency contact
  React.useEffect(() => {
    if (route.params?.post) {
      onChangeValue(route.params.post);
      _storeData("emergencyContact", value);
    }
  }, [route.params?.post]);

  //Store new emergency contact
  _storeData = async () => {
    try {
      await AsyncStorage.setItem("emergencyContact", value);
    } catch (error) {
      console.log("error");
    }
  };
  //Retrieve saved emergency contact
  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem("emergencyContact");
      if (value !== null) {
        setActualValue(value);
      }
    } catch (error) {}
  };
  useEffect(() => {
    _retrieveData();
  }, []);

  //-----------------------------
  // Check Permissions and save the current location in the state variable
  //-----------------------------

  useEffect(() => {
    (async () => {
      if (Platform.OS === "android" && !Constants.isDevice) {
        setErrorMsg(
          "Oops, this will not work on Snack in an Android emulator. Try it on your device!"
        );

        return;
      }
      let { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});

      setLocation(location);
    })();
  }, []);

  //-----------------------------
  // Function to send the current location
  //-----------------------------
  const sendSMS = () => SMS.sendSMSAsync(actualValue, JSON.stringify(location));
  console.log(location);
  return (
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
      style={styles.container}
    >
      <View>
        <SafeAreaView style={styles.container}>
          <View style={styles.inputContainer}>
            <Text style={styles.titleText}>Smart Location</Text>
            <Text>
              Smart Location functionality will automatically send the current
              position to the emergency contact.
            </Text>
            <Text style={styles.titleText}>Emergency Contact Number</Text>
            <TextInput
              style={styles.textInput}
              keyboardType="numeric"
              onChangeText={(text) => onChangeValue(text)}
              value={value}
              defaultValue={actualValue}
            />
            <TouchableOpacity
              onPress={() => navigation.navigate("SearchableContacts")}
            >
              <Text style={styles.plainButton}>Search from Contacts</Text>
            </TouchableOpacity>
            {value !== undefined && (
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => {
                  _storeData("emergencyContact", value);
                  _retrieveData();
                  Keyboard.dismiss();
                  onChangeValue(undefined);
                }}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.sendLocation}
              title="Send Location"
              onPress={() => {
                sendSMS();
              }}
            >
              <Text style={styles.buttonText}>Send Location</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "#ffffff",
    paddingTop: 25,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  contactsList: {
    height: "100%",
    width: "100%",
  },
  textInput: {
    height: 45,
    borderRadius: 8,
    borderColor: "gray",
    borderWidth: 0.5,
    padding: 4,
    fontSize: 16,
  },
  inputContainer: {
    margin: 16,
  },
  saveButton: {
    backgroundColor: "#ff9933",
    alignItems: "center",
    padding: 15,
    marginVertical: 15,
    borderRadius: 8,
  },
  plainButton: {
    color: "#009999",
    fontSize: 20,
    paddingVertical: 16,
  },
  sendLocation: {
    backgroundColor: "#009999",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 15,
    marginVertical: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
