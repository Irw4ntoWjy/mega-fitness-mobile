import BottomTabBar from "@/components/BottomTabBar/bottom-tab-bar";
import { Tabs } from "expo-router";
import { CopilotProvider } from "react-native-copilot";

export default function Layout() {
  return (
    <CopilotProvider>
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
        <Tabs.Screen name="index" />
        <Tabs.Screen name="history" />
        <Tabs.Screen name="classes" />
        <Tabs.Screen name="transaction" />
        <Tabs.Screen name="bookings" />
      </Tabs>
    </CopilotProvider>
  );
}
