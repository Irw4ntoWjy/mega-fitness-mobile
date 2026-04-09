import { X } from "lucide-react-native";
import {
  Modal,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmModal({
  visible,
  title,
  message,
  confirmText,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 24,
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <TouchableWithoutFeedback onPress={() => {}}>
            <View className="w-full rounded-2xl bg-white p-5 shadow-lg">
              <View className="flex flex-row justify-between items-center">
                <Text className="text-xl font-semibold text-gray-900 mt-1">
                  {title}
                </Text>
                <Pressable
                  onPress={onCancel}
                  className="w-8 h-8 rounded-md bg-gray-100 items-center justify-center ml-auto"
                >
                  <X size={22} color="#111" />
                </Pressable>
              </View>

              <Text className="mt-4 text-base text-gray-700 leading-6">
                {message}
              </Text>

              <View className="mt-6 flex-row gap-4">
                <Pressable
                  onPress={onCancel}
                  className="flex-1 h-12 rounded-xl border border-black items-center justify-center"
                >
                  <Text className="text-xl font-semibold text-black">
                    Batal
                  </Text>
                </Pressable>

                <Pressable
                  onPress={onConfirm}
                  className="flex-1 h-12 rounded-xl bg-red-600 items-center justify-center"
                >
                  <Text className="text-xl font-semibold text-white">
                    {confirmText ?? "Lanjut"}
                  </Text>
                </Pressable>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
