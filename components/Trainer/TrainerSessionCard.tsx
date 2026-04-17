import { approveSessionLog } from "@/app/api/session-log";
import { useToast } from "@/components/Toast/toast-provider";
import { getInitials } from "@/lib/utils";
import { TrainerSessionLogHistoryItem } from "@/type/session-log";
import { Check } from "lucide-react-native";
import React, { useState } from "react";
import { Image, Modal, Pressable, ScrollView, Text, View } from "react-native";

interface TrainerSessionCardProps {
  item: TrainerSessionLogHistoryItem;
  onRefresh?: () => void;
}

export function TrainerSessionCard({
  item,
  onRefresh,
}: TrainerSessionCardProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [checked, setChecked] = useState<{ [id: string]: boolean }>(() => {
    const initial: { [id: string]: boolean } = {};
    (item.members || []).forEach((m) => {
      initial[m.session_log_id] = false;
    });
    return initial;
  });
  const [loadingApprove, setLoadingApprove] = useState(false);
  const { showToast } = useToast();

  const statusId = String(item.session_log_status_id);
  const statusBg = statusId === "1" ? "#64748B" : "#16A34A";
  const statusName =
    statusId === "1" ? "Belum Dikonfirmasi" : "Telah Dikonfirmasi";

  const handleCheck = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleApprove = async () => {
    setLoadingApprove(true);
    try {
      const checkedIds = Object.entries(checked)
        .filter(([_, v]) => v)
        .map(([id]) => id);
      for (const session_log_id of checkedIds) {
        await approveSessionLog(session_log_id);
      }
      showToast({
        message: "Kehadiran member berhasil dikonfirmasi!",
        variant: "success",
      });
      setModalVisible(false);
      if (onRefresh) onRefresh();
    } catch (e) {
      showToast({
        message: "Gagal konfirmasi kehadiran member.",
        variant: "error",
      });
      console.error(e);
    } finally {
      setLoadingApprove(false);
    }
  };

  return (
    <>
      <Pressable
        className="w-[48%] mb-4"
        onPress={() => {
          if (statusId !== "3") setModalVisible(true);
        }}
      >
        <View className="bg-white rounded-2xl shadow-md relative">
          <View className="w-full h-44 rounded-t-2xl overflow-hidden">
            <View className="w-full h-full bg-black" />
          </View>
          <View
            style={{
              position: "absolute",
              top: -10,
              left: -5,
              backgroundColor: statusBg,
              paddingHorizontal: 12,
              paddingVertical: 7,
              borderRadius: 8,
              zIndex: 1000,
              elevation: 30,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 10,
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: 0.8,
              }}
            >
              {statusName}
            </Text>
          </View>
          <View className="flex-row items-center justify-between px-4 py-4">
            <View>
              <Text className="text-black font-bold text-lg">
                {item.product_name}
              </Text>
              <Text className="text-black text-xs mt-1">
                {item.schedule_date} • {item.time_start} - {item.time_end}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.3)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 16,
              padding: 24,
              minWidth: 320,
              maxWidth: 360,
              maxHeight: 480,
            }}
          >
            <View className="mb-2">
              <Text className="text-black font-semibold text-xl mb-1">
                {item.product_name}
              </Text>
              <Text className="text-gray-500 text-sm">
                {item.schedule_date} • {item.time_start} - {item.time_end}
              </Text>
            </View>
            <Text className="text-gray-500 text-sm mb-2">
              Checklist member yang hadir dalam sesi ini.
            </Text>
            <View className="flex-row items-center mb-2">
              <Text className="text-cyan-600 font-semibold text-xs mr-1">
                {Object.values(checked).filter(Boolean).length}
              </Text>
              <Text className="text-gray-500 text-xs">
                hadir dari {item.members?.length || 0} member
              </Text>
            </View>
            <View className="h-px bg-gray-200 mb-3" />
            <ScrollView style={{ maxHeight: 320 }}>
              {(item.members || []).length === 0 ? (
                <Text style={{ color: "#888" }}>
                  No members in this session.
                </Text>
              ) : (
                item.members.map((member) => (
                  <Pressable
                    key={member.session_log_id}
                    onPress={() => handleCheck(member.session_log_id)}
                    className="flex-row items-center mb-3"
                  >
                    <View
                      className={`w-6 h-6 rounded-md border-2 mr-3 items-center justify-center ${
                        checked[member.session_log_id]
                          ? "border-cyan-600 bg-cyan-600"
                          : "border-gray-400 bg-white"
                      }`}
                    >
                      {checked[member.session_log_id] && (
                        <Check size={18} color="#fff" strokeWidth={3} />
                      )}
                    </View>
                    {member.member_picture_url ? (
                      <Image
                        source={{
                          uri: `${process.env.EXPO_PUBLIC_ASSET_BASE_URL}${member.member_picture_url}`,
                        }}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 16,
                          marginRight: 10,
                          backgroundColor: "#eee",
                        }}
                      />
                    ) : (
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          marginRight: 10,
                          backgroundColor: "#eee",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text className="text-gray-400 text-md">
                          {getInitials(member.member_name)}
                        </Text>
                      </View>
                    )}
                    <Text style={{ fontSize: 16 }}>{member.member_name}</Text>
                  </Pressable>
                ))
              )}
            </ScrollView>
            {statusId !== "3" && (
              <Pressable
                onPress={handleApprove}
                className={`mt-5 bg-cyan-600 rounded-lg py-2.5 items-center ${loadingApprove ? "opacity-60" : ""}`}
                disabled={
                  loadingApprove ||
                  Object.values(checked).filter(Boolean).length === 0
                }
              >
                <Text className="text-white font-bold text-base">
                  {loadingApprove ? "Menyimpan..." : "Konfirmasi Kehadiran"}
                </Text>
              </Pressable>
            )}
            <Pressable
              onPress={() => setModalVisible(false)}
              className="mt-2 bg-gray-200 rounded-lg py-2.5 items-center"
              disabled={loadingApprove}
            >
              <Text className="text-gray-700 font-bold text-base">Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}
