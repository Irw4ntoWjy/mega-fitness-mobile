import HeaderNavBar from "@/components/HeaderNavBar/header-nav-bar";
import { useAuth } from "@/hooks/useAuth";
import { BackgroundGlow } from "@components/Theme/background";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronDown } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { profileDetail, updateProfile } from "../api/profile";

function formatDate(date: Date) {
  return date.toLocaleDateString("en-GB");
}

function resolveDate(value: unknown, fallback: Date) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  return fallback;
}

function Label({ children }: { children: React.ReactNode }) {
  return <Text className="text-lg text-gray-500 mb-1">{children}</Text>;
}

function InputBox({ children }: { children: React.ReactNode }) {
  return (
    <View className="bg-white rounded-xl px-2 border-1 border-gray-200 justify-center">
      {children}
    </View>
  );
}

const genderLabels: Record<string, string> = {
  "Laki-laki": "Laki-laki",
  Perempuan: "Perempuan",
  lainnya: "Rather not to say",
};

export default function EditProfile() {
  const insets = useSafeAreaInsets();

  const { role, accountId } = useLocalSearchParams<{
    role?: string;
    accountId?: string;
  }>();

  const [loading, setLoading] = useState(false);
  const [openGender, setOpenGender] = useState(false);
  const [openDate, setOpenDate] = useState(false);

  const [form, setForm] = useState({
    account_id: accountId,
    member_name: "",
    contact_number: "",
    address: "",
    birth_date: new Date(),
    gender: "",
    instagram: "",
    whatsapp: "",
    tiktok: "",
    facebook: "",
  });
  const { auth, loading: loadingAuth } = useAuth();

  const accountRole = typeof role === "string" ? role : "Member";
  const isTrainer = accountRole === "Trainer";

  const resolvedAccountId =
    typeof accountId === "string" ? accountId : undefined;

  useEffect(() => {
    if (!resolvedAccountId) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);

        const res = await profileDetail({
          account_id: resolvedAccountId,
        });

        if (!res.success || !res.data) {
          console.error(res.message);
          return;
        }

        const data = res.data;
        if (!data) return;

        setForm({
          account_id: accountId,
          member_name: data.profile_name ?? "",
          contact_number: data.contact_number ?? "",
          address: data.address ?? "",
          birth_date: resolveDate(data.birth_date, new Date()),
          gender: data.gender ?? "",
          instagram: data.member_detail?.instagram ?? "",
          whatsapp: data.member_detail?.whatsapp ?? "",
          tiktok: data.member_detail?.tiktok ?? "",
          facebook: data.member_detail?.facebook ?? "",
        });
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [resolvedAccountId]);

  const handleSave = async () => {
    try {
      if (!resolvedAccountId) return;
      console.log(auth.accountDetail);
      const payload = {
        ...form,
        account_id: resolvedAccountId,
        email: auth.accountDetail.account_email,
        birth_date: form.birth_date.toISOString(),
        gender: form.gender || "lainnya",
      };

      const res = await updateProfile(payload);

      if (!res.success) {
        console.error("Update failed:", res.message);
        return;
      }

      console.log("Update success:", res.data);

      router.push("/profile/profile");
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const handlebirth_dateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (Platform.OS === "android") {
      setOpenDate(false);
    }
    if (event.type === "dismissed") return;

    if (selectedDate) {
      setForm({ ...form, birth_date: selectedDate });
    }
  };
  if (loadingAuth) return null;

  return (
    <View className="flex-1 bg-[#F3F3F3]">
      <BackgroundGlow />
      <HeaderNavBar title="Edit Info" backOnly route="profile/profile" />

      {loading && (
        <Text className="text-center mt-4 text-gray-500">
          Loading profile...
        </Text>
      )}

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          className="px-6 mt-6"
          contentContainerStyle={{ paddingBottom: insets.bottom }}
          showsVerticalScrollIndicator={false}
        >
          <Text className={`text-gray-800 text-2xl font-bold my-2`}>
            Your Info
          </Text>
          {/* Full Name */}
          <View className="mb-4">
            <Label>Full Name</Label>
            <InputBox>
              <TextInput
                value={form.member_name}
                onChangeText={(v) => setForm({ ...form, member_name: v })}
                className="text-gray-900 w-full py-3"
              />
            </InputBox>
          </View>

          {/* Contact */}
          <View className="mb-4">
            <Label>Contact Number</Label>
            <InputBox>
              <TextInput
                value={form.contact_number}
                placeholder="(+62) xxxxxxxxx"
                onChangeText={(v) => setForm({ ...form, contact_number: v })}
                className="text-gray-900 w-full py-3"
              />
            </InputBox>
          </View>

          {/* Address */}
          <View className="mb-4">
            <Label>Address</Label>
            <InputBox>
              <TextInput
                value={form.address}
                onChangeText={(v) => setForm({ ...form, address: v })}
                className="text-gray-900 w-full py-3"
              />
            </InputBox>
          </View>

          {/* Birth Date */}
          <View className="mb-4">
            <Label>Birth Date</Label>
            <Pressable onPress={() => setOpenDate(!openDate)}>
              <InputBox>
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-900 py-3 px-1">
                    {formatDate(form.birth_date)}
                  </Text>
                  <ChevronDown size={16} color="#9CA3AF" />
                </View>
              </InputBox>
            </Pressable>

            {openDate && (
              <DateTimePicker
                value={form.birth_date}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handlebirth_dateChange}
              />
            )}
          </View>

          {/* Gender */}
          <View className="mb-4">
            <Label>Gender</Label>

            <Pressable onPress={() => setOpenGender(!openGender)}>
              <InputBox>
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-900 py-3 px-1">
                    {form.gender ? genderLabels[form.gender] ?? form.gender : "Select gender"}
                  </Text>
                  <ChevronDown size={16} color="#9CA3AF" />
                </View>
              </InputBox>
            </Pressable>

            {openGender && (
              <View className="mt-2 bg-white border rounded-lg">
                {[
                  { label: "Laki-laki", value: "Laki-laki" },
                  { label: "Perempuan", value: "Perempuan" },
                  { label: "Rather not to say", value: "lainnya" },
                ].map((g) => (
                  <Pressable
                    key={g.value}
                    onPress={() => {
                      setForm({ ...form, gender: g.value });
                      setOpenGender(false);
                    }}
                    className="px-4 py-3 border-b last:border-b-0"
                  >
                    <Text>{g.label}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          {!isTrainer && (
            <>
              <Text className={`text-gray-800 text-2xl font-bold my-2`}>
                Social Media
              </Text>
              <View className="mb-4">
                <Label>Instagram</Label>
                <InputBox>
                  <TextInput
                    value={form.instagram}
                    placeholder="@username"
                    onChangeText={(v) => setForm({ ...form, instagram: v })}
                    className="text-gray-900 w-full py-3"
                  />
                </InputBox>
              </View>

              <View className="mb-4">
                <Label>WhatsApp</Label>
                <InputBox>
                  <TextInput
                    value={form.whatsapp}
                    placeholder="08xxxxxxxxxx"
                    onChangeText={(v) =>
                      setForm({ ...form, whatsapp: v.replace(/[^0-9]/g, "") })
                    }
                    keyboardType="numeric"
                    className="text-gray-900 w-full py-3"
                  />
                </InputBox>
              </View>

              <View className="mb-4">
                <Label>TikTok</Label>
                <InputBox>
                  <TextInput
                    value={form.tiktok}
                    placeholder="@username"
                    onChangeText={(v) => setForm({ ...form, tiktok: v })}
                    className="text-gray-900 w-full py-3"
                  />
                </InputBox>
              </View>

              <View className="mb-4">
                <Label>Facebook</Label>
                <InputBox>
                  <TextInput
                    value={form.facebook}
                    placeholder="username or profile URL"
                    onChangeText={(v) => setForm({ ...form, facebook: v })}
                    className="text-gray-900 w-full py-3"
                  />
                </InputBox>
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Save Button */}
      <View
        style={{
          paddingBottom: insets.bottom + 30,
          paddingHorizontal: 20,
        }}
      >
        <Pressable
          onPress={handleSave}
          className="w-full h-12 rounded-lg bg-[#0E8BAA] items-center justify-center"
        >
          <Text className="text-white font-semibold text-xl">Save</Text>
        </Pressable>
      </View>
    </View>
  );
}
