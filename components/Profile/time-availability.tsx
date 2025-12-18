import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

type DayKey = string;

export type TimeSlot = {
  id: string;
  label: string;
};

export type TimeAvailabilityData = {
  days: { key: DayKey; label: string }[];
  slotsByDay: Record<DayKey, TimeSlot[]>;
};

type TimeAvailabilitySectionProps = {
  data: TimeAvailabilityData;
  defaultDayKey?: DayKey;
};

export function TimeAvailabilitySection({
  data,
  defaultDayKey,
}: TimeAvailabilitySectionProps) {
  const [selectedDay, setSelectedDay] = useState<DayKey>(
    defaultDayKey ?? data.days[0]?.key
  );

  const slots = data.slotsByDay[selectedDay] ?? [];
  const selectedDayLabel =
    data.days.find((d) => d.key === selectedDay)?.label ?? selectedDay;

  return (
    <View className="my-5">
      <Text className="text-gray-900 text-lg font-semibold mb-3">
        Time Availability
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 2, paddingBottom: 6 }}
      >
        {data.days.map((day) => {
          const isActive = day.key === selectedDay;
          return (
            <Pressable
              key={day.key}
              onPress={() => setSelectedDay(day.key)}
              className={`px-4 py-2 rounded-full border mr-2 ${
                isActive
                  ? "bg-[#0EA5B7] border-[#0EA5B7]"
                  : "bg-white border-gray-300"
              }`}
            >
              <Text
                className={`text-md font-semibold ${
                  isActive ? "text-white" : "text-gray-700"
                }`}
              >
                {day.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View className="mt-2 bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
        <Text className="text-gray-900 text-lg font-semibold mb-3">
          {selectedDayLabel}
        </Text>

        {slots.length === 0 ? (
          <Text className="text-gray-400 text-md">
            No time availability for this day.
          </Text>
        ) : (
          <View className="flex-row flex-wrap justify-between">
            {slots.map((slot) => (
              <View
                key={slot.id}
                className="px-3 py-2 rounded-lg bg-white border border-gray-300 mb-2 w-48"
              >
                <Text className="text-gray-800 text-center text-md font-medium">
                  {slot.label}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}
