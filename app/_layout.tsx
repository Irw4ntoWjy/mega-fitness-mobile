import "@/global.css";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Afacad-Bold": require("../assets/fonts/Afacad/Afacad-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <Stack initialRouteName="(auth)">
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="notification/notification"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="packages/list-package"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="packages/[id]/detail"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="classes/[id]/detail"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="classes/[id]/barcode"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="transactions/[id]/detail"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="profile/profile" options={{ headerShown: false }} />
        <Stack.Screen
          name="profile/settings-list"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="profile/edit-profile"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="profile/edit-account"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="history/history" options={{ headerShown: false }} />
        <Stack.Screen name="journal/journal" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaProvider>
  );
}
