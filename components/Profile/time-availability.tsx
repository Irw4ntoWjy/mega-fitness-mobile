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
    <View className="mt-4">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="-mx-1"
        contentContainerStyle={{ paddingHorizontal: 2 }}
      >
        {data.days.map((day) => {
          const isActive = day.key === selectedDay;
          return (
            <Pressable
              key={day.key}
              onPress={() => setSelectedDay(day.key)}
              className={`px-4 py-2 rounded-full border mx-1 ${
                isActive
                  ? "bg-[#0891B2] border-[#0891B2]"
                  : "bg-transparent border-black/15"
              }`}
            >
              <Text
                className={`text-sm font-semibold ${
                  isActive ? "text-white" : "text-gray-700"
                }`}
              >
                {day.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View className="mt-4 bg-white rounded-3xl border border-[#E0D5F2] p-4 shadow-sm">
        <Text className="text-gray-900 text-base font-semibold mb-3">
          {selectedDayLabel}
        </Text>

        {slots.length === 0 ? (
          <Text className="text-gray-400 text-sm">
            No time availability for this day.
          </Text>
        ) : (
          <View className="-mx-1 flex-row flex-wrap">
            {slots.map((slot) => (
              <View
                key={slot.id}
                className="px-3 py-2 rounded-xl bg-[#F3F4F6] mx-1 mb-2"
              >
                <Text className="text-gray-800 text-xs font-medium">
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
