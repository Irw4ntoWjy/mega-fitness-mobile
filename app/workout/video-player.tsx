import { useVideoPlayer, VideoView } from "expo-video";
import { Clock, Layers, Repeat, X } from "lucide-react-native";
import { Modal, Pressable, Text, View } from "react-native";
import { Exercise } from "./workout-accordian";

interface Props {
  exercise: Exercise;
  visible: boolean;
  onClose: () => void;
  url: string;
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function PopupVideoPlayer({ exercise, visible, onClose, url }: Props) {
  const player = useVideoPlayer(url, (player) => {
    player.loop = false;
    player.play();
  });

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 24,
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <View className="bg-white rounded-2xl w-full p-4 gap-3">
          {/* Title + Close */}
          <View className="flex flex-row gap-2 justify-between items-center">
            <Text className="text-2xl font-medium tracking-wide">
              {exercise.name}
            </Text>

            <Pressable
              onPress={onClose}
              className="w-8 h-8 rounded-md bg-gray-100 items-center justify-center"
            >
              <X size={22} color="black" />
            </Pressable>
          </View>

          <View className="bg-gray-200 rounded-xl px-3 pt-4">
            <View className="flex-row bg-gray-100 p-2 rounded-xl">
              {/* Sets */}
              <View className="flex-1 items-center border-r border-gray-200">
                <View className="flex-row gap-1 items-center">
                  <Layers size={12} />
                  <Text className="text-base text-gray-500">Sets</Text>
                </View>
                <Text className="text-2xl font-semibold">{exercise.sets}</Text>
              </View>

              {/* Reps */}
              <View className="flex-1 items-center border-r border-gray-200">
                <View className="flex-row gap-1 items-center">
                  <Repeat size={12} />
                  <Text className="text-base text-gray-500">Reps</Text>
                </View>
                <Text className="text-2xl font-semibold">{exercise.reps}</Text>
              </View>

              {/* Duration */}
              <View className="flex-1 items-center">
                <View className="flex-row gap-1 items-center">
                  <Clock size={12} />
                  <Text className="text-base text-gray-500">Duration</Text>
                </View>
                <Text className="text-2xl font-semibold">
                  {formatDuration(exercise.duration)}
                </Text>
              </View>
            </View>

            <VideoView
              style={{
                width: "100%",
                height: 240,
                borderRadius: 16,
                marginTop: 8,
              }}
              player={player}
              nativeControls
              allowsFullscreen
              allowsPictureInPicture
              contentFit="contain"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
