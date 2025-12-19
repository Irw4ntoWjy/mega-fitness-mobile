// Bookings.tsx
import { BackgroundGlow } from "@/components/Theme/background";
import { router } from "expo-router";
import { ArrowLeft, Clock, Contact, X } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
    FlatList,
    Image,
    Modal,
    Pressable,
    Text,
    TouchableWithoutFeedback,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
            android_ripple={{ color: "rgba(0,0,0,0.08)", borderless: false }}
        >
            <Text
                className={[
                    "text-sm font-semibold",
                    active ? "text-white" : "text-slate-600",
                ].join(" ")}
            >
                {label}
            </Text>
        </Pressable>
    );
}

function BookingCard({
    item,
    onCancel,
    showCancel,
}: {
    item: Booking;
    onCancel: () => void;
    showCancel: boolean;
}) {
    return (
        <View className="mb-4">

            <View className="rounded-2xl bg-white p-3 shadow-sm">
                <View className="flex-row items-center justify-between px-2">
                    <Text className="text-xs text-slate-500">{item.date}</Text>
                    <Text className="text-[10px] text-slate-400">{item.location}</Text>
                </View>

                <View className="mt-2 flex-row">
                    <Image
                        source={{ uri: item.image }}
                        className="h-18 w-18 rounded-xl"
                        resizeMode="cover"
                    />

                    <View className="ml-3 flex-1">
                        <Text className="text-base font-extrabold tracking-wide text-slate-900">
                            {item.title}
                        </Text>
                        <View className="mt-1 flex-row items-center gap-3">
                            <Clock size={14} color="#111" />
                            <Text className="text-[8px] text-zinc-900">
                                {item.time}
                            </Text>
                        </View>

                        <View className="mt-1 flex-row items-center gap-3">
                            <Contact size={14} color="#111" />
                            <Text className="text-[8px] text-zinc-900">
                                {item.instructor}
                            </Text>
                        </View>
                    </View>

                    <View className="ml-2 items-end justify-center">
                        <Pressable
                            onPress={() =>
                                    router.push({
                                    pathname: "/classes/[id]/detail",
                                    params: { id: item.id },
                                    })
                                }
                            className="w-[92px] items-center justify-center rounded-md bg-[#DAA770] px-3 py-2"
                        >
                            <Text className="text-xs font-bold text-white">
                                See Details
                            </Text>
                        </Pressable>

                        {showCancel && (
                            <Pressable
                                onPress={onCancel}
                                className="mt-2 w-[92px] items-center justify-center rounded-md bg-[#FF2D55] px-3 py-2"
                            >
                                <Text className="text-xs font-bold text-white">Cancel</Text>
                            </Pressable>
                        )}
                    </View>
                </View>
            </View>
        </View>
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
        <View className="flex-1 items-center justify-center px-4">
          <View className="absolute inset-0 bg-zinc-900/40" />
          <TouchableWithoutFeedback onPress={() => {}}>
            <View className="w-full max-w-[420px] bg-white rounded-[26px] px-6 pt-6 pb-5">
              <Pressable
                onPress={onClose}
                className="absolute right-4 top-4 h-11 w-11 rounded-xl bg-zinc-300 items-center justify-center"
              >
                <X size={22} color="#fff" />
              </Pressable>

              <Text className="text-[28px] leading-8 text-zinc-900 mt-6">
                Are you sure you want to{"\n"}
                <Text className="font-bold">cancel?</Text>
              </Text>

              <View className="mt-8">
                <Text className="text-[28px] font-bold text-zinc-900">
                  {booking.title}
                </Text>

                <Text className="mt-3 text-[18px] font-medium text-zinc-900">
                  {booking.date}
                </Text>

                <View className="mt-4 flex-row items-center gap-3">
                  <Clock size={22} color="#111" />
                  <Text className="text-[16px] text-zinc-900">
                    {booking.time}
                  </Text>
                </View>

                <View className="mt-3 flex-row items-center gap-3">
                  <Contact size={22} color="#111" />
                  <Text className="text-[16px] text-zinc-900">
                    {booking.instructor}
                  </Text>
                </View>
              </View>

              <Text className="mt-8 text-center text-[16px] font-semibold text-[#E11D48]">
                This action can’t be undone!
              </Text>

              <View className="mt-4 flex-row gap-4">
                <Pressable
                  onPress={onClose}
                  className="flex-1 h-16 rounded-2xl border border-black items-center justify-center"
                >
                  <Text className="text-[18px] font-bold text-black">
                    Back
                  </Text>
                </Pressable>

                <Pressable
                  onPress={onConfirm}
                  className="flex-1 h-16 rounded-2xl bg-[#E11D48] items-center justify-center"
                >
                  <Text className="text-[18px] font-bold text-white">
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
    const data = useMemo(
        () => list.filter((b) => b.status === tab),
        [list, tab]
    );

        
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
        b.id === selectedBooking.id ? { ...b, status: "Cancelled" } : b
        )
    );

    setOpen(false);
    setSelectedBooking(null);
    };

    return (
        <SafeAreaView style={{ flex: 1 }} >

            <BackgroundGlow showText={true} />
            <View className="h-14 px-4 justify-center">
                <Pressable
                className="h-11 w-11 rounded-xl bg-zinc-300 items-center justify-center"
                onPress={() => router.back()}
                >
                <ArrowLeft size={22} color="#fff" />
                </Pressable>
            </View>

            <View className="mx-3">

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
      </SafeAreaView>
    );
}
