import React from "react";
import "react-native-gesture-handler";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import TabBar from "./screens/TabBar/TabBar";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator headerMode="none">
        <Stack.Screen component={TabBar} name="App" />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
