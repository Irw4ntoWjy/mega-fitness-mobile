import { ChevronDown, ChevronUp, Clock, Play } from "lucide-react-native";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { PopupVideoPlayer } from "./video-player";

export type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: number;
  duration: number;
  videoUrl: string;
};

type Props = {
  title: string;
  description: string;
  exercises: Exercise[];
  totalTime: string;
};

export default function WorkoutAccordion({
  title,
  description,
  exercises,
  totalTime,
}: Props) {
  const [open, setOpen] = useState(false);
  const [openPlayer, setOpenPlayer] = useState(false);
  const [activity, setActivity] = useState<Exercise>();

  return (
    <View className="rounded-2xl bg-gray-100">
      <Pressable
        className="p-4 rounded-2xl bg-[#DAA770]"
        onPress={() => setOpen(!open)}
      >
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-white font-bold text-lg">{title}</Text>
            <Text className="text-white/80">{description}</Text>

            <View className="flex-row gap-3 mt-2">
              <Text className="text-white/90">
                {exercises.length} exercises
              </Text>
              <Text className="text-white/90">{totalTime}</Text>
            </View>
          </View>

          {open ? (
            <ChevronUp color="white" size={22} />
          ) : (
            <ChevronDown color="white" size={22} />
          )}
        </View>
      </Pressable>

      {open && (
        <View className="p-4 gap-3">
          {exercises.map((item, index) => (
            <View key={item.id}>
              <Pressable
                onPress={() => {
                  setOpenPlayer(true);
                  setActivity(item);
                }}
                className="flex flex-row justify-between items-center bg-gray-50 rounded-xl p-3 shadow"
              >
                <View className="flex-row items-center gap-3">
                  <View className="w-6 h-6 rounded-full bg-cyan-600 items-center justify-center">
                    <Text className="text-white text-xs font-bold">
                      {index + 1}
                    </Text>
                  </View>

                  <View>
                    <Text className="text-black font-semibold">
                      {item.name}
                    </Text>
                    <View className="flex flex-row gap-2 items-center ">
                      <Clock size={10} />
                      <Text className="text-black/70 text-xs">
                        {item.duration} Seconds
                      </Text>
                    </View>
                  </View>
                </View>
                <View className="rounded-full ml-0 bg-cyan-600/[0.10] p-2">
                  <Play size={14} color="#0891B2" />
                </View>
              </Pressable>
            </View>
          ))}
        </View>
      )}
      {activity && (
        <PopupVideoPlayer
          exercise={activity}
          visible={openPlayer}
          onClose={() => setOpenPlayer(false)}
          url="http://164.152.166.4:9100/assets/vid/251108093243_4954949-hd_1920_1080_25fps.mp4"
        />
      )}
    </View>
  );
}
