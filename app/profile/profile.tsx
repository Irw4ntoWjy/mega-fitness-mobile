import { deleteAccount } from "@/app/api/auth";
import { getPurchaseList } from "@/app/api/purchase";
import { getSessionLogCount } from "@/app/api/session-log";
import { useToast } from "@/components/Toast/toast-provider";
import { getWeekRange } from "@/components/dateWeekRange";
import HeaderNavBar from "@/components/HeaderNavBar/header-nav-bar";
import { ActivePackagesSessionsCard } from "@/components/Profile/active-package-session";
import {
  TimeAvailabilityData,
  TimeAvailabilitySection,
} from "@/components/Profile/time-availability";
import { InnerShadowOverlay } from "@/components/Theme/inner-shadow";
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/lib/auth-storage";
import { getInitials } from "@/lib/utils";
import { AccountSchema, TrainerSchedule } from "@/type/profile";
import type { PurchaseItemSchema } from "@/type/purchase";
import type { SessionLogCount } from "@/type/session-log";
import { formatDate } from "@/utils/datetimeFormat";
import { BackgroundGlow } from "@components/Theme/background";
import { router } from "expo-router";
import { Pencil, X } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { profileDetail } from "../api/profile";
import { getTrainerScheduleList } from "../api/schedule";

const DEFAULT_TIME_AVAILABILITY: TimeAvailabilityData = {
  days: [
    { key: "Mon", label: "Mon" },
    { key: "Tue", label: "Tue" },
    { key: "Wed", label: "Wed" },
    { key: "Thu", label: "Thu" },
    { key: "Fri", label: "Fri" },
    { key: "Sat", label: "Sat" },
    { key: "Sun", label: "Sun" },
  ],
  slotsByDay: {
    Mon: [],
    Tue: [],
    Wed: [],
    Thu: [],
    Fri: [],
    Sat: [],
    Sun: [],
  },
};

const HERO_H = 100;

type ProfileFieldConfig = {
  key: string;
  label: string;
};

const BASE_PROFILE_FIELDS: ProfileFieldConfig[] = [
  { key: "name", label: "Full Name" },
  { key: "phone", label: "Contact Number" },
  { key: "address", label: "Address" },
  { key: "birth", label: "Birth Date" },
  { key: "gender", label: "Gender" },
];

const BODY_INFO_FIELDS: ProfileFieldConfig[] = [
  { key: "weight", label: "Weight" },
  { key: "height", label: "Height" },
];

const ACCOUNT_INFO_FIELDS: ProfileFieldConfig[] = [
  { key: "email", label: "Email" },
];

const MEMBER_DETAIL_FIELDS: ProfileFieldConfig[] = [
  { key: "instagram", label: "Instagram" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "tiktok", label: "TikTok" },
  { key: "facebook", label: "Facebook" },
];

const TRAINER_EXTRA_FIELDS: ProfileFieldConfig[] = [
  { key: "certification", label: "Certification" },
  { key: "experience", label: "Experience" },
  { key: "availability", label: "Availability" },
];

// day_of_week: 0 = Monday ... 6 = Sunday
const DAY_KEYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
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

function mapSchedulesToTimeAvailability(
  schedules: TrainerSchedule[],
): TimeAvailabilityData {
  const slotsByDay: TimeAvailabilityData["slotsByDay"] = {
    Mon: [],
    Tue: [],
    Wed: [],
    Thu: [],
    Fri: [],
    Sat: [],
    Sun: [],
  };

  schedules.forEach((schedule) => {
    const dayIndex = schedule.day_of_week;
    if (dayIndex === undefined || dayIndex === null) return;

    const dayKey = DAY_KEYS[dayIndex];
    if (!dayKey) return;

    slotsByDay[dayKey]?.push({
      id: schedule.id,
      label: `${schedule.time_start} - ${schedule.time_end}`,
    });
  });

  return {
    days: DAY_KEYS.map((k) => ({ key: k, label: k })),
    slotsByDay,
  };
}

export default function Profile() {
  const insets = useSafeAreaInsets();
  const { auth, loading: loadingAuth } = useAuth();
  const { showToast } = useToast();

  const [profile, setProfile] = useState<AccountSchema | null>(null);
  const [trainerScheduleData, setTrainerScheduleData] =
    useState<TimeAvailabilityData>(DEFAULT_TIME_AVAILABILITY);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const isTrainer = auth?.accountDetail?.account_role === "Trainer";
  const customerProfileId = isTrainer
    ? null
    : auth?.accountDetail?.profile_id ?? null;
  const [activePackagesTotal, setActivePackagesTotal] = useState(0);
  const [activePackagesTotalLoading, setActivePackagesTotalLoading] =
    useState(true);
  const [sessionLogCount, setSessionLogCount] =
    useState<SessionLogCount | null>(null);
  const [sessionLogCountLoading, setSessionLogCountLoading] = useState(true);
  const [activePackagesPopupOpen, setActivePackagesPopupOpen] = useState(false);
  const [activePackagesListLoading, setActivePackagesListLoading] =
    useState(false);
  const [activePackagesList, setActivePackagesList] = useState<
    PurchaseItemSchema[]
  >([]);
  const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const isDeleteConfirmValid = deleteConfirmText === "CONFIRM";

  const fetchProfile = async () => {
    try {
      const res = await profileDetail({
        account_id: auth.accountDetail.account_id,
      });

      if (!res.success || !res.data) {
        console.error(res.message);
        return;
      }

      const data = res.data as AccountSchema;

      setProfile(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const fetchTrainerSchedule = async () => {
    try {
      setScheduleLoading(true);

      if (!auth?.accountDetail) return;

      const trainerId =
        (auth?.accountDetail?.trainer_detail as any)?.profile_id ??
        auth?.accountDetail?.profile_id;

      if (!trainerId) return;
      const { monday, sunday } = getWeekRange();

      const res = await getTrainerScheduleList({
        trainer_id: trainerId,
        date_from: monday.toISOString(),
        date_to: sunday.toISOString(),
        this_week: false,
      });

      if (res.success && res.data) {
        const mapped = mapSchedulesToTimeAvailability(
          res.data as TrainerSchedule[],
        );
        setTrainerScheduleData(mapped);
      }
    } catch (err) {
      console.error("Fetch trainer schedule error:", err);
    } finally {
      setScheduleLoading(false);
    }
  };

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
          typeof res.data.total_data === "number"
            ? res.data.total_data
            : (res.data.data ?? []).length,
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

  const fetchSessionTotals = useCallback(async () => {
    if (isTrainer) return;
    if (!customerProfileId) return;

    setSessionLogCountLoading(true);
    try {
      const res = await getSessionLogCount({
        member_profile_id: customerProfileId,
      });

      if (res.success && res.data) {
        const data: any = res.data;
        setSessionLogCount({
          active_class: Number(data?.active_class ?? data?.activeClass ?? 0),
          total_class: Number(data?.total_class ?? data?.totalClass ?? 0),
          active_private: Number(
            data?.active_private ?? data?.activePrivate ?? 0,
          ),
          total_private: Number(data?.total_private ?? data?.totalPrivate ?? 0),
        });
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

  const openActivePackagesPopup = useCallback(() => {
    setActivePackagesPopupOpen(true);
    fetchActivePackagesList();
  }, [fetchActivePackagesList]);

  const closeActivePackagesPopup = useCallback(() => {
    setActivePackagesPopupOpen(false);
  }, []);

  const openDeleteAccountModal = useCallback(() => {
    setDeleteAccountModalOpen(true);
  }, []);

  const closeDeleteAccountModal = useCallback(() => {
    if (deletingAccount) return;
    setDeleteAccountModalOpen(false);
    setDeleteConfirmText("");
  }, [deletingAccount]);

  const confirmDeleteAccount = useCallback(async () => {
    if (!auth?.accountDetail?.account_id) return;
    if (deleteConfirmText !== "CONFIRM") return;

    setDeletingAccount(true);
    try {
      const res = await deleteAccount({
        account_id: auth.accountDetail.account_id,
      });

      if (res.success) {
        setDeleteAccountModalOpen(false);
        setDeleteConfirmText("");
        showToast({
          message: "Account has been deleted",
          variant: "success",
          duration: 2500,
        });
        await logout();
        router.replace("/(auth)/sign-in");
      } else {
        showToast({
          message: res.message || "Failed to delete account",
          variant: "error",
          duration: 2500,
        });
      }
    } catch (err) {
      showToast({
        message: "Failed to delete account",
        variant: "error",
        duration: 2500,
      });
    } finally {
      setDeletingAccount(false);
    }
  }, [auth?.accountDetail?.account_id, deleteConfirmText, showToast]);

  useEffect(() => {
    if (!auth?.accountDetail?.account_id) return;
    fetchProfile();
  }, [auth?.accountDetail?.account_id]);

  useEffect(() => {
    if (!isTrainer) return;
    if (!auth?.accountDetail?.account_id) return;
    fetchTrainerSchedule();
  }, [isTrainer, auth?.accountDetail?.account_id]);

  useEffect(() => {
    if (isTrainer) return;
    if (!customerProfileId) return;

    fetchActivePackagesTotal();
    fetchSessionTotals();
  }, [
    customerProfileId,
    fetchActivePackagesTotal,
    fetchSessionTotals,
    isTrainer,
  ]);

  const profileValues: Record<string, string> = {
    name: profile?.profile_name ?? "-",
    phone: profile?.contact_number ?? "-",
    address: profile?.address ?? "-",
    birth: formatDate(profile?.birth_date) ?? "-",
    gender: profile?.gender ?? "-",
    weight: "-",
    height: "-",
    email: profile?.account_email ?? "-",
    certification: "-",
    experience: "-",
    availability: "-",

    // Member detail — blank if null/undefined
    instagram: profile?.member_detail?.instagram ?? "",
    whatsapp: profile?.member_detail?.whatsapp ?? "",
    tiktok: profile?.member_detail?.tiktok ?? "",
    facebook: profile?.member_detail?.facebook ?? "",
  };

  if (loadingAuth) return;

  const user = {
    account_id: auth.accountDetail.account_id,
    account_code: auth.accountDetail.account_code,
    account_role: auth.accountDetail.account_role,
    profile_name: auth.accountDetail.profile_name,
    completedPercent: 10,
  };

  const profileFields = isTrainer
    ? [...BASE_PROFILE_FIELDS, ...TRAINER_EXTRA_FIELDS]
    : BASE_PROFILE_FIELDS;
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

  return (
    <View className="flex-1">
      <Modal
        visible={activePackagesPopupOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={closeActivePackagesPopup}
        statusBarTranslucent={true}
      >
        <View className="flex-1 bg-[rgba(0,0,0,0.45)]">
          <View className="flex-1 justify-center px-5">
            <View className="max-h-[80%] rounded-3xl bg-white p-6">
              <View className="mb-4 flex-row items-center justify-between">
                <Text className="text-2xl font-bold text-slate-800">
                  Active Packages
                </Text>

                <Pressable
                  onPress={closeActivePackagesPopup}
                  className="rounded-full p-4"
                >
                  <X size={18} color="black" />
                </Pressable>
              </View>

              {activePackagesListLoading ? (
                <View className="min-h-[220px] items-center justify-center">
                  <ActivityIndicator size="small" />
                </View>
              ) : activePackagesList.length === 0 ? (
                <View className="min-h-[220px] items-center justify-center">
                  <Text className="text-gray-500">No active packages.</Text>
                </View>
              ) : (
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingHorizontal: 8,
                    paddingVertical: 8,
                  }}
                >
                  {activePackagesList.map((item) => (
                    <ActivePackageCard key={item.id} item={item} />
                  ))}
                </ScrollView>
              )}
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={deleteAccountModalOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={closeDeleteAccountModal}
        statusBarTranslucent={true}
      >
        <View className="flex-1 items-center justify-center bg-[rgba(0,0,0,0.45)] px-6">
          <View className="w-full rounded-2xl bg-white p-6">
            <Text className="text-xl font-bold text-slate-800">
              Delete Account
            </Text>
            <Text className="mt-2 text-md text-gray-600">
              Are you sure you want to delete this account? This action cannot
              be reversed.
            </Text>

            <Text className="mt-4 text-sm text-gray-500">
              Type <Text className="font-bold text-slate-800">CONFIRM</Text> to
              proceed account deletion.
            </Text>

            <TextInput
              value={deleteConfirmText}
              onChangeText={(text) => setDeleteConfirmText(text.toUpperCase())}
              autoCapitalize="characters"
              autoCorrect={false}
              editable={!deletingAccount}
              placeholder="CONFIRM"
              className="mt-2 rounded-xl border border-gray-300 px-3 py-3 text-md text-black"
            />

            <View className="mt-6 flex-row justify-end gap-3">
              <Pressable
                onPress={closeDeleteAccountModal}
                disabled={deletingAccount}
                className="rounded-xl px-4 py-3"
              >
                <Text className="text-md font-semibold text-gray-600">
                  Cancel
                </Text>
              </Pressable>

              <Pressable
                onPress={confirmDeleteAccount}
                disabled={deletingAccount || !isDeleteConfirmValid}
                className={`items-center justify-center rounded-xl px-4 py-3 min-w-[90px] ${
                  isDeleteConfirmValid ? "bg-red-600" : "bg-red-300"
                }`}
              >
                {deletingAccount ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text className="text-md font-semibold text-white">
                    Confirm
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <BackgroundGlow />
      <HeaderNavBar />

      <ScrollView className="px-4 mb-10" showsVerticalScrollIndicator={false}>
        <View className="relative">
          <View style={{ height: HERO_H }} />

          <View className="absolute right-0 bottom-4 items-end">
            <Text className="text-black text-xl font-extrabold">
              {user.profile_name}
            </Text>
            <Text className="text-black/60">{user.account_code}</Text>
          </View>

          <View className="absolute -bottom-15 z-50">
            <View className="w-30 h-30 rounded-full bg-[#E6FAFF] border-[3px] border-[#30B8C4] items-center justify-center overflow-hidden">
              {auth.accountDetail.picture_url ? (
                <Image
                  source={{
                    uri: `${process.env.EXPO_PUBLIC_ASSET_BASE_URL}${auth.accountDetail.picture_url}`,
                    cache: "reload",
                  }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <Text className="text-[#0F6B7E] text-2xl font-semibold">
                  {getInitials(user.profile_name)}
                </Text>
              )}
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
                {auth.accountDetail.account_role}
              </Text>
            </View>
          </View>

          {isTrainer ? (
            <>
              {scheduleLoading ? (
                <View className="items-center justify-center py-6">
                  <Text className="text-gray-500">Loading schedule...</Text>
                </View>
              ) : (
                <TimeAvailabilitySection
                  data={trainerScheduleData}
                  defaultDayKey="Mon"
                />
              )}
            </>
          ) : (
            <>
              {activePackagesTotalLoading || sessionLogCountLoading ? (
                <View className="items-center justify-center py-8">
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
            </>
          )}
        </View>

        <View className="pt-8">
          <ProfileInfoSection
            title="Your Info"
            fields={profileFields}
            values={profileValues}
          />
          {!isTrainer && (
            <ProfileInfoSection
              title="Social Media"
              fields={MEMBER_DETAIL_FIELDS}
              values={profileValues}
            />
          )}
          {isTrainer ? (
            <ProfileInfoSection
              title="Body Info"
              fields={BODY_INFO_FIELDS}
              values={profileValues}
            />
          ) : null}
          <ProfileInfoSection
            title="Account Info"
            fields={ACCOUNT_INFO_FIELDS}
            values={profileValues}
          />

          <View className="px-2 pt-2">
            <Pressable
              onPress={openDeleteAccountModal}
              className="items-center justify-center rounded-xl border border-red-300 bg-red-50 py-3"
            >
              <Text className="text-red-600 font-semibold text-md">
                Delete Account
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <Pressable
        onPress={() =>
          router.push({
            pathname: "/profile/edit-profile",
            params: {
              role: user.account_role,
              accountId: user.account_id,
            },
          })
        }
        style={{
          position: "absolute",
          right: 20,
          bottom: insets.bottom + 20,
        }}
      >
        {!isTrainer && (
          <View
            className={`
              w-16 h-16 rounded-full
              items-center justify-center
              shadow-lg bg-[#0891B2]
            `}
          >
            <Pencil size={24} color="#FFFFFF" />
          </View>
        )}
      </Pressable>
    </View>
  );
}

function ProfileInfoSection({
  title,
  fields,
  values,
}: {
  title: string;
  fields: ProfileFieldConfig[];
  values: Record<string, string>;
}) {
  return (
    <View className="pb-4 px-2">
      <SectionTitle title={title} />

      <View className="mt-4">
        {fields.map((f) => (
          <View key={f.key} className="mb-4">
            <Text className="text-lg text-gray-500 mb-2">{f.label}</Text>

            <View className="bg-gray-50 rounded-xl px-3 py-3 text-lg border-1 border-gray-200">
              {f.key === "weight" || f.key === "height" ? (
                <View className="flex-row items-center justify-between">
                  <Text className="text-md text-black">
                    {values[f.key] || "-"}
                  </Text>
                  <Text className="text-md text-gray-400">
                    {f.key === "weight" ? "kg" : "cm"}
                  </Text>
                </View>
              ) : (
                <Text className="text-md text-black">
                  {values[f.key] || "-"}
                </Text>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function SectionTitle({
  title,
  className = "",
}: {
  title: string;
  className?: string;
}) {
  return (
    <Text className={`text-gray-800 text-2xl font-bold ${className}`}>
      {title}
    </Text>
  );
}

function ActivePackageCard({ item }: { item: PurchaseItemSchema }) {
  return (
    <View className="mb-9 min-w-50 max-w-100">
      <View className="bg-white rounded-2xl shadow-md relative">
        <View className="flex flex-row items-center justify-start w-full h-20 rounded-t-2xl overflow-hidden bg-cyan-600 p-4 ">
          <View className="h-full w-full flex flex-row justify-start items-center">
            <Text
              className="text-white font-bold text-lg"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.package_name.trim()}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center justify-between px-4 py-4">
          <View className="flex-1 pr-2">
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
