import { Text, View } from "react-native";

export default function QuestionNumber({ index }: { index: number }) {
  return (
    <View className="w-8 h-8 rounded-full bg-cyan-100 items-center justify-center mr-3">
      <Text className="text-cyan-700 font-semibold">{index}</Text>
    </View>
  );
}
