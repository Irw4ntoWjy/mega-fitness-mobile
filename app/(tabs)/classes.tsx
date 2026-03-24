import { BackgroundGlow } from "@/components/Theme/background";
import { getAuth } from "@/lib/auth-storage";
import { fetcher } from "@/lib/fetcher";
import { router } from "expo-router";
import { User } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { bookings } from "../bookings/dummy_data";
import { activities, profile } from "../classes/dummy_data";

const ongoingActivities = activities.filter(
  (activity) => activity.status === "Ongoing" || activity.status === "Now",
);

type OngoingActivity = (typeof ongoingActivities)[number];

function normalizeRole(role: string) {
  return role.trim().toLowerCase();
}

function getRoleTheme(role: string) {
  const r = normalizeRole(role);

  if (r.includes("trainer")) {
    return {
      container: "border-purple-400 bg-purple-50",
      text: "text-purple-700",
      iconColor: "#7C3AED",
    };
  }

  if (r.includes("member")) {
    return {
      container: "border-amber-400 bg-amber-50",
      text: "text-amber-700",
      iconColor: "#B45309",
    };
  }

  if (r.includes("admin")) {
    return {
      container: "border-blue-400 bg-blue-50",
      text: "text-blue-700",
      iconColor: "#1D4ED8",
    };
  }

  if (r.includes("staff") || r.includes("employee")) {
    return {
      container: "border-teal-400 bg-teal-50",
      text: "text-teal-700",
      iconColor: "#0F766E",
    };
  }

  return {
    container: "border-slate-300 bg-slate-50",
    text: "text-slate-700",
    iconColor: "#334155",
  };
}

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

const upcomingActivities = bookings.filter((booking) => booking.status === "Upcoming");

type UpcomingActivity = (typeof upcomingActivities)[number];

function UpcomingCard({ item }: { item: UpcomingActivity }) {
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
            backgroundColor: "#22C55E",
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

async function fetchAccountDetailByCode(accountCode: string) {
  const endpoint = "/account/detail/code";
  const body = { account_code: accountCode };

  const postRes = await fetcher<any>(endpoint, {
    method: "POST",
    auth: true,
    body,
  });

  if (postRes.success && postRes.data) return postRes;

  return fetcher<any>(
    `${endpoint}?account_code=${encodeURIComponent(accountCode)}`,
    { method: "GET", auth: true },
  );
}

const Home = () => {
  useSafeAreaInsets();
  const [profileName, setProfileName] = useState("");
  const [accountEmail, setAccountEmail] = useState("");
  const [accountRole, setAccountRole] = useState(profile.role ?? "Member");
  const [totalActivity, setTotalActivity] = useState<number>(
    typeof profile.total_activity === "number" ? profile.total_activity : 0,
  );
  const roleTheme = getRoleTheme(accountRole);

  useEffect(() => {
    const load = async () => {
      const auth = await getAuth();
      const accountCode =
        auth?.accessPayload?.account_code ?? (auth?.accessPayload as any)?.accountCode;

      if (!accountCode) return;

      const res = await fetchAccountDetailByCode(accountCode);
      if (!res.success || !res.data) return;

      const detail = res.data;

      if (typeof detail.profile_name === "string") {
        setProfileName(detail.profile_name);
      }

      if (typeof detail.account_email === "string") {
        setAccountEmail(detail.account_email);
      }

      if (typeof detail.account_role === "string") {
        setAccountRole(detail.account_role);
      }

      if (typeof detail.total_activity === "number") {
        setTotalActivity(detail.total_activity);
      }
    };

    load();
  }, []);

  return (
    <View className="flex-1 mb-28">
      <ScrollView>
        {/* <View className="px-5 pt-4"> */}
        <BackgroundGlow showText={true} />
        <View className="flex flex-row justify-between items-center mb-4 mt-20 mx-5">
          <View>
            <Text className="text-3xl font-semibold text-slate-900">
              {profileName || profile.username}
            </Text>
            <Text className="text-base text-slate-500">
              {accountEmail || profile.userId}
            </Text>

            <View
              className={`flex flex-row mt-3 self-start rounded-full items-center text-center border gap-2 px-4 py-1 ${
                roleTheme.container
              }`}
            >
              <User size={14} color={roleTheme.iconColor} />
              <Text
                className={`text-xs font-semibold ${
                  roleTheme.text
                }`}
              >
                {accountRole}
              </Text>
            </View>
          </View>

          <View className="w-46 h-40 bg-[#FEFEFE] rounded-3xl items-center justify-center shadow-2xl">
            <Text className="text-lg font-medium mb-2">Active Packages</Text>
            <View className="w-20 h-20 rounded-full bg-cyan-600 items-center justify-center">
              <Text className="text-3xl font-semibold text-white">
                {totalActivity}
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
          Upcoming Activity
        </Text>
        <View className="flex flex-row flex-wrap justify-between mx-5">
          {upcomingActivities.map((item) => (
            <UpcomingCard key={item.id} item={item} />
          ))}
        </View>
        {/* </View> */}
      </ScrollView>
    </View>
  );
};

export default Home;
