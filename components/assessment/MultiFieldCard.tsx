import { Text, TextInput, View } from "react-native";

type Field = {
  label: string;
  key: string;
  unit?: string;
};

type Props = {
  title: string;
  baseKey: string;
  fields: Field[];
  answers: Record<string, any>;
  setAnswers: React.Dispatch<React.SetStateAction<any>>;
  isEditMode: boolean;
  isTrainerReadOnlySection: boolean;
};

export default function MultiFieldCard({
  title,
  baseKey,
  fields,
  answers,
  setAnswers,
  isEditMode,
  isTrainerReadOnlySection,
}: Props) {
  return (
    <View
      className={
        !isEditMode || isTrainerReadOnlySection
          ? "bg-gray-100 rounded-4xl p-4 mb-4 border-gray-600/50 border"
          : "bg-white rounded-4xl p-4 mb-4 shadow-sm"
      }
    >
      <View className="flex-row">
        <View className="flex-1 px-4">
          <Text className="font-semibold mb-3">{title}</Text>

          <View className="flex-row flex-wrap justify-between">
            {fields.map((f) => {
              const fieldKey = `${baseKey}-${f.key}`;
              const value = answers[fieldKey]?.value || "";

              return (
                <View key={f.key} className="w-[48%] mb-3">
                  <Text className="mb-1">{f.label}</Text>

                  <TextInput
                    value={value}
                    editable={isEditMode && !isTrainerReadOnlySection}
                    onChangeText={(text) => {
                      setAnswers((prev: any) => ({
                        ...prev,
                        [fieldKey]: {
                          type: "TEXT",
                          value: text,
                        },
                      }));
                    }}
                    className="border border-gray-300 rounded-lg px-3 py-2"
                  />
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}
