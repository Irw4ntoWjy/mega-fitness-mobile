import { TextInput } from "react-native";

type Props = {
  value?: string;
  onChange: (text: string) => void;
};

export default function TextArea({ value, onChange }: Props) {
  return (
    <TextInput
      multiline
      placeholder="Type your answer..."
      value={value}
      onChangeText={onChange}
      className="border border-gray-300 rounded-xl p-3 text-[14px] min-h-[90px]"
      textAlignVertical="top"
    />
  );
}
