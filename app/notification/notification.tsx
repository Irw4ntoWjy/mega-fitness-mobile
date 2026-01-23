import { BackgroundGlow } from "@/components/Theme/background";
import { router } from "expo-router";
import { ChevronLeft, User } from "lucide-react-native";
import React, { useState } from "react";
import {
  FlatList,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { notificationDummyData } from "./dummy-data";

type Notification = {
  id: string;
  title: string;
  description?: string;
  time: string;
  read?: boolean;
};

export default function NotificationPage() {
  const insets = useSafeAreaInsets();

  const [notifications, setNotifications] = useState<Notification[]>(
    notificationDummyData,
  );

  const [isEdit, setIsEdit] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const deleteSelected = () => {
    setNotifications((prev) => prev.filter((n) => !selectedIds.includes(n.id)));

    setSelectedIds([]);
    setIsEdit(false);
  };

  const renderItem = ({ item }: { item: Notification }) => {
    const selected = selectedIds.includes(item.id);

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          if (isEdit) toggleSelect(item.id);
        }}
        className={`flex-row items-start gap-3 px-4 py-4 ${
          item.read ? "bg-white" : "bg-sky-50"
        }`}
      >
        {isEdit && (
          <Pressable
            onPress={() => toggleSelect(item.id)}
            className={`mt-1 h-6 w-6 items-center justify-center rounded-full border-2 ${
              selected ? "border-red-500 bg-red-500" : "border-gray-300"
            }`}
          >
            {selected && <View className="h-2.5 w-2.5 rounded-full bg-white" />}
          </Pressable>
        )}

        <View className="h-10 w-10 items-center justify-center rounded-full bg-gray-200">
          <User size={18} color="#9ca3af" />
        </View>

        <View className="flex-1">
          <Text className="text-sm font-medium text-gray-900">
            {item.title}
          </Text>

          {item.description && (
            <Text className="mt-1 text-sm text-gray-600">
              {item.description}
            </Text>
          )}

          <Text className="mt-1 text-xs text-gray-400">{item.time}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  /* =========================
     UI
  ========================= */

  return (
    <View className="flex-1 bg-white">
      <BackgroundGlow />

      <View
        style={{ paddingTop: insets.top + 8 }}
        className="flex-row items-center justify-between border-b border-gray-200 px-2 pb-3"
      >
        <View className="flex flex-row items-center justify-between">
          <Pressable
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center"
          >
            <ChevronLeft size={22} />
          </Pressable>

          <Pressable
            onPress={() => {
              setIsEdit(!isEdit);
              setSelectedIds([]);
            }}
            className="mx-4"
          >
            <Text className="px-3 text-xl font-semibold text-[#0891B2]">
              {isEdit ? "Done" : "Edit"}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* ================= List ================= */}
      <FlatList
        className="flex-1"
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListHeaderComponent={() => (
          <Text className="px-4 py-4 text-xl font-bold text-gray-600">
            TODAY
          </Text>
        )}
        ItemSeparatorComponent={() => (
          <View className="ml-16 h-px bg-gray-200" />
        )}
        ListEmptyComponent={() => (
          <View className="items-center justify-center py-20">
            <Text className="text-gray-400">No notifications</Text>
          </View>
        )}
      />

      {/* ================= Bottom Button ================= */}
      <View
        style={{ paddingBottom: insets.bottom }}
        className="border-t border-gray-200 bg-white"
      >
        {isEdit ? (
          <TouchableOpacity
            onPress={deleteSelected}
            disabled={selectedIds.length === 0}
            className="items-center py-4"
          >
            <Text
              className={`text-xl font-semibold ${
                selectedIds.length === 0 ? "text-gray-300" : "text-red-500"
              }`}
            >
              Delete
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={markAllAsRead}
            className="items-center py-4"
          >
            <Text className="text-xl font-semibold text-[#0891B2]">
              Mark all as read
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
