import { BackgroundGlow } from "@/components/Theme/background";
import { router, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  CheckCheck,
  Clock,
  User as UserIcon,
} from "lucide-react-native";
import React, { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { activities } from "../dummy_data";

export default function barcodePages() {
  const { id, trainer } = useLocalSearchParams<{
    id?: string;
    trainer?: string;
  }>();

  const isTrainer = trainer === "true";
  console.log(id);
  const item = activities.find((item) => item.id === Number(id));
  if (!item) {
    return <div>Activity not found</div>;
  }

  const [isRefreshed, setIsRefreshed] = useState(isTrainer ?? false);

  return (
    <View style={{ flex: 1 }}>
      <BackgroundGlow showText={true} />
      <View className="px-6 pt-2 mt-20">
        <Pressable
          onPress={() => router.back()}
          className="h-12 w-12 rounded-xl bg-zinc-300 items-center justify-center"
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <ArrowLeft color="#fff" size={22} />
        </Pressable>
      </View>

      <View
        className="flex-1 "
        style={{
          paddingTop: isRefreshed ? 48 : 0,
          paddingHorizontal: 24,
        }}
      >
        <View className="mt-10 items-center">
          <View className="w-full max-w-[520px]  rounded-3xl bg-white shadow-lg px-8 py-9">
            {!isRefreshed ? (
              <View className="items-center">
                <View className="h-42 w-42 rounded-2xl bg-black items-center justify-center overflow-hidden">
                  <Image className="h-20 w-20" resizeMode="contain" />
                </View>

                <View className="mt-7 w-full items-center">
                  <View className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-5 items-center justify-center">
                    <Text className="text-gray-600 font-semibold py-8">
                      THIS IS BARCODE LOCATION
                    </Text>
                  </View>

                  <Text className="mt-3 text-base text-gray-900 font-medium">
                    Mega-Fitness
                  </Text>
                </View>
              </View>
            ) : (
              <View className="items-center justify-center py-10">
                <CheckCheck size={242} color="#000" />
              </View>
            )}
          </View>
        </View>

        <View className="mt-10 items-center">
          <Text className="text-xl font-semibold text-gray-900">
            {item.date}
          </Text>

          <View className="mt-2 w-full max-w-[520px] space-y-4">
            <View className="flex-row items-center">
              <View className="h-10 w-10 rounded-xl bg-gray-200 items-center justify-center">
                <Clock size={20} color="#111827" />
              </View>
              <Text className="ml-4 text-lg text-gray-800 font-semibold">
                {item.time}
              </Text>
            </View>

            <View className="flex-row items-center mt-2">
              <View className="h-10 w-10 rounded-xl bg-gray-200 items-center justify-center">
                <UserIcon size={20} color="#111827" />
              </View>
              <Text className="ml-4 text-lg text-gray-800 font-semibold">
                {item.instructor}
              </Text>
            </View>
          </View>
        </View>
        <View className="h-37" />
        {!isRefreshed && (
          <View className="bottom-2 left-0 right-0 bg-zinc-100/60 px-[40px] pb-[18px] pt-2">
            <Pressable
              onPress={() => setIsRefreshed(true)}
              className={`w-full h-14 rounded-xl items-center justify-center bg-cyan-600
                   `}
            >
              <Text className="text-white text-xl font-semibold">Refresh</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}
