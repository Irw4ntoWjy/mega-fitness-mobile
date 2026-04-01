import React from "react";
import { Pressable, Text, View } from "react-native";

type CommisionProgressBarProps = {};

export function CommisionProgressBar({}: CommisionProgressBarProps) {
  return (
    <View className="w-full my-3">
      <Pressable onPress={() => console.log("clicked")}>
        <View className="h-full flex-[1.6] bg-white rounded-3xl border border-[#F1E6F4] p-4 overflow-hidden shadow-sm">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-gray-500">Commision Progress</Text>
          </View>
          <View className="h-1.5 bg-gray-200 rounded-full overflow-hidden mt-1.5 flex-row">
            <View
              style={{
                // Percent / 100
                flex: 3.5,
                backgroundColor: "#0891B2",
              }}
            />

            <View
              style={{
                flex: 1 - 3.5,
                backgroundColor: "transparent",
              }}
            />
          </View>
          <Text className="ml-auto text-sm font-bold text-gray-800 mt-1">
            {35}%
          </Text>

          <View>
            <View className="flex-row items-center mb-2">
              <View className="rounded-full bg-[#0891B2] px-3 py-3 mr-2"></View>

              <Text className="text-gray-700 text-sm">
                Commision Progress Description
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
}
