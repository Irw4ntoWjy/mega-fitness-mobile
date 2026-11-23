import { AnswerValue, Question } from "@/type/assessment";
import { Check } from "lucide-react-native";
import { Pressable, Text, TextInput, View } from "react-native";
import BooleanOption from "./BooleanOption";

type Props = {
  q: Question;
  index: number;
  value?: AnswerValue;
  setAnswer: (key: string, value: AnswerValue) => void;
  disabled?: boolean;
  error?: boolean;
  questionKey: string;
};

export default function PhysicalQuestionCard({
  q,
  value,
  setAnswer,
  disabled,
  error,
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
        case "CHOICE":
          return { type: "CHOICE", desc: "" };
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
        error
          ? "bg-white rounded-4xl p-4 mb-4 border border-red-600" // border/text match the error toast
          : isDisabled
            ? "bg-gray-100 rounded-4xl p-4 mb-4 border-gray-200 border"
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

              {booleanValue === false &&
                "noHint" in q.value &&
                q.value.noHint && (
                  <Text className="text-red-500 text-sm mb-2">
                    {q.value.noHint}
                  </Text>
                )}

              {/* DETAIL INPUT */}
              {type === "BOOL_TEXT" && booleanValue === true && (
                <TextInput
                  value={detailsValue}
                  onChangeText={updateDetail}
                  placeholder={isDisabled ? undefined : "Jelaskan lebih lanjut..."}
                  placeholderTextColor="#6b7280"
                  className="border-b border-gray-300 text-md py-1"
                  textAlignVertical="top"
                  multiline
                  editable={!isDisabled}
                />
              )}
            </>
          )}

          {/* ===== CHOICE ===== */}
          {type === "CHOICE" &&
            q.value.type === "CHOICE" &&
            q.value.options?.map((opt, _, options) => {
              // single -> radio; otherwise multi-select stored as "a; b" in option order
              const single = q.value.type === "CHOICE" && q.value.single;
              const picked =
                currentValue.type === "CHOICE" && currentValue.desc
                  ? currentValue.desc.split("; ")
                  : [];
              const selected = picked.includes(opt);
              return (
                <Pressable
                  key={opt}
                  disabled={isDisabled}
                  onPress={() =>
                    setAnswer(key, {
                      type: "CHOICE",
                      desc: single
                        ? opt
                        : options
                            .filter((o) => (o === opt ? !selected : picked.includes(o)))
                            .join("; "),
                    })
                  }
                  className="flex-row items-start gap-2 mb-3"
                >
                  {single ? (
                    <View
                      className={`w-5 h-5 mt-0.5 rounded-full border items-center justify-center ${
                        selected ? "border-cyan-600" : "border-gray-400"
                      }`}
                    >
                      {selected && (
                        <View className="w-2.5 h-2.5 rounded-full bg-cyan-600" />
                      )}
                    </View>
                  ) : (
                    <View
                      className={`w-5 h-5 mt-0.5 rounded border items-center justify-center ${
                        selected ? "border-cyan-600 bg-cyan-600" : "border-gray-400"
                      }`}
                    >
                      {selected && <Check size={14} color="#fff" />}
                    </View>
                  )}
                  <Text className="flex-1">{opt}</Text>
                </Pressable>
              );
            })}

          {/* ===== TEXT ===== */}
          {type === "TEXT" && (
            <TextInput
              value={textValue}
              onChangeText={updateText}
              placeholder={isDisabled ? undefined : "Tulis jawaban..."}
              placeholderTextColor="#6b7280"
              className="border-b border-gray-300 text-md py-1"
              textAlignVertical="top"
              multiline
              editable={!isDisabled}
            />
          )}

          {error && (
            <Text className="text-red-800 text-sm mt-2">
              This question is required
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}
