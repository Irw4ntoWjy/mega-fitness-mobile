import { BackgroundGlow } from "@/components/Theme/background";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, ShoppingCart } from "lucide-react-native";
import { Image, Pressable, ScrollView, Text, View } from "react-native";

export default function PackageCategory() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const decodedCategory = decodeURIComponent(category ?? "");


  const CATEGORY_SECTIONS: Record<string, string[]> = {
    "Group Classes": [
        "Campfire",
        "Active Flow",
        "Active Pilates",
        "Active Retro",
        "Super Kids",
    ],

    "Bundled Group Classes": [
        "Active Flow + Active Pilates",
        "Campfire + Active Retro",
    ],

    "Special Classes": [
        "Campfire",
        "Active Flow",
        "Active Pilates",
        "Active Retro",
    ],

    "Private Coaching": [
        "Gym Club",
        "Campfire",
        "Active Flow",
        "Active Pilates",
        "Active Retro",
        "Super Kids",
        "Physiotherapy"
    ],

    "Independant Athlete Pass": [
        "Gym Membership",
        "Recharge"
    ],
    
  };


  const PackageSection = ({ title }: { title: string }) => (
  <View className="w-full px-[5%] flex flex-col justify-center items-center gap-[1vh]">
    <View className="flex justify-between flex-row items-center w-full">
      <Text className="text-left text-black font-semibold text-[20px] text-nowrap">
        {title.toUpperCase()}
      </Text>
    </View>

    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      className="w-full overflow-hidden mb-[40px] rounded-lg py-3"
    >
      {renderBuyPackages()}
    </ScrollView>
  </View>
);


  const renderBuyPackages = () => {
    return Array.from({ length: 4 }).map((_, i) => (
      <Pressable
        key={i}
        className="bg-white shadow-[0_0_10px_rgba(0,0,0,0.3)] rounded-lg overflow-hidden w-47 h-50 flex flex-col justify-center items-center mr-3"
      >
        <View className="w-full h-[60%] overflow-hidden">
          <Image
            source={require("../assets/png/Campfire.png")}
            className="w-full h-full absolute"
            resizeMode="cover"
          />
        </View>

        <View className="w-full h-[40%] bg-white flex justify-center px-3">
          <View className="flex flex-row justify-between items-center">
            <Text className="font-semibold text-[18px]">
              Campfire
            </Text>

            <Pressable className="bg-[#DAA770] p-2 rounded-sm">
              <ShoppingCart size={15} color="white" />
            </Pressable>
          </View>
        </View>
      </Pressable>
    ));
  };

  return (
    <View className="bg-black w-full h-full">
      <ScrollView className="bg-[#EFEFEF] w-full h-full">
        <View className="pt-[5vh] rounded-t-xl pb-30 w-full">
          <BackgroundGlow></BackgroundGlow>
              {/* <View className="bg-[#FF30D9] blur-[70px] w-[50vh] h-[50vh] opacity-[15%] rounded-full absolute z-0 right-[-60vw] top-[-20vh]"></View> */}
               <Image
                    source={require("../assets/png/MegaText.png")}
                    className="h-[60vh] absolute z-0 right-[-0vw] top-[60vh]"
                    resizeMode="contain"
                  /> 
              <View className="bg-[#5CD6D6] blur-[70px] w-[50vh] h-[50vh] opacity-[30%] rounded-full absolute z-0 left-[-60vw] bottom-[-20vh]"></View>


          <Pressable
            onPress={() => router.back()}
            className="px-[5%]"
          >
            <View className="bg-[rgba(0,0,0,0.4)] w-10 h-10 rounded-lg flex items-center justify-center">
              <ArrowLeft size={25} color="white" />
            </View>
          </Pressable>

          <View className="w-full px-[5%] mt-8 mb-10 items-end">
            <Text className="font-bold text-4xl capitalize">
              {decodeURIComponent(category ?? "").toUpperCase()}
            </Text>
          </View>

        {CATEGORY_SECTIONS[decodedCategory]?.map((section) => (
        <PackageSection key={section} title={section} />
        ))}
        
        </View>
      </ScrollView>
    </View>
  );
}
