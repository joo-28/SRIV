//Completed NO Changes Required - Test Completed - Logs and Blank space Removed

import React from "react";
import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import Colors from "../../Services/Colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.DarkBlue,
        headerShown: false,
        tabBarStyle: {
          keyboardHidesTabBar: true,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Customer"
        options={{
          title: "Customer",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Menu"
        options={{
          title: "Menu",
          tabBarIcon: ({ color }) => (
            <SimpleLineIcons name="menu" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
