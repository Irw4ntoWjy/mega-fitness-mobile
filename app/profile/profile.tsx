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

export default function Profile() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-[#180921]">
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          paddingTop: insets.top + 8,
          paddingBottom: 8,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center"
        >
          <ChevronLeft size={22} color="#fff" />
        </Pressable>

        <View className="flex-row items-center ml-auto mr-4 gap-2">
          <HeaderIcon>
            <FileQuestionMark size={18} color="black" />
          </HeaderIcon>
          <HeaderIcon>
            <Bell size={18} color="black" />
          </HeaderIcon>
          <HeaderIcon>
            <Settings size={18} color="black" />
          </HeaderIcon>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
        className="px-4"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center">
          <View className="w-25 h-25 rounded-full bg-cyan-900/40 border-2 border-cyan-400 items-center justify-center">
            <Text className="text-cyan-200 text-3xl font-semibold">
              {user.initials}
            </Text>
          </View>

          <View className="flex-1 ml-4 items-end">
            <View className="min-w-0 items-end">
              <Text
                numberOfLines={1}
                className="text-white text-2xl font-extrabold text-right"
              >
                {user.name}
              </Text>
              <Text className="text-white/60 text-right">@{user.username}</Text>
            </View>

            <View className="mt-3 self-end">
              <View className="px-5 py-2 rounded-full border border-cyan-400/60 bg-transparent">
                <Text className="text-cyan-200 text-sm font-semibold">
                  Member
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View className="w-full mb-5 mt-5">
          <View className="flex-row h-45 items-start">
            <View className="flex-1 h-full mr-4 bg-[#312439] rounded-xl border border-[rgba(255,255,255,0.18)] p-4 overflow-hidden">
              <Text className="text-white text-base text-center font-medium">
                Your Active Packages
              </Text>

              <View className="mt-4 items-center">
                <View className="w-16 h-16 relative items-center justify-center">
                  <Image
                    className="w-full h-full absolute"
                    resizeMode="contain"
                  />
                  <Text className="text-white text-2xl font-semibold">2</Text>
                </View>
              </View>
            </View>

            <View className="h-full flex-[1.6] bg-[#312439] rounded-xl border border-[rgba(255,255,255,0.18)] p-4 overflow-hidden">
              <View className="flex-row items-center min-w-0">
                <Text
                  numberOfLines={1}
                  className="flex-1 pr-2 text-[0.75rem] text-white font-semibold"
                >
                  30%{" "}
                  <Text className="text-white/70 font-normal">
                    You’ve Completed 20/200 Active Sessions
                  </Text>
                </Text>

                <Pressable className="shrink-0 ml-3 rounded-full border border-cyan-400/60 px-[1rem] py-[0.5rem]">
                  <Text className="text-cyan-200 text-[0.75rem] font-semibold">
                    My Packages
                  </Text>
                </Pressable>
              </View>

              <View className="mt-3 w-full h-[0.5rem] bg-white/10 rounded-full overflow-hidden">
                <View className="h-full w-[30%] bg-cyan-600" />
              </View>

              <View className="mt-3">
                {["Membership Pass", "Class Pass", "Private Training"].map(
                  (label, i) => (
                    <View key={i} className="flex-row items-center mb-2">
                      <View className="rounded-full bg-cyan-600 px-[0.5rem] py-[0.15rem] mr-2">
                        <Text className="text-white text-[0.65rem]">0/0</Text>
                      </View>
                      <Text className="text-white text-[0.8rem]">{label}</Text>
                    </View>
                  )
                )}
              </View>
            </View>
          </View>
        </View>

        <SectionTitle title="History" className="mt-3" />
        <View className="mt-3 flex-row flex-wrap -mx-2">
          {user.history.map((h) => (
            <View key={h.id} className="w-1/2 px-2 mb-4">
              <Card className="p-0 overflow-hidden">
                <Image
                  source={{ uri: h.image }}
                  className="w-full h-28"
                  resizeMode="cover"
                />
                <View className="p-3">
                  <Text className="text-white font-semibold">{h.title}</Text>
                  <Text className="text-white/60 text-xs mt-1">{h.time}</Text>
                  <View className="mt-2">
                    <StatusBadge text={h.status} />
                  </View>
                </View>
              </Card>
            </View>
          ))}
        </View>
        <Pressable className="self-end px-4 py-2 rounded-lg bg-cyan-500 mt-1">
          <Text className="text-white font-medium">See All</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function HeaderIcon({ children }: { children: React.ReactNode }) {
  return (
    <Pressable className="w-10 h-10 rounded-xl items-center justify-center bg-white">
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
    <Text className={`text-white text-xl font-semibold ${className}`}>
      {title}
    </Text>
  );
}

function Card({
  children,
  className = "",
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <View
      className={`bg-white/5 border border-white/10 rounded-2xl p-4 ${className}`}
      style={{
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 3,
      }}
    >
      {children}
    </View>
  );
}

function StatusBadge({ text }: { text: string }) {
  return (
    <View className="self-start px-2.5 py-1 rounded-md bg-emerald-500/20 border border-emerald-400/30">
      <Text className="text-emerald-300 text-xs font-semibold">{text}</Text>
    </View>
  );
}
