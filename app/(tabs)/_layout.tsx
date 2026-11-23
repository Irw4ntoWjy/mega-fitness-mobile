import BottomTabBar from "@/components/BottomTabBar/bottom-tab-bar";
import { Tabs } from "expo-router";
import { CopilotProvider } from "react-native-copilot";

export default function Layout() {
  const tooltipStyle = {
    borderRadius: 10,
    paddingTop: 5,
  };

  return (
    <CopilotProvider
      tooltipStyle={tooltipStyle}
      // Expo SDK 54 is edge-to-edge on Android: the window already starts at the
      // top of the screen, so copilot must NOT subtract the status bar height
      // (its default), otherwise every highlight shifts up by that height.
      androidStatusBarVisible
    >
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
