import { BackgroundGlow } from "@/components/Theme/background";
import { router } from "expo-router";
import { Clock, Contact, UserIcon, X } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  Animated,
  FlatList,
  Image,
  Modal,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { bookings } from "../bookings/dummy_data";

type TabKey = "Upcoming" | "Completed" | "Cancelled";
const TABS: TabKey[] = ["Upcoming", "Completed", "Cancelled"];

type Booking = (typeof bookings)[number];

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
              <Text className="text-slate-500 text-lg">{item.date}</Text>
              <Text className="text-slate-400 text-lg">{item.location}</Text>
            </View>

            <View className="mt-2 flex-row">
              <Image
                source={{ uri: item.image }}
                className="w-24 h-24 rounded-lg"
              />

              <View className="ml-3 flex-1">
                <Text className="text-lg font-bold text-slate-900">
                  {item.title}
                </Text>

                <View className="mt-7 space-y-1">
                  <View className="flex-row items-center">
                    <Clock size={12} color="#111827" />
                    <Text className="ml-1.5 font-semibold text-slate-900">
                      {item.time}
                    </Text>
                  </View>

                  <View className="flex-row items-center">
                    <UserIcon size={12} color="#111827" />
                    <Text className="ml-1.5 font-semibold text-slate-900">
                      {item.instructor}
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
  booking: Booking | null;
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

              <View className="mt-8">
                <Text className="font-bold text-xl text-gray-900">
                  {booking.title}
                </Text>

                <Text className="font-bold text-xl text-gray-900">
                  {booking.date}
                </Text>

                <View className="mt-2 flex-row items-center gap-3">
                  <Clock size={22} color="#111" />
                  <Text className="text-xl text-gray-900">{booking.time}</Text>
                </View>

                <View className="mt-1 flex-row items-center gap-3">
                  <Contact size={22} color="#111" />
                  <Text className="text-xl text-gray-900">
                    {booking.instructor}
                  </Text>
                </View>
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
  const [list, setList] = useState<Booking[]>(bookings);
  const data = useMemo(() => list.filter((b) => b.status === tab), [list, tab]);

  const [open, setOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const handleOpenCancel = (booking: Booking) => {
    setSelectedBooking(booking);
    setOpen(true);
  };

  const handleConfirmCancel = () => {
    if (!selectedBooking) return;

    setList((prev) =>
      prev.map((b) =>
        b.id === selectedBooking.id ? { ...b, status: "Cancelled" } : b,
      ),
    );

    setOpen(false);
    setSelectedBooking(null);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1">
        <BackgroundGlow showText={true} />

        <View className="mx-3 mt-20">
          <Text className="mt-4 text-3xl font-extrabold tracking-wide text-slate-900">
            BOOKINGS
          </Text>

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
            data={data}
            keyExtractor={(i) => String(i.id)}
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
      </View>
    </GestureHandlerRootView>
  );
}
