import { BackgroundGlow } from "@/components/Theme/background";
import { useAuth } from "@/hooks/useAuth";
import * as Location from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Check, Clock, Contact, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { activities, member } from "../dummy_data";

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

const TRAINER_SIGN_OUT_RADIUS_METERS = 10;
const TRAINER_SIGN_OUT_TARGET = {
  latitude: 3.591907,
  longitude: 98.681419,
};

const toRadians = (deg: number) => (deg * Math.PI) / 180;

function getDistanceMeters(
  start: { latitude: number; longitude: number },
  end: { latitude: number; longitude: number },
) {
  const earthRadiusMeters = 6371000;
  const dLat = toRadians(end.latitude - start.latitude);
  const dLon = toRadians(end.longitude - start.longitude);
  const lat1 = toRadians(start.latitude);
  const lat2 = toRadians(end.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusMeters * c;
}

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
  isSubmitting,
}: {
  visible: boolean;
  activity: Activity;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isSubmitting: boolean;
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
                  disabled={isSubmitting}
                  className="flex-1 h-12 rounded-xl border border-black items-center justify-center"
                >
                  <Text className="text-xl font-semibold text-black">
                    Cancel
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    void onConfirm();
                  }}
                  disabled={isSubmitting}
                  className="flex-1 h-12 rounded-xl bg-red-600 items-center justify-center"
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="text-xl font-semibold text-white">
                      Sign Out
                    </Text>
                  )}
                </Pressable>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

export function FeedbackModal({
  visible,
  title,
  message,
  onClose,
}: {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
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

export default function ClassesDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { auth } = useAuth();

  const activity = activities.find((item) => item.id === Number(id));
  const isTrainer = auth?.accountDetail?.account_role === "Trainer";
  const members: Member[] = member;
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(activity?.status ?? "Upcoming");
  const [isSubmittingSignOut, setIsSubmittingSignOut] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState<{
    visible: boolean;
    title: string;
    message: string;
  }>({
    visible: false,
    title: "",
    message: "",
  });

  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);

  const toggleMember = (memberId: string) => {
    setSelectedMemberIds((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId],
    );
  };

  if (!activity) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg text-zinc-900">Activity not found</Text>
      </View>
    );
  }

  const isOngoing = status === "Ongoing";

  const handleSignOut = async () => {
    if (isSubmittingSignOut) {
      return;
    }

    if (!isTrainer) {
      setStatus("Signed Out");
      setOpen(false);
      return;
    }

    setIsSubmittingSignOut(true);

    try {
      const { status: permissionStatus } =
        await Location.requestForegroundPermissionsAsync();

      if (permissionStatus !== "granted") {
        setFeedbackModal({
          visible: true,
          title: "Location Permission Needed",
          message: "Aktifkan izin lokasi untuk sign out trainer.",
        });
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const trainerLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      const distanceMeters = getDistanceMeters(
        trainerLocation,
        TRAINER_SIGN_OUT_TARGET,
      );

      if (distanceMeters > TRAINER_SIGN_OUT_RADIUS_METERS) {
        setFeedbackModal({
          visible: true,
          title: "Di Luar Radius",
          message: `Trainer harus berada dalam radius ${TRAINER_SIGN_OUT_RADIUS_METERS}m.\nJarak saat ini ${Math.round(distanceMeters)}m.`,
        });
        return;
      }

      setStatus("Signed Out");
      setOpen(false);
    } catch {
      setFeedbackModal({
        visible: true,
        title: "Sign Out Gagal",
        message: "Lokasi tidak bisa diambil. Coba lagi beberapa saat.",
      });
    } finally {
      setIsSubmittingSignOut(false);
    }
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
            source={{
              uri: `${process.env.EXPO_PUBLIC_ASSET_BASE_URL}${String(activity.image)}`,
              cache: "reload",
            }}
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

        {!isTrainer ? (
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
        ) : isTrainer ? (
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
                          onPress={() => router.push("/journal/journal")}
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
                    trainer: String(isTrainer),
                  },
                })
          }
          className={`absolute bottom-10 left-1/2 -translate-x-1/2 w-[80%] h-14 rounded-xl items-center justify-center pb-2 pt-2 ${
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
        isSubmitting={isSubmittingSignOut}
        onClose={() => setOpen(false)}
        onConfirm={handleSignOut}
      />

      <FeedbackModal
        visible={feedbackModal.visible}
        title={feedbackModal.title}
        message={feedbackModal.message}
        onClose={() =>
          setFeedbackModal((prev) => ({
            ...prev,
            visible: false,
          }))
        }
      />
    </View>
  );
}
