import HeaderNavBar from "@/components/HeaderNavBar/header-nav-bar";
import { BackgroundGlow } from "@components/Theme/background";
import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Journal = () => {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1">
      <BackgroundGlow />
      <HeaderNavBar backOnly title="Journal" />
    </View>
  );
};

export default Journal;
