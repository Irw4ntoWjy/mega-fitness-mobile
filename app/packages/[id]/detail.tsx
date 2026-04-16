import { getPackageDetail } from "@/app/api/package";
import { BackgroundGlow } from "@/components/Theme/background";
import { getInitials } from "@/lib/utils";
import { Package } from "@/type/package";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

type PersonalTrainer = {
  id: string;
  name: string;
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
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [personalTrainers, setPersonalTrainers] = useState<PersonalTrainer[]>(
    [],
  );
  const { id, from } = useLocalSearchParams<{ id: string; from?: string }>();

  const openWhatsApp = async () => {
    try {
      const url = "https://wa.me/6282167661122";
      await Linking.openURL(url);
    } catch (err) {
      console.log("WhatsApp open error:", err);
    }
  };

  const fetchDetail = useCallback(async () => {
    try {
      if (!id) return;
      setLoading(true);
      const res = await getPackageDetail({ package_id: id });

      if (res.success && res.data) {
        setPackageData(res.data);
      }
    } catch (err) {
      console.log("Detail error:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

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
          onPress={() => {
            if (from === "list-package") {
              router.replace({
                pathname: "/packages/list-package",
                params: { refresh: Date.now().toString() },
              });
              return;
            }

            router.replace({
              pathname: "/",
              params: { refresh: Date.now().toString() },
            });
          }}
          className="w-10 h-10 items-center justify-center"
        >
          <ChevronLeft size={22} color="#000" />
        </Pressable>
      </View>

      <ScrollView className="flex-1 mx-6" showsVerticalScrollIndicator={false}>
        <View className="h-[210px] rounded-[18px] overflow-hidden bg-black mt-1">
          {packageData.package_cover_image ? (
            <Image
              source={{ uri: packageData.package_cover_image }}
              className="h-full w-full"
              resizeMode="cover"
            />
          ) : (
            <View className="h-full w-full bg-black" />
          )}
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

      <Pressable
        onPress={openWhatsApp}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[80%] h-14 rounded-xl items-center justify-center bg-cyan-600 pb-2 pt-2"
      >
        <Text className="text-white text-xl font-semibold">Buy Package</Text>
      </Pressable>
    </View>
  );
}
