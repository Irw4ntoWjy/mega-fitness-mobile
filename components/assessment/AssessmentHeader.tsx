import { Text, View } from "react-native";

type Props = {
  currentStep: number;
  totalSteps: number;
  sectionLabel: string;
  title: string;
  subtitle?: string;
};

export default function AssessmentHeader({
  currentStep,
  totalSteps,
  sectionLabel,
  title,
  subtitle,
}: Props) {
  const progressPercentage = (currentStep / totalSteps) * 100;
  return (
    <View className="px-8">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-xs text-gray-600">
          STEP {currentStep} / {totalSteps}
        </Text>
        <View className="border border-[#30B8C4] px-4 py-1 rounded-full">
          <Text className="text-xs font-semibold tracking-widest text-[#30B8C4]">
            {sectionLabel}
          </Text>
        </View>
      </View>

      <View
        style={{
          width: "100%",
          height: 8,
          backgroundColor: "#e5e7eb",
          borderRadius: 999,
          overflow: "hidden",
          marginBottom: 24,
        }}
      >
        <View
          style={{
            width: `${progressPercentage}%`,
            height: "100%",
            backgroundColor: "#30B8C4",
          }}
        />
      </View>

      <Text className="text-2xl font-bold text-center">{title}</Text>

      {subtitle && (
        <Text className="text-center text-gray-500 mt-1 mb-3">{subtitle}</Text>
      )}
    </View>
  );
}
