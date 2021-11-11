import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import SmartLocationPage from "./SmartLocationPage";
import SearchableContacts from "./SearchableContacts";

const Stack = createStackNavigator();

export default function SmartLocation() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        component={SmartLocationPage}
        name="SmartLocationPage"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        component={SearchableContacts}
        name="SearchableContacts"
        options={{
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
}
