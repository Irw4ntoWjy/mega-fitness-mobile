import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

type Props = {
  onNext: () => void;
  onBack?: () => void;
  backDisabled?: boolean;
  nextDisabled?: boolean;
  isLastStep?: boolean;
};

export default function BottomNavbar({
  onNext,
  onBack,
  backDisabled = false,
  nextDisabled = false,
  isLastStep = false,
}: Props) {
  return (
    <View className="absolute bottom-5 left-0 right-0 px-4 py-4">
      <View className="flex-row items-center justify-between">
        {/* BACK BUTTON */}
        {onBack ? (
          <Pressable
            onPress={onBack}
            disabled={backDisabled}
            className="w-1/3 h-14 flex-row items-center justify-center rounded-2xl border border-gray-300"
          >
            <ChevronLeft size={20} color="#000" />
            <Text className="ml-1">Back</Text>
          </Pressable>
        ) : (
          <View className="w-1/3" />
        )}

        {/* NEXT / SUBMIT BUTTON */}
        <Pressable
          onPress={onNext}
          disabled={nextDisabled}
          className={`w-1/3 h-14 flex-row items-center justify-center rounded-2xl ${
            nextDisabled ? "bg-gray-300" : "bg-[#30B8C4]"
          }`}
        >
          <Text className="font-semibold text-white">
            {isLastStep ? "Submit" : "Next"}
          </Text>
          {!isLastStep && <ChevronRight size={20} color="#fff" />}
        </Pressable>
      </View>
    </View>
  );
}
