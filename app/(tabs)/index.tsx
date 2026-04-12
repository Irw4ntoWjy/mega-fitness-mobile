import { getPackageList } from "@/app/api/package";
import { WarningCard } from "@/components/Member/warning-card";
import { ActivePackagesSessionsCard } from "@/components/Profile/active-package-session";
import { TimeAvailabilityData } from "@/components/Profile/time-availability";
import { BackgroundGlow } from "@/components/Theme/background";
import { InnerShadowOverlay } from "@/components/Theme/inner-shadow";
import { CommisionProgressBar } from "@/components/Trainer/commision-progress-bar";
import { checkSession } from "@/lib/auth-session";
import { getAuth } from "@/lib/auth-storage";
import { fetcher } from "@/lib/fetcher";
import { useFocusEffect, useRouter } from "expo-router";
import { ArrowRight, Bell, HelpCircle } from "lucide-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { CopilotStep, useCopilot, walkthroughable } from "react-native-copilot";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const WalkableView = walkthroughable(View);

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

const HERO_H = 76;

function getInitials(value: string) {
  const parts = value.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "";

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

function normalizeRole(role: string) {
  return role.trim().toLowerCase();
}

function getRoleTheme(role: string) {
  const r = normalizeRole(role);

  if (r.includes("trainer")) {
    return {
      container: "bg-[#F8E6FF] border-[#B44DFF]",
      text: "text-[#7A20C9]",
    };
  }

  if (r.includes("member")) {
    return {
      container: "bg-[#FFF7E6] border-[#D48B28]",
      text: "text-[#B45C17]",
    };
  }

  if (r.includes("admin")) {
    return {
      container: "bg-[#E6F0FF] border-[#3B82F6]",
      text: "text-[#1D4ED8]",
    };
  }

  if (r.includes("staff") || r.includes("employee")) {
    return {
      container: "bg-[#E6FFFA] border-[#14B8A6]",
      text: "text-[#0F766E]",
    };
  }

  return {
    container: "bg-[#F1F5F9] border-[#94A3B8]",
    text: "text-[#334155]",
  };
}

const NEW_WINDOW_DAYS = 7;

function parseBackendDate(value?: string | null) {
  if (!value) return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  const [datePart, timePart] = trimmed.split(" ");
  const [year, month, day] = datePart.split("-").map((n) => Number(n));

  if (!year || !month || !day) return null;

  let hours = 0;
  let minutes = 0;
  let seconds = 0;
  if (timePart) {
    const [h, m, s] = timePart.split(":").map((n) => Number(n));
    hours = h ?? 0;
    minutes = m ?? 0;
    seconds = s ?? 0;
  }

  const dt = new Date(year, month - 1, day, hours, minutes, seconds);
  if (Number.isNaN(dt.getTime())) return null;
  return dt;
}

function isNewPackage(createdAt?: string | null) {
  const created = parseBackendDate(createdAt);
  if (!created) return false;

  const today = new Date();
  const diffMs = today.getTime() - created.getTime();
  if (diffMs < 0) return false;

  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays <= NEW_WINDOW_DAYS;
}

async function fetchAccountDetailByCode(accountCode: string) {
  const endpoint = "/account/detail/code";
  const body = { account_code: accountCode };

  const postRes = await fetcher<any>(endpoint, {
    method: "POST",
    auth: true,
    body,
  });

  if (postRes.success && postRes.data) return postRes;

  return fetcher<any>(
    `${endpoint}?account_code=${encodeURIComponent(accountCode)}`,
    { method: "GET", auth: true },
  );
}

export default function Home() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [openNotification, setOpenNotification] = useState(false);
  const [buyPackagesData, setBuyPackagesData] = useState<any[]>([]);
  const [promotionsData, setPromotionsData] = useState<any[]>([]);
  const [specialClassData, setSpecialClassData] = useState<any[]>([]);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profileInitials, setProfileInitials] = useState("");
  const [accountRole, setAccountRole] = useState("Member");
  const [bottomSectionLayout, setBottomSectionLayout] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const isTrainer = normalizeRole(accountRole).includes("trainer");
  const roleTheme = getRoleTheme(accountRole);

  const loadAccountDetail = useCallback(async () => {
    setProfileLoading(true);

    const auth = await getAuth();
    const accountCode =
      auth?.accessPayload?.account_code ??
      (auth?.accessPayload as any)?.accountCode;

    if (auth?.accessPayload?.account_role) {
      setAccountRole(auth.accessPayload.account_role);
    }
    let detail: any = null;
    if (accountCode) {
      const res = await fetchAccountDetailByCode(accountCode);
      if (res.success && res.data) detail = res.data;
    }

    const resolvedName =
      detail?.profile_name ??
      detail?.profile?.profile_name ??
      detail?.profile?.name ??
      detail?.name ??
      "";

    if (resolvedName) {
      setProfileName(resolvedName);
      setProfileInitials(getInitials(resolvedName));
    } else {
      setProfileName("");
      setProfileInitials("");
    }

    const resolvedRole = detail?.account_role ?? detail?.role;
    if (typeof resolvedRole === "string" && resolvedRole.trim()) {
      setAccountRole(resolvedRole);
    }

    setProfileLoading(false);
  }, []);

  useEffect(() => {
    const guard = async () => {
      const authenticated = await checkSession();

      if (!authenticated) {
        router.replace("/(auth)/sign-in");
        return;
      }

      setLoading(false);
      await loadAccountDetail();
    };

    guard();
  }, [loadAccountDetail, router]);

  useEffect(() => {
    if (!isTrainer) {
      const checkNewUser = async () => {
        const auth = await getAuth();
        if (!auth?.accountDetail?.created_at) return;

        const createdAt = new Date(auth.accountDetail.created_at);
        const now = new Date();
        const diffInHours =
          (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

        if (diffInHours <= 1) {
          setTimeout(() => start(), 500);
        }
      };
      checkNewUser();
    }
  }, []);

  const fetchBuyPackages = useCallback(async () => {
    try {
      const res = await getPackageList({ page: 1, limit: 100 });

      if (res.success && res.data) {
        const formatted = res.data.data.map((item: any) => ({
          id: item.package_id,
          packageName: item.package_name,
          description: item.package_description,
          image: item.package_cover_image,
          packageTag: item.package_tag,
          createdAt: item.created_at ?? null,
        }));

        const packageListItems = formatted.filter((item: any) => {
          if (typeof item.packageTag !== "string") return true;
          const tag = item.packageTag.toLowerCase();
          return !(
            tag.includes("addon") ||
            tag.includes("add on") ||
            tag.includes("%") ||
            tag.includes("special")
          );
        });
        setBuyPackagesData(packageListItems.slice(0, 4));

        const promotions = formatted
          .filter(
            (item: any) =>
              typeof item.packageTag === "string" &&
              item.packageTag.includes("%"),
          )
          .map((item: any) => ({
            id: item.id,
            title: item.packageName,
            discount: item.packageTag,
            image: item.image,
            description: item.description,
            createdAt: item.createdAt ?? null,
          }));
        setPromotionsData(promotions);

        const specialClasses = formatted
          .filter(
            (item: any) =>
              typeof item.packageTag === "string" &&
              item.packageTag.toLowerCase().includes("special"),
          )
          .map((item: any) => ({
            id: item.id,
            title: item.packageName,
            occasion: item.packageTag,
            image: item.image,
            description: item.description,
            createdAt: item.createdAt ?? null,
          }));
        setSpecialClassData(specialClasses);
      }
    } catch (error) {
      console.log("Error fetching buy packages:", error);
    }
  }, []);

  useEffect(() => {
    fetchBuyPackages();
  }, [fetchBuyPackages]);

  const navigating = useRef(false);

  useFocusEffect(
    useCallback(() => {
      navigating.current = false;
    }, []),
  );

  const scrollRef = useRef<ScrollView>(null);
  const stepPositions = useRef<Record<string, number>>({});

  const { start, currentStep } = useCopilot();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  type PromotionActivity = {
    id: string | number;
    title: string;
    discount: string;
    image?: string | null;
    createdAt?: string | null;
  };
  function PromotionCard({ item }: { item: PromotionActivity }) {
    const router = useRouter();
    const [isNavigating, setIsNavigating] = useState(false);

    const handlePress = () => {
      if (isNavigating) return;
      setIsNavigating(true);

      router.push({
        pathname: "/packages/[id]/detail",
        params: { id: String(item.id) },
      });
      setTimeout(() => setIsNavigating(false), 1000);
    };

    return (
      <Pressable
        key={item.id}
        className="w-[44vw] mb-4 mr-5"
        onPress={handlePress}
      >
        <View className="bg-white rounded-2xl shadow-md relative">
          <View className="w-full h-44 rounded-t-2xl overflow-hidden bg-black">
            {item.image && item.image !== "null" && item.image !== "" ? (
              <Image
                source={{ uri: String(item.image) }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-full bg-black" />
            )}
          </View>

          {isNewPackage(item.createdAt) ? (
            <View
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                backgroundColor: "#22C55E",
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 10,
                zIndex: 1000,
                elevation: 30,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 10,
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                }}
              >
                New
              </Text>
            </View>
          ) : null}

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
              {/* <Text className="text-black text-xs mt-1">{item.time}</Text> */}
            </View>
          </View>
        </View>
      </Pressable>
    );
  }

  type SpecialClass = {
    id: string | number;
    title: string;
    occasion: string;
    image?: string | null;
    createdAt?: string | null;
  };
  function SpecialClassCard({ item }: { item: SpecialClass }) {
    const router = useRouter();
    const [isNavigating, setIsNavigating] = useState(false);

    const handlePress = () => {
      if (isNavigating) return;
      setIsNavigating(true);

      router.push({
        pathname: "/packages/[id]/detail",
        params: { id: String(item.id) },
      });
      setTimeout(() => setIsNavigating(false), 1000);
    };

    return (
      <Pressable
        key={item.id}
        className="w-[44vw] mb-4 mr-5"
        onPress={handlePress}
      >
        <View className="bg-white rounded-2xl shadow-md relative">
          <View className="w-full h-44 rounded-t-2xl overflow-hidden bg-black">
            {item.image && item.image !== "null" && item.image !== "" ? (
              <Image
                source={{ uri: String(item.image) }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-full bg-black" />
            )}
          </View>

          {isNewPackage(item.createdAt) ? (
            <View
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                backgroundColor: "#22C55E",
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 10,
                zIndex: 1000,
                elevation: 30,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 10,
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                }}
              >
                New
              </Text>
            </View>
          ) : null}

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
              {item.occasion}
            </Text>
          </View>

          <View className="flex-row items-center justify-between px-4 py-4">
            <View>
              <Text className="text-black font-bold text-lg">{item.title}</Text>
              {/* <Text className="text-black text-xs mt-1">{item.time}</Text> */}
            </View>
          </View>
        </View>
      </Pressable>
    );
  }

  type PackagesActivity = {
    id: string;
    packageName: string;
    description?: string;
    image?: string;
    packageTag?: string | null;
    createdAt?: string | null;
  };
  function PackageCard({ item }: { item: PackagesActivity }) {
    // supaya g double routing

    const router = useRouter();
    const [isNavigating, setIsNavigating] = useState(false);

    const handlePress = () => {
      if (isNavigating) return;
      setIsNavigating(true);

      router.push({
        pathname: "/packages/[id]/detail",
        params: {
          id: item.id,
          packageName: item.packageName,
          description: item.description ?? "",
          image: item.image ?? "",
        },
      });
      setTimeout(() => setIsNavigating(false), 1000);
    };

    return (
      <Pressable
        key={item.id}
        className="w-[44vw] mb-4 mr-5"
        onPress={handlePress}
      >
        <View className="bg-white rounded-2xl shadow-md relative">
          <View className="w-full h-44 rounded-t-2xl overflow-hidden bg-black">
            {item.image && item.image !== "null" && item.image !== "" ? (
              <Image
                source={{ uri: String(item.image) }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-full bg-black" />
            )}
          </View>

          {isNewPackage(item.createdAt) ? (
            <View
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                backgroundColor: "#22C55E",
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 10,
                zIndex: 1000,
                elevation: 30,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 10,
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                }}
              >
                New
              </Text>
            </View>
          ) : null}

          {typeof item.packageTag === "string" &&
          item.packageTag.toLowerCase().includes("bundle") ? (
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
                {item.packageTag}
              </Text>
            </View>
          ) : null}

          <View className="flex-row items-center justify-between px-4 py-4">
            <View>
              <Text className="text-black font-bold text-lg">
                {item.packageName}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <View className="flex-1">
      <BackgroundGlow showText={true} />
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
            <Text className="mt-1 mx-4 font-medium">
              {profileLoading ? "..." : profileName}
            </Text>
          </View>

          <View className="flex-row items-center justify-end gap-1 pr-2">
            {!isTrainer && (
              <CopilotStep
                text="Tutorial here."
                order={3}
                name="onboarding tutorial"
              >
                <WalkableView>
                  <HeaderIcon onPress={() => start()}>
                    <HelpCircle size={18} color="black" />
                  </HeaderIcon>
                </WalkableView>
              </CopilotStep>
            )}

            <CopilotStep
              text="Check your latest notifications here."
              order={4}
              name="notifications"
            >
              <WalkableView>
                <HeaderIcon
                  onPress={() => router.push("/notification/notification")}
                >
                  <Bell size={18} color="black" />
                </HeaderIcon>
              </WalkableView>
            </CopilotStep>
          </View>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 200 }}
      >
        <View>
          <View className="px-4">
            <View className="relative">
              <View style={{ height: HERO_H }} />

              <View className="absolute -bottom-15 z-50">
                <View
                  onLayout={(e) => {
                    stepPositions.current["profile-avatar"] =
                      e.nativeEvent.layout.y;
                  }}
                >
                  <CopilotStep
                    text="Tap your avatar to view and edit your profile."
                    order={2}
                    name="profile-avatar"
                  >
                    <WalkableView>
                      <Pressable
                        onPress={() => router.push("/profile/profile")}
                      >
                        <View className="w-30 h-30 rounded-full bg-[#E6FAFF] border-[3px] border-[#30B8C4] items-center justify-center">
                          {profileLoading ? (
                            <ActivityIndicator size="small" />
                          ) : (
                            <Text className="text-[#0F6B7E] text-2xl font-semibold">
                              {profileInitials ||
                                getInitials(profileName) ||
                                "?"}
                            </Text>
                          )}
                        </View>
                      </Pressable>
                    </WalkableView>
                  </CopilotStep>
                </View>
              </View>
            </View>
            <View className="-mx-4 px-4 pt-16 pb-6 bg-[#EEEEEE]">
              {/* {profileLoading ? (
                <View className="items-center justify-center py-10">
                  <Text className="text-gray-500 text-base">Loading profile...</Text>
                </View>
              ) : ( */}
              <>
                <InnerShadowOverlay height={25} />
                <View className="absolute right-4 top-4 z-40">
                  <View
                    className={`px-5 py-2 rounded-xl border shadow-sm ${
                      roleTheme.container
                    }`}
                  >
                    <Text className={`text-sm font-semibold ${roleTheme.text}`}>
                      {accountRole}
                    </Text>
                  </View>
                </View>

                {isTrainer ? (
                  <View>
                    <View
                      onLayout={(e) => {
                        stepPositions.current["active-packages"] =
                          e.nativeEvent.layout.y;
                      }}
                    >
                      <CopilotStep
                        text="Track your active sessions and package usage."
                        order={5}
                        name="active-packages"
                      >
                        <WalkableView>
                          <ActivePackagesSessionsCard
                            summary={activePackagesData.activePackagesSummary}
                            packages={activePackagesData.packages}
                          />
                          <CommisionProgressBar />
                        </WalkableView>
                      </CopilotStep>
                    </View>
                  </View>
                ) : (
                  <View>
                    <View
                      onLayout={(e) => {
                        stepPositions.current["active-packages"] =
                          e.nativeEvent.layout.y;
                      }}
                    >
                      <CopilotStep
                        text="Track your active sessions and package usage."
                        order={5}
                        name="active-packages"
                      >
                        <WalkableView>
                          <ActivePackagesSessionsCard
                            summary={activePackagesData.activePackagesSummary}
                            packages={activePackagesData.packages}
                          />
                        </WalkableView>
                      </CopilotStep>
                      <WarningCard />
                    </View>
                  </View>
                )}
              </>
              {/* )} */}
            </View>
          </View>
        </View>

        <View
          className="pt-5 rounded-t-xl pb-30 overflow-visible"
          onLayout={(e) => {
            const { width, height } = e.nativeEvent.layout;
            setBottomSectionLayout((prev) =>
              prev?.width === width && prev?.height === height
                ? prev
                : { width, height },
            );
          }}
        >
          {/* <View className="flex flex-row justify-between">
            <Text className="text-2xl font-bold text-slate-800 mb-4 mx-5">
              Schedule Activities
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="p-5"
          >
            <View className="flex-col gap-4">
              <View className="flex-row">
                {topRow.map((item) => (
                  <TodayCard key={item.id} item={item} />
                ))}
              </View>
              <View className="flex-row">
                {bottomRow.map((item) => (
                  <TodayCard key={item.id} item={item} />
                ))}
              </View>
            </View>
          </ScrollView> */}

          {/* <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="px-5 py-5"
          >
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                width: 600, // make wider than screen so it scrolls
              }}
            >
              {todaysActivityData.map((item) => (
                <TodayCard key={item.id} item={item} />
              ))}
            </View>
          </ScrollView> */}

          {/* <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            className="overflow-hidden p-5"
          >
            {todaysActivityData.map((item) => (
              <TodayCard key={item.id} item={item} />
            ))}
          </ScrollView> */}

          {/* <View className="flex flex-row justify-between">
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
          </View> */}
          <View className="flex flex-row justify-between">
            <Text className="text-2xl font-bold text-slate-800 mb-4 mx-5">
              Promotions
            </Text>
            {/* <Pressable className="bg-cyan-600 w-8 h-8 rounded-full mx-5 items-center justify-center">
              <ArrowRight size={20} color="white" />
            </Pressable> */}
          </View>

          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            className="overflow-hidden p-5"
          >
            {promotionsData.map((item) => (
              <PromotionCard key={item.id} item={item} />
            ))}
          </ScrollView>

          <View className="flex flex-row justify-between">
            <Text className="text-2xl font-bold text-slate-800 mb-4 mx-5">
              Special Classes
            </Text>
            {/* <Pressable className="bg-cyan-600 w-8 h-8 rounded-full mx-5 items-center justify-center">
              <ArrowRight size={20} color="white" />
            </Pressable> */}
          </View>

          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            className="overflow-hidden p-5"
          >
            {specialClassData.map((item) => (
              <SpecialClassCard key={item.id} item={item} />
            ))}
          </ScrollView>

          <View className="flex flex-row justify-between">
            <Text className="text-2xl font-bold text-slate-800 mb-4 mx-5">
              Package List
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

          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            className="overflow-hidden p-5"
          >
            {buyPackagesData.map((item) => (
              <PackageCard key={item.id} item={item} />
            ))}
          </ScrollView>
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
      className="w-10 h-10 mx-1 rounded-xl items-center justify-center bg-white shadow-sm"
    >
      {children}
    </Pressable>
  );
}
