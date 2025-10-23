import BottomTabBar from "@/components/BottomTabBar/bottom-tab-bar";
import { Tabs } from "expo-router";

export default function Layout() {
  return (
    <Tabs
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "transparent",
        },
        tabBarBackground: () => null,
      }}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="index" />
      <Tabs.Screen name="explore" />
    </Tabs>
  );
}
