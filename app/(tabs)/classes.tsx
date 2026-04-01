import { BackgroundGlow } from "@/components/Theme/background";
import { useAuth } from "@/hooks/useAuth";
import { router } from "expo-router";
import { User } from "lucide-react-native";
import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { activities, profile } from "../classes/dummy_data";

const ongoingActivities = activities.filter(
  (activity) => activity.status === "Ongoing",
);

type OngoingActivity = (typeof ongoingActivities)[number];

function OngoingCard({ item }: { item: OngoingActivity }) {
  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/classes/[id]/detail",
          params: { id: item.id },
        })
      }
      className="w-[48%] mb-4"
    >
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
            paddingVertical: 7,
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
        </View>
      </View>
    </Pressable>
  );
}

const todaysActivities = activities.filter(
  (activity) => activity.status !== "Ongoing",
);

type TodaysActivities = (typeof todaysActivities)[number];

function TodaysCard({ item }: { item: TodaysActivities }) {
  return (
    <Pressable
      className="w-[48%] mb-4 mt-2"
      onPress={() =>
        router.push({
          pathname: "/classes/[id]/detail",
          params: { id: item.id },
        })
      }
    >
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
            paddingVertical: 7,
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
        </View>
      </View>
    </Pressable>
  );
}

const Home = () => {
  const insets = useSafeAreaInsets();
  const userProfile = profile;
  const { auth, loading: loadingAuth } = useAuth();

  if (loadingAuth) return null;
  return (
    <View className="flex-1 mb-28">
      <ScrollView>
        {/* <View className="px-5 pt-4"> */}
        <BackgroundGlow showText={true} />
        <View className="flex flex-row justify-between gap-4 items-center mb-4 mt-20 mx-5">
          <View className="flex-1">
            <Text className="text-3xl font-semibold text-slate-900 flex-wrap">
              {auth.accountDetail.profile_name}
            </Text>

            <Text className="text-base text-slate-500">
              {auth.accessPayload.account_code}
            </Text>

            <View
              className={`flex flex-row mt-3 self-start rounded-full items-center text-center border gap-2 px-4 py-1 ${
                auth.accountDetail.account_role === "Trainer"
                  ? "border-purple-400 bg-purple-50"
                  : "border-amber-400 bg-amber-50"
              }`}
            >
              <User
                size={14}
                color={
                  auth.accountDetail.account_role === "Trainer"
                    ? "#7C3AED"
                    : "#B45309"
                }
              />
              <Text
                className={`text-xs font-semibold ${
                  auth.accountDetail.account_role === "Trainer"
                    ? "text-purple-700"
                    : "text-amber-700"
                }`}
              >
                {auth.accountDetail.account_role}
              </Text>
            </View>
          </View>

          <View className="w-46 h-40 bg-[#FEFEFE] rounded-3xl items-center justify-center shadow-2xl">
            <Text className="text-lg font-medium mb-2">Active Packages</Text>
            <View className="w-20 h-20 rounded-full bg-cyan-600 items-center justify-center">
              <Text className="text-3xl font-semibold text-white">
                {profile.total_activity}
              </Text>
            </View>
          </View>
        </View>

        <Text className="text-2xl font-bold text-slate-800 mb-4 mx-5">
          Ongoing Activity
        </Text>
        <View className="flex flex-row flex-wrap justify-between mx-5">
          {ongoingActivities.map((item) => (
            <OngoingCard key={item.id} item={item} />
          ))}
        </View>

        <Text className="text-2xl font-bold text-slate-800 mb-4 mx-5">
          Today’s Activity
        </Text>
        <View className="flex flex-row flex-wrap justify-between mx-5">
          {todaysActivities.map((item) => (
            <TodaysCard key={item.id} item={item} />
          ))}
        </View>
        {/* </View> */}
      </ScrollView>
    </View>
  );
};

export default Home;
