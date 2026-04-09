import React from "react";
import { Pressable, Text, View } from "react-native";

type WarningCardProps = {};

export function WarningCard({}: WarningCardProps) {
  return (
    <View className="w-full my-3">
      <Pressable onPress={() => console.log("clicked")}>
        <View className="bg-yellow-50 rounded-3xl border border-yellow-200 p-4 overflow-hidden shadow-sm flex-col gap-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-xl font-bold text-yellow-900">
              Warning !!
            </Text>
          </View>

          <View>
            <Text className="font-medium text-lg text-yellow-700">
              Product ... akan otomatis diaktifkan mohon untuk segera melakukan
              Check In Pertama
            </Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
}
