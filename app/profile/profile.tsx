import HeaderNavBar from "@/components/HeaderNavBar/header-nav-bar";
import { ActivePackagesSessionsCard } from "@/components/Profile/active-package-session";
import {
  TimeAvailabilityData,
  TimeAvailabilitySection,
} from "@/components/Profile/time-availability";
import { InnerShadowOverlay } from "@/components/Theme/inner-shadow";
import { getStoredAccountDetail } from "@/lib/auth-storage";
import { syncAccountDetailFromAuth } from "@/lib/auth-session";
import { AccountDetail } from "@/type/detail-account";
import { BackgroundGlow } from "@components/Theme/background";
import { router } from "expo-router";
import { Pencil } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const fallbackUser = {
  account_id: "9ffd1d6f-e85c-433b-9d68-ddfc09d7a4af",
  account_code: "MFC-191125-PT-25004",
  account_role: "Member",
  profile_name: "Kilto Aznah",
  initials: "KA",
  completedPercent: 10,
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

const TRAINER_EXTRA_FIELDS: ProfileFieldConfig[] = [
  { key: "certification", label: "Certification" },
  { key: "experience_year", label: "Experience" },
];

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function formatBirthDate(value?: string) {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-GB");
}

export default function Profile() {
  const insets = useSafeAreaInsets();
  const [accountDetail, setAccountDetail] = useState<AccountDetail | null>(
    null,
  );

  useEffect(() => {
    let isMounted = true;

    const loadAccount = async () => {
      const cached = await getStoredAccountDetail();
      if (!isMounted) return;
      if (cached) {
        setAccountDetail(cached);
      }

      const synced = await syncAccountDetailFromAuth();
      if (!isMounted || !synced) return;

      const latest = await getStoredAccountDetail();
      if (latest) {
        setAccountDetail(latest);
      }
    };

    loadAccount();
    return () => {
      isMounted = false;
    };
  }, []);

  const resolvedUser = useMemo(() => {
    const profileName =
      accountDetail?.profile_name ?? fallbackUser.profile_name;
    const initials = getInitials(profileName) || fallbackUser.initials;
    return {
      account_id: accountDetail?.account_id ?? fallbackUser.account_id,
      account_code: accountDetail?.account_code ?? fallbackUser.account_code,
      account_role: accountDetail?.account_role ?? fallbackUser.account_role,
      profile_name: profileName,
      initials,
      completedPercent: fallbackUser.completedPercent,
    };
  }, [accountDetail]);

  const isTrainer = resolvedUser.account_role === "Trainer";
  const profileFields = isTrainer
    ? [...BASE_PROFILE_FIELDS, ...TRAINER_EXTRA_FIELDS]
    : BASE_PROFILE_FIELDS;

  const profileValues: Record<string, string> = {
    name: resolvedUser.profile_name,
    phone: accountDetail?.contact_number ?? "-",
    address: "-",
    birth: formatBirthDate(accountDetail?.birth_date) || "-",
    gender: accountDetail?.gender ?? "-",
    weight: accountDetail?.trainer_detail?.weight?.toString() ?? "-",
    height: accountDetail?.trainer_detail?.height?.toString() ?? "-",

    certification: accountDetail?.trainer_detail?.certifications ?? "-",
    experience_year:
      accountDetail?.trainer_detail?.experience_year != null
        ? `${accountDetail.trainer_detail.experience_year}`
        : "-",
  };

  return (
    <View className="flex-1">
      <BackgroundGlow />
      <HeaderNavBar />

      <ScrollView className="px-4 mb-10" showsVerticalScrollIndicator={false}>
        <View className="relative">
          <View style={{ height: HERO_H }} />

          <View className="absolute right-0 bottom-4 items-end">
            <Text className="text-black text-xl font-extrabold">
              {resolvedUser.profile_name}
            </Text>
            <Text className="text-black/60">@{resolvedUser.account_code}</Text>
          </View>

          <View className="absolute -bottom-15 z-50">
            <View className="w-30 h-30 rounded-full bg-[#E6FAFF] border-[3px] border-[#30B8C4] items-center justify-center">
              <Text className="text-[#0F6B7E] text-2xl font-semibold">
                {resolvedUser.initials}
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
                {resolvedUser.account_role}
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

        <View className="pt-8">
          <ProfileInfoSection
            title="Your Info"
            fields={profileFields}
            values={profileValues}
          />
          <ProfileInfoSection
            title="Body Info"
            fields={BODY_INFO_FIELDS}
            values={profileValues}
          />
        </View>
      </ScrollView>
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/profile/edit-profile",
            params: {
              role: resolvedUser.account_role,
              accountId: resolvedUser.account_id,
            },
          })
        }
        style={{
          position: "absolute",
          right: 20,
          bottom: insets.bottom + 20,
        }}
      >
        <View
          className={`
        w-16 h-16 rounded-full
        items-center justify-center
        shadow-lg bg-[#0891B2]
      `}
        >
          <Pencil size={24} color="#FFFFFF" />
        </View>
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
