import { Bell } from "lucide-react-native";
import { Dimensions, Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get('window');

export default function Home() {
  
  return (
    <>
      <SafeAreaView edges={['top']} className="bg-[#180921] w-full h-full">

          <ScrollView
          horizontal={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={true}
          className="bg-[#180921] w-full h-full">
            
            <View className="w-full h-[30vh] bg-[#060109] overflow-hidden relative rounded-b-xl mb-[2vh]">
              <View className="bg-[#FF30D9] blur-[70px] w-[50vh] h-[50vh] opacity-[25%] rounded-full absolute z-0 right-[-40vw] bottom-[-120%]"></View>
              <View className="w-full h-full overflow-hidden absolute z-1 flex flex-col justify-between items-center py-[2vh]">
                
                <View className="w-[95%] flex flex-row justify-between items-center">
                    <Pressable className="bg-[#112D37] w-[50px] h-[50px] border-[1px] border-cyan-400 rounded-full flex justify-center items-center">
                      <Text className="text-center text-cyan-400">
                        KA
                      </Text>
                    </Pressable>

                    <View className="flex flex-row justify-end">
                      <Pressable className="w-[50px] h-[50px] relative flex justify-center items-center">
                        <View className="flex justify-center items-center w-[40px] h-[40px] bg-white rounded-lg absolute overflow-hidden">
                          {/* <Image
                            source={require("../../assets/icons/li_bell.png")}
                            className="w-[50%] h-[50%] rounded-xl"
                            resizeMode="cover"
                          /> */}
                          <Bell className="w-[50%] h-[50%] text-black"/>
                        </View>
                        <View className="w-full h-full flex flex-col justfiy-start items-end absolute">
                          <View className="bg-rose-600 w-[15px] h-[15px] border-[1.5px] border-black rounded-full"></View>
                        </View>
                      </Pressable>
                    </View>
                    
                </View>

                <View className="w-[95%] px-[10%] flex flex-row">
                  <View className="flex flex-col justify-center items-start">
                      <Text className="text-white font-semibold text-[20px]">WELCOME BACK,</Text>
                      <Text className="text-white">Kilto Aznah</Text>
                  </View>
                </View>

                <View className="w-[95%] flex flex-row justify-end items-center">
                  <View className="bg-[#112D37] border-[2px] border-cyan-400 px-6 py-1 rounded-full">
                    <Text className="text-center text-[10px] text-cyan-400">Members</Text>
                  </View>
                </View>

              </View>
            </View>

            <View className="w-full px-[2vw] flex flex-row justify-between items-center overflow-hidden mb-[40px]">
              <View className="w-[35vw] h-[50vw] bg-[#312439] rounded-xl border-[1px] border-[rgba(255,255,255,0.18)] flex flex-col justify-center items-center overflow-hidden gap-[1vh]">
                <Text className="w-[80%] text-center text-white">Your Active Packages</Text>
                <View className=" w-[60px] h-[60px] flex justify-center items-center relative">
                  <Image
                    source={require("../../assets/shapes/hexagon.png")}
                    className="w-full h-full absolute"
                    resizeMode="contain"
                  />
                  <View className="w-full h-full flex justify-center items-center">
                    <Text className="text-[30px] font-medium text-white">
                      2
                    </Text>
                  </View>
                </View>
              </View>
              <View className="w-[59vw] h-[50vw] bg-[#312439] rounded-xl border-[1px] border-[rgba(255,255,255,0.18)] flex flex-col justify-start items-center overflow-hidden p-[2vh] gap-[5%]">

                <View className="w-full h-[20%] flex flex-col justify-center items-center gap-[0.2vh]">
                  <View className="w-full flex justify-between flex-row items-center">
                    <Text className="text-white font-semibold text-center text-[8px]">30%</Text>
                    <Text className="text-white text-center text-[8px] text-nowrap">You’ve Completed 20/200 Active Sessions</Text>
                  </View>
                  <View className="w-full overflow-hidden bg-white h-[1vh] rounded-full">
                    <View className="w-[30%] bg-cyan-600 h-full"></View>
                  </View>
                </View>

                <View className="w-full h-[75%] flex flex-col justify-center items-center gap-[5px]">
                  <View className="w-full h-[75%] flex flex-col justify-center items-start gap-[5px]">
                    <View className="flex gap-[1vh] flex-row items-center">
                      <View className="rounded-full bg-cyan-600"><Text className="text-white text-center text-[8px] p-[5px]">0/0</Text></View>
                      <Text className="text-white text-center text-[10px]">Membership Pass</Text>
                    </View>
                    <View className="flex gap-[1vh] flex-row items-center">
                      <View className="rounded-full bg-cyan-600"><Text className="text-white text-center text-[8px] p-[5px]">0/0</Text></View>
                      <Text className="text-white text-center text-[10px]">Class Pass</Text>
                    </View>
                    <View className="flex gap-[1vh] flex-row items-center">
                      <View className="rounded-full bg-cyan-600"><Text className="text-white text-center text-[8px] p-[5px]">0/0</Text></View>
                      <Text className="text-white text-center text-[10px]">Private Training</Text>
                    </View>
                  </View>
                  <View className="w-full h-[25%] flex justify-end items-end">
                    <Pressable className="overflow-hidden bg-cyan-600 h-full px-[2vh] rounded-sm flex justify-center items-center">
                      <Text className="text-center text-white text-[10px] text-nowrap">My Packages</Text>
                    </Pressable>
                  </View>
                </View>

              </View>
            </View>

            <View className="w-full px-[5%] flex flex-col justify-center items-center gap-[2vh]">
              <View className="flex justify-start flex-row items-center w-full">
                <Text className="text-left text-white font-semibold text-[20px] text-nowrap">Today's Activity</Text>
              </View>
              <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              className="w-full overflow-hidden mb-[40px] rounded-lg">

                  <View className="mr-[4vw] bg-[#312439] w-[50vw] h-[60vw] rounded-lg border-[1px] border-[rgba(255,255,255,0.18)] overflow-hidden flex flex-col justify-center items-center">
                    <View className="w-full h-[60%] bg-gray-600 overflow-hidden">
                      <Image
                        source={require("../../assets/shapes/hexagon.png")}
                        className="w-full h-full absolute"
                        resizeMode="cover"
                      />
                    </View>
                    <View className="w-full h-[40%] bg-[#312439] border-t-[1px] border-t-[rgba(255,255,255,0.18)] flex flex-row justify-between items-center px-[2vw]">
                      <View className="flex flex-col justify-center items-start gap-[0.1vh]">
                        <Text className="text-left text-white font-semibold text-[20px] text-nowrap">Campfire</Text>
                        <Text className="text-left text-white font-normal text-[9px] text-nowrap">03.00PM - 04.00PM</Text>
                        <View className="mt-[1vh] flex flex-row justify-center items-center bg-[#112D37] border-[1px] border-cyan-400 rounded-full overflow-hidden px-[1.5vw] py-[.3vh] gap-[5px]">
                          <Image
                            source={require("../../assets/icons/li_clock-2.png")}
                            className="w-[10px] h-[10px]"
                            resizeMode="contain"
                          />
                          <Text className="text-left text-cyan-400 font-normal text-[10px] text-nowrap">60 min</Text>
                        </View>
                      </View>
                      <Pressable className="overflow-hidden bg-cyan-600 px-[4vw] py-[1vh] rounded-sm flex justify-center items-center">
                        <Text className="text-center text-white text-[10px] text-nowrap">Sign In</Text>
                      </Pressable>
                    </View>
                  </View>

                  <View className="mr-[4vw] bg-[#312439] w-[50vw] h-[60vw] rounded-lg border-[1px] border-[rgba(255,255,255,0.18)] overflow-hidden flex flex-col justify-center items-center">
                    <View className="w-full h-[60%] bg-gray-600 overflow-hidden">
                      <Image
                        source={require("../../assets/shapes/hexagon.png")}
                        className="w-full h-full absolute"
                        resizeMode="cover"
                      />
                    </View>
                    <View className="w-full h-[40%] bg-[#312439] border-t-[1px] border-t-[rgba(255,255,255,0.18)] flex flex-row justify-between items-center px-[2vw]">
                      <View className="flex flex-col justify-center items-start gap-[0.1vh]">
                        <Text className="text-left text-white font-semibold text-[20px] text-nowrap">Campfire</Text>
                        <Text className="text-left text-white font-normal text-[9px] text-nowrap">03.00PM - 04.00PM</Text>
                        <View className="mt-[1vh] flex flex-row justify-center items-center bg-[#112D37] border-[1px] border-cyan-400 rounded-full overflow-hidden px-[1.5vw] py-[.3vh] gap-[5px]">
                          <Image
                            source={require("../../assets/icons/li_clock-2.png")}
                            className="w-[10px] h-[10px]"
                            resizeMode="contain"
                          />
                          <Text className="text-left text-cyan-400 font-normal text-[10px] text-nowrap">60 min</Text>
                        </View>
                      </View>
                      <Pressable className="overflow-hidden bg-cyan-600 px-[4vw] py-[1vh] rounded-sm flex justify-center items-center">
                        <Text className="text-center text-white text-[10px] text-nowrap">Sign In</Text>
                      </Pressable>
                    </View>
                  </View>

                  <View className="mr-[4vw] bg-[#312439] w-[50vw] h-[60vw] rounded-lg border-[1px] border-[rgba(255,255,255,0.18)] overflow-hidden flex flex-col justify-center items-center">
                    <View className="w-full h-[60%] bg-gray-600 overflow-hidden">
                      <Image
                        source={require("../../assets/shapes/hexagon.png")}
                        className="w-full h-full absolute"
                        resizeMode="cover"
                      />
                    </View>
                    <View className="w-full h-[40%] bg-[#312439] border-t-[1px] border-t-[rgba(255,255,255,0.18)] flex flex-row justify-between items-center px-[2vw]">
                      <View className="flex flex-col justify-center items-start gap-[0.1vh]">
                        <Text className="text-left text-white font-semibold text-[20px] text-nowrap">Campfire</Text>
                        <Text className="text-left text-white font-normal text-[9px] text-nowrap">03.00PM - 04.00PM</Text>
                        <View className="mt-[1vh] flex flex-row justify-center items-center bg-[#112D37] border-[1px] border-cyan-400 rounded-full overflow-hidden px-[1.5vw] py-[.3vh] gap-[5px]">
                          <Image
                            source={require("../../assets/icons/li_clock-2.png")}
                            className="w-[10px] h-[10px]"
                            resizeMode="contain"
                          />
                          <Text className="text-left text-cyan-400 font-normal text-[10px] text-nowrap">60 min</Text>
                        </View>
                      </View>
                      <Pressable className="overflow-hidden bg-cyan-600 px-[4vw] py-[1vh] rounded-sm flex justify-center items-center">
                        <Text className="text-center text-white text-[10px] text-nowrap">Sign In</Text>
                      </Pressable>
                    </View>
                  </View>

              </ScrollView>
            </View>


            <View className="w-full px-[5%] flex flex-col justify-center items-center gap-[2vh] mb-[40px]">
              <View className="flex justify-start flex-row items-center w-full">
                <Text className="text-left text-white font-semibold text-[20px] text-nowrap">Mega Events</Text>
              </View>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                pagingEnabled={true}
                className="w-full h-[40vw] bg-gray-600 rounded-lg overflow-hidden">

                  <View className="w-[90vw] h-full bg-fuchsia-500"></View>
                  <View className="w-[90vw] h-full bg-amber-500"></View>
                  <View className="w-[90vw] h-full bg-rose-500"></View>

              </ScrollView>
            </View>

            <View className="w-full px-[5%] flex flex-col justify-center items-center gap-[2vh] mb-[40px]">
              <View className="flex justify-start flex-row items-center w-full">
                <Text className="text-left text-white font-semibold text-[20px] text-nowrap">Buy Packages</Text>
              </View>


              <View className="w-full flex flex-row flex-wrap rounded-lg justify-between gap-[4vw]">

                  <View className="bg-[#312439] w-[43vw] h-[65vw] rounded-lg border-[1px] border-[rgba(255,255,255,0.18)] overflow-hidden flex flex-col justify-center items-center">
                    <View className="w-full h-[60%] bg-gray-600 overflow-hidden">
                      <Image
                        source={require("../../assets/shapes/hexagon.png")}
                        className="w-full h-full absolute"
                        resizeMode="cover"
                      />
                    </View>
                    <View className="w-full h-[40%] bg-[#312439] border-t-[1px] border-t-[rgba(255,255,255,0.18)] flex flex-col justify-center items-center px-[2vw]">
                      <View className="w-full flex flex-col justify-center items-start gap-[0.1vh]">
                        <Text className="text-left text-white font-semibold text-[20px] text-nowrap">Campfire</Text>
                        <Text className="text-left text-white font-normal text-[9px] text-nowrap">Lorem Ipsum Dolor Amet</Text>
                        <Pressable className="mt-[10px] overflow-hidden bg-cyan-600 px-[4vw] py-[1vh] rounded-sm flex justify-center items-center">
                          <Text className="text-center text-white text-[10px] text-nowrap">Buy</Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>

                  <View className="bg-[#312439] w-[43vw] h-[65vw] rounded-lg border-[1px] border-[rgba(255,255,255,0.18)] overflow-hidden flex flex-col justify-center items-center">
                    <View className="w-full h-[60%] bg-gray-600 overflow-hidden">
                      <Image
                        source={require("../../assets/shapes/hexagon.png")}
                        className="w-full h-full absolute"
                        resizeMode="cover"
                      />
                    </View>
                    <View className="w-full h-[40%] bg-[#312439] border-t-[1px] border-t-[rgba(255,255,255,0.18)] flex flex-col justify-center items-center px-[2vw]">
                      <View className="w-full flex flex-col justify-center items-start gap-[0.1vh]">
                        <Text className="text-left text-white font-semibold text-[20px] text-nowrap">Campfire</Text>
                        <Text className="text-left text-white font-normal text-[9px] text-nowrap">Lorem Ipsum Dolor Amet</Text>
                        <Pressable className="mt-[10px] overflow-hidden bg-cyan-600 px-[4vw] py-[1vh] rounded-sm flex justify-center items-center">
                          <Text className="text-center text-white text-[10px] text-nowrap">Buy</Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>

                  <View className="bg-[#312439] w-[43vw] h-[65vw] rounded-lg border-[1px] border-[rgba(255,255,255,0.18)] overflow-hidden flex flex-col justify-center items-center">
                    <View className="w-full h-[60%] bg-gray-600 overflow-hidden">
                      <Image
                        source={require("../../assets/shapes/hexagon.png")}
                        className="w-full h-full absolute"
                        resizeMode="cover"
                      />
                    </View>
                    <View className="w-full h-[40%] bg-[#312439] border-t-[1px] border-t-[rgba(255,255,255,0.18)] flex flex-col justify-center items-center px-[2vw]">
                      <View className="w-full flex flex-col justify-center items-start gap-[0.1vh]">
                        <Text className="text-left text-white font-semibold text-[20px] text-nowrap">Campfire</Text>
                        <Text className="text-left text-white font-normal text-[9px] text-nowrap">Lorem Ipsum Dolor Amet</Text>
                        <Pressable className="mt-[10px] overflow-hidden bg-cyan-600 px-[4vw] py-[1vh] rounded-sm flex justify-center items-center">
                          <Text className="text-center text-white text-[10px] text-nowrap">Buy</Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>

                  <View className="bg-[#312439] w-[43vw] h-[65vw] rounded-lg border-[1px] border-[rgba(255,255,255,0.18)] overflow-hidden flex flex-col justify-center items-center">
                    <View className="w-full h-[60%] bg-gray-600 overflow-hidden">
                      <Image
                        source={require("../../assets/shapes/hexagon.png")}
                        className="w-full h-full absolute"
                        resizeMode="cover"
                      />
                    </View>
                    <View className="w-full h-[40%] bg-[#312439] border-t-[1px] border-t-[rgba(255,255,255,0.18)] flex flex-col justify-center items-center px-[2vw]">
                      <View className="w-full flex flex-col justify-center items-start gap-[0.1vh]">
                        <Text className="text-left text-white font-semibold text-[20px] text-nowrap">Campfire</Text>
                        <Text className="text-left text-white font-normal text-[9px] text-nowrap">Lorem Ipsum Dolor Amet</Text>
                        <Pressable className="mt-[10px] overflow-hidden bg-cyan-600 px-[4vw] py-[1vh] rounded-sm flex justify-center items-center">
                          <Text className="text-center text-white text-[10px] text-nowrap">Buy</Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>

              </View>


              <View className="w-full flex flex-row justify-end items-center">
                <Pressable className="overflow-hidden bg-cyan-600 px-[4vw] py-[1vh] rounded-sm flex justify-center items-center">
                  <Text className="text-center text-white text-[10px] text-nowrap">See All</Text>
                </Pressable>
              </View>
            </View>



            <View className="w-full px-[5%] flex flex-col justify-center items-center gap-[2vh] mb-[40px]">
              <View className="flex justify-start flex-row items-center w-full">
                <Text className="text-left text-white font-semibold text-[20px] text-nowrap">Promotions</Text>
              </View>


              <View className="w-full flex flex-row flex-wrap rounded-lg justify-between gap-[4vw]">

                  <View className="bg-[#312439] w-[43vw] h-[65vw] rounded-lg border-[1px] border-[rgba(255,255,255,0.18)] overflow-hidden flex flex-col justify-center items-center">
                    <View className="w-full h-[60%] bg-gray-600 overflow-hidden">
                      <Image
                        source={require("../../assets/shapes/hexagon.png")}
                        className="w-full h-full absolute"
                        resizeMode="cover"
                      />
                    </View>
                    <View className="w-full h-[40%] bg-[#312439] border-t-[1px] border-t-[rgba(255,255,255,0.18)] flex flex-col justify-center items-center px-[2vw]">
                      <View className="w-full flex flex-col justify-center items-start gap-[0.1vh]">
                        <Text className="text-left text-white font-semibold text-[20px] text-nowrap">Campfire</Text>
                        <Text className="text-left text-white font-normal text-[9px] text-nowrap">Lorem Ipsum Dolor Amet</Text>
                        <Pressable className="mt-[10px] overflow-hidden bg-cyan-600 px-[4vw] py-[1vh] rounded-sm flex justify-center items-center">
                          <Text className="text-center text-white text-[10px] text-nowrap">Buy</Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>

                  <View className="bg-[#312439] w-[43vw] h-[65vw] rounded-lg border-[1px] border-[rgba(255,255,255,0.18)] overflow-hidden flex flex-col justify-center items-center">
                    <View className="w-full h-[60%] bg-gray-600 overflow-hidden">
                      <Image
                        source={require("../../assets/shapes/hexagon.png")}
                        className="w-full h-full absolute"
                        resizeMode="cover"
                      />
                    </View>
                    <View className="w-full h-[40%] bg-[#312439] border-t-[1px] border-t-[rgba(255,255,255,0.18)] flex flex-col justify-center items-center px-[2vw]">
                      <View className="w-full flex flex-col justify-center items-start gap-[0.1vh]">
                        <Text className="text-left text-white font-semibold text-[20px] text-nowrap">Campfire</Text>
                        <Text className="text-left text-white font-normal text-[9px] text-nowrap">Lorem Ipsum Dolor Amet</Text>
                        <Pressable className="mt-[10px] overflow-hidden bg-cyan-600 px-[4vw] py-[1vh] rounded-sm flex justify-center items-center">
                          <Text className="text-center text-white text-[10px] text-nowrap">Buy</Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>

              </View>

            </View>





          </ScrollView>
      </SafeAreaView>
    </>
  );
}
