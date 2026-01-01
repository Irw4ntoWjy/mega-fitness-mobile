import BottomTabBar from "@/components/BottomTabBar/bottom-tab-bar";
import { Tabs } from "expo-router";
import React from "react";

export default function Layout() {
  return (
    <Tabs
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="explore" />
      <Tabs.Screen name="classes" />
      <Tabs.Screen name="transaction" />
      <Tabs.Screen name="bookings" />
    </Tabs>
  );
}
