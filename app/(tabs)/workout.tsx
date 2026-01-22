import { BackgroundGlow } from "@/components/Theme/background";
import { Search, TriangleAlert } from "lucide-react-native";
import React from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { workoutTutorial } from "../workout/dummy_data";
import WorkoutAccordion from "../workout/workout-accordian";

const Workout = () => {
  const insets = useSafeAreaInsets();
  const getTotalTime = (activities: any[]) => {
    const totalSeconds = activities.reduce(
      (acc, curr) => acc + curr.duration,
      0,
    );
    return Math.round(totalSeconds / 60);
  };

  return (
    <View style={{ flex: 1 }}>
      <BackgroundGlow />
      <View className="mt-14 h-14 px-4 justify-center" />
      <View className="w-full flex-row items-center gap-3 px-6">
        <View className="flex-1 flex-row items-center bg-white rounded-full px-4 py-3 shadow">
          <Search size={18} color="#6b7280" />
          <TextInput
            placeholder="Search Workout"
            placeholderTextColor="#9ca3af"
            className="ml-2 flex-1 text-base text-gray-700"
          />
        </View>
      </View>

      <View className="flex-col items-start gap-2 mx-6 mt-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-xl">
        <View className="flex flex-row items-center gap-2 ">
          <TriangleAlert size={16} color={"#808080"}></TriangleAlert>
          <Text className="text-gray-500 tracking-wide">How to Use</Text>
        </View>
        <Text className="text-base tracking-wide">
          Tap any workout group to see exercises, then tap an exercise for a
          full video.
        </Text>
      </View>
      <View className="flex-1 mt-4">
        <ScrollView className="flex-1 px-6">
          <View className="gap-4">
            {workoutTutorial.map((program, index) => {
              const isLast = index === workoutTutorial.length - 1;

              return (
                <View key={program.group} className={isLast ? "mb-24" : ""}>
                  <WorkoutAccordion
                    title={program.group}
                    description="Workout Program"
                    exercises={program.activities}
                    totalTime={`${getTotalTime(program.activities)} min`}
                  />
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default Workout;
