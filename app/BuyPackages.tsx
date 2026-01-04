import { BackgroundGlow } from "@/components/Theme/background";
import { router, useFocusEffect } from "expo-router";
import { ArrowLeft, ArrowRight, ShoppingCart } from "lucide-react-native";
import { useCallback, useRef } from "react";
import { Dimensions, Image, Pressable, ScrollView, Text, View } from "react-native";

const { width } = Dimensions.get('window');

export default function BuyPackages() {

  const navigating = useRef(false);
  useFocusEffect(
    useCallback(() => {
      navigating.current = false;
    }, [])
  );

  const renderBuyPackages = () => {
  const items = [];

  for (let i = 0; i < 4; i++) {
      items.push(
        <Pressable key={i} 
        className="bg-white shadow-[0_0_10px_rgba(0,0,0,0.3)] rounded-lg border-none overflow-hidden w-47 h-50 flex flex-col justify-center items-center mr-3">
          
            <View className="w-full h-[60%] bg-yellow-700 overflow-hidden">
              <Image
                source={require("../assets/png/Campfire.png")}
                className="w-full h-full absolute"
                resizeMode="cover"
              />
            </View>
            <View className="w-full h-[40%] bg-white flex flex-col justify-center items-center px-3">
              <View className="w-full flex flex-row justify-between items-center gap-[0.1vh] overflow-hidden">
                <View className="overflow-hidden w-[60%] h-full">
                  <Text className="text-left text-black font-semibold text-[18px] text-nowrap">Campfire</Text>
                </View>

                <Pressable onPress={() => {
                          if (navigating.current) return;
                          navigating.current = true;
                          router.push({
                              pathname: "/ProductDetails",
                              params: { name: "Campfire" },
                            })
                        }}
                        className="overflow-hidden bg-[#DAA770] p-2 rounded-sm flex justify-center items-center">
                  <ShoppingCart size={15} color="white" className="w-[50%] h-[50%] text-black"/>
                </Pressable>
              </View>
            </View>
          
        </Pressable>
      );
    }

    return items;
  };
  
  return (
    <View className="bg-[#EFEFEF] w-full h-full overflow-hidden">
      
            <BackgroundGlow></BackgroundGlow>
              {/* <View className="bg-[#FF30D9] blur-[70px] w-[50vh] h-[50vh] opacity-[15%] rounded-full absolute z-0 right-[-60vw] top-[-20vh]"></View> */}
               <Image
                    source={require("../assets/png/MegaText.png")}
                    className="h-[60vh] absolute z-0 right-[-0vw] top-[30vh]"
                    resizeMode="contain"
                  /> 
          <ScrollView
          horizontal={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={true}
          className=" w-full h-full">

            <View className=" shadow-[0_0_10px_rgba(0,0,0,0.3)] pt-[5vh] rounded-t-xl pb-30 overflow-hidden w-full">
              {/* <View className="bg-[#5CD6D6] blur-[70px] w-[50vh] h-[50vh] opacity-[30%] rounded-full absolute z-0 left-[-60vw] bottom-[-20vh]"></View> */}

                    <Pressable
                      onPress={() => router.back()}
                      className="w-full px-[5%] flex flex-col items-start justify-center"
                    >
                      <View className="bg-[rgba(0,0,0,0.4)] w-10 h-10 rounded-lg flex items-center justify-center">
                        <ArrowLeft size={25} color="white" />
                      </View>
                    </Pressable>

                    <View className="w-full px-[5%] mt-8 mb-10 flex flex-col items-end justify-center">
                        <View className="rounded-lg flex items-center justify-end">
                          <Text className="font-bold text-4xl">PACKAGES</Text>
                        </View>
                    </View>

                    <View className="w-full px-[5%] flex flex-col justify-center items-center gap-[1vh]">
                      <View className="flex justify-between flex-row items-center w-full">
                        <Text className="text-left text-black font-semibold text-[20px] text-nowrap">Group Classes</Text>
                        <Pressable
                        onPress={() => {
                          if (navigating.current) return;
                          navigating.current = true;
                          router.push({
                              pathname: "/DetailedBuyPackages",
                              params: { category: "Group Classes" },
                            })
                        }}
                          
                          className="bg-cyan-600 p-1 flex justify-center items-center rounded-full"
                        >
                          <ArrowRight size={20} color="white" />
                        </Pressable>
                      </View>
                      <ScrollView
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      showsVerticalScrollIndicator={false}
                      className="w-full overflow-hidden mb-[40px] rounded-lg py-3">

                          {renderBuyPackages()}

                      </ScrollView>
                    </View>

                    <View className="w-full px-[5%] flex flex-col justify-center items-center gap-[1vh]">
                      <View className="flex justify-between flex-row items-center w-full">
                        <Text className="text-left text-black font-semibold text-[20px] text-nowrap">Bundled Group Classes</Text>
                        <Pressable
                        onPress={() => {
                          if (navigating.current) return;
                          navigating.current = true;
                          router.push({
                              pathname: "/DetailedBuyPackages",
                              params: { category: "Bundled Group Classes" },
                            })
                        }}
                          
                          className="bg-cyan-600 p-1 flex justify-center items-center rounded-full"
                        >
                          <ArrowRight size={20} color="white" />
                        </Pressable>
                      </View>
                      <ScrollView
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      showsVerticalScrollIndicator={false}
                      className="w-full overflow-hidden mb-[40px] rounded-lg py-3">

                          {renderBuyPackages()}

                      </ScrollView>
                    </View>

                    <View className="w-full px-[5%] flex flex-col justify-center items-center gap-[1vh]">
                      <View className="flex justify-between flex-row items-center w-full">
                        <Text className="text-left text-black font-semibold text-[20px] text-nowrap">Special Classes</Text>
                        <Pressable
                        onPress={() => {
                          if (navigating.current) return;
                          navigating.current = true;
                          router.push({
                              pathname: "/DetailedBuyPackages",
                              params: { category: "Special Classes" },
                            })
                        }}
                          
                          className="bg-cyan-600 p-1 flex justify-center items-center rounded-full"
                        >
                          <ArrowRight size={20} color="white" />
                        </Pressable>
                      </View>
                      <ScrollView
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      showsVerticalScrollIndicator={false}
                      className="w-full overflow-hidden mb-[40px] rounded-lg py-3">

                          {renderBuyPackages()}

                      </ScrollView>
                    </View>

                    <View className="w-full px-[5%] flex flex-col justify-center items-center gap-[1vh]">
                      <View className="flex justify-between flex-row items-center w-full">
                        <Text className="text-left text-black font-semibold text-[20px] text-nowrap">Private Coaching</Text>
                        <Pressable
                        onPress={() => {
                          if (navigating.current) return;
                          navigating.current = true;
                          router.push({
                              pathname: "/DetailedBuyPackages",
                              params: { category: "Private Coaching" },
                            })
                        }}
                          
                          className="bg-cyan-600 p-1 flex justify-center items-center rounded-full"
                        >
                          <ArrowRight size={20} color="white" />
                        </Pressable>
                      </View>
                      <ScrollView
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      showsVerticalScrollIndicator={false}
                      className="w-full overflow-hidden mb-[40px] rounded-lg py-3">

                          {renderBuyPackages()}

                      </ScrollView>
                    </View>

                    <View className="w-full px-[5%] flex flex-col justify-center items-center gap-[1vh]">
                      <View className="flex justify-between flex-row items-center w-full">
                        <Text className="text-left text-black font-semibold text-[20px] text-nowrap">Independant Athlete Pass</Text>
                        <Pressable
                        onPress={() => {
                          if (navigating.current) return;
                          navigating.current = true;
                          router.push({
                              pathname: "/DetailedBuyPackages",
                              params: { category: "Independant Athlete Pass" },
                            })
                        }}
                      
                          className="bg-cyan-600 p-1 flex justify-center items-center rounded-full"
                        >
                          <ArrowRight size={20} color="white" />
                        </Pressable>
                      </View>
                      <ScrollView
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      showsVerticalScrollIndicator={false}
                      className="w-full overflow-hidden mb-[40px] rounded-lg py-3">

                          {renderBuyPackages()}

                      </ScrollView>
                    </View>

                    
            </View>

            





          </ScrollView>
      
    </View>
  );
}
