import HeaderNavBar from "@/components/HeaderNavBar/header-nav-bar";
import { BackgroundGlow } from "@components/Theme/background";
import { router } from "expo-router";
import { ChevronRight, User } from "lucide-react-native";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function SettingsList() {
  const items = [
    {
      title: "Edit Account",
      icon: <User size={20} color="#1F2933" />,
      onPress: () => router.push("/profile/edit-account"),
    },
  ];

  return (
    <View className="flex-1">
      <BackgroundGlow showText={true} />
      <HeaderNavBar title="Settings" backOnly />

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
              <View className="flex-row items-center justify-between bg-white rounded-2xl border border-[#F1E6F4] px-4 py-4 shadow-sm">
                <View className="flex-row items-center">
                  <View className="w-9 h-9 rounded-full bg-[#FFF3E0] items-center justify-center mr-3">
                    {item.icon}
                  </View>
                  <Text className="text-gray-800 text-lg">{item.title}</Text>
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
