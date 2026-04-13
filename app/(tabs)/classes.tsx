import { getBookingList } from "@/app/api/booking";
import { BackgroundGlow } from "@/components/Theme/background";
import { useAuth } from "@/hooks/useAuth";
import { BookingSchema } from "@/type/bookings";
import { router } from "expo-router";
import { User } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { profile } from "../classes/dummy_data";

function timeToMinutes(time: string) {
  const parts = time.split(":");
  const hours = Number(parts[0] ?? 0);
  const minutes = Number(parts[1] ?? 0);
  return hours * 60 + minutes;
}

function BookingCard({
  item,
  showOngoingTag,
}: {
  item: BookingSchema;
  showOngoingTag?: boolean;
}) {
  const statusId = String(item.booking_status_id);
  const statusBg =
    statusId === "3"
      ? "#16A34A"
      : statusId === "4"
        ? "#06B6D4"
        : statusId === "1"
          ? "#DC2626"
          : "#64748B";
  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/classes/[id]/barcode",
          params: {
            id: item.booking_id,
            trainer: "false",
          },
        })
      }
      className="w-[48%] mb-4"
    >
      <View className="bg-white rounded-2xl shadow-md relative">
        <View className="w-full h-44 rounded-t-2xl overflow-hidden">
          {item.package_cover_image ? (
            <Image
              source={{
                uri: `${process.env.EXPO_PUBLIC_URL}${item.package_cover_image}`,
              }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full bg-black" />
          )}
        </View>

        <View
          style={{
            position: "absolute",
            top: -10,
            left: -5,
            backgroundColor: showOngoingTag ? "#06B6D4" : statusBg,
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
            {showOngoingTag ? "Ongoing" : item.booking_status_name}
          </Text>
        </View>

        <View className="flex-row items-center justify-between px-4 py-4">
          <View>
            <Text className="text-black font-bold text-lg">
              {item.product_name}
            </Text>
            <Text className="text-black text-xs mt-1">
              {item.schedule_date} • {item.time_start} - {item.time_end}
            </Text>
            <Text className="text-black text-xs mt-1">
              {item.trainer_name ?? "-"}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const Home = () => {
  const { auth, loading: loadingAuth } = useAuth();
  const [upcomingBookings, setUpcomingBookings] = useState<BookingSchema[]>([]);
  const [ongoingBookings, setOngoingBookings] = useState<BookingSchema[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  const memberProfileId = auth?.accountDetail?.profile_id;

  useEffect(() => {
    if (!memberProfileId) return;

    let cancelled = false;
    setLoadingBookings(true);

    Promise.all([
      getBookingList({
        member_profile_id: memberProfileId,
        is_not_expired: true,
        booking_status_id: 3,
      }),
      getBookingList({
        member_profile_id: memberProfileId,
        is_not_expired: true,
        booking_status_id: 4,
      }),
    ])
      .then(([upcomingRes, ongoingRes]) => {
        if (cancelled) return;

        setUpcomingBookings(
          upcomingRes.success && upcomingRes.data ? upcomingRes.data.data ?? [] : [],
        );
        setOngoingBookings(
          ongoingRes.success && ongoingRes.data ? ongoingRes.data.data ?? [] : [],
        );
      })
      .finally(() => {
        if (cancelled) return;
        setLoadingBookings(false);
      });

    return () => {
      cancelled = true;
    };
  }, [memberProfileId]);

  const classUpcomingBookings = useMemo(
    () => upcomingBookings.filter((b) => b.schedule_type === "class"),
    [upcomingBookings],
  );

  const classOngoingBookings = useMemo(
    () => ongoingBookings.filter((b) => b.schedule_type === "class"),
    [ongoingBookings],
  );

  if (loadingAuth) return null;

  const sortedOngoingBookings = useMemo(
    () =>
      [...classOngoingBookings].sort((a, b) => {
        if (a.schedule_date !== b.schedule_date) {
          return a.schedule_date.localeCompare(b.schedule_date);
        }
        return a.time_start.localeCompare(b.time_start);
      }),
    [classOngoingBookings],
  );

  const sortedUpcomingBookings = useMemo(
    () =>
      [...classUpcomingBookings].sort((a, b) => {
        if (a.schedule_date !== b.schedule_date) {
          return a.schedule_date.localeCompare(b.schedule_date);
        }
        return a.time_start.localeCompare(b.time_start);
      }),
    [classUpcomingBookings],
  );

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
          {loadingBookings ? (
            <Text className="text-base text-slate-500">Loading...</Text>
          ) : sortedOngoingBookings.length > 0 ? (
            sortedOngoingBookings.map((item) => (
              <BookingCard
                key={item.booking_id}
                item={item}
                showOngoingTag={true}
              />
            ))
          ) : (
            <Text className="text-base text-slate-500">No Ongoing Class</Text>
          )}
        </View>

        <Text className="text-2xl font-bold text-slate-800 mb-4 mx-5 mt-6">
          Upcoming Classes
        </Text>
        <View className="flex flex-row flex-wrap justify-between mx-5">
          {loadingBookings ? (
            <Text className="text-base text-slate-500">Loading...</Text>
          ) : sortedUpcomingBookings.length > 0 ? (
            sortedUpcomingBookings.map((item) => (
              <BookingCard key={item.booking_id} item={item} />
            ))
          ) : (
            <Text className="text-base text-slate-500">No upcoming classes</Text>
          )}
        </View>
        {/* </View> */}
      </ScrollView>
    </View>
  );
};

export default Home;
