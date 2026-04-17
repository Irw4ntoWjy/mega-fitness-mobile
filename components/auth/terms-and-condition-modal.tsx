import { CheckSquare, Square, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { DUMMY_LIABILITY } from "./dummy_liability";
import { DUMMY_TNC } from "./dummy_tnc";

interface Props {
  visible: boolean;
  onAccept?: () => void;
  onDecline?: () => void;
  onView?: boolean;
}

export default function TermsModal({
  visible,
  onAccept,
  onDecline,
  onView,
}: Props) {
  const [page, setPage] = useState(0);
  const [checked, setChecked] = useState(false);

  const isLastPage = page === 1;
  const data = page === 0 ? DUMMY_LIABILITY : DUMMY_TNC;

  useEffect(() => {
    if (visible) {
      setPage(0);
      setChecked(false);
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          paddingHorizontal: 20,
        }}
      >
        <View className="bg-white rounded-2xl p-5 max-h-[80%]">
          {/* Header */}
          <View className="flex-row px-5 py-4">
            <Text className="text-xl font-bold w-10/12">{data.title}</Text>

            <Pressable className="w-2/12 items-end" onPress={onDecline}>
              <X size={20} />
            </Pressable>
          </View>

          {/* Content */}
          <ScrollView
            className="px-5 py-4"
            showsVerticalScrollIndicator={false}
          >
            {data.sections.map((s, i) => (
              <View key={i} className="mb-4">
                <Text className="font-semibold text-base mb-1">{s.title}</Text>
                <Text className="text-gray-700 text-justify leading-6">
                  {s.body}
                </Text>
              </View>
            ))}
          </ScrollView>

          {/* Agreement Checkbox */}
          {isLastPage && (
            <Pressable
              onPress={() => setChecked(!checked)}
              className="flex-row items-center px-5 pt-3"
            >
              {checked ? (
                <CheckSquare size={22} color="#259AAA" />
              ) : (
                <Square size={22} color="#6B7280" />
              )}

              <Text className="ml-2 text-gray-800">
                I have read and agree to the Terms & Conditions
              </Text>
            </Pressable>
          )}

          {/* Buttons */}
          <View className="flex-row px-5 pb-5 pt-2">
            <Pressable
              onPress={() => {
                if (page === 0) {
                  onDecline!();
                } else {
                  setPage(0);
                }
              }}
              className="flex-1 mr-2 bg-gray-200 py-3 rounded-xl items-center"
            >
              <Text className="font-medium">
                {page === 0 ? "Decline" : "Back"}
              </Text>
            </Pressable>

            {!isLastPage ? (
              <Pressable
                onPress={() => setPage(1)}
                className="flex-1 ml-2 bg-[#259AAA] py-3 rounded-xl items-center"
              >
                <Text className="text-white font-medium">Next</Text>
              </Pressable>
            ) : onView ? (
              <Pressable
                disabled={!checked}
                onPress={onAccept}
                className={`flex-1 ml-2 py-3 rounded-xl items-center ${
                  checked ? "bg-[#259AAA]" : "bg-gray-300"
                }`}
              >
                <Text className="text-white font-medium">Accept</Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      </View>
    </Modal>
  );
}
