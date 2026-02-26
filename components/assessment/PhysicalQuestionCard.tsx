import { AnswerValue, Question } from "@/type/assessments";
import { Text, TextInput, View } from "react-native";
import BooleanOption from "./BooleanOption";

type Props = {
  q: Question;
  index: number;
  value?: AnswerValue;
  setAnswer: (key: string, value: AnswerValue) => void;
};

export default function PhysicalQuestionCard({
  q,
  index,
  value,
  setAnswer,
}: Props) {
  const booleanValue = value?.value;
  const detailsValue = value?.detail;
  const textValue = value?.text;

  const updateBoolean = (v: boolean) => {
    if (q.type === "boolean" || "boolean_without_description") {
      setAnswer(q.key, { value: v });
    }
  };

  const updateDetail = (text: string) => {
    if (q.type === "boolean") {
      setAnswer(q.key, { detail: text });
    }
  };

  const updateText = (text: string) => {
    setAnswer(q.key, { text: text });
  };

  return (
    <View className="bg-white rounded-4xl p-4 mb-4 shadow-sm">
      <View className="flex-row">
        <View className="flex-1">
          <Text className="font-semibold text-md leading-6.8">{q.en}</Text>

          {q.id && (
            <Text className="text-gray-500 text-sm leading-6.5 mt-1 mb-3">
              {q.id}
            </Text>
          )}

          {q.type !== "text" ? (
            <>
              <View className="flex-row gap-6 mb-3">
                <BooleanOption
                  label="Ya"
                  value={true}
                  selected={booleanValue === true}
                  onPress={updateBoolean}
                />

                <BooleanOption
                  label="Tidak"
                  value={false}
                  selected={booleanValue === false}
                  onPress={updateBoolean}
                />
              </View>

              {booleanValue === true && q.type === "boolean" && (
                <TextInput
                  value={detailsValue}
                  onChangeText={updateDetail}
                  placeholder="Jelaskan lebih detail..."
                  placeholderTextColor="#6b7280"
                  multiline
                  className="border-b border-gray-300 text-sm"
                  textAlignVertical="top"
                />
              )}
            </>
          ) : null}

          {/* TEXT AREA */}
          {q.type === "text" && (
            <TextInput
              value={textValue}
              onChangeText={updateText}
              placeholder="Tulis jawaban..."
              placeholderTextColor="#6b7280"
              multiline
              className="border-b border-gray-300 p-3 text-sm"
              textAlignVertical="top"
            />
          )}
        </View>
      </View>
    </View>
  );
}
