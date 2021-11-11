import { StyleSheet, Platform } from "react-native";
export default StyleSheet.create({
  adroidSafeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 35 : 0,
    backgroundColor: "#ffffff",
  },
});
