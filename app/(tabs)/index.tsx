import { checkSession } from "@/lib/auth-session";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Home() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const guard = async () => {
      const authenticated = await checkSession();

      if (!authenticated) {
        router.replace("/(auth)/sign-in");
        return;
      }

      setLoading(false);
    };

    guard();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ paddingTop: insets.top }}>
      <Pressable
        onPress={() => router.push("/profile/profile")}
        style={{
          position: "absolute",
          top: insets.top + 8,
          left: 12,
          padding: 4,
          zIndex: 10,
        }}
      >
        <Ionicons name="person-circle-outline" size={28} />
      </Pressable>

      <View>
        <Text>Home</Text>
      </View>
    </View>
  );
}
