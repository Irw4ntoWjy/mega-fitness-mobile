import { BackgroundGlow } from "@components/Theme/background";
import { router } from "expo-router";
import { ChevronLeft, ChevronRight, Trash2, User } from "lucide-react-native";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SettingsList() {
  const insets = useSafeAreaInsets();

  const items = [
    {
      title: "Edit Profile",
      icon: <User size={18} color="#1F2933" />,
      onPress: () => router.push("/profile/edit-profile"),
    },
    {
      title: "Delete Account",
      icon: <Trash2 size={18} color="#B91C1C" />,
      onPress: () => {},
    },
  ];

  return (
    <View className="flex-1">
      <BackgroundGlow showText={true} />
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          paddingTop: insets.top + 8,
          paddingRight: insets.right + 8,
          paddingLeft: insets.left + 8,
        }}
        className="px-4"
      >
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center"
        >
          <ChevronLeft size={22} color="#000" />
        </Pressable>

        <View className="flex-row items-center">
          <Text className="text-gray-900 text-lg font-semibold ml-2">
            Settings
          </Text>
        </View>
      </View>

      <View
        style={{
          flex: 1,
        }}
      >
        <ScrollView
          className="px-4 mt-4"
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 24,
          }}
        >
          {items.map((item, index) => (
            <Pressable key={index} className="mb-3" onPress={item.onPress}>
              <View className="flex-row items-center justify-between bg-white rounded-2xl border border-[#F1E6F4] px-4 py-3 shadow-sm">
                <View className="flex-row items-center">
                  <View className="w-9 h-9 rounded-full bg-[#FFF3E0] items-center justify-center mr-3">
                    {item.icon}
                  </View>
                  <Text className="text-gray-800 text-base">{item.title}</Text>
                </View>
                <ChevronRight size={18} color="#9CA3AF" />
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
