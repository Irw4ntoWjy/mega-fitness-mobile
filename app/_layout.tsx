import { ToastProvider } from "@/components/Toast/toast-provider";
import "@/global.css";
import { useAuth } from "@/hooks/useAuth";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Afacad-Bold": require("../assets/fonts/Afacad/Afacad-Bold.ttf"),
  });
  const { auth, loading: loadingAuth } = useAuth();

  if (!fontsLoaded || loadingAuth) return null;

  const isLoggedIn = !!auth;

  return (
    <SafeAreaProvider>
      <ToastProvider>
        <Stack>
          <Stack.Protected guard={!isLoggedIn}>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          </Stack.Protected>
          <Stack.Protected guard={isLoggedIn}>
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
            <Stack.Screen
              name="profile/profile"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="profile/edit-profile"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="journal/journal"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="assessment/detail"
              options={{ headerShown: false }}
            />
          </Stack.Protected>
        </Stack>
      </ToastProvider>
    </SafeAreaProvider>
  );
}
