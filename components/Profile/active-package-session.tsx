import React from "react";
import { Pressable, Text, View } from "react-native";

type ActivePackagesSessionsCardProps = {
  summary: {
    totalActive: number;
    completedSessions: number;
    totalSessions: number;
  };
  packages: {
    id: string;
    label: string;
    currentSessions: number;
    totalSessions: number;
  }[];
};

export function ActivePackagesSessionsCard({
  summary,
  packages,
}: ActivePackagesSessionsCardProps) {
  const { totalActive, completedSessions, totalSessions } = summary;

  const progress = totalSessions > 0 ? completedSessions / totalSessions : 0;
  const clamped = Math.min(Math.max(progress, 0), 1);

  const rawPercent =
    totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;
  const progressPercent = Math.round(rawPercent);
  const clampedPercent = Math.min(Math.max(progressPercent, 0), 100);

  return (
    <View className="w-full mb-5 mt-5">
      <View className="h-45 flex-row items-start">
        <View className="h-full flex-1 mr-4 bg-white rounded-3xl border border-[#F1E6F4] p-4 overflow-hidden shadow-sm">
          <Text className="text-gray-800 text-base text-center font-medium">
            Active Packages
          </Text>
          <View className="items-center">
            <View className="mt-6 items-center justify-center">
              <View className="w-18 h-18 rounded-full bg-[#0891B2] items-center justify-center shadow">
                <Text className="text-white text-3xl font-bold">
                  {totalActive}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="h-full flex-[1.6] bg-white rounded-3xl border border-[#F1E6F4] p-4 overflow-hidden shadow-sm">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-bold text-gray-800">
              {clampedPercent}%
            </Text>
            <Text className="text-sm text-gray-500">
              {completedSessions}/{totalSessions} Active Sessions Done
            </Text>
          </View>

          <View className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mt-1.5 flex-row">
            <View
              style={{
                flex: clamped,
                backgroundColor: "#0891B2",
              }}
            />

            <View
              style={{
                flex: 1 - clamped,
                backgroundColor: "transparent",
              }}
            />
          </View>

          <View className="mt-4">
            {packages.map((pkg) => (
              <View key={pkg.id} className="flex-row items-center mb-2">
                <View className="rounded-full bg-[#0891B2] px-2 py-0.5 mr-2">
                  <Text className="text-[#ffffff] text-xs font-semibold">
                    {pkg.currentSessions}/{pkg.totalSessions}
                  </Text>
                </View>

                <Text className="text-gray-700 text-sm">{pkg.label}</Text>
              </View>
            ))}
          </View>

          <Pressable className="mt-1 ml-auto rounded-full px-3 py-1.5 bg-[#E1B07C] shadow-sm">
            <Text className="text-white text-sm font-semibold">
              My Packages
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
