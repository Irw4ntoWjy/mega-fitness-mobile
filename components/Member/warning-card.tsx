import type { PurchaseReminder } from "@/type/purchase";
import React from "react";
import { Text, View } from "react-native";

type WarningCardProps = {
  reminders: PurchaseReminder[];
  loading?: boolean;
};

export function WarningCard({ reminders, loading = false }: WarningCardProps) {
  const warningItems = reminders
    .map((item) => {
      const timeRemaining =
        typeof item.time_remaining === "number" && item.time_remaining > 0
          ? item.time_remaining
          : null;
      const expiryRemaining =
        typeof item.expiry_remaining === "number" && item.expiry_remaining > 0
          ? item.expiry_remaining
          : null;

      const messages: string[] = [];

      if (timeRemaining !== null && expiryRemaining !== null) {
        if (timeRemaining <= 7) {
          messages.push(
            `Remaining time for the package to be activated is ${timeRemaining} days.`,
          );
        }

        if (expiryRemaining <= 7) {
          messages.push(
            `Remaining time for the package to be expired is ${expiryRemaining} days.`,
          );
        }
      } else if (timeRemaining !== null) {
        messages.push(
          `Remaining time for the package to be activated is ${timeRemaining} days.`,
        );
      } else if (expiryRemaining !== null) {
        messages.push(
          `Remaining time for the package to be expired is ${expiryRemaining} days.`,
        );
      }

      return {
        purchase_id: item.purchase_id,
        package_name: item.package_name.trim(),
        messages,
      };
    })
    .filter((item) => item.messages.length > 0);

  if (!loading && warningItems.length === 0) {
    return null;
  }

  return (
    <View className="w-full my-3">
      <View className="bg-yellow-50 rounded-3xl border border-yellow-200 p-4 overflow-hidden shadow-sm flex-col gap-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-xl font-bold text-yellow-900">Warning !!</Text>
        </View>

        <View className="gap-3">
          {loading ? (
            <Text className="font-medium text-base text-yellow-700">
              Loading warnings...
            </Text>
          ) : (
            warningItems.map((item) => (
              <View key={item.purchase_id} className="gap-1">
                <Text className="font-semibold text-base text-yellow-900">
                  {item.package_name}
                </Text>
                {item.messages.map((message) => (
                  <Text
                    key={`${item.purchase_id}-${message}`}
                    className="font-medium text-sm text-yellow-700"
                  >
                    {message}
                  </Text>
                ))}
              </View>
            ))
          )}
        </View>
      </View>
    </View>
  );
}
