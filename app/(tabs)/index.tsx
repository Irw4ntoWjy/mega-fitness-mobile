import { getPackageList } from "@/app/api/package";
import { getPurchaseList, getPurchaseReminder } from "@/app/api/purchase";
import { getSessionLogCount } from "@/app/api/session-log";
import { WarningCard } from "@/components/Member/warning-card";
import { ActivePackagesSessionsCard } from "@/components/Profile/active-package-session";
import { TimeAvailabilityData } from "@/components/Profile/time-availability";
import { BackgroundGlow } from "@/components/Theme/background";
import { InnerShadowOverlay } from "@/components/Theme/inner-shadow";
import { CommisionProgressBar } from "@/components/Trainer/commision-progress-bar";
import { checkSession } from "@/lib/auth-session";
import { getAuth } from "@/lib/auth-storage";
import { fetcher } from "@/lib/fetcher";
import type { PurchaseItemSchema, PurchaseReminder } from "@/type/purchase";
import type { SessionLogCount } from "@/type/session-log";
import { useFocusEffect, useRouter } from "expo-router";
import { ArrowRight, Bell, HelpCircle, X } from "lucide-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { CopilotStep, useCopilot, walkthroughable } from "react-native-copilot";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const WalkableView = walkthroughable(View);

const activePackagesData = {
  activePackagesSummary: {
    totalActive: 0,
    completedSessions: 0,
    totalSessions: 0,
  },
  packages: [
    {
      id: "class-pass",
      label: "Class Pass",
      currentSessions: 0,
      totalSessions: 0,
    },
    {
      id: "private-training",
      label: "Private Training",
      currentSessions: 0,
      totalSessions: 0,
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
  const window = useWindowDimensions();
  const [loading, setLoading] = useState(true);
  const [openNotification, setOpenNotification] = useState(false);
  const [buyPackagesData, setBuyPackagesData] = useState<any[]>([]);
  const [promotionsData, setPromotionsData] = useState<any[]>([]);
  const [specialClassData, setSpecialClassData] = useState<any[]>([]);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profileInitials, setProfileInitials] = useState("");
  const [accountRole, setAccountRole] = useState("Member");
  const [customerProfileId, setCustomerProfileId] = useState<string | null>(null);
  const [activePackagesTotal, setActivePackagesTotal] = useState(0);
  const [activePackagesTotalLoading, setActivePackagesTotalLoading] =
    useState(true);
  const [sessionLogCount, setSessionLogCount] = useState<SessionLogCount | null>(
    null,
  );
  const [sessionLogCountLoading, setSessionLogCountLoading] = useState(true);
  const [activePackagesPopupOpen, setActivePackagesPopupOpen] = useState(false);
  const [activePackagesListLoading, setActivePackagesListLoading] =
    useState(false);
  const [activePackagesList, setActivePackagesList] = useState<
    PurchaseItemSchema[]
  >([]);
  const [purchaseRemindersLoading, setPurchaseRemindersLoading] =
    useState(false);
  const [purchaseReminders, setPurchaseReminders] = useState<PurchaseReminder[]>(
    [],
  );
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

    const resolvedProfileId =
      detail?.profile_id ??
      detail?.profile?.profile_id ??
      detail?.profile?.id ??
      null;
    setCustomerProfileId(
      typeof resolvedProfileId === "string" && resolvedProfileId.trim()
        ? resolvedProfileId
        : null,
    );
    console.log("[account/detail/code] resolved profile id", resolvedProfileId);

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

  const fetchActivePackagesTotal = useCallback(async () => {
    if (isTrainer) return;
    if (!customerProfileId) return;
    setActivePackagesTotalLoading(true);
    try {
      const res = await getPurchaseList({
        customer_profile_id: customerProfileId,
        purchase_status_id: "2",
      });

      if (res.success && res.data) {
        setActivePackagesTotal(
          res.data.total_data ?? res.data.data?.length ?? 0,
        );
      } else {
        setActivePackagesTotal(0);
      }
    } catch {
      setActivePackagesTotal(0);
    } finally {
      setActivePackagesTotalLoading(false);
    }
  }, [customerProfileId, isTrainer]);

  const fetchSessionLogCount = useCallback(async () => {
    if (isTrainer) {
      console.log("[session-log/count] skipped: trainer role");
      return;
    }
    if (!customerProfileId) {
      console.log("[session-log/count] skipped: missing customerProfileId");
      return;
    }
    setSessionLogCountLoading(true);
    try {
      console.log("[session-log/count] fetching", {
        member_profile_id: customerProfileId,
      });
      const res = await getSessionLogCount({
        member_profile_id: customerProfileId,
      });
      console.log("[session-log/count] response", {
        member_profile_id: customerProfileId,
        success: res.success,
        message: res.message,
        data: res.data,
      });
      if (res.success && res.data) {
        const data: any = res.data;
        const normalized: SessionLogCount = {
          active_class: Number(data?.active_class ?? data?.activeClass ?? 0),
          total_class: Number(data?.total_class ?? data?.totalClass ?? 0),
          active_private: Number(
            data?.active_private ?? data?.activePrivate ?? 0,
          ),
          total_private: Number(
            data?.total_private ?? data?.totalPrivate ?? 0,
          ),
        };
        setSessionLogCount(normalized);
      } else {
        setSessionLogCount(null);
      }
    } catch {
      setSessionLogCount(null);
    } finally {
      setSessionLogCountLoading(false);
    }
  }, [customerProfileId, isTrainer]);

  const fetchActivePackagesList = useCallback(async () => {
    if (isTrainer) return;
    if (!customerProfileId) return;
    setActivePackagesListLoading(true);
    try {
      const res = await getPurchaseList({
        customer_profile_id: customerProfileId,
        purchase_status_id: "2",
      });

      if (res.success && res.data) {
        setActivePackagesList(res.data.data ?? []);
      } else {
        setActivePackagesList([]);
      }
    } catch {
      setActivePackagesList([]);
    } finally {
      setActivePackagesListLoading(false);
    }
  }, [customerProfileId, isTrainer]);

  const fetchPurchaseReminders = useCallback(async () => {
    if (isTrainer) return;
    if (!customerProfileId) return;
    setPurchaseRemindersLoading(true);
    try {
      const res = await getPurchaseReminder({
        member_profile_id: customerProfileId,
      });

      if (res.success && Array.isArray(res.data)) {
        setPurchaseReminders(res.data);
      } else {
        setPurchaseReminders([]);
      }
    } catch {
      setPurchaseReminders([]);
    } finally {
      setPurchaseRemindersLoading(false);
    }
  }, [customerProfileId, isTrainer]);

  const openActivePackagesPopup = useCallback(() => {
    setActivePackagesPopupOpen(true);
    fetchActivePackagesList();
  }, [fetchActivePackagesList]);

  const closeActivePackagesPopup = useCallback(() => {
    setActivePackagesPopupOpen(false);
  }, []);

  const navigating = useRef(false);

  useFocusEffect(
    useCallback(() => {
      navigating.current = false;
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      if (!customerProfileId) return;
      fetchActivePackagesTotal();
      fetchSessionLogCount();
      fetchPurchaseReminders();
    }, [
      customerProfileId,
      fetchActivePackagesTotal,
      fetchPurchaseReminders,
      fetchSessionLogCount,
    ]),
  );

  useEffect(() => {
    if (isTrainer) return;
    if (!customerProfileId) return;
    fetchActivePackagesTotal();
    fetchSessionLogCount();
    fetchPurchaseReminders();
  }, [
    customerProfileId,
    fetchActivePackagesTotal,
    fetchPurchaseReminders,
    fetchSessionLogCount,
    isTrainer,
  ]);

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

  const activeClassSessions = sessionLogCount?.active_class ?? 0;
  const totalClassSessions = sessionLogCount?.total_class ?? 0;
  const activePrivateSessions = sessionLogCount?.active_private ?? 0;
  const totalPrivateSessions = sessionLogCount?.total_private ?? 0;

  const completedSessions = activeClassSessions + activePrivateSessions;
  const totalSessions = totalClassSessions + totalPrivateSessions;

  const packagesForActiveSessionsCard = [
    {
      id: "class-pass",
      label: "Class Pass",
      currentSessions: activeClassSessions,
      totalSessions: totalClassSessions,
    },
    {
      id: "private-training",
      label: "Private Training",
      currentSessions: activePrivateSessions,
      totalSessions: totalPrivateSessions,
    },
  ];

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

  function ActivePackageCard({ item }: { item: PurchaseItemSchema }) {
    return (
      <View className="mb-9 min-w-50 max-w-100">
        <View className="bg-white rounded-2xl shadow-md relative">
          <View className="w-full h-44 rounded-t-2xl overflow-hidden bg-black">
            {item.package_cover_image &&
            item.package_cover_image !== "null" &&
            item.package_cover_image !== "" ? (
              <Image
                source={{ uri: String(item.package_cover_image) }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-full bg-black" />
            )}
          </View>

          {isNewPackage(item.requested_at) ? (
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
              {item.purchase_status_name || "Active"}
            </Text>
          </View>

          <View className="flex-row items-center justify-between px-4 py-4">
            <View className="flex-1 pr-2">
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                className="text-black font-bold text-lg"
              >
                {item.package_name.trim()}
              </Text>
              {item.product_type_name ? (
                <Text className="text-gray-500 text-xs mt-1">
                  {item.product_type_name}
                </Text>
              ) : null}
              {typeof item.package_session_quota === "number" ||
              typeof item.package_expiry === "number" ? (
                <Text className="text-gray-500 text-xs mt-0.5">
                  {typeof item.package_session_quota === "number"
                    ? `Quota: ${item.package_session_quota}`
                    : null}
                  {typeof item.package_session_quota === "number" &&
                  typeof item.package_expiry === "number"
                    ? " • "
                    : null}
                  {typeof item.package_expiry === "number"
                    ? `Expiry: ${item.package_expiry} days`
                    : null}
                </Text>
              ) : null}
              {item.package_trainer_name ? (
                <Text className="text-gray-500 text-xs mt-0.5">
                  Trainer: {item.package_trainer_name}
                </Text>
              ) : null}
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <BackgroundGlow showText={true} />
      <Modal
        visible={activePackagesPopupOpen}
        transparent={false}
        animationType="fade"
        onRequestClose={closeActivePackagesPopup}
        presentationStyle="fullScreen"
      >
        <View className="flex-1 p-8 bg-white">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-slate-800">
              Active Packages
            </Text>

            <Pressable
              onPress={closeActivePackagesPopup}
              className="bg-[rgba(0,0,0,0.1)] rounded-full p-4"
            >
              <X size={18} color="black" />
            </Pressable>
          </View>

          {activePackagesListLoading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="small" />
            </View>
          ) : activePackagesList.length === 0 ? (
            <View className="flex-1 items-center justify-center">
              <Text className="text-gray-500">No active packages.</Text>
            </View>
          ) : (
            <ScrollView
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 24 }}
            >
              {activePackagesList.map((item) => (
                <ActivePackageCard key={item.id} item={item} />
              ))}
            </ScrollView>
          )}
        </View>
      </Modal>
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
                    <CommisionProgressBar />
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
                          {activePackagesTotalLoading ||
                          sessionLogCountLoading ? (
                            <View className="py-8 items-center justify-center">
                              <ActivityIndicator size="small" />
                            </View>
                          ) : (
                            <ActivePackagesSessionsCard
                              summary={{
                                totalActive: activePackagesTotal,
                                completedSessions,
                                totalSessions,
                              }}
                              packages={packagesForActiveSessionsCard}
                              onPress={openActivePackagesPopup}
                            />
                          )}
                        </WalkableView>
                      </CopilotStep>
                      <WarningCard
                        reminders={purchaseReminders}
                        loading={purchaseRemindersLoading}
                      />
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
