import { BackgroundGlow } from "@/components/Theme/background";
import { useAuth } from "@/hooks/useAuth";
import { Notification } from "@/type/notification";
import { router } from "expo-router";
import { ChevronLeft, User } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getNotificationList, updateNotification } from "../api/notification";

export default function NotificationPage() {
  const insets = useSafeAreaInsets();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | string | null>(null);
  const { auth, loading: loadingAuth } = useAuth();

  useEffect(() => {
    if (loadingAuth) return;
    if (!auth?.accountDetail?.profile_id) return;
    fetchNotifications();
  }, [loadingAuth, auth?.accountDetail?.profile_id]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const profileId = auth?.accountDetail?.profile_id;
      const response = await getNotificationList({
        page: 1,
        limit: -1,
        profile_id: profileId,
      });
      if (!response.success || !response.data) {
        setNotifications([]);
        return;
      } else {
        setNotifications(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePressNotification = async (item: Notification) => {
    if (item.is_read || updatingId === item.id) return;

    try {
      setUpdatingId(item.id);
      const profileId = auth?.accountDetail?.profile_id;
      if (!profileId) return;

      const response = await updateNotification({
        notification_id: item.id,
        profile_id: profileId,
        title: item.title,
        body: item.body ?? "",
        is_read: true,
      });

      if (response?.success) {
        await fetchNotifications();
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const renderItem = ({ item }: { item: Notification }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => handlePressNotification(item)}
        disabled={updatingId === item.id}
        className={`flex-row items-start gap-3 px-4 py-4 ${
          item.is_read ? "bg-white" : "bg-sky-50"
        }`}
      >
        <View className="h-10 w-10 items-center justify-center rounded-full bg-gray-200">
          <User size={18} color="#9ca3af" />
        </View>

        <View className="flex-1">
          <Text className="text-sm font-medium text-gray-900">
            {item.title}
          </Text>

          {!!item.body && (
            <Text className="mt-1 text-sm text-gray-600">{item.body}</Text>
          )}

          <Text className="mt-1 text-xs text-gray-400">
            {new Date(item.created_at).toLocaleString()}
          </Text>
        </View>

        {updatingId === item.id && (
          <ActivityIndicator size="small" color="#0891B2" />
        )}
      </TouchableOpacity>
    );
  };

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
        </View>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0891B2" />
        </View>
      ) : (
        <FlatList
          className="flex-1"
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListHeaderComponent={() => (
            <Text className="px-4 py-4 text-xl font-bold text-gray-600">
              Notification
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
      )}
    </View>
  );
}
