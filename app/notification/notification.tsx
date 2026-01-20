import React from "react";
import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { notificationDummyData } from "./dummy-data";

type Notification = {
  id: string;
  title: string;
  description?: string;
  time: string;
  read?: boolean;
};

export default function NotificationPage() {
  const notifications = notificationDummyData;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="border-b border-gray-200 px-4 py-4">
        <Text className="text-lg font-semibold text-gray-900">
          Notifications
        </Text>
      </View>

      {/* Content */}
      {notifications.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">No notifications</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 12 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              className={`mb-3 rounded-2xl px-4 py-3 shadow-sm ${
                item.read ? "bg-white" : "bg-sky-50"
              }`}
              onPress={() => {
                // later: mark as read or navigate to detail
              }}
            >
              <Text className="font-medium text-gray-900">{item.title}</Text>

              {item.description && (
                <Text className="mt-1 text-sm text-gray-600">
                  {item.description}
                </Text>
              )}

              <Text className="mt-1 text-xs text-gray-400">{item.time}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}
