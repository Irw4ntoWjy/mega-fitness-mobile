import { BackgroundGlow } from "@/components/Theme/background";
import { router } from "expo-router";
import { LogOut, User } from "lucide-react-native";
import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

// Dummy data
const ongoingActivities = [
  {
    id: 1,
    title: "CAMPFIRE",
    time: "12:00 - 13:00",
    status: "Ongoing!",
    tagColor: "#06B6D4",
    image:
      "https://images.unsplash.com/photo-1554284126-aa88f22d8b74?auto=format&fit=crop&w=800&q=80",
  },
];

type OngoingActivity = (typeof ongoingActivities)[number];

function OngoingCard({
  item,
  onPress,
}: {
  item: OngoingActivity;
  onPress?: () => void;
}) {
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
                pathname: "/classes/detail/[id]",
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

const todaysActivities = [
  {
    id: 2,
    title: "CAMPFIRE",
    time: "12:00 - 13:00",
    status: "Now!",
    tagColor: "#D946EF",
    image:
      "https://images.unsplash.com/photo-1554284126-aa88f22d8b74?auto=format&fit=crop&w=800&q=80",
    buttonText: "Sign In",
    owned: false,
  },
  {
    id: 3,
    title: "CAMPFIRE",
    time: "15:00 - 16:00",
    status: "Today",
    tagColor: "#0891B2",
    image:
      "https://images.unsplash.com/photo-1598970434795-0c54fe7c0644?auto=format&fit=crop&w=800&q=80",
    buttonText: "Sign In",
    owned: true,
  },
  {
    id: 4,
    title: "CAMPFIRE",
    time: "17:00 - 18:00",
    status: "Today",
    tagColor: "#0891B2",
    image:
      "https://images.unsplash.com/photo-1571019613914-85f342c0f7f7?auto=format&fit=crop&w=800&q=80",
    buttonText: "Sign In",
    owned: false,
  },
  {
    id: 5,
    title: "CAMPFIRE",
    time: "19:00 - 20:00",
    status: "Today",
    tagColor: "#0891B2",
    image:
      "https://images.unsplash.com/photo-1550345332-09e3ac987658?auto=format&fit=crop&w=800&q=80",
    buttonText: "Sign In",
    owned: false,
  },
];

type TodaysActivities = (typeof todaysActivities)[number];

function TodaysCard({
  item,
  onPress,
}: {
  item: TodaysActivities;
  onPress?: () => void;
}) {
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
                pathname: "/classes/detail/[id]",
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
                  Kilto Aznah
                </Text>
                <Text className="text-base text-slate-500">User1234</Text>

                <View className="flex flex-row mt-3 self-start rounded-full items-center text-center border gap-2 border-cyan-400 bg-cyan-50 px-4 py-1">
                  <User color="#0891B2" size={14} />
                  <Text className="text-xs font-semibold text-cyan-600">
                    Member
                  </Text>
                </View>
              </View>

              <View className="w-46 h-40 bg-[#FEFEFE] rounded-3xl items-center justify-center shadow-2xl">
                <Text className="text-lg font-medium mb-2">
                  Active Packages
                </Text>
                <View className="w-20 h-20 rounded-full bg-cyan-600 items-center justify-center">
                  <Text className="text-3xl font-semibold text-white">10</Text>
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
                <OngoingCard key={item.id} item={item} onPress={() => {}} />
              ))}
            </View>

            <Text className="text-2xl font-bold text-slate-800 mb-4">
              Today’s Activity
            </Text>

            <View className="flex flex-row flex-wrap justify-between">
              {todaysActivities.map((item) => (
                <TodaysCard key={item.id} item={item} onPress={() => {}} />
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Home;
