import { BackgroundGlow } from "@/components/Theme/background";
import { router } from "expo-router";
import { LogOut, User } from "lucide-react-native";
import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { activities, profile } from "../classes/dummy_data";

const ongoingActivities = activities.filter(
  (activity) => activity.status === "Ongoing"
);

type OngoingActivity = (typeof ongoingActivities)[number];

function OngoingCard({ item }: { item: OngoingActivity }) {
  return (
    <View className="w-[48%] mb-4">
      <View className="bg-white rounded-2xl shadow-md relative">
        <View className="w-full h-44 rounded-t-2xl overflow-hidden">
          <Image
            source={{ uri: item.image }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        <View
          style={{
            position: "absolute",
            top: -10,
            left: -5,
            backgroundColor: item.tagColor,
            paddingHorizontal: 12,
            paddingVertical: 4,
            borderRadius: 8,
            zIndex: 1000,
            elevation: 30,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 10,
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: 0.8,
            }}
          >
            {item.status}
          </Text>
        </View>

        <View className="flex-row items-center justify-between px-4 py-4">
          <View>
            <Text className="text-black font-bold text-lg">{item.title}</Text>
            <Text className="text-black text-xs mt-1">{item.time}</Text>
          </View>

          <Pressable
            onPress={() =>
              router.push({
                pathname: "/classes/[id]/detail",
                params: { id: item.id },
              })
            }
            className="rounded-lg bg-[#EF4565] p-2"
          >
            <LogOut size={16} color="white" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const todaysActivities = activities.filter(
  (activity) => activity.status !== "Ongoing"
);

type TodaysActivities = (typeof todaysActivities)[number];

function TodaysCard({ item }: { item: TodaysActivities }) {
  return (
    <View className="w-[48%] mb-4">
      <View className="bg-white rounded-2xl shadow-md relative">
        <View className="w-full h-44 rounded-t-2xl overflow-hidden">
          <Image
            source={{ uri: item.image }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        <View
          style={{
            position: "absolute",
            top: -10,
            left: -5,
            backgroundColor: item.tagColor,
            paddingHorizontal: 12,
            paddingVertical: 4,
            borderRadius: 8,
            zIndex: 1000,
            elevation: 30,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 10,
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: 0.8,
            }}
          >
            {item.status}
          </Text>
        </View>

        <View className="flex-row items-center justify-between px-4 py-4">
          <View>
            <Text className="text-black font-bold text-lg">{item.title}</Text>
            <Text className="text-black text-xs mt-1">{item.time}</Text>
          </View>

          <Pressable
            className="rounded-lg bg-[#DAA770] p-2 items-center justify-center"
            onPress={() =>
              router.push({
                pathname: "/classes/[id]/detail",
                params: { id: item.id },
              })
            }
          >
            <Text className="text-white text-sm tracking-tight">Sign In</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const Home = () => {
  const insets = useSafeAreaInsets();

  const userProfile = profile;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="bg-[#DBDBDB] w-full h-full overflow-hidden">
        <View className="w-full h-[21vh] shadow-[0_0_10px_rgba(0,0,0,0.3)] bg-[#EFEFEF] overflow-hidden relative rounded-b-xl">
          {/* <View className="absolute w-[70vh] h-[70vh] bg-[#FF30D9] opacity-25 rounded-full left-[-60vw] top-[-120%]" />
          <View className="absolute w-[70vh] h-[70vh] bg-[#FF30D9] opacity-25 rounded-full right-[-50vw] bottom-[-130%]" /> */}
          <View className="absolute inset-0 bg-white/30" />

          <View className="w-full h-full absolute z-10 flex flex-col justify-between items-center py-[2vh]">
            <View className="w-[95%] flex flex-row justify-between items-center">
              <View>
                <Text className="text-3xl font-semibold text-slate-900">
                  {profile.username}
                </Text>
                <Text className="text-base text-slate-500">
                  {profile.userId}
                </Text>

                <View
                  className={`flex flex-row mt-3 self-start rounded-full items-center text-center border gap-2 px-4 py-1 ${
                    profile.role === "Trainer"
                      ? "border-purple-400 bg-purple-50"
                      : "border-amber-400 bg-amber-50"
                  }`}
                >
                  <User
                    size={14}
                    color={profile.role === "Trainer" ? "#7C3AED" : "#B45309"}
                  />
                  <Text
                    className={`text-xs font-semibold ${
                      profile.role === "Trainer"
                        ? "text-purple-700"
                        : "text-amber-700"
                    }`}
                  >
                    {profile.role}
                  </Text>
                </View>
              </View>

              <View className="w-46 h-40 bg-[#FEFEFE] rounded-3xl items-center justify-center shadow-2xl">
                <Text className="text-lg font-medium mb-2">
                  Active Packages
                </Text>
                <View className="w-20 h-20 rounded-full bg-cyan-600 items-center justify-center">
                  <Text className="text-3xl font-semibold text-white">
                    {profile.total_activity}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Content */}
        <ScrollView className="rounded-t-xl mt-10">
          <BackgroundGlow showText={true} />

          <View className="px-4 pt-4">
            <Text className="text-2xl font-bold text-slate-800 mb-4">
              Ongoing Activity
            </Text>

            <View className="flex flex-row flex-wrap justify-between">
              {ongoingActivities.map((item) => (
                <OngoingCard key={item.id} item={item} />
              ))}
            </View>

            <Text className="text-2xl font-bold text-slate-800 mb-4">
              Today’s Activity
            </Text>

            <View className="flex flex-row flex-wrap justify-between">
              {todaysActivities.map((item) => (
                <TodaysCard key={item.id} item={item} />
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Home;
