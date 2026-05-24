import { getBookingList } from "@/app/api/booking";
import { getPurchaseList } from "@/app/api/purchase";
import {
  createTrainerAttendance,
  getTrainerSessionLogHistory,
} from "@/app/api/session-log";
import { FeedbackModal } from "@/app/classes/[id]/detail";
import { BackgroundGlow } from "@/components/Theme/background";
import { useToast } from "@/components/Toast/toast-provider";
import { TrainerSessionCard } from "@/components/Trainer/TrainerSessionCard";
import { useAuth } from "@/hooks/useAuth";
import { getDistanceMeters } from "@/lib/utils";
import { BookingSchema } from "@/type/bookings";
import { PurchaseItemSchema } from "@/type/purchase";
import { TrainerSessionLogHistoryItem } from "@/type/session-log";
import { useFocusEffect } from "@react-navigation/native";
import * as Location from "expo-location";
import { router } from "expo-router";
import { LogIn, User, X } from "lucide-react-native";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

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
              {item.trainers && item.trainers.length > 0
                ? item.trainers.map((t) => t.trainer_name).join(", ")
                : "-"}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function MembershipCard({
  item,
  showOngoingTag,
}: {
  item: PurchaseItemSchema;
  showOngoingTag?: boolean;
}) {
  const statusBg = "#16A34A";
  return (
    <Pressable
      className="w-[48%] mb-4"
      onPress={() =>
        router.push({
          pathname: "/classes/[id]/barcode",
          params: {
            id: item.id,
            trainer: "false",
            membership: "true",
          },
        })
      }
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
            Ongoing
          </Text>
        </View>

        <View className="flex-row items-center justify-between px-4 py-4">
          <View>
            <Text className="text-black font-bold text-lg">
              {item.product_name}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function ActivePackageCard({ item }: { item: PurchaseItemSchema }) {
  return (
    <View className="mb-9 min-w-50 max-w-100">
      <View className="bg-white rounded-2xl shadow-md relative">
        <View className="flex flex-row items-center justify-start w-full h-20 rounded-t-2xl overflow-hidden bg-cyan-600 p-4 ">
          <View className="h-full w-full flex flex-row justify-start items-center">
            <Text
              className="text-white font-bold text-lg"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.package_name.trim()}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center justify-between px-4 py-4">
          <View className="flex-1 pr-2">
            {item.product_type_name ? (
              <Text className="text-gray-500 text-xs mt-1">
                {item.product_type_name}
              </Text>
            ) : null}
            {typeof item.package_session_quota === "number" ||
            typeof item.package_expiry === "number" ? (
              <Text className="text-gray-500 text-xs mt-0.5">
                {typeof item.package_session_quota === "number"
                  ? `Quota: ${item.package_session_quota}`
                  : null}
                {typeof item.package_session_quota === "number" &&
                typeof item.package_expiry === "number"
                  ? " • "
                  : null}
                {typeof item.package_expiry === "number"
                  ? `Expiry: ${item.package_expiry} days`
                  : null}
              </Text>
            ) : null}
            {item.package_trainer_name ? (
              <Text className="text-gray-500 text-xs mt-0.5">
                Trainer: {item.package_trainer_name}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
}

const formatDate = (date: Date) => date.toISOString().slice(0, 10);
const today = new Date();
const todayStr = formatDate(today);
const weekAgo = new Date(today);
weekAgo.setDate(today.getDate() - 7);
const weekAgoStr = formatDate(weekAgo);

function fetchTrainerSessions(
  trainerProfileId: string,
  setTodaySessions: any,
  setPastSessions: any,
  setLoadingTrainerSessions: any,
  todayStr: string,
  weekAgoStr: string,
  cancelled?: { current: boolean },
) {
  setLoadingTrainerSessions(true);
  Promise.all([
    getTrainerSessionLogHistory({
      page: 1,
      limit: -1,
      trainer_profile_id: trainerProfileId,
      date_from: todayStr,
      date_to: todayStr,
      session_log_status_id: 1,
    }),
    getTrainerSessionLogHistory({
      page: 1,
      limit: -1,
      trainer_profile_id: trainerProfileId,
      date_from: todayStr,
      date_to: todayStr,
      session_log_status_id: 3,
    }),
    getTrainerSessionLogHistory({
      page: 1,
      limit: -1,
      trainer_profile_id: trainerProfileId,
      date_from: weekAgoStr,
      date_to: todayStr,
      session_log_status_id: 1,
    }),
    getTrainerSessionLogHistory({
      page: 1,
      limit: -1,
      trainer_profile_id: trainerProfileId,
      date_from: weekAgoStr,
      date_to: todayStr,
      session_log_status_id: 3,
    }),
  ])
    .then(([today1, today3, past1, past3]) => {
      if (cancelled && cancelled.current) return;
      setTodaySessions([
        ...(today1.success && today1.data ? (today1.data.data ?? []) : []),
        ...(today3.success && today3.data ? (today3.data.data ?? []) : []),
      ]);
      setPastSessions(
        [
          ...(past1.success && past1.data ? (past1.data.data ?? []) : []),
          ...(past3.success && past3.data ? (past3.data.data ?? []) : []),
        ].filter((s) => s.schedule_date !== todayStr),
      );
    })
    .finally(() => {
      if (cancelled && cancelled.current) return;
      setLoadingTrainerSessions(false);
    });
}

const Home = () => {
  const { auth, loading: loadingAuth } = useAuth();
  const [upcomingBookings, setUpcomingBookings] = useState<BookingSchema[]>([]);
  const [ongoingBookings, setOngoingBookings] = useState<BookingSchema[]>([]);
  const [membership, setMembership] = useState<PurchaseItemSchema[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [activePackagesTotal, setActivePackagesTotal] = useState(0);
  const [activePackagesTotalLoading, setActivePackagesTotalLoading] =
    useState(true);
  const [activePackagesPopupOpen, setActivePackagesPopupOpen] = useState(false);
  const [activePackagesListLoading, setActivePackagesListLoading] =
    useState(false);
  const [activePackagesList, setActivePackagesList] = useState<
    PurchaseItemSchema[]
  >([]);

  const [todaySessions, setTodaySessions] = useState<
    TrainerSessionLogHistoryItem[]
  >([]);
  const [pastSessions, setPastSessions] = useState<
    TrainerSessionLogHistoryItem[]
  >([]);
  const [loadingTrainerSessions, setLoadingTrainerSessions] = useState(false);

  const memberProfileId = auth?.accountDetail?.profile_id;
  const isTrainer = auth?.accountDetail?.account_role === "Trainer";
  const trainerProfileId = auth?.accountDetail?.profile_id;
  const { showToast } = useToast();
  const [feedbackModal, setFeedbackModal] = useState({
    visible: false,
    title: "",
    message: "",
  });

  const fetchMembershipData = async ({ profileId }: { profileId: string }) => {
    try {
      const res = await getPurchaseList({
        customer_profile_id: profileId,
        q: "Membership",
      });
      const data = res.data;
      if (data) setMembership(data.data ?? []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchActivePackagesTotal = useCallback(async () => {
    if (isTrainer) return;
    if (!memberProfileId) return;

    setActivePackagesTotalLoading(true);
    try {
      const res = await getPurchaseList({
        customer_profile_id: memberProfileId,
        purchase_status_id: "2",
      });

      if (res.success && res.data) {
        setActivePackagesTotal(
          typeof res.data.total_data === "number"
            ? res.data.total_data
            : (res.data.data ?? []).length,
        );
      } else {
        setActivePackagesTotal(0);
      }
    } catch {
      setActivePackagesTotal(0);
    } finally {
      setActivePackagesTotalLoading(false);
    }
  }, [isTrainer, memberProfileId]);

  const fetchActivePackagesList = useCallback(async () => {
    if (isTrainer) return;
    if (!memberProfileId) return;

    setActivePackagesListLoading(true);
    try {
      const res = await getPurchaseList({
        customer_profile_id: memberProfileId,
        purchase_status_id: "2",
      });

      if (res.success && res.data) {
        setActivePackagesList(res.data.data ?? []);
      } else {
        setActivePackagesList([]);
      }
    } catch {
      setActivePackagesList([]);
    } finally {
      setActivePackagesListLoading(false);
    }
  }, [isTrainer, memberProfileId]);

  const openActivePackagesPopup = useCallback(() => {
    setActivePackagesPopupOpen(true);
    fetchActivePackagesList();
  }, [fetchActivePackagesList]);

  const closeActivePackagesPopup = useCallback(() => {
    setActivePackagesPopupOpen(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!memberProfileId) return;

      let cancelled = false;
      setLoadingBookings(true);

      Promise.all([
        getBookingList({
          page: 1,
          limit: -1,
          member_profile_id: memberProfileId,
          is_not_expired: true,
          booking_status_id: 3,
        }),
        getBookingList({
          page: 1,
          limit: -1,
          member_profile_id: memberProfileId,
          is_not_expired: true,
          booking_status_id: 4,
        }),
      ])
        .then(([upcomingRes, ongoingRes]) => {
          if (cancelled) return;

          setUpcomingBookings(
            upcomingRes.success && upcomingRes.data
              ? (upcomingRes.data.data ?? [])
              : [],
          );
          setOngoingBookings(
            ongoingRes.success && ongoingRes.data
              ? (ongoingRes.data.data ?? [])
              : [],
          );

          fetchMembershipData({ profileId: memberProfileId });
        })
        .finally(() => {
          if (cancelled) return;
          setLoadingBookings(false);
        });

      return () => {
        cancelled = true;
      };
    }, [memberProfileId]),
  );

  useFocusEffect(
    useCallback(() => {
      if (isTrainer) return;
      if (!memberProfileId) return;
    }, [isTrainer, memberProfileId]),
  );

  useFocusEffect(
    useCallback(() => {
      if (isTrainer) return;
      if (!memberProfileId) return;

      fetchActivePackagesTotal();
    }, [fetchActivePackagesTotal, isTrainer, memberProfileId]),
  );

  const refreshTrainerSessions = useCallback(() => {
    if (!isTrainer || !trainerProfileId) return;
    fetchTrainerSessions(
      trainerProfileId,
      setTodaySessions,
      setPastSessions,
      setLoadingTrainerSessions,
      todayStr,
      weekAgoStr,
    );
  }, [isTrainer, trainerProfileId]);

  useFocusEffect(
    useCallback(() => {
      if (!isTrainer || !trainerProfileId) return;
      const cancelled = { current: false };
      fetchTrainerSessions(
        trainerProfileId,
        setTodaySessions,
        setPastSessions,
        setLoadingTrainerSessions,
        todayStr,
        weekAgoStr,
        cancelled,
      );
      return () => {
        cancelled.current = true;
      };
    }, [isTrainer, trainerProfileId]),
  );

  const classUpcomingBookings = useMemo(
    () =>
      upcomingBookings.filter(
        (b) => b.schedule_type === "class" || b.schedule_type === "trainer",
      ),
    [upcomingBookings],
  );

  const classOngoingBookings = useMemo(
    () =>
      ongoingBookings.filter(
        (b) => b.schedule_type === "class" || b.schedule_type === "trainer",
      ),
    [ongoingBookings],
  );

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

  if (loadingAuth) return null;

  return (
    <View className="flex-1 mb-28">
      <Modal
        visible={activePackagesPopupOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={closeActivePackagesPopup}
        statusBarTranslucent={true}
      >
        <View className="flex-1 bg-[rgba(0,0,0,0.45)]">
          <View className="flex-1 justify-center px-5">
            <View className="max-h-[80%] rounded-3xl bg-white p-6">
              <View className="mb-4 flex-row items-center justify-between">
                <Text className="text-2xl font-bold text-slate-800">
                  Active Packages
                </Text>

                <Pressable
                  onPress={closeActivePackagesPopup}
                  className="rounded-full p-4"
                >
                  <X size={18} color="black" />
                </Pressable>
              </View>

              {activePackagesListLoading ? (
                <View className="min-h-[220px] items-center justify-center">
                  <ActivityIndicator size="small" />
                </View>
              ) : activePackagesList.length === 0 ? (
                <View className="min-h-[220px] items-center justify-center">
                  <Text className="text-gray-500">No active packages.</Text>
                </View>
              ) : (
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingHorizontal: 8,
                    paddingVertical: 8,
                  }}
                >
                  {activePackagesList.map((item) => (
                    <ActivePackageCard key={item.id} item={item} />
                  ))}
                </ScrollView>
              )}
            </View>
          </View>
        </View>
      </Modal>
      <ScrollView>
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
                isTrainer
                  ? "border-purple-400 bg-purple-50"
                  : "border-amber-400 bg-amber-50"
              }`}
            >
              <User size={14} color={isTrainer ? "#7C3AED" : "#B45309"} />
              <Text
                className={`text-xs font-semibold ${
                  isTrainer ? "text-purple-700" : "text-amber-700"
                }`}
              >
                {auth.accountDetail.account_role}
              </Text>
            </View>
          </View>

          {isTrainer ? (
            <>
              <Pressable
                style={({ pressed }) => ({
                  opacity: pressed ? 0.85 : 1,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                })}
                onPress={async () => {
                  const TARGET = { latitude: 3.6338338, longitude: 98.7022789 };
                  const RADIUS_METERS = 10;
                  try {
                    const { status } =
                      await Location.requestForegroundPermissionsAsync();
                    if (status !== "granted") {
                      setFeedbackModal({
                        visible: true,
                        title: "Location Permission Needed",
                        message: "Aktifkan izin lokasi untuk sign in trainer.",
                      });
                      return;
                    }
                    const position = await Location.getCurrentPositionAsync({
                      accuracy: 6,
                    });
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    const distance = getDistanceMeters(
                      { latitude, longitude },
                      TARGET,
                    );
                    if (distance > RADIUS_METERS) {
                      setFeedbackModal({
                        visible: true,
                        title: "Di Luar Radius",
                        message: `Harus berada dalam radius ${RADIUS_METERS}m dari lokasi gym.\nJarak saat ini ${Math.round(distance)}m.`,
                      });
                      return;
                    }
                    await createTrainerAttendance({
                      trainer_profile_id: trainerProfileId,
                      latitude: String(latitude),
                      longitude: String(longitude),
                    });
                    showToast({
                      message: "Sign in successful!",
                      variant: "success",
                    });
                  } catch (e) {
                    showToast({
                      message: "Failed to sign in. Please try again.",
                      variant: "error",
                    });
                  }
                }}
              >
                <View className="w-[148px] h-40 bg-cyan-600 rounded-3xl items-center justify-center shadow-lg gap-2.5">
                  <View className="w-14 h-14 rounded-full bg-white/20 items-center justify-center">
                    <LogIn size={26} color="#FFFFFF" />
                  </View>
                  <Text className="text-xl font-bold tracking-wide text-white">
                    Sign In
                  </Text>
                </View>
              </Pressable>
              <FeedbackModal
                visible={feedbackModal.visible}
                title={feedbackModal.title}
                message={feedbackModal.message}
                onClose={() =>
                  setFeedbackModal((prev) => ({ ...prev, visible: false }))
                }
              />
            </>
          ) : (
            <Pressable
              onPress={openActivePackagesPopup}
              className="w-46 h-40 bg-[#FEFEFE] rounded-3xl items-center justify-center shadow-2xl"
            >
              <Text className="text-lg font-medium mb-2">Active Packages</Text>
              {activePackagesTotalLoading ? (
                <ActivityIndicator size="small" />
              ) : (
                <View className="w-20 h-20 rounded-full bg-cyan-600 items-center justify-center">
                  <Text className="text-3xl font-semibold text-white">
                    {activePackagesTotal}
                  </Text>
                </View>
              )}
            </Pressable>
          )}
        </View>

        {isTrainer ? (
          <>
            <Text className="text-2xl font-bold text-slate-800 mb-4 mx-5">
              Today&apos;s Sessions
            </Text>
            <View className="flex flex-row flex-wrap justify-between mx-5">
              {loadingTrainerSessions ? (
                <Text className="text-base text-slate-500">Loading...</Text>
              ) : todaySessions.length > 0 ? (
                todaySessions.map((item) => (
                  <TrainerSessionCard
                    key={item.schedule_id}
                    item={item}
                    onRefresh={refreshTrainerSessions}
                  />
                ))
              ) : (
                <Text className="text-base text-slate-500">
                  No sessions today
                </Text>
              )}
            </View>

            <Text className="text-2xl font-bold text-slate-800 mb-4 mx-5 mt-6">
              Past 7 Days
            </Text>
            <View className="flex flex-row flex-wrap justify-between mx-5">
              {loadingTrainerSessions ? (
                <Text className="text-base text-slate-500">Loading...</Text>
              ) : pastSessions.length > 0 ? (
                pastSessions.map((item) => (
                  <TrainerSessionCard
                    key={item.schedule_id}
                    item={item}
                    onRefresh={refreshTrainerSessions}
                  />
                ))
              ) : (
                <Text className="text-base text-slate-500">
                  No sessions in the past 7 days
                </Text>
              )}
            </View>
          </>
        ) : (
          <>
            <Text className="text-2xl font-bold text-slate-800 mb-4 mx-5">
              Ongoing Activity
            </Text>
            <View className="flex flex-row flex-wrap justify-between mx-5">
              {loadingBookings && membership.length === 0 ? (
                <Text className="text-base text-slate-500">Loading...</Text>
              ) : sortedOngoingBookings.length === 0 &&
                membership.length === 0 ? (
                <Text className="text-base text-slate-500">
                  No Ongoing Class
                </Text>
              ) : (
                <>
                  {sortedOngoingBookings.map((item) => (
                    <BookingCard
                      key={item.booking_id}
                      item={item}
                      showOngoingTag={true}
                    />
                  ))}

                  {membership.map((item) => (
                    <MembershipCard key={item.id} item={item} />
                  ))}
                </>
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
                <Text className="text-base text-slate-500">
                  No upcoming classes
                </Text>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default Home;
