import { Check, X } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

type Props = {
  label: string;
  value: boolean;
  selected?: boolean;
  onPress: (value: boolean) => void;
};

export default function BooleanOption({
  label,
  value,
  selected,
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={() => onPress(value)}
      className="flex-row items-center gap-2"
    >
      <View
        className={`w-5 h-5 rounded-full border items-center justify-center ${
          selected
            ? value
              ? "border-cyan-600"
              : "border-red-500"
            : "border-gray-400"
        }`}
      >
        {selected &&
          (value ? (
            <Check size={14} color="#0891b2" />
          ) : (
            <X size={14} color="#ef4444" />
          ))}
      </View>

      <Text>{label}</Text>
    </Pressable>
  );
}
