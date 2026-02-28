import { ChevronRight } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

type Props = {
  onNext: () => void;
  backDisabled?: boolean;
  nextDisabled?: boolean;
};

export default function BottomNavbar({ onNext, nextDisabled = false }: Props) {
  return (
    <View className="absolute bottom-5 left-0 right-0 px-4 py-4 ">
      <View className="flex-row items-center gap-3 justify-end">
        <Pressable
          onPress={onNext}
          disabled={nextDisabled}
          className="w-1/3 h-14 flex-row items-center justify-center rounded-2xl bg-[#30B8C4]"
        >
          <Text className="font-semibold text-[#fff]">Next</Text>
          <ChevronRight size={20} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}
