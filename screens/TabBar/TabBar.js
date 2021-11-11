import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import SmartLocation from "../SmartLocation/SmartLocation";
import CustomIcon from "./CustomIcon";
import CameraRender from "../CameraRender/CameraRender";

const Tab = createBottomTabNavigator();

export default function TabBar() {
  return (
    <Tab.Navigator
      backBehavior="none"
      initialRouteName="CameraRender"
      tabBarOptions={{ style: { backgroundColor: "black", height: 150 } }}
    >
      <Tab.Screen
        name="CameraRender"
        component={CameraRender}
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ color }) => <CustomIcon objectsDetection />,
        }}
      />
      <Tab.Screen
        name="Smart Location"
        component={SmartLocation}
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ color }) => <CustomIcon smartLocation />,
        }}
      />
    </Tab.Navigator>
  );
}
