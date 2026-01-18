import { ActivePackagesSessionsCard } from "@/components/Profile/active-package-session";
import { TimeAvailabilityData } from "@/components/Profile/time-availability";
import { BackgroundGlow } from "@/components/Theme/background";
import { InnerShadowOverlay } from "@/components/Theme/inner-shadow";
import { checkSession } from "@/lib/auth-session";
import { useFocusEffect, useRouter } from "expo-router";
import { ArrowRight, Bell } from "lucide-react-native";
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
const HERO_H = 76;

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
    const guard = async () => {
      const authenticated = await checkSession();

      if (!authenticated) {
        router.replace("/(auth)/sign-in");
        return;
      }

      setLoading(false);
    };

    guard();
  }, []);

  const navigating = useRef(false);

  useFocusEffect(
    useCallback(() => {
      navigating.current = false;
    }, []),
  );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  type TodayActivity = (typeof todaysActivityData)[number];
  function TodayCard({ item }: { item: TodayActivity }) {
    return (
      <Pressable key={item.id} className="w-[44vw] mb-4 mr-5">
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

  type PromotionActivity = (typeof promotionsData)[number];
  function PromotionCard({ item }: { item: PromotionActivity }) {
    return (
      <Pressable className="w-[48%] mb-4 mt-2">
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
              {item.discount}
            </Text>
          </View>

          <View className="flex-row items-center justify-between px-4 py-4">
            <View>
              <Text className="text-black font-bold text-lg">{item.title}</Text>
            </View>
          </View>
        </View>
      </Pressable>
    );
  }

  type PackagesActivity = (typeof buyPackagesData)[number];
  function PackageCard({ item }: { item: PackagesActivity }) {
    return (
      <Pressable key={item.id} className="w-[48%] mb-4">
        <View className="bg-white rounded-2xl shadow-md relative">
          <View className="w-full h-44 rounded-t-2xl overflow-hidden">
            <Image
              source={item.image}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>

          <View className="flex-row items-center justify-between px-4 py-4">
            <View>
              <Text className="text-black font-bold text-lg">{item.title}</Text>
            </View>
          </View>
        </View>
      </Pressable>
    );
  }

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
        <View className="flex-row items-center justify-between w-full">
          <View className="flex flex-col">
            <Text className="mt-3 mx-4 font-bold text-2xl">Welcome Back,</Text>
            <Text className="mt-1 mx-4 font-medium">{user.profile_name}</Text>
          </View>

          <HeaderIcon>
            <Bell size={18} color="black" />
          </HeaderIcon>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <View className="px-4">
            <View className="relative">
              <View style={{ height: HERO_H }} />

              <View className="absolute right-0 bottom-4 items-end px-4">
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
                <Pressable onPress={() => router.push("/profile/profile")}>
                  <View className="w-30 h-30 rounded-full bg-[#E6FAFF] border-[3px] border-[#30B8C4] items-center justify-center">
                    <Text className="text-[#0F6B7E] text-2xl font-semibold">
                      {user.initials}
                    </Text>
                  </View>
                </Pressable>
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
                <ActivePackagesSessionsCard
                  summary={activePackagesData.activePackagesSummary}
                  packages={activePackagesData.packages}
                />
              ) : (
                <ActivePackagesSessionsCard
                  summary={activePackagesData.activePackagesSummary}
                  packages={activePackagesData.packages}
                />
              )}
            </View>
          </View>
        </View>

        <View className="pt-5 rounded-t-xl pb-30 overflow-hidden">
          <BackgroundGlow showText={true} />

          <View className="flex flex-row justify-between">
            <Text className="text-2xl font-bold text-slate-800 mb-4 mx-5">
              Today's Activity
            </Text>
            <Pressable className="bg-cyan-600 w-8 h-8 rounded-full mx-5 items-center justify-center">
              <ArrowRight size={20} color="white" />
            </Pressable>
          </View>

          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            className="overflow-hidden p-5"
          >
            {todaysActivityData.map((item) => (
              <TodayCard key={item.id} item={item} />
            ))}
          </ScrollView>

          <View className="flex flex-row justify-between">
            <Text className="text-2xl font-bold text-slate-800 mb-4 mx-5">
              Promotions
            </Text>
            <Pressable className="bg-cyan-600 w-8 h-8 rounded-full mx-5 items-center justify-center">
              <ArrowRight size={20} color="white" />
            </Pressable>
          </View>
          <View className="flex flex-row flex-wrap justify-between mx-5">
            {promotionsData.map((item) => (
              <PromotionCard key={item.id} item={item} />
            ))}
          </View>

          <View className="flex flex-row justify-between mt-4">
            <Text className="text-2xl font-bold text-slate-800 mb-4 mx-5">
              Buy Packages
            </Text>
            <Pressable
              onPress={() => {
                if (navigating.current) return;
                navigating.current = true;
                router.push("./packages/list-package");
              }}
              className="bg-cyan-600 w-8 h-8 rounded-full mx-5 items-center justify-center"
            >
              <ArrowRight size={20} color="white" />
            </Pressable>
          </View>

          <View className="flex flex-row flex-wrap justify-between mx-5">
            {buyPackagesData.map((item) => (
              <PackageCard key={item.id} item={item} />
            ))}
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
      className="w-10 h-10  mx-4 rounded-xl items-center justify-center bg-white shadow-sm"
    >
      {children}
    </Pressable>
  );
}
