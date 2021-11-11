import React from "react";
import { Text, View, StyleSheet, Image } from "react-native";

export default function CustomIcon(props) {
  return (
    <View style={styles.container}>
      <View style={styles.roundShape}>
        <View style={styles.iconContainer}>
          {props.objectsDetection && (
            <Image
              style={styles.icon}
              source={require("./../../assets/objects.png")}
            />
          )}
          {props.coloursDetection && (
            <Image
              style={styles.icon}
              source={require("./../../assets/colours.png")}
            />
          )}
          {props.smartLocation && (
            <Image
              style={styles.icon}
              source={require("./../../assets/location.png")}
            />
          )}
        </View>
      </View>
      {props.objectsDetection && (
        <Text style={styles.titleText}>Objects Detection</Text>
      )}
      {props.coloursDetection && (
        <Text style={styles.titleText}>Colours Detection</Text>
      )}
      {props.smartLocation && (
        <Text style={styles.titleText}>Smart Location</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  roundShape: {
    borderRadius: 70 / 2,
    width: 70,
    height: 70,
    backgroundColor: "#ffffff",
    borderColor: "#19FCC5",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
  },
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  titleText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
  },
  icon: {
    width: 50,
    height: 50,
  },
  iconContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
  },
});
