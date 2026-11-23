import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  onNext: () => void;
  onBack?: () => void;
  backDisabled?: boolean;
  nextDisabled?: boolean;
  isLastStep?: boolean;
  hideNext?: boolean;
};

export default function BottomNavbar({
  onNext,
  onBack,
  backDisabled = false,
  nextDisabled = false,
  isLastStep = false,
  hideNext = false,
}: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View
      // in normal flow below the ScrollView; all in style since nativewind v5 drops className when style is set
      style={{
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: Math.max(insets.bottom, 20), // clear the phone's system nav bar
      }}
    >
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
        {hideNext ? (
          <View className="w-1/3" />
        ) : (
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
        )}
      </View>
    </View>
  );
}
