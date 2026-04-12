import BottomTabBar from "@/components/BottomTabBar/bottom-tab-bar";
import { Tabs } from "expo-router";
import { CopilotProvider } from "react-native-copilot";

export default function Layout() {
  const tooltipStyle = {
    borderRadius: 10,
    paddingTop: 5,
  };

  return (
    <CopilotProvider tooltipStyle={tooltipStyle}>
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
