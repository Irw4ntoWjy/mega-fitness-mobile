import { BackgroundGlow } from "@components/Theme/background";
import { router } from "expo-router";
import {
  Bell,
  ChevronLeft,
  FileQuestionMark,
  Settings,
} from "lucide-react-native";
import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const user = {
  name: "Kilto Aznah",
  username: "user1234",
  memberType: "Member",
  initials: "KA",
  completedPercent: 10,
  activePackages: 2,
  packages: [
    { label: "Membership Pass" },
    { label: "Class Pass" },
    { label: "Private Training" },
  ],
  history: new Array(4).fill(0).map((_, i) => ({
    id: String(i),
    title: "CAMPFIRE",
    time: "15:00 - 16:00",
    status: "Completed",
    image:
      "https://static.dezeen.com/uploads/2025/05/sq-google-g-logo-update_dezeen_2364_col_0.jpg",
  })),
};

const HERO_H = 100;

export default function Profile() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1">
      <BackgroundGlow />
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          paddingTop: insets.top + 8,
          paddingRight: insets.right + 8,
          paddingLeft: insets.left + 8,
        }}
        className="px-4"
      >
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center"
        >
          <ChevronLeft size={22} color="#000" />
        </Pressable>

        <View className="flex-row items-center ml-auto">
          <HeaderIcon>
            <FileQuestionMark size={18} color="black" />
          </HeaderIcon>
          <View className="ml-3">
            <HeaderIcon>
              <Bell size={18} color="black" />
            </HeaderIcon>
          </View>
          <View className="ml-3 mr-1">
            <HeaderIcon onPress={() => router.push("/profile/settings-list")}>
              <Settings size={18} color="black" />
            </HeaderIcon>
          </View>
        </View>
      </View>
      <ScrollView className="px-4" showsVerticalScrollIndicator={false}>
        <View className="relative">
          <View style={{ height: HERO_H }} />

          <View className="absolute right-0 bottom-4 items-end">
            <Text
              numberOfLines={1}
              className="text-black text-2xl font-extrabold text-right"
            >
              {user.name}
            </Text>
            <Text className="text-black/60 text-right">@{user.username}</Text>
          </View>

          <View className="absolute -bottom-15 z-50">
            <View className="w-30 h-30 rounded-full bg-[#E6FAFF] border-[3px] border-[#30B8C4] items-center justify-center">
              <Text className="text-[#0F6B7E] text-3xl font-semibold">
                {user.initials}
              </Text>
            </View>
          </View>
        </View>

        <View className="-mx-4 px-4 pt-16 pb-6 bg-[#F8F8F8]">
          <View className="absolute right-4 top-4 z-40">
            <View className="px-5 py-2 rounded-xl bg-[#FFF7E6] border border-[#D48B28] shadow-sm">
              <Text className="text-[#B45C17] text-sm font-semibold">
                Member
              </Text>
            </View>
          </View>

          <View className="w-full mb-5 mt-5">
            <View className="h-45 flex-row items-start">
              <View className="h-full flex-1 mr-4 bg-white rounded-3xl border border-[#F1E6F4] p-4 overflow-hidden shadow-sm">
                <Text className="text-gray-800 text-base text-center font-medium">
                  Active Packages
                </Text>
                <View className="items-center">
                  <View className="mt-6 items-center justify-center">
                    <View className="w-18 h-18 rounded-full bg-[#0EA5A4] items-center justify-center shadow">
                      <Text className="text-white text-3xl font-bold">10</Text>
                    </View>
                  </View>
                </View>
              </View>

              <View className="h-full flex-[1.6] bg-white rounded-3xl border border-[#F1E6F4] p-4 overflow-hidden shadow-sm">
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm font-bold text-gray-800">10%</Text>
                  <Text className="text-sm text-gray-500">
                    20/200 Active Sessions Done
                  </Text>
                </View>

                <View className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <View className="h-full w-[10%] bg-[#0EA5A4]" />
                </View>

                <View className="mt-4">
                  {["Membership Pass", "Class Pass", "Private Training"].map(
                    (label, i) => (
                      <View key={i} className="flex-row items-center mb-2">
                        <View className="rounded-full bg-[#E6F7F7] border border-[#0EA5A4] px-2 py-0.5 mr-2">
                          <Text className="text-[#0EA5A4] text-[10px] font-semibold">
                            0/0
                          </Text>
                        </View>

                        <Text className="text-gray-700 text-[13px]">
                          {label}
                        </Text>
                      </View>
                    )
                  )}
                </View>
                <Pressable className="mt-1 ml-auto rounded-full px-3 py-1.5 bg-[#E1B07C] shadow-sm">
                  <Text className="text-white text-[11px] font-semibold">
                    My Packages
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>

          <SectionTitle title="History" className="mt-3" />
          <View className="mt-3 -mx-2 flex-row flex-wrap">
            {user.history.map((h) => (
              <View key={h.id} className="w-1/2 px-2 mb-4">
                <View className="bg-white rounded-3xl border border-[#F1E6F4] shadow-sm overflow-hidden">
                  <Image
                    source={{ uri: h.image }}
                    className="w-full h-28"
                    resizeMode="cover"
                  />
                  <View className="p-3">
                    <Text className="text-gray-900 font-semibold">
                      {h.title}
                    </Text>
                    <Text className="text-gray-500 text-xs mt-1">{h.time}</Text>
                    <View className="ml-auto">
                      <StatusBadge text={h.status} />
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <Pressable className="self-end px-5 py-2.5 rounded-xl bg-[#E1B07C] mt-1 shadow-sm">
            <Text className="text-white font-semibold">See All</Text>
          </Pressable>
        </View>
        <View
          style={{
            width: "120%",
            height: insets.bottom,
            backgroundColor: "#F8F8F8",
          }}
        />
      </ScrollView>
    </View>
  );
}

function HeaderIcon({
  children,
  onPress,
}: {
  children: React.ReactNode;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="w-10 h-10 rounded-xl items-center justify-center bg-white shadow-sm"
    >
      {children}
    </Pressable>
  );
}

function SectionTitle({
  title,
  className = "",
}: {
  title: string;
  className?: string;
}) {
  return (
    <Text className={`text-gray-800 text-xl font-semibold ${className}`}>
      {title}
    </Text>
  );
}

function StatusBadge({ text }: { text: string }) {
  const lower = text.toLowerCase();

  if (lower === "completed") {
    return (
      <View className="px-5 py-2 rounded-full bg-[#F2FFF7] border border-[#00A651] shadow-sm">
        <Text className="text-[#008542] text-sm font-semibold">{text}</Text>
      </View>
    );
  }

  return (
    <View className="px-5 py-2 rounded-full bg-white border border-gray-300 shadow-sm">
      <Text className="text-gray-700 text-sm font-semibold">{text}</Text>
    </View>
  );
}
