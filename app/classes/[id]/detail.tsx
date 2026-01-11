import { BackgroundGlow } from "@/components/Theme/background";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Check, Clock, Contact, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { activities, member, profile } from "../dummy_data";

type Activity = {
  title: string;
  date: string;
  time: string;
  instructor: string;
};

type Member = {
  id: string;
  name: string;
};

function Checkbox({
  checked,
  onPress,
}: {
  checked: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`h-6 w-6 rounded-md items-center justify-center border-2 ${
        checked ? "bg-black border-black" : "bg-white border-black"
      }`}
      hitSlop={10}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
    >
      {checked ? <Check size={16} color="#fff" /> : null}
    </Pressable>
  );
}

function SignOutModal({
  visible,
  onClose,
  onConfirm,
  activity,
}: {
  visible: boolean;
  activity: Activity;
  onClose: () => void;
  onConfirm: () => void;
}) {
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
                <Text className="text-xl text-gray-900 mt-2">
                  Are you sure you want to{" "}
                  <Text className="font-semibold">sign out?</Text>
                </Text>
                <Pressable
                  onPress={onClose}
                  className="w-8 h-8 rounded-md bg-gray-100 items-center justify-center ml-auto"
                >
                  <X size={22} color="#fff" />
                </Pressable>
              </View>

              <View className="mt-4 ">
                <Text className="font-bold text-xl text-gray-900">
                  {activity.title}
                </Text>

                <Text className="mt-1 font-bold text-xl text-gray-900">
                  {activity.date}
                </Text>

                <View className="mt-2 flex-row items-center gap-3">
                  <Clock size={22} color="#111" />
                  <Text className="text-xl text-gray-900">{activity.time}</Text>
                </View>

                <View className="mt-1 flex-row items-center gap-3">
                  <Contact size={22} color="#111" />
                  <Text className="text-xl text-gray-900">
                    {activity.instructor}
                  </Text>
                </View>
              </View>

              <Text className="mt-8 text-md font-bold text-red-600 text-center">
                This action can’t be undone!
              </Text>

              <View className="mt-4 flex-row gap-4">
                <Pressable
                  onPress={onClose}
                  className="flex-1 h-12 rounded-xl border border-black items-center justify-center"
                >
                  <Text className="text-xl font-semibold text-black">
                    Cancel
                  </Text>
                </Pressable>

                <Pressable
                  onPress={onConfirm}
                  className="flex-1 h-12 rounded-xl bg-red-600 items-center justify-center"
                >
                  <Text className="text-xl font-semibold text-white">
                    Sign Out
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

export default function ClassesDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();

  const activity = activities.find((item) => item.id === Number(id));
  const userProfile = profile;
  const isTrainer = userProfile.role === "Trainer";
  const members: Member[] = member;

  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);

  const toggleMember = (memberId: string) => {
    setSelectedMemberIds((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  if (!activity) {
    return <div>Activity not found</div>;
  }
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(activity.status);

  const isOngoing = status === "Ongoing";

  const handleSignOut = () => {
    setStatus("Signed Out");
    setOpen(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <BackgroundGlow showText={true} />

      <View className="h-14 px-6 justify-center mt-20">
        <Pressable
          className="h-11 w-11 rounded-xl bg-zinc-300 items-center justify-center"
          onPress={() => router.back()}
        >
          <ArrowLeft size={22} color="#fff" />
        </Pressable>
      </View>

      <ScrollView className="flex-1 mx-6" showsVerticalScrollIndicator={false}>
        <View className="h-[210px] rounded-[18px] overflow-hidden bg-zinc-300 mt-1">
          <Image
            source={{ uri: activity.image }}
            className="h-full w-full"
            resizeMode="cover"
          />
        </View>

        <View className="flex-row items-center mt-6">
          <Text className="flex-1 text-[36px] font-semibold tracking-[1px] text-zinc-950">
            {activity.title}
          </Text>

          <View className="flex-row items-center gap-2 bg-[#DAA770] px-4 py-2 rounded-full">
            <Clock size={16} color="#fff" />
            <Text className="text-base font-semibold text-white">
              {activity.duration}
            </Text>
          </View>
        </View>

        <Text className="mt-2 text-[20px] font-bold text-zinc-900">
          {activity.date}
        </Text>

        <View className="mt-6 w-full max-w-[520px] space-y-4">
          <View className="mt-1 flex-row items-center gap-3">
            <Clock size={22} color="#111" />
            <Text className="text-xl text-gray-900">{activity.time}</Text>
          </View>

          <View className="mt-1 flex-row items-center gap-3">
            <Contact size={22} color="#111" />
            <Text className="text-xl text-gray-900">{activity.instructor}</Text>
          </View>
        </View>

        {userProfile.role === "Member" ? (
          <Text
            style={{
              marginTop: 28,
              fontSize: 20,
              lineHeight: 30,
              color: "rgba(24,24,27,0.9)",
              textAlign: "justify",
            }}
          >
            {activity.description}
          </Text>
        ) : userProfile.role === "Trainer" ? (
          <View className="mt-7">
            <Text className="text-[20px] text-zinc-900/90 font-bold">
              Member:
            </Text>
            <View className="mt-3 bg-white rounded-2xl border border-zinc-200 overflow-hidden">
              {members.map((m, idx) => {
                const checked = selectedMemberIds.includes(m.id);
                return (
                  <View key={m.id}>
                    <View className="flex-row items-center px-5 py-5">
                      {activity.status === "Ongoing" && (
                        <Checkbox
                          checked={checked}
                          onPress={() => toggleMember(m.id)}
                        />
                      )}

                      <Text className="ml-4 flex-1 text-[14px] text-black">
                        {m.name}
                      </Text>

                      {activity.status === "Ongoing" && (
                        <Pressable
                          onPress={() => console.log("Open journal for", m.id)}
                          hitSlop={10}
                        >
                          <Text className="text-[14px] text-zinc-500 underline">
                            Journal
                          </Text>
                        </Pressable>
                      )}
                    </View>

                    {idx !== members.length - 1 ? (
                      <View className="h-[1px] bg-zinc-200 mx-5" />
                    ) : null}
                  </View>
                );
              })}
            </View>
          </View>
        ) : null}

        <View className="h-32" />
      </ScrollView>
      {activity.owned && (
        <Pressable
          onPress={() =>
            isOngoing
              ? setOpen(true)
              : router.push({
                  pathname: "/classes/[id]/barcode",
                  params: {
                    id: String(activity.id),
                    trainer: String(userProfile.role === "Trainer"),
                  },
                })
          }
          className={`absolute bottom-2 left-1/2 -translate-x-1/2 w-[80%] h-14 rounded-xl items-center justify-center pb-2 pt-2 ${
            isOngoing ? "bg-red-600" : "bg-cyan-600"
          }`}
          disabled={!activity.owned}
        >
          <Text className="text-white text-xl font-semibold">
            {isOngoing ? "Sign Out" : "Sign In"}
          </Text>
        </Pressable>
      )}

      <SignOutModal
        visible={open}
        activity={activity}
        onClose={() => setOpen(false)}
        onConfirm={handleSignOut}
      />
    </View>
  );
}
