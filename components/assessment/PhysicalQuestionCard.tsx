import { AnswerValue, Question } from "@/type/assessment";
import { Text, TextInput, View } from "react-native";
import BooleanOption from "./BooleanOption";

type Props = {
  q: Question;
  index: number;
  value?: AnswerValue;
  setAnswer: (key: string, value: AnswerValue) => void;
  disabled?: boolean;
  questionKey: string;
};

export default function PhysicalQuestionCard({
  q,
  value,
  setAnswer,
  disabled,
  questionKey,
}: Props) {
  const isDisabled = !!disabled;

  const currentValue: AnswerValue =
    value ??
    (() => {
      switch (q.value.type) {
        case "BOOL":
          return { type: "BOOL", value: false };
        case "BOOL_TEXT":
          return { type: "BOOL_TEXT", value: false, desc: "" };
        case "TEXT":
          return { type: "TEXT", desc: "" };
        default:
          throw new Error("Unknown question type");
      }
    })();
  const type = currentValue.type;

  const booleanValue =
    type === "BOOL" || type === "BOOL_TEXT"
      ? (currentValue as Extract<AnswerValue, { value?: boolean }>)?.value
      : undefined;

  const detailsValue =
    type === "BOOL_TEXT"
      ? ((currentValue as Extract<AnswerValue, { desc?: string }>)?.desc ?? "")
      : "";

  const textValue =
    type === "TEXT"
      ? ((currentValue as Extract<AnswerValue, { desc?: string }>)?.desc ?? "")
      : "";

  const key = questionKey;

  const updateBoolean = (v: boolean) => {
    if (type === "BOOL") {
      setAnswer(key, {
        type: "BOOL",
        value: v,
      });
    }

    if (type === "BOOL_TEXT") {
      setAnswer(key, {
        type: "BOOL_TEXT",
        value: v,
        desc: v ? detailsValue : undefined,
      });
    }
  };

  const updateDetail = (text: string) => {
    setAnswer(key, {
      type: "BOOL_TEXT",
      value: true,
      desc: text,
    });
  };

  // ✅ TEXT UPDATE
  const updateText = (text: string) => {
    setAnswer(key, {
      type: "TEXT",
      desc: text,
    });
  };

  return (
    <View
      className={
        isDisabled
          ? "bg-gray-100 rounded-4xl p-4 mb-4 border-gray-600/50 border"
          : "bg-white rounded-4xl p-4 mb-4 shadow-sm "
      }
    >
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

          {/* ===== BOOLEAN ===== */}
          {(type === "BOOL" || type === "BOOL_TEXT") && (
            <>
              <View className="flex-row gap-6 mb-3">
                <BooleanOption
                  label="Ya"
                  value={true}
                  selected={booleanValue === true}
                  onPress={updateBoolean}
                  editable={isDisabled}
                />

                <BooleanOption
                  label="Tidak"
                  value={false}
                  selected={booleanValue === false}
                  onPress={updateBoolean}
                  editable={isDisabled}
                />
              </View>

              {/* DETAIL INPUT */}
              {type === "BOOL_TEXT" && booleanValue === true && (
                <TextInput
                  value={detailsValue}
                  onChangeText={updateDetail}
                  placeholder="Jelaskan lebih lanjut..."
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
          {type === "TEXT" && (
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
