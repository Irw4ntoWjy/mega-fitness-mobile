// TermsModal.tsx

import React, { useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { DUMMY_TNC } from "./dummy_tnc";

interface Props {
  visible: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export default function TermsModal({ visible, onAccept, onDecline }: Props) {
  const [checked, setChecked] = useState(false);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/40 justify-center px-5">
        <View className="bg-white rounded-2xl p-5 max-h-[80%]">
          <Text className="text-xl font-bold">{DUMMY_TNC.title}</Text>
          <Text className="text-gray-500 mb-3">
            Last updated: {DUMMY_TNC.lastUpdated}
          </Text>

          <ScrollView className="mb-4">
            {DUMMY_TNC.content.map((item, index) => (
              <View key={index} className="mb-3">
                <Text className="font-semibold">{item.title}</Text>
                <Text className="text-gray-700">{item.body}</Text>
              </View>
            ))}
          </ScrollView>

          {/* Checkbox */}
          <Pressable
            onPress={() => setChecked(!checked)}
            className="flex-row items-center mb-4"
          >
            <View
              className={`w-5 h-5 border rounded mr-2 ${
                checked ? "bg-[#259AAA]" : "bg-white"
              }`}
            />
            <Text>I agree to the Terms & Conditions</Text>
          </Pressable>

          {/* Buttons */}
          <View className="flex-row justify-between">
            <Pressable
              onPress={() => {
                setChecked(false);
                onDecline();
              }}
              className="flex-1 mr-2 bg-gray-200 py-3 rounded-xl items-center"
            >
              <Text>Decline</Text>
            </Pressable>

            <Pressable
              disabled={!checked}
              onPress={() => {
                setChecked(false);
                onAccept();
              }}
              className={`flex-1 ml-2 py-3 rounded-xl items-center ${
                checked ? "bg-[#259AAA]" : "bg-gray-300"
              }`}
            >
              <Text className="text-white">Accept</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
