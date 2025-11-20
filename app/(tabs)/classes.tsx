import { BackgroundGlow } from "@/components/Theme/background";
import { User } from "lucide-react-native";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const Home = () => {
  const insets = useSafeAreaInsets();
  return (
    <View className="bg-[#D0D0D0] w-full h-full overflow-hidden">
      <SafeAreaView style={{ flex: 1 }}>
        <View className="w-full h-[21vh] shadow-[0_0_10px_rgba(0,0,0,0.3)] bg-[#EFEFEF] overflow-hidden relative rounded-b-xl">
          <View className="will-change-variable bg-[#FF30D9] blur-[70px] w-[50vh] h-[50vh] opacity-[25%] rounded-full absolute z-0 left-[-70vw] top-[-160%]"></View>
          <View className="will-change-variable bg-[#FF30D9] blur-[70px] w-[50vh] h-[50vh] opacity-[25%] rounded-full absolute z-0 right-[-60vw] bottom-[-150%]"></View>

          <View className="w-full h-full overflow-hidden absolute z-1 flex flex-col justify-between items-center py-[2vh]">
            <View className="w-[95%] flex flex-row justify-between items-center">
              <View>
                <Text className="text-3xl font-semibold text-slate-900">
                  Kilto Aznah
                </Text>
                <Text className="text-base text-slate-500">User1234</Text>

                <View className="flex flex-row mt-3 self-start rounded-full items-center text-center border gap-2 border-cyan-400 bg-cyan-50 px-4 py-1">
                  <User color="#0891B2" size={14} />
                  <Text className="text-xs font-semibold text-cyan-600">
                    Member
                  </Text>
                </View>
              </View>

              <View className="w-46 h-40 bg-[#FEFEFE] rounded-3xl items-center justify-center shadow-2xl">
                <Text className="text-lg font-medium mb-2">
                  Active Packages
                </Text>
                <View className="w-20 h-20 rounded-full bg-cyan-600 items-center justify-center">
                  <Text className="text-3xl font-semibold text-white">10</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
      <ScrollView style={{ flex: 1 }}>
        <View>
          <BackgroundGlow />
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;
