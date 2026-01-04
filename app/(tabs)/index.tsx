import { ActivePackagesSessionsCard } from "@/components/Profile/active-package-session";
import {
  TimeAvailabilityData,
  TimeAvailabilitySection,
} from "@/components/Profile/time-availability";
import { BackgroundGlow } from "@/components/Theme/background";
import { InnerShadowOverlay } from "@/components/Theme/inner-shadow";
import { getSession } from "@/lib/session";
import { useFocusEffect, useRouter } from "expo-router";
import { ArrowRight, Bell, ShoppingCart } from "lucide-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const user = {
  account_id: "9ffd1d6f-e85c-433b-9d68-ddfc09d7a4af",
  account_code: "MFC-191125-PT-25004",
  account_role: "Member",
  profile_name: "Kilto Aznah",
  initials: "KA",
  total_activity: 1,
  completedPercent: 30,
};

const activePackagesData = {
  activePackagesSummary: {
    totalActive: 5,
    completedSessions: 60,
    totalSessions: 200,
  },
  packages: [
    {
      id: "membership-pass",
      label: "Membership Pass",
      currentSessions: 5,
      totalSessions: 100,
    },
    {
      id: "class-pass",
      label: "Class Pass",
      currentSessions: 50,
      totalSessions: 50,
    },
    {
      id: "private-training",
      label: "Private Training",
      currentSessions: 5,
      totalSessions: 50,
    },
  ],
};

const timeAvailabilityData: TimeAvailabilityData = {
  days: [
    { key: "Sun", label: "Sun" },
    { key: "Mon", label: "Mon" },
    { key: "Tue", label: "Tue" },
    { key: "Wed", label: "Wed" },
    { key: "Thu", label: "Thu" },
    { key: "Fri", label: "Fri" },
    { key: "Sat", label: "Sat" },
  ],
  slotsByDay: {
    Sun: [
      { id: "sun-1", label: "12.00 PM - 04.00 PM" },
      { id: "sun-2", label: "12.00 PM - 04.00 PM" },
      { id: "sun-3", label: "12.00 PM - 04.00 PM" },
      { id: "sun-4", label: "12.00 PM - 04.00 PM" },
    ],
    Mon: [],
    Tue: [],
    Wed: [],
    Thu: [],
    Fri: [],
    Sat: [],
  },
};

const isTrainer = user.account_role === "Trainer";
const HERO_H = 100;

const todaysActivityData = [
  {
    id: 1,
    title: "Campfire",
    time: "03.00PM - 04.00PM",
    duration: "60 min",
    label: "Today",
    image: require("../../assets/png/Campfire.png"),
  },
  {
    id: 2,
    title: "Campfire",
    time: "03.00PM - 04.00PM",
    duration: "60 min",
    label: "Today",
    image: require("../../assets/png/Campfire.png"),
  },
  {
    id: 3,
    title: "Campfire",
    time: "03.00PM - 04.00PM",
    duration: "60 min",
    label: "Today",
    image: require("../../assets/png/Campfire.png"),
  },
  {
    id: 4,
    title: "Campfire",
    time: "03.00PM - 04.00PM",
    duration: "60 min",
    label: "Today",
    image: require("../../assets/png/Campfire.png"),
  },
];

const promotionsData = [
  {
    id: 1,
    title: "Campfire",
    discount: "20% Off",
    image: require("../../assets/png/Campfire.png"),
  },
  {
    id: 2,
    title: "Campfire",
    discount: "20% Off",
    image: require("../../assets/png/Campfire.png"),
  },
  {
    id: 3,
    title: "Campfire",
    discount: "20% Off",
    image: require("../../assets/png/Campfire.png"),
  },
  {
    id: 4,
    title: "Campfire",
    discount: "20% Off",
    image: require("../../assets/png/Campfire.png"),
  },
];

const buyPackagesData = [
  {
    id: 1,
    title: "Campfire",
    image: require("../../assets/png/Campfire.png"),
  },
  { id: 2, title: "Campfire", image: require("../../assets/png/Campfire.png") },
  { id: 3, title: "Campfire", image: require("../../assets/png/Campfire.png") },
  { id: 4, title: "Campfire", image: require("../../assets/png/Campfire.png") },
];

const { width } = Dimensions.get("window");
export default function Home() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const admin = await getSession("admin");
      if (!admin) {
        router.replace("/(auth)/sign-in");
      } else {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const navigating = useRef(false);

  useFocusEffect(
    useCallback(() => {
      navigating.current = false;
    }, [])
  );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const CARD_WIDTH = (width * 0.95 - 16) / 2;
  type TodayActivity = (typeof todaysActivityData)[number];
  function TodayCard({ item }: { item: TodayActivity }) {
    return (
      <Pressable key={item.id} style={{ width: CARD_WIDTH, marginRight: 16 }}>
        <View className="bg-white rounded-2xl shadow-md relative">
          <View className="w-full h-44 rounded-t-2xl overflow-hidden">
            <Image
              source={item.image}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>

          <View
            style={{
              position: "absolute",
              top: -10,
              left: -5,
              backgroundColor: "#06B6D4",
              paddingHorizontal: 12,
              paddingVertical: 7,
              borderRadius: 8,
              zIndex: 1000,
              elevation: 30,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 10,
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: 0.8,
              }}
            >
              {item.label}
            </Text>
          </View>

          <View className="flex-row items-center justify-between px-4 py-4">
            <View>
              <Text className="text-black font-bold text-lg">{item.title}</Text>
              <Text className="text-black text-xs mt-1">{item.time}</Text>
            </View>
          </View>
        </View>
      </Pressable>
    );
  }

  const renderPromotions = () =>
    promotionsData.map((item) => (
      <Pressable
        key={item.id}
        className="relative w-50 h-50 flex justify-center items-center"
      >
        <View className="bg-white shadow-[0_0_10px_rgba(0,0,0,0.3)] rounded-lg w-[92%] h-[92%] overflow-hidden">
          <View className="w-full h-[60%] overflow-hidden">
            <Image source={item.image} className="w-full h-full" />
          </View>

          <View className="w-full h-[40%] flex flex-row justify-between items-center px-3">
            <Text className="text-black font-semibold text-[18px]">
              {item.title}
            </Text>

            <Pressable className="bg-[#DAA770] p-2 rounded-sm">
              <ShoppingCart size={15} color="white" />
            </Pressable>
          </View>
        </View>

        <View className="absolute top-0 left-0 bg-cyan-600 rounded-lg px-6 py-2">
          <Text className="text-[10px] text-white font-medium">
            {item.discount}
          </Text>
        </View>
      </Pressable>
    ));

  const renderBuyPackages = () =>
    buyPackagesData.map((item) => (
      <Pressable
        key={item.id}
        className="bg-white shadow-[0_0_10px_rgba(0,0,0,0.3)] rounded-lg w-47 h-50 overflow-hidden"
      >
        <View className="w-full h-[60%]">
          <Image source={item.image} className="w-full h-full" />
        </View>

        <View className="w-full h-[40%] flex flex-row justify-between items-center px-3">
          <Text className="text-black font-semibold text-[18px]">
            {item.title}
          </Text>

          <Pressable
            onPress={() =>
              router.push({
                pathname: "/ProductDetails",
                params: { name: item.title },
              })
            }
            className="bg-[#DAA770] p-2 rounded-sm"
          >
            <ShoppingCart size={15} color="white" />
          </Pressable>
        </View>
      </Pressable>
    ));

  return (
    <View className="flex-1">
      <BackgroundGlow />
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          paddingTop: insets.top + 8,
          paddingRight: insets.right + 8,
          paddingLeft: insets.left + 8,
          paddingBottom: 12,
        }}
        className="px-4"
      >
        <View className="flex-row items-center ml-auto">
          <View className="ml-3">
            <HeaderIcon>
              <Bell size={18} color="black" />
            </HeaderIcon>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-4">
          <View className="relative ">
            <View style={{ height: HERO_H }} />

            <View className="absolute right-0 bottom-4 items-end">
              <View className="px-[4vw] rounded-full flex flex-row justify-end items-center gap-1">
                <View className="rounded-full bg-[rgba(0,0,0,0.25)] w-5 h-5 flex items-center justify-center overflow-hidden">
                  <Text className="text-center text-[10px] text-white font-medium">
                    2
                  </Text>
                </View>
                <Text className="text-center text-[12px] text-black font-medium">
                  Activity
                </Text>
              </View>
            </View>

            <View className="absolute -bottom-15 z-50">
              <View className="w-30 h-30 rounded-full bg-[#E6FAFF] border-[3px] border-[#30B8C4] items-center justify-center">
                <Text className="text-[#0F6B7E] text-2xl font-semibold">
                  {user.initials}
                </Text>
              </View>
            </View>
          </View>

          <View className="-mx-4 px-4 pt-16 pb-6 bg-[#EEEEEE]">
            <InnerShadowOverlay height={25} />
            <View className="absolute right-4 top-4 z-40">
              <View
                className={`px-5 py-2 rounded-xl border shadow-sm ${
                  isTrainer
                    ? "bg-[#F8E6FF] border-[#B44DFF]"
                    : "bg-[#FFF7E6] border-[#D48B28]"
                }`}
              >
                <Text
                  className={`text-sm font-semibold ${
                    isTrainer ? "text-[#7A20C9]" : "text-[#B45C17]"
                  }`}
                >
                  {user.account_role}
                </Text>
              </View>
            </View>

            {isTrainer ? (
              <>
                <TimeAvailabilitySection
                  data={timeAvailabilityData}
                  defaultDayKey="Sun"
                />
              </>
            ) : (
              <ActivePackagesSessionsCard
                summary={activePackagesData.activePackagesSummary}
                packages={activePackagesData.packages}
              />
            )}
          </View>
        </View>

        <View className="bg-[#EFEFEF] shadow-[0_0_10px_rgba(0,0,0,0.3)] pt-5 rounded-t-xl pb-30 overflow-hidden">
          <BackgroundGlow showText={true} />

          <Image
            source={require("../../assets/png/MegaText.png")}
            className="h-[60vh] absolute z-0 right-[-0vw] top-[60vh]"
            resizeMode="contain"
          />

          <View className="w-full flex flex-col justify-center items-center gap-[2vh]">
            <View className="flex justify-between flex-row items-center w-full px-[4vw]">
              <Text className="text-left text-black font-semibold text-[20px] text-nowrap">
                Today's Activity
              </Text>
              <Pressable className="bg-cyan-600 p-1 flex justify-center items-center rounded-full">
                <ArrowRight
                  size={20}
                  color="white"
                  className="w-[50%] h-[50%] text-black"
                />
              </Pressable>
            </View>

            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              className="w-[95%] overflow-hidden mb-[40px] rounded-lg h-[40%]"
            >
              {todaysActivityData.map((item) => (
                <TodayCard key={item.id} item={item} />
              ))}
            </ScrollView>
          </View>

          <View className="w-full px-[5%] flex flex-col justify-center items-center gap-[2vh] mb-[40px]">
            <View className="flex justify-between flex-row items-center w-full">
              <Text className="text-left text-black font-semibold text-[20px] text-nowrap">
                Promotions
              </Text>
              <Pressable className="bg-cyan-600 p-1 flex justify-center items-center rounded-full">
                <ArrowRight
                  size={20}
                  color="white"
                  className="w-[50%] h-[50%] text-black"
                />
              </Pressable>
            </View>

            <View className="w-full flex flex-row flex-wrap rounded-lg justify-between gap-1">
              {renderPromotions()}
            </View>
          </View>

          <View className="w-full px-[5%] flex flex-col justify-center items-center gap-[2vh] mb-[40px]">
            <View className="flex justify-between flex-row items-center w-full">
              <Text className="text-left text-black font-semibold text-[20px] text-nowrap">
                Buy Packages
              </Text>
              <Pressable
                onPress={() => {
                  if (navigating.current) return;
                  navigating.current = true;
                  router.push("../BuyPackages");
                }}
                className="bg-cyan-600 p-1 flex justify-center items-center rounded-full"
              >
                <ArrowRight
                  size={20}
                  color="white"
                  className="w-[50%] h-[50%] text-black"
                />
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

function HeaderIcon({
  children,
  onPress,
}: {
  children: React.ReactNode;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="w-10 h-10 rounded-xl items-center justify-center bg-white shadow-sm"
    >
      {children}
    </Pressable>
  );
}
