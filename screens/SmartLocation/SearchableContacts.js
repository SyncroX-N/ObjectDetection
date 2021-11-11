import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import {} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Contacts from "expo-contacts";

export default function SearchableContacts({ route }) {
  const [phoneNumber, setPhoneNumber] = useState();
  const [inMemoryContacts, setInMemoryContacts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const navigation = useNavigation();

  //Check permission to access contacts, and save the contacts list in the state variable

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Emails],
        });
        setContacts(data);
        setInMemoryContacts(data);
      }
    })();
  }, []);

  renderItem = ({ item }) => (
    <View style={styles.row}>
      <View style={styles.topRow}>
        <View style={styles.textContainer}>
          <Text style={{ color: "#009999", fontWeight: "bold", fontSize: 26 }}>
            {item.firstName + " "}
            {item.lastName}
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.selectButton}
            title="Send Location"
            onPress={() => {
              try {
                if (item.phoneNumbers[0].digits) {
                  setPhoneNumber(item.phoneNumbers[0].digits);
                }
                if (item.phoneNumbers[0].number) {
                  setPhoneNumber(item.phoneNumbers[0].number);
                }
              } catch (e) {
                if (e) {
                  Alert.alert("Phone Number cannot be empty");
                }
              }
            }}
          >
            <Text style={styles.buttonText}>Select</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.bottomRow}>
        <Text style={{ color: "black", fontWeight: "bold" }}>
          {item.phoneNumbers && item.phoneNumbers[0].number}
        </Text>
      </View>
    </View>
  );

  //Function to update contacts list when user search for a specific contact

  searchContacts = (value) => {
    const filteredContacts = inMemoryContacts.filter(
      (contact) =>
        contact.firstName?.toLowerCase().indexOf(value) > -1 ||
        contact.firstName?.indexOf(value) > -1
    );
    setContacts(filteredContacts);
  };

  if (phoneNumber != undefined) {
    navigation.navigate("SmartLocationPage", {
      post: phoneNumber,
    });
  }
  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        placeholder="Search"
        placeholderTextColor="black"
        style={styles.searchBar}
        onChangeText={(value) => searchContacts(value)}
      />

      <View>
        <FlatList
          data={contacts}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  topRow: {
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    width: "100%",
  },
  row: {
    minHeight: 70,
    padding: 5,
    width: "100%",
  },
  textContainer: {
    width: "80%",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
  },
  selectButton: {
    backgroundColor: "#009999",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    padding: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  searchBar: {
    height: 50,
    fontSize: 20,
    paddingHorizontal: 8,
    color: "black",
    borderBottomWidth: 1,
    borderBottomColor: "#7d90a0",
  },
});
