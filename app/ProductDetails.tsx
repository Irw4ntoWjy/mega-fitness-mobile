import { BackgroundGlow } from "@/components/Theme/background";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, ContactRound } from "lucide-react-native";
import { Image, Pressable, ScrollView, Text, View } from "react-native";

export default function ProductDetails() {
const { name } = useLocalSearchParams<{ name: string }>();
const decodedName = decodeURIComponent(name ?? "");

const personalTrainers = [
  { id: '1', PTname: 'Michael Sugeh' },
  { id: '2', PTname: 'John Doe' },
  { id: '3', PTname: 'Jane Smith' },
  { id: '4', PTname: 'Alex Brown' },
  { id: '5', PTname: 'Chris White' },
  { id: '6', PTname: 'Emma Green' },
  { id: '7', PTname: 'Emma Green' },
  { id: '8', PTname: 'Emma Green' },
  { id: '9', PTname: 'Emma Green' },
  { id: '10', PTname: 'Emma Green' },
];


  return (
    <View className="bg-[#EFEFEF] w-full h-full flex flex-col justify-center items-center">
      <BackgroundGlow></BackgroundGlow>
        {/* <View className="bg-[#FF30D9] blur-[70px] w-[50vh] h-[50vh] opacity-[15%] rounded-full absolute z-0 right-[-60vw] top-[-20vh]"></View> */}
        <Image
            source={require("../assets/png/MegaText.png")}
            className="h-[60vh] absolute z-0 right-[-0vw] top-[25vh]"
            resizeMode="contain"
            /> 
        {/* <View className="bg-[#5CD6D6] blur-[70px] w-[50vh] h-[50vh] opacity-[30%] rounded-full absolute z-0 left-[-60vw] bottom-[-20vh]"></View> */}

      <ScrollView className="w-full h-full ">
        <View className="pt-[5vh] rounded-t-xl pb-10 w-full">
          <Pressable
            onPress={() => router.back()}
            className="px-[5%]"
          >
            <View className="bg-[rgba(0,0,0,0.4)] w-10 h-10 rounded-lg flex items-center justify-center">
              <ArrowLeft size={25} color="white" />
            </View>
          </Pressable>

        <View className="w-full flex justify-center items-center mt-10 mb-5">
            <View className="bg-black w-[90vw] h-[30vh] rounded-xl overflow-hidden flex justify-center items-center shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                <Image
                    source={require("../assets/png/Campfire.png")}
                    className=" w-full h-full absolute"
                    resizeMode="cover"
                />
            </View>
        </View>

        <View className="w-full px-[5vw] flex flex-row justify-between items-center mb-5">
            <Text className="text-5xl font-bold">{decodedName.toUpperCase()}</Text>
        </View>

        <View className="w-full px-[5vw] mb-20">
            <Text className="text-lg leading-0 text-justify">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam interdum sapien in maximus posuere. Duis a vulputate eros. Aenean consequat, orci ut condimentum mollis, lacus nunc dictum turpis, nec malesuada neque neque et sapien. Curabitur ultricies sed felis id pretium. Vestibulum eu metus id sem lobortis tincidunt. Mauris non placerat lectus, ac pellentesque est. Duis laoreet enim quis nisl consequat consectetur. Phasellus vitae elit ac dui mattis ornare. Praesent eget placerat sem.
            </Text>
        </View>

        <View className="w-full px-[5vw] flex flex-col justify-start items-center mb-10">
            <View className="w-full flex flex-row justify-start items-center gap-2 mb-5">
                <ContactRound size={40} color="black"/>
                <Text className="text-3xl font-bold">Personal Trainer</Text>
            </View>
            <View className="w-full rounded-xl h-fit p-5">
                <View>
                    <View className="flex-row flex-wrap gap-[5%]">
                    {personalTrainers.map((item) => (
                        <View key={item.id} className="bg-white shadow-[0_0_20px_rgba(0,0,0,0.3)] p-2 rounded-full w-[45%] mb-3 overflow-hidden">
                          <Text className="text-md text-nowrap">• {item.PTname}</Text>
                        </View>
                    ))}
                    </View>
                </View>
            </View>
        </View>
        
        </View>
      </ScrollView>

      <View className="flex flex-row justify-center items-center overflow-hidden mb-12 mt-5 rounded-lg bg-[#DAA770] w-[90vw] h-[8vh] shadow-[0_0_20px_rgba(0,0,0,0.3)]">
        <Text className="text-2xl text-white">Buy Package</Text>
      </View>
    </View>
  );
}
