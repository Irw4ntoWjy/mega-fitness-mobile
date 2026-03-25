import HeaderNavBar from "@/components/HeaderNavBar/header-nav-bar";
import { ActivePackagesSessionsCard } from "@/components/Profile/active-package-session";
import {
  TimeAvailabilityData,
  TimeAvailabilitySection,
} from "@/components/Profile/time-availability";
import { InnerShadowOverlay } from "@/components/Theme/inner-shadow";
import { useAuth } from "@/hooks/useAuth";
import { AccountSchema } from "@/type/profile";
import { formatDate } from "@/utils/datetimeFormat";
import { BackgroundGlow } from "@components/Theme/background";
import { router } from "expo-router";
import { Pencil } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { profileDetail } from "../api/profile";

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

const ACCOUNT_INFO_FIELDS: ProfileFieldConfig[] = [
  { key: "email", label: "Email" },
];

const TRAINER_EXTRA_FIELDS: ProfileFieldConfig[] = [
  { key: "certification", label: "Certification" },
  { key: "experience", label: "Experience" },
  { key: "availability", label: "Availability" },
];

export function getInitials(name: string): string {
  if (!name) return "";

  const words = name.trim().split(" ");

  if (words.length === 1) {
    return words[0][0].toUpperCase();
  }

  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

export default function Profile() {
  const insets = useSafeAreaInsets();
  const { auth, loading: loadingAuth } = useAuth();

  const [profile, setProfile] = useState<AccountSchema | null>(null);

  const isTrainer = auth?.accountDetail?.account_role === "Trainer";

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

      console.log("DATA:", data);

      setProfile(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    if (!auth?.accountDetail?.account_id) return;
    fetchProfile();
  }, [auth?.accountDetail?.account_id]);

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
            <Text className="text-black/60">{user.account_code}</Text>
          </View>

          <View className="absolute -bottom-15 z-50">
            <View className="w-30 h-30 rounded-full bg-[#E6FAFF] border-[3px] border-[#30B8C4] items-center justify-center">
              <Text className="text-[#0F6B7E] text-2xl font-semibold">
                {getInitials(user.profile_name)}
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
                {auth.accountDetail.account_role}
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
