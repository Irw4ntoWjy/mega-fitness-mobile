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
  onClose: () => void;
};

export default function FeedbackModal({
  visible,
  title,
  message,
  onClose,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
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
                  onPress={onClose}
                  className="w-8 h-8 rounded-md bg-gray-100 items-center justify-center ml-auto"
                >
                  <X size={22} color="#111" />
                </Pressable>
              </View>

              <Text className="mt-4 text-base text-gray-700 leading-6">
                {message}
              </Text>

              <Pressable
                onPress={onClose}
                className="mt-6 h-12 rounded-xl bg-cyan-600 items-center justify-center"
              >
                <Text className="text-xl font-semibold text-white">OK</Text>
              </Pressable>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
