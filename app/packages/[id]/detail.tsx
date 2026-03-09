import { BackgroundGlow } from "@/components/Theme/background";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";


type PersonalTrainer = {
  id: string;
  name: string;
};


const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

export const TrainerCard = ({ item }: { item: PersonalTrainer }) => {
  const initials = getInitials(item.name);

  return (
    <View className="flex-row items-center gap-3 bg-[#FFE3F1] shadow rounded-2xl p-2 w-full">
      <View className="w-12 h-12 rounded-xl bg-white items-center justify-center">
        <Text className="text-black text-lg font-semibold">{initials}</Text>
      </View>
      <Text className="text-lg tracking-wide font-medium text-[#2D2D2D]">
        {item.name}
      </Text>
    </View>
  );
};

export default function ProductDetail() {
  const [packageData, setPackageData] = useState<any>(null);
  const [personalTrainers, setPersonalTrainers] = useState<PersonalTrainer[]>([]);
  const { id } = useLocalSearchParams<{ id: string }>();

  useEffect(() => {
    fetchDetail();
  }, []);

  const fetchDetail = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/package/detail`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            package_id: id,
          }),
        }
      );

      const json = await res.json();

      if (json.success) {
        setPackageData(json.data);

        const details = json.data.package_details || [];

        const trainers = details.flatMap((detail: any) =>
          (detail.package_detail_trainers || []).map((t: any) => ({
            id: t.package_trainer_id,
            name: t.trainer_profile_name,
          }))
        );

        setPersonalTrainers(trainers);
      }
    } catch (err) {
      console.log("Detail error:", err);
    }
  };

  if (!packageData) {
  return (
    <View className="flex-1 items-center justify-center">
      <Text>Package not found</Text>
    </View>
  );
}

  return (
    <View style={{ flex: 1 }}>
      <BackgroundGlow showText={true} />

      <View className="mt-20 h-14 px-4 justify-center">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center"
        >
          <ChevronLeft size={22} color="#000" />
        </Pressable>
      </View>

      <ScrollView className="flex-1 mx-6" showsVerticalScrollIndicator={false}>
        <View className="h-[210px] rounded-[18px] overflow-hidden bg-zinc-300 mt-1">
          <Image
            source={{ uri: packageData.package_cover_image }}
            className="h-full w-full"
            resizeMode="cover"
          />
        </View>

        <View className="flex-row items-center mt-6">
          <Text className="flex-1 text-3xl font-semibold tracking-[1px] text-zinc-950">
            {packageData.package_name}
          </Text>
        </View>
        <Text
          style={{
            marginTop: 28,
            fontSize: 20,
            lineHeight: 30,
            color: "rgba(24,24,27,0.9)",
            textAlign: "justify",
          }}
        >
          {packageData.package_description}
        </Text>
        {/* <View className="flex flex-col mt-4 bg-white  p-4 rounded-2xl gap-3 mb-28">
          <View className="flex flex-row items-start gap-2">
            <Contact size={22} color="#000" />
            <Text className="text-xl text-black">Personal Trainer</Text>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="flex-1 h-64"
          >
            <View className="flex flex-col flex-wrap justify-between gap-2">
              {personalTrainers.map((item) => (
                <TrainerCard key={item.id} item={item} />
              ))}
            </View>
          </ScrollView>
        </View> */}
      </ScrollView>

      {/* <Pressable className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[80%] h-14 rounded-xl items-center justify-center bg-cyan-600 pb-2 pt-2">
        <Text className="text-white text-xl font-semibold">Buy Package</Text>
      </Pressable> */}
    </View>
  );
}
