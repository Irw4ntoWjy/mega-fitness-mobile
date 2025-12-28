import { BackgroundGlow } from "@/components/Theme/background";
import { router, useFocusEffect } from "expo-router";
import { ArrowRight, Bell, Clock, ShoppingCart } from "lucide-react-native";
import { useCallback, useRef } from "react";
import { Dimensions, Image, Pressable, ScrollView, Text, View } from "react-native";


const { width } = Dimensions.get('window');

export default function Home() {

  const navigating = useRef(false);
  useFocusEffect(
    useCallback(() => {
      navigating.current = false;
    }, [])
  );

  const renderTodaysActivity = () => {
  const items = [];

  for (let i = 0; i < 4; i++) {
      items.push(
        <Pressable
          key={i}
          className="mr-1 w-53 h-55 overflow-hidden relative flex flex-col justify-center items-center"
        >
          <View className="bg-white shadow-[0_0_50px_rgba(0,0,0,0.2)] absolute flex flex-col justify-center items-center w-[92%] h-[92%] rounded-[10px] overflow-hidden">
            
            <View className="w-full h-[60%] bg-yellow-700 overflow-hidden">
              <Image
                source={require("../../assets/png/Campfire.png")}
                className="w-full h-full absolute"
                resizeMode="cover"
              />
            </View>

            <View className="w-full h-[40%] bg-white flex flex-row justify-between items-center px-3">
              <View className="flex flex-col justify-center items-start gap-[0.1vh]">
                <Text className="text-left text-black font-semibold text-[20px] text-nowrap">Campfire</Text>
                <Text className="text-left text-black font-normal text-[9px] text-nowrap">03.00PM - 04.00PM</Text>
              </View>

              <View className="mt-[1vh] flex flex-row justify-center items-center bg-[rgba(0,0,0,0.1)] border-[1px] border-[rgba(0,0,0,0.3)] rounded-full overflow-hidden px-[1.5vw] py-[.3vh] gap-[4px]">
                <Clock size={10} color="black" className="w-[50%] h-[50%]" />
                <Text className="text-left text-black text-[9px] text-nowrap font-medium">60 min</Text>
              </View>
            </View>
          </View>

          <View className="absolute top-0 left-0 bg-cyan-600 flex justify-center items-center rounded-lg px-10 py-2">
            <Text className="text-[12px] text-center text-nowrap text-white font-medium">Today</Text>
          </View>
        </Pressable>
      );
    }

    return items;
  };

  const renderPromotions = () => {
  const items = [];

  for (let i = 0; i < 4; i++) {
      items.push(
        <Pressable key={i} 
        className="relative w-50 h-50 flex flex-col justify-center items-center">
          <View className="bg-white shadow-[0_0_10px_rgba(0,0,0,0.3)] rounded-lg border-none overflow-hidden flex flex-col justify-center items-center w-[92%] h-[92%] absolute">
            <View className="w-full h-[60%] bg-yellow-700 overflow-hidden">
              <Image
                source={require("../../assets/png/Campfire.png")}
                className="w-full h-full absolute"
                resizeMode="cover"
              />
            </View>
            <View className="w-full h-[40%] bg-white flex flex-col justify-center items-center px-3">
              <View className="w-full flex flex-row justify-between items-center gap-[0.1vh] overflow-hidden">
                <View className="overflow-hidden w-[60%] h-full">
                  <Text className="text-left text-black font-semibold text-[18px] text-nowrap">Campfire</Text>
                </View>

                <Pressable className="overflow-hidden bg-[#DAA770] p-2 rounded-sm flex justify-center items-center">
                  <ShoppingCart size={15} color="white" className="w-[50%] h-[50%] text-black"/>
                </Pressable>
              </View>
            </View>
          </View>

            <View className="absolute top-0 left-0 bg-cyan-600 flex justify-center items-center rounded-lg px-6 py-2">
            <Text className="text-[10px] text-center text-nowrap text-white font-medium">20% Off</Text>
          </View>
          
        </Pressable>
      );
    }

    return items;
  };

  const renderBuyPackages = () => {
  const items = [];

  for (let i = 0; i < 4; i++) {
      items.push(
        <Pressable key={i} 
        className="bg-white shadow-[0_0_10px_rgba(0,0,0,0.3)] rounded-lg border-none overflow-hidden w-47 h-50 flex flex-col justify-center items-center">
          
            <View className="w-full h-[60%] bg-yellow-700 overflow-hidden">
              <Image
                source={require("../../assets/png/Campfire.png")}
                className="w-full h-full absolute"
                resizeMode="cover"
              />
            </View>
            <View className="w-full h-[40%] bg-white flex flex-col justify-center items-center px-3">
              <View className="w-full flex flex-row justify-between items-center gap-[0.1vh] overflow-hidden">
                <View className="overflow-hidden w-[60%] h-full">
                  <Text className="text-left text-black font-semibold text-[18px] text-nowrap">Campfire</Text>
                </View>

                <Pressable onPress={() =>
                            router.push({
                              pathname: "/ProductDetails",
                              params: { name: "Campfire" },
                            })
                          } className="overflow-hidden bg-[#DAA770] p-2 rounded-sm flex justify-center items-center">
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
    <View className="bg-black w-full h-full overflow-hidden">
      

          <ScrollView
          horizontal={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={true}
          className="bg-[#DBDBDB] w-full h-full">
            <View className="w-full flex flex-col h-fit">
              <View className="w-full h-[26vh] shadow-[0_0_10px_rgba(0,0,0,0.3)] bg-[#EFEFEF] overflow-hidden relative rounded-b-xl">
                <BackgroundGlow></BackgroundGlow>
                {/* <View className="bg-[#FF30D9] blur-[70px] w-[50vh] h-[50vh] opacity-[25%] rounded-full absolute z-0 left-[-70vw] top-[-160%]"></View>
                <View className="bg-[#FF30D9] blur-[70px] w-[50vh] h-[50vh] opacity-[25%] rounded-full absolute z-0 right-[-60vw] bottom-[-150%]"></View> */}
                <View className="w-full h-full overflow-hidden absolute z-1 flex flex-col justify-between items-center py-[2vh] pt-[5vh]">
                  <View className="flex flex-col">
                    <View className="w-[95%] flex flex-row justify-end items-center">

                        <View className="flex flex-row justify-end">
                          <Pressable className="w-[40px] h-[40px] relative flex justify-center items-center">
                            <View className="flex justify-center items-center w-[85%] h-[85%] border-[1px] border-[#999999] bg-white rounded-xl absolute overflow-hidden">
                              {/* <Image
                                source={require("../../assets/icons/li_bell.png")}
                                className="w-[50%] h-[50%] rounded-xl"
                                resizeMode="cover"
                              /> */}
                              <Bell size={18} className="w-[50%] h-[50%] text-black"/>
                            </View>
                            <View className="w-full h-full flex flex-col justfiy-start items-end absolute">
                              <View className="bg-rose-600 w-[10px] h-[10px] border-[1.5px] border-black rounded-full"></View>
                            </View>
                          </Pressable>
                        </View>
                        
                    </View>

                    <View className="w-[95%] px-[4vw] flex flex-row">
                      <View className="flex flex-col justify-center items-start">
                          <Text className="text-black font-semibold text-[25px]">WELCOME BACK,</Text>
                          <Text className="text-black text-[15px]">Kilto Aznah</Text>
                      </View>
                    </View>
                  </View> 
                  

                  <View className="w-[100%] flex flex-column justify-center items-end gap-1">
                    <View className="px-[4vw] rounded-full flex flex-row justify-end items-center gap-1">
                      <View className="rounded-full bg-[rgba(0,0,0,0.25)] w-5 h-5 flex items-center justify-center overflow-hidden">
                        <Text className="text-center text-[10px] text-white font-medium">2</Text>
                      </View>
                      <Text className="text-center text-[12px] text-black font-medium">Activity</Text>
                    </View>
                    {/* <View className="px-6 rounded-full flex flex-row justify-end items-center gap-1">
                      <User size={15} className=" text-black"/>
                      <Text className="text-center text-[12px] text-black font-medium">Member</Text>
                    </View> */}
                  </View>

                </View>
              </View>

              <Pressable className="absolute left-[4vw] bottom-[-15vw] bg-[#112D37] w-[30vw] h-[30vw] border-[1px] border-cyan-400 rounded-full flex justify-center items-center">
                <Text className="text-center text-cyan-400 text-[30px]">
                  KA
                </Text>
              </Pressable>
            </View>
            

            <View className="w-full flex flex-col">
              <View className="h-[20vw] w-full px-[2vw] flex flex-row justify-end items-center">
                 <View
                  className="px-5 py-2 rounded-xl border shadow-sm bg-[#F8E6FF] border-[#B44DFF]"
                >
                  <Text
                    className="text-sm font-semibold text-[#7A20C9]"
                  >
                    Member
                  </Text>
                </View>
              </View>
              <View className="w-full px-[2vw] flex flex-row justify-between items-center py-4 pt-0">
                <View className="will-change-variable w-[35vw] h-40 shadow-[0_0_10px_rgba(0,0,0,0.3)] bg-white rounded-xl border-[1px] border-[rgba(255,255,255,0.18)] flex flex-col justify-center items-center overflow-hidden gap-[1vh]">
                  <Text className="w-[80%] text-center text-black font-medium">Your Active Packages</Text>
                  <View className=" w-[60px] h-[60px] flex justify-center items-center relative">
                    {/* <Image
                      source={require("../../assets/shapes/hexagon.png")}
                      className="w-full h-full absolute"
                      resizeMode="contain"
                    /> */}
                    <View className="w-15 h-15 flex justify-center items-center bg-cyan-600 rounded-full">
                      <Text className="text-[20px] font-medium text-white">
                        2
                      </Text>
                    </View>
                  </View>
                </View>
                <View className="will-change-variable w-[59vw] h-40 shadow-[0_0_10px_rgba(0,0,0,0.3)] bg-white rounded-xl border-[1px] border-[rgba(255,255,255,0.18)] flex flex-col justify-start items-center overflow-hidden p-[1vh] gap-[5%]">

                  <View className="w-full h-[20%] flex flex-col justify-center items-center gap-[0.2vh]">
                    <View className="w-full flex justify-between flex-row items-center">
                      <Text className="text-black font-semibold text-center text-[10px]">30%</Text>
                      <Text className="text-black text-center text-[10px] text-nowrap">20/200 Active Sessions Done</Text>
                    </View>
                    <View className="w-full overflow-hidden bg-[#D5D5D5] h-[1vh] rounded-full">
                      <View className="w-[30%] bg-cyan-600 h-full"></View>
                    </View>
                  </View>

                  <View className="w-full h-[75%] flex flex-row justify-center items-center gap-1">
                    <View className="w-fit h-full flex flex-col justify-end items-start gap-[5px]">
                      <View className="flex gap-[1vh] flex-row items-center">
                        <View className="rounded-full bg-cyan-600"><Text className="text-white text-center text-[8px] p-[5px]">0/0</Text></View>
                        <Text className="text-black text-center text-[10px] font-medium">Membership Pass</Text>
                      </View>
                      <View className="flex gap-[1vh] flex-row items-center">
                        <View className="rounded-full bg-cyan-600"><Text className="text-white text-center text-[8px] p-[5px]">0/0</Text></View>
                        <Text className="text-black text-center text-[10px] font-medium">Class Pass</Text>
                      </View>
                      <View className="flex gap-[1vh] flex-row items-center">
                        <View className="rounded-full bg-cyan-600"><Text className="text-white text-center text-[8px] p-[5px]">0/0</Text></View>
                        <Text className="text-black text-center text-[10px] font-medium">Private Training</Text>
                      </View>
                    </View>
                    <View className="w-fit h-full flex justify-end items-end">
                      <Pressable className="overflow-hidden bg-[#DAA770] h-8 px-[2vh] rounded-md flex justify-center items-center">
                        <Text className="text-center text-white text-[10px] text-nowrap">My Packages</Text>
                      </Pressable>
                    </View>
                  </View>

                </View>
              </View>
              
            </View>

            <View className="bg-[#EFEFEF] shadow-[0_0_10px_rgba(0,0,0,0.3)] pt-5 rounded-t-xl pb-30 overflow-hidden">
             <BackgroundGlow></BackgroundGlow>
              {/* <View className="bg-[#FF30D9] blur-[70px] w-[50vh] h-[50vh] opacity-[15%] rounded-full absolute z-0 right-[-60vw] top-[-20vh]"></View> */}
               <Image
                    source={require("../../assets/png/MegaText.png")}
                    className="h-[60vh] absolute z-0 right-[-0vw] top-[60vh]"
                    resizeMode="contain"
                  /> 
              {/* <View className="bg-[#5CD6D6] blur-[70px] w-[50vh] h-[50vh] opacity-[30%] rounded-full absolute z-0 left-[-60vw] bottom-[-20vh]"></View> */}

              
                    <View className="w-full flex flex-col justify-center items-center gap-[2vh]">
                      <View className="flex justify-between flex-row items-center w-full px-[4vw]">
                        <Text className="text-left text-black font-semibold text-[20px] text-nowrap">Today's Activity</Text>
                        <Pressable className="bg-cyan-600 p-1 flex justify-center items-center rounded-full">
                          <ArrowRight size={20} color="white" className="w-[50%] h-[50%] text-black"/>
                        </Pressable>
                      </View>
                      <ScrollView
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      showsVerticalScrollIndicator={false}
                      className="w-[95%] overflow-hidden mb-[40px] rounded-lg">

                          {renderTodaysActivity()}

                      </ScrollView>
                    </View>

                    <View className="w-full px-[5%] flex flex-col justify-center items-center gap-[2vh] mb-[40px]">
                      <View className="flex justify-between flex-row items-center w-full">
                        <Text className="text-left text-black font-semibold text-[20px] text-nowrap">Promotions</Text>
                        <Pressable className="bg-cyan-600 p-1 flex justify-center items-center rounded-full">
                          <ArrowRight size={20} color="white" className="w-[50%] h-[50%] text-black"/>
                        </Pressable>
                      </View>

                      <View className="w-full flex flex-row flex-wrap rounded-lg justify-between gap-1">
                          {renderPromotions()}
                      </View>
                    </View>

                    <View className="w-full px-[5%] flex flex-col justify-center items-center gap-[2vh] mb-[40px]">
                      <View className="flex justify-between flex-row items-center w-full">
                        <Text className="text-left text-black font-semibold text-[20px] text-nowrap">Buy Packages</Text>
                        <Pressable onPress={() => {
                          if (navigating.current) return;
                          navigating.current = true;
                          router.push("../BuyPackages");
                        }}
                        className="bg-cyan-600 p-1 flex justify-center items-center rounded-full">
                          <ArrowRight size={20} color="white" className="w-[50%] h-[50%] text-black"/>
                        </Pressable>
                      </View>

                      <View className="w-full flex flex-row flex-wrap rounded-lg justify-center gap-4">
                          {renderBuyPackages()}
                      </View>
                    </View>

                    
            </View>

            





          </ScrollView>
      
    </View>
  );
}
