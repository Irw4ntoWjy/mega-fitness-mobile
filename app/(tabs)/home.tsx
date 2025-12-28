import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Home() {
  const insets = useSafeAreaInsets();

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
