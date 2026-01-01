import { getSession } from "@/lib/session";
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
    const checkSession = async () => {
      const admin = await getSession("admin");
      if (!admin) {
        router.replace("/(auth)/sign-in");
      } else {
        setLoading(false);
      }
    };

    checkSession();
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
