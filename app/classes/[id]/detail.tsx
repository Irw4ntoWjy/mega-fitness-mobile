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
import { SafeAreaView } from "react-native-safe-area-context";
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
        <View className="flex-1 items-center justify-center px-4">
          <View className="absolute inset-0 bg-zinc-900/40" />
          <TouchableWithoutFeedback onPress={() => {}}>
            <View className="w-full max-w-[420px] bg-white rounded-[26px] px-6 pt-6 pb-5">
              <Pressable
                onPress={onClose}
                className="absolute right-4 top-4 h-11 w-11 rounded-xl bg-zinc-300 items-center justify-center"
              >
                <X size={22} color="#fff" />
              </Pressable>

              <Text className="text-[28px] leading-8 text-zinc-900 mt-6">
                Are you sure you want to{"\n"}
                <Text className="font-bold">sign out?</Text>
              </Text>

              <View className="mt-8">
                <Text className="text-[28px] font-bold text-zinc-900">
                  {activity.title}
                </Text>

                <Text className="mt-3 text-[18px] font-medium text-zinc-900">
                  {activity.date}
                </Text>

                <View className="mt-4 flex-row items-center gap-3">
                  <Clock size={22} color="#111" />
                  <Text className="text-[16px] text-zinc-900">
                    {activity.time}
                  </Text>
                </View>

                <View className="mt-3 flex-row items-center gap-3">
                  <Contact size={22} color="#111" />
                  <Text className="text-[16px] text-zinc-900">
                    {activity.instructor}
                  </Text>
                </View>
              </View>

              <Text className="mt-8 text-center text-[16px] font-semibold text-[#E11D48]">
                This action can’t be undone!
              </Text>

              <View className="mt-4 flex-row gap-4">
                <Pressable
                  onPress={onClose}
                  className="flex-1 h-16 rounded-2xl border border-black items-center justify-center"
                >
                  <Text className="text-[18px] font-bold text-black">
                    Cancel
                  </Text>
                </Pressable>

                <Pressable
                  onPress={onConfirm}
                  className="flex-1 h-16 rounded-2xl bg-[#E11D48] items-center justify-center"
                >
                  <Text className="text-[18px] font-bold text-white">
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
    <SafeAreaView style={{ flex: 1 }}>
      <BackgroundGlow showText={true} />

      <View className="h-14 px-4 justify-center">
        <Pressable
          className="h-11 w-11 rounded-xl bg-zinc-300 items-center justify-center"
          onPress={() => router.back()}
        >
          <ArrowLeft size={22} color="#fff" />
        </Pressable>
      </View>

      <ScrollView className="flex-1 mx-4" showsVerticalScrollIndicator={false}>
        <View className="h-[210px] rounded-[18px] overflow-hidden bg-zinc-300 mt-1">
          <Image
            source={{ uri: activity.image }}
            className="h-full w-full"
            resizeMode="cover"
          />
        </View>

        <View className="flex-row items-center mt-4">
          <Text className="flex-1 text-[44px] font-bold tracking-[1px] text-zinc-950">
            {activity.title}
          </Text>

          <View className="flex-row items-center gap-2 bg-zinc-300/80 border border-white px-4 py-2 rounded-full">
            <Clock size={16} color="#fff" />
            <Text className="text-base font-semibold text-white">
              {activity.duration}
            </Text>
          </View>
        </View>

        <Text className="mt-2 text-[22px] font-bold text-zinc-900">
          {activity.date}
        </Text>

        <View className="flex-row items-center gap-3 mt-4">
          <Clock size={20} color="#111" />
          <Text className="text-lg text-zinc-900">{activity.time}</Text>
        </View>

        <View className="flex-row items-center gap-3 mt-4">
          <Contact size={20} color="#111" />
          <Text className="text-lg text-zinc-900">{activity.instructor}</Text>
        </View>

        {userProfile.role === "Member" ? (
          <Text className="mt-7 text-[17px] leading-7 text-zinc-900/90">
            {activity.description}
          </Text>
        ) : userProfile.role === "Trainer" ? (
          <View className="mt-7">
            <Text className="text-[17px] leading-7 text-zinc-900/90 font-extrabold">
              Member:
            </Text>
            <View className="mt-3 bg-white rounded-2xl border border-zinc-200 overflow-hidden">
              {members.map((m, idx) => {
                const checked = selectedMemberIds.includes(m.id);
                return (
                  <View key={m.id}>
                    <View className="flex-row items-center px-5 py-5">
                      <Checkbox
                        checked={checked}
                        onPress={() => toggleMember(m.id)}
                      />

                      <Text className="ml-4 flex-1 text-[14px] text-black">
                        {m.name}
                      </Text>

                      <Pressable
                        onPress={() => console.log("Open journal for", m.id)}
                        hitSlop={10}
                      >
                        <Text className="text-[18px] text-zinc-500 underline">
                          Journal
                        </Text>
                      </Pressable>
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

      <View className="absolute bottom-0 left-0 right-0 bg-zinc-100 px-[18px] pb-[18px] pt-2">
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
          className={`h-16 rounded-[14px] items-center justify-center ${
            !activity.owned
              ? "bg-gray-400"
              : isOngoing
              ? "bg-[#E11D48]"
              : "bg-cyan-600"
          }`}
          disabled={!activity.owned}
        >
          <Text className="text-white text-[22px] font-bold">
            {isOngoing ? "Sign Out" : "Sign In"}
          </Text>
        </Pressable>
      </View>

      <SignOutModal
        visible={open}
        activity={activity}
        onClose={() => setOpen(false)}
        onConfirm={handleSignOut}
      />
    </SafeAreaView>
  );
}
