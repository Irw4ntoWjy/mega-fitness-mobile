import { BackgroundGlow } from "@/components/Theme/background";
import { useToast } from "@/components/Toast/toast-provider";
import MemberActionList from "@/components/Trainer/member-action-list";
import { useAuth } from "@/hooks/useAuth";
import { BookingSchema } from "@/type/bookings";
import { TrainerMember } from "@/type/session-log";
import { router } from "expo-router";
import { Clock, Contact, UserIcon, X } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  Animated,
  FlatList,
  Image,
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { checkAssessment } from "../api/assessment";
import { cancelBooking, getBookingList } from "../api/booking";
import { getTrainerMembers } from "../api/session-log";
import AddBookingModal from "../bookings/add-bookings";

type TabKey = "Upcoming" | "Completed" | "Cancelled";
const TABS: TabKey[] = ["Upcoming", "Completed", "Cancelled"];

const TAB_STATUS_MAP: Record<TabKey, number[]> = {
  Upcoming: [3, 4],
  Completed: [2],
  Cancelled: [1],
};

function TabPill({
  label,
  active,
  onPress,
}: {
  label: TabKey;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={[
        "flex-1 items-center justify-center rounded-xl py-2",
        active ? "bg-[#0891B2]" : "bg-transparent",
      ].join(" ")}
    >
      <Text
        className={[
          "text-md font-semibold",
          active ? "text-white" : "text-slate-600",
        ].join(" ")}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function BookingCard({ item, onCancel, showCancel }: any) {
  const renderRightActions = (_progress: any, _dragX: any) => {
    if (!showCancel) return null;
    return (
      <Pressable
        onPress={onCancel}
        className="justify-center items-center w-15 mb-4 bg-red-500 rounded-2xl ml-2"
      >
        <X size={24} color="white" />
      </Pressable>
    );
  };

  return (
    <ReanimatedSwipeable
      renderRightActions={showCancel ? renderRightActions : undefined}
      friction={1}
    >
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/classes/[id]/detail",
            params: { id: item.id },
          })
        }
      >
        <Animated.View pointerEvents="box-none">
          <View className="mb-4 rounded-2xl bg-white p-3 shadow-md">
            <View className="flex-row justify-between px-2">
              <Text className="text-slate-500 text-lg">
                {item.schedule_date}
              </Text>
              <Text className="text-slate-400 text-lg">{item.location}</Text>
            </View>

            <View className="mt-2 flex-row">
              {item.package_cover_image ? (
                <Image
                  source={{
                    uri: `${process.env.EXPO_PUBLIC_URL}${item.package_cover_image}`,
                  }}
                  className="h-24 w-24 rounded-xl"
                  resizeMode="cover"
                />
              ) : (
                <View className="h-24 w-24 rounded-xl bg-black" />
              )}

              <View className="ml-3 flex-1">
                <Text className="text-lg font-bold text-slate-900">
                  {item.product_name}
                </Text>

                <View className="mt-7 space-y-1">
                  <View className="flex-row items-center">
                    <Clock size={12} color="#111827" />
                    <Text className="ml-1.5 font-semibold text-slate-900">
                      {item.time_start} - {item.time_end}
                    </Text>
                  </View>

                  <View className="flex-row items-center">
                    <UserIcon size={12} color="#111827" />
                    <Text className="ml-1.5 font-semibold text-slate-900">
                      {item.trainer_name ?? "-"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>
      </Pressable>
    </ReanimatedSwipeable>
  );
}

function CancelModal({
  visible,
  booking,
  onClose,
  onConfirm,
}: {
  visible: boolean;
  booking: BookingSchema | null;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!booking) return null;
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 24,
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <TouchableWithoutFeedback onPress={() => {}}>
            <View className="w-full max-w-[420px] bg-white rounded-[26px] px-6 pt-6 pb-5">
              <View className="flex flex-row justify-between items-center">
                <Text className="text-xl text-gray-900 mt-2">
                  Are you sure you want to{" "}
                  <Text className="font-semibold">cancel?</Text>
                </Text>
                <Pressable
                  onPress={onClose}
                  className="w-8 h-8 rounded-md bg-gray-100 items-center justify-center ml-auto"
                >
                  <X size={22} color="#fff" />
                </Pressable>
              </View>

              <View className="mt-4">
                <Text className="font-bold text-xl text-gray-900">
                  {booking.product_name}
                </Text>

                <Text className="font-bold text-xl text-gray-900">
                  {booking.schedule_date}
                </Text>

                <View className="mt-2 flex-row items-center gap-3">
                  <Clock size={22} color="#111" />
                  <Text className="text-xl text-gray-900">
                    {booking.time_start} - {booking.time_end}
                  </Text>
                </View>

                <View className="mt-1 flex-row items-center gap-3">
                  <Contact size={22} color="#111" />
                  <Text className="text-xl text-gray-900">
                    {booking.trainer_name ?? "-"}
                  </Text>
                </View>

                <TextInput
                  placeholder="Masukkan Alasan Batal"
                  placeholderTextColor="#6b7280"
                  className="mt-4 border border-gray-300 rounded-xl p-3 text-gray-900"
                  textAlignVertical="top"
                />
              </View>

              <Text className="mt-8 text-md font-bold text-red-600 text-center">
                This action can’t be undone!
              </Text>

              <View className="mt-4 flex-row gap-4">
                <Pressable
                  onPress={onClose}
                  className="flex-1 h-12 rounded-xl border border-black items-center justify-center"
                >
                  <Text className="text-xl font-semibold text-black">Back</Text>
                </Pressable>

                <Pressable
                  onPress={onConfirm}
                  className="flex-1 h-12 rounded-xl bg-red-600 items-center justify-center"
                >
                  <Text className="text-xl font-semibold text-white">
                    Cancel
                  </Text>
                </Pressable>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

export default function Bookings() {
  const [tab, setTab] = useState<TabKey>("Upcoming");
  const { auth, loading: loadingAuth } = useAuth();
  const [data, setData] = useState<BookingSchema[]>([]);
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<TrainerMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const fetchBookings = async () => {
    const profileId = auth?.accountDetail?.profile_id;
    if (!profileId) return;

    try {
      setLoading(true);
      const res = await getBookingList({
        member_profile_id: profileId,
        is_not_expired: true,
      });
      const data = res.data;
      if (data) setData(data.data ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loadingAuth) return;
    fetchBookings();
  }, [loadingAuth, auth]);

  useEffect(() => {
    if (auth?.accountDetail?.account_role !== "Trainer") return;
    if (!auth?.accountDetail?.profile_id) return;
    setLoadingMembers(true);
    getTrainerMembers({ trainer_profile_id: auth.accountDetail.profile_id })
      .then((res) => {
        setMembers(res.data ?? []);
      })
      .catch(() => setMembers([]))
      .finally(() => setLoadingMembers(false));
  }, [auth?.accountDetail?.account_role, auth?.accountDetail?.profile_id]);

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      TAB_STATUS_MAP[tab].includes(item.booking_status_id),
    );
  }, [data, tab]);
  console.log("filteredData", filteredData);
  const [open, setOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingSchema | null>(
    null,
  );

  const [openAddBooking, setOpenAddBooking] = useState(false);

  const handleAddBooking = async () => {
    const profileId = auth?.accountDetail?.profile_id;
    if (!profileId) return;

    try {
      const checkAssessmentRes = await checkAssessment({
        profile_id: profileId,
      });

      if (!checkAssessmentRes.data?.done_assessment) {
        router.push("/assessment/detail");
        showToast({
          message: "Assessment section 1 & 2 required before booking",
          variant: "error",
          duration: 2500,
        });
        return;
      }

      setOpenAddBooking(true);
    } catch (err) {
      console.error(err);
      showToast({
        message: "Failed to check assessment",
        variant: "error",
        duration: 2500,
      });
    }
  };
  const handleOpenCancel = (booking: BookingSchema) => {
    setSelectedBooking(booking);
    setOpen(true);
  };

  const [loadingCancel, setLoadingCancel] = useState(false);
  const { showToast } = useToast();
  const handleConfirmCancel = async () => {
    if (!selectedBooking) return;

    try {
      setLoadingCancel(true);

      const res = await cancelBooking({
        booking_id: selectedBooking.booking_id,
      });
      showToast({
        message: res.message,
        variant: res.success === true ? "success" : "error",
        duration: 2500,
      });

      await fetchBookings();

      setOpen(false);
      setSelectedBooking(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCancel(false);
    }
  };

  if (loadingAuth) return null;

  if (auth?.accountDetail?.account_role === "Trainer") {
    return (
      <MemberActionList
        title="ASSESSMENT"
        subtitle="Pilih member yang pernah kamu ajar untuk membuka assessment mereka."
        emptyLabel={
          loadingMembers ? "Loading..." : "Belum ada member yang tersedia."
        }
        members={members.map((m) => ({
          id: m.member_profile_id,
          code: m.member_account_code,
          name: m.member_name,
        }))}
        onSelectMember={(memberItem) => {
          if (isNavigating) return;
          setIsNavigating(true);
          router.push({
            pathname: "/assessment/detail",
            params: {
              memberId: memberItem.id,
              memberName: memberItem.name,
            },
          });

          setTimeout(() => setIsNavigating(false), 1000);
        }}
      />
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1 mb-20">
        <BackgroundGlow showText={true} />

        <View className="mx-3 mt-20">
          <View className="mt-4 flex-row items-center justify-between">
            <Text className="text-3xl font-extrabold tracking-wide text-slate-900">
              BOOKINGS
            </Text>

            <Pressable onPress={handleAddBooking}>
              <Text className="underline">ADD BOOKINGS</Text>
            </Pressable>
          </View>

          {/* Tabs */}
          <View className="mt-4 flex-row rounded-2xl bg-white px-1 py-1">
            {TABS.map((t) => (
              <TabPill
                key={t}
                label={t}
                active={tab === t}
                onPress={() => setTab(t)}
              />
            ))}
          </View>
        </View>

        <View className="flex-1 px-4 pt-3">
          <FlatList
            key={tab}
            data={filteredData}
            keyExtractor={(i) => String(i.booking_id)}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
            renderItem={({ item }) => (
              <BookingCard
                item={item}
                showCancel={tab === "Upcoming"}
                onCancel={() => handleOpenCancel(item)}
              />
            )}
            ListEmptyComponent={
              <View className="mt-10 items-center">
                <Text className="text-sm text-slate-500">
                  No {tab.toLowerCase()} bookings.
                </Text>
              </View>
            }
          />
        </View>

        <CancelModal
          visible={open}
          booking={selectedBooking}
          onClose={() => {
            setOpen(false);
            setSelectedBooking(null);
          }}
          onConfirm={handleConfirmCancel}
        />

        <AddBookingModal
          visible={openAddBooking}
          onClose={() => setOpenAddBooking(false)}
          onSuccess={() => fetchBookings()}
        />
      </View>
    </GestureHandlerRootView>
  );
}
