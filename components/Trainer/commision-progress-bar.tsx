import type { CommissionProgressItem } from "@/type/commission";
import React from "react";
import { Text, View } from "react-native";

type CommisionProgressBarProps = {
  items: CommissionProgressItem[];
};

function normalizeProgress(progressPercentage: number) {
  if (!Number.isFinite(progressPercentage)) return 0;
  if (progressPercentage <= 1) return Math.min(Math.max(progressPercentage, 0), 1);
  return Math.min(Math.max(progressPercentage / 100, 0), 1);
}

export function CommisionProgressBar({
  items,
}: CommisionProgressBarProps) {
  if (!items.length) return null;

  return (
    <View className="w-full my-3">
      {items.map((item) => {
        const clamped = normalizeProgress(item.progress_percentage);
        const percent = Math.round(clamped * 100);

        return (
          <View
            key={item.commission_code}
            className="mb-3 bg-white rounded-3xl border border-[#F1E6F4] p-4 overflow-hidden shadow-sm"
          >
            <View className="flex-row items-start justify-between gap-3">
              <View className="flex-1">
                <Text className="text-sm text-gray-500">Commission Progress</Text>
                <Text className="mt-1 text-base font-bold text-gray-800">
                  {item.product_name}
                </Text>
                <Text className="mt-0.5 text-xs text-gray-500">
                  {item.product_type_name}
                </Text>
              </View>

              <Text className="text-sm font-bold text-gray-800">{percent}%</Text>
            </View>

            <View
              className="mt-3 overflow-hidden"
              style={{
                width: "100%",
                height: 6,
                backgroundColor: "#E5E7EB",
                borderRadius: 9999,
              }}
            >
              <View
                style={{
                  height: "100%",
                  width: `${percent}%`,
                  backgroundColor: "#0891B2",
                  borderRadius: 9999,
                  minWidth: percent > 0 ? 8 : 0,
                }}
              />
            </View>

            <View className="mt-3 flex-row items-center">
              <View className="mr-2 h-3 w-3 rounded-full bg-[#0891B2]" />
              <Text className="flex-1 text-sm text-gray-700">
                {item.session_count} session{item.session_count === 1 ? "" : "s"}
                {" • "}
                {item.commission_code}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}
