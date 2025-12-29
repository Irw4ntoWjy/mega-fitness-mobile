import HeaderNavBar from "@/components/HeaderNavBar/header-nav-bar";
import { BackgroundGlow } from "@components/Theme/background";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import React, { useCallback, useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

export default function Profile() {
  const [selectedDate, setSelectedDate] = useState(new Date(2020, 10, 6));
  const [pickerOpen, setPickerOpen] = useState(false);
  const [firstEventHeight, setFirstEventHeight] = useState<number | null>(null);
  const [eventsHeight, setEventsHeight] = useState<number | null>(null);

  const { day, monthLabel, year } = useMemo(() => {
    const formatter = new Intl.DateTimeFormat("en", { month: "long" });
    return {
      day: selectedDate.getDate(),
      monthLabel: formatter.format(selectedDate),
      year: selectedDate.getFullYear(),
    };
  }, [selectedDate]);

  const months = useMemo(
    () => [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    []
  );

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(monthIndex);
    setSelectedDate(newDate);
    setPickerOpen(false);
  };

  const changeYear = useCallback(
    (delta: number) => {
      const newDate = new Date(selectedDate);
      newDate.setFullYear(selectedDate.getFullYear() + delta);
      setSelectedDate(newDate);
    },
    [selectedDate]
  );

  // const events = useMemo(
  //   () => [
  //     {
  //       day: "01",
  //       month: "November",
  //       title: "CAMPFIRE",
  //       coach: "Michael Sugeh",
  //       time: "03.00 PM - 04.00 PM",
  //       duration: "60 min",
  //       status: "Completed",
  //       color: "#0E8BAA",
  //     },
  //     {
  //       day: "01",
  //       month: "November",
  //       title: "CAMPFIRE",
  //       coach: "Kita Aznah",
  //       time: "03.00 PM - 04.00 PM",
  //       duration: "60 min",
  //       status: "Completed",
  //       color: "#C98F52",
  //     },
  //     {
  //       day: "03",
  //       month: "November",
  //       title: "CAMPFIRE",
  //       coach: "Michael Sugeh",
  //       time: "03.00 PM - 04.00 PM",
  //       duration: "60 min",
  //       status: "Completed",
  //       color: "#0E8BAA",
  //     },
  //     {
  //       day: "07",
  //       month: "November",
  //       title: "CAMPFIRE",
  //       coach: "Michael Sugeh",
  //       time: "03.00 PM - 04.00 PM",
  //       duration: "60 min",
  //       status: "Completed",
  //       color: "#0E8BAA",
  //     },
  //     {
  //       day: "12",
  //       month: "November",
  //       title: "CAMPFIRE",
  //       coach: "Michael Sugeh",
  //       time: "03.00 PM - 04.00 PM",
  //       duration: "60 min",
  //       status: "Completed",
  //       color: "#C98F52",
  //     },
  //   ],
  //   []
  // );

  return (
    <View className="flex-1">
      <BackgroundGlow />
      <HeaderNavBar backOnly title="History" />

      <View className="my-2 gap-4">
        <Pressable
          className="mx-6 bg-white shadow-neutral-400/50 shadow-sm rounded-2xl p-4"
          onPress={() => setPickerOpen(true)}
        >
          <View className="flex-row items-center justify-between">
            <View className="w-10 h-10 rounded-full bg-gray-300 items-center justify-center">
              <Text className="text-2xl font-semibold text-white">{day}</Text>
            </View>

            <View className="items-end">
              <Text className="font-semibold text-2xl uppercase text-gray-800">
                {monthLabel}
              </Text>
              <Text className="text-lg text-gray-800">{year}</Text>
            </View>
          </View>
        </Pressable>
        <Modal
          animationType="fade"
          visible={pickerOpen}
          transparent
          onRequestClose={() => setPickerOpen(false)}
        >
          <Pressable
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
            onPress={() => setPickerOpen(false)}
          >
            <Pressable className="w-6/8 bg-white shadow-neutral-400/50 shadow-sm rounded-4xl pb-6">
              <View className="flex-row items-center justify-between mb-4 px-6 py-4">
                <Pressable onPress={() => changeYear(-1)} className="p-2">
                  <ChevronLeft size={24} color="black" />
                </Pressable>
                <Text className="text-xl font-bold text-black">{year}</Text>
                <Pressable onPress={() => changeYear(1)} className="p-2">
                  <ChevronRight size={24} color="black" />
                </Pressable>
              </View>

              <View className="flex-row flex-wrap -mx-1">
                {months.map((m, idx) => {
                  const isSelected = idx === selectedDate.getMonth();
                  return (
                    <Pressable
                      key={m}
                      onPress={() => handleMonthSelect(idx)}
                      className="w-1/3 px-6 mb-2"
                    >
                      <View
                        className={`rounded-lg py-3 items-center ${
                          isSelected ? "bg-cyan-600" : "bg-white"
                        }`}
                      >
                        <Text
                          className={`text-xl font-semibold ${
                            isSelected ? "text-white" : "text-gray-400"
                          }`}
                        >
                          {m}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </Pressable>
          </Pressable>
        </Modal>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="bg-white rounded-2xl px-8 py-6">
            <View className="flex-row justify-between">
              <View
                style={
                  firstEventHeight
                    ? {
                        height: firstEventHeight,
                        justifyContent: "center",
                      }
                    : { justifyContent: "center" }
                }
              >
                <Text className="text-4xl font-bold text-gray-900 text-center">
                  {day}
                </Text>
                <Text className="text-xl text-gray-500 text-center">
                  {monthLabel}
                </Text>
              </View>
              <View
                style={{
                  marginHorizontal: 12,
                  alignItems: "center",
                  justifyContent: "center",
                  height: eventsHeight ?? undefined,
                  alignSelf: "stretch",
                  position: "relative",
                }}
              >
                <View
                  style={{
                    alignSelf: "stretch",
                    minHeight: eventsHeight,
                    borderLeftWidth: 3,
                    borderColor: "#D1D5DB",
                  }}
                />
                {firstEventHeight ? (
                  <View
                    style={{
                      position: "absolute",
                      top: (firstEventHeight ?? 0) / 2,
                      width: 14,
                      height: 14,
                      borderRadius: 7,
                      backgroundColor: "#fff",
                      borderWidth: 2,
                      borderColor: "#9CA3AF",
                    }}
                  />
                ) : null}
              </View>

              <View
                className="flex-col gap-4"
                onLayout={(e) => setEventsHeight(e.nativeEvent.layout.height)}
              >
                <View
                  className="rounded-2xl p-4 shadow-sm bg-amber-300"
                  onLayout={(e) => {
                    if (!firstEventHeight) {
                      setFirstEventHeight(e.nativeEvent.layout.height);
                    }
                  }}
                >
                  <View className="flex-row justify-between items-center">
                    <View className="max-w-2/3">
                      <Text className=" text-white font-extrabold text-lg uppercase">
                        test eventttttttttttttttttttttttttttttttttttttt
                      </Text>
                      <View className="flex-row gap-10">
                        <Text className="text-white/90 text-sm">
                          Test Coach
                        </Text>
                        <Text className="text-white text-sm font-semibold ml-auto">
                          09.00 AM - 10.00 AM
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View className="rounded-2xl p-4 shadow-sm bg-amber-300">
                  <View className="flex-row justify-between items-center">
                    <View className="max-w-2/3">
                      <Text className=" text-white font-extrabold text-lg uppercase">
                        test eventttttttttttttttttttttttttttttttttttttt
                      </Text>
                      <View className="flex-row gap-10">
                        <Text className="text-white/90 text-sm">
                          Test Coach
                        </Text>
                        <Text className="text-white text-sm font-semibold ml-auto">
                          09.00 AM - 10.00 AM
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
