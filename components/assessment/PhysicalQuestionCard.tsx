import { AnswerValue, Question } from "@/type/assessment";
import { Text, TextInput, View } from "react-native";
import BooleanOption from "./BooleanOption";

type Props = {
  q: Question;
  index: number;
  value?: AnswerValue;
  setAnswer: (key: string, value: AnswerValue) => void;
  disabled?: boolean;
};

export default function PhysicalQuestionCard({
  q,
  index,
  value,
  setAnswer,
  disabled,
}: Props) {
  const isDisabled = !!disabled;

  const booleanValue =
    value?.type === "BOOL" || value?.type === "BOOL_TEXT"
      ? value.value
      : undefined;
  const detailsValue = value?.type === "BOOL_TEXT" ? value.desc : undefined;
  const textValue = value?.type === "TEXT" ? value.desc : undefined;

  const key = q.key.en;

  const updateBoolean = (v: boolean) => {
    if (q.value?.type === "BOOL") {
      setAnswer(key, {
        type: "BOOL",
        value: v,
      });
    }

    if (q.value?.type === "BOOL_TEXT") {
      setAnswer(key, {
        type: "BOOL_TEXT",
        value: v,
        desc: v ? detailsValue : undefined, // clear if false
      });
    }
  };

  const updateDetail = (text: string) => {
    if (q.value?.type === "BOOL_TEXT") {
      setAnswer(key, {
        type: "BOOL_TEXT",
        value: true,
        desc: text,
      });
    }
  };

  const updateText = (text: string) => {
    if (q.value?.type === "TEXT") {
      setAnswer(key, {
        type: "TEXT",
        desc: text,
      });
    }
  };

  return (
    <View className="bg-white rounded-4xl p-4 mb-4 shadow-sm">
      <View className="flex-row">
        <View className="flex-1 px-4">
          {/* QUESTION */}
          <Text className="font-semibold text-md leading-6.8 pb-2">
            {q.key.en}
          </Text>

          {/* INDONESIAN */}
          {q.key.id && (
            <Text className="text-gray-500 text-sm leading-6.5 mt-1 mb-3">
              {q.key.id}
            </Text>
          )}

          {/* ===== BOOLEAN TYPES ===== */}
          {(q.value?.type === "BOOL" || q.value?.type === "BOOL_TEXT") && (
            <>
              <View className="flex-row gap-6 mb-3">
                <BooleanOption
                  label="Ya"
                  value={true}
                  selected={booleanValue === true}
                  onPress={updateBoolean}
                  editable={!isDisabled}
                />

                <BooleanOption
                  label="Tidak"
                  value={false}
                  selected={booleanValue === false}
                  onPress={updateBoolean}
                  editable={!isDisabled}
                />
              </View>

              {/* DETAIL INPUT */}
              {q.value?.type === "BOOL_TEXT" && booleanValue === true && (
                <TextInput
                  value={detailsValue}
                  onChangeText={updateDetail}
                  placeholder="Jelaskan lebih desc..."
                  placeholderTextColor="#6b7280"
                  className="border-b border-gray-300 text-md py-1"
                  textAlignVertical="top"
                  multiline
                  editable={!isDisabled}
                />
              )}
            </>
          )}

          {/* ===== TEXT ===== */}
          {q.value?.type === "TEXT" && (
            <TextInput
              value={textValue}
              onChangeText={updateText}
              placeholder="Tulis jawaban..."
              placeholderTextColor="#6b7280"
              className="border-b border-gray-300 text-md py-1"
              textAlignVertical="top"
              multiline
              editable={!isDisabled}
            />
          )}
        </View>
      </View>
    </View>
  );
}
