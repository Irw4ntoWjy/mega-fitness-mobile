import { BackgroundGlow } from "@components/Theme/background";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronDown, ChevronLeft } from "lucide-react-native";
import React, { useMemo, useState } from "react";
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

const mockAccount = {
  role: "Member",
  profile_name: "Member",
  contact_number: "",
  address: "Jl. Lychee, Cemara Asri",
  birth_date: "2000-11-11T00:00:00Z",
  gender: "Male",
  weight: "72",
  height: "175",
  certification: "NASM CPT",
  experience: "5 Years",
  availability: "Mon - Fri",
};

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
    <View className="bg-white rounded-xl px-3 py-3 border-2 border-gray-200 justify-center">
      {children}
    </View>
  );
}

export default function EditProfile() {
  const insets = useSafeAreaInsets();
  const { role, accountId, account } = useLocalSearchParams<{
    role?: string;
    accountId?: string;
    account?: string;
  }>();
  const parsedAccount = useMemo(() => {
    if (typeof account !== "string") {
      return null;
    }
    try {
      return JSON.parse(account);
    } catch {
      try {
        return JSON.parse(decodeURIComponent(account));
      } catch {
        return null;
      }
    }
  }, [account]);
  const baseAccount = useMemo(
    () => ({ ...mockAccount, ...(parsedAccount ?? {}) }),
    [parsedAccount]
  );
  const accountRole =
    typeof role === "string"
      ? role
      : typeof baseAccount.role === "string"
      ? baseAccount.role
      : mockAccount.role;
  const isTrainer = accountRole === "Trainer";

  const initialBirthDate = useMemo(
    () => resolveDate(baseAccount.birth_date, new Date(mockAccount.birth_date)),
    [baseAccount.birth_date]
  );
  const [openGender, setOpenGender] = useState(false);

  const [openDate, setOpenDate] = useState(false);

  const [form, setForm] = useState({
    fullName: baseAccount.profile_name,
    contactNumber: baseAccount.contact_number,
    address: baseAccount.address,
    birthDate: initialBirthDate,
    gender: baseAccount.gender,
    weight: baseAccount.weight,
    height: baseAccount.height,
    certification: baseAccount.certification,
    experience: baseAccount.experience,
    availability: baseAccount.availability,
  });

  const resolvedAccountId =
    typeof accountId === "string"
      ? accountId
      : typeof baseAccount.account_id === "string"
      ? baseAccount.account_id
      : undefined;

  const handleSave = () => {
    console.log("SAVE:", { accountId: resolvedAccountId, form });
    router.back();
  };

  const handleBirthDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    if (Platform.OS === "android") {
      setOpenDate(false);
    }
    if (event.type === "dismissed") {
      return;
    }
    if (selectedDate) {
      setForm({ ...form, birthDate: selectedDate });
    }
  };

  return (
    <View className="flex-1 bg-[#F3F3F3]">
      <BackgroundGlow />

      <View
        style={{
          paddingTop: insets.top + 8,
          paddingRight: insets.right + 6,
          paddingLeft: insets.left + 6,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          className="w-12 h-12 m-4 rounded-lg bg-gray-200 items-center justify-center"
        >
          <ChevronLeft size={24} color="#000" />
        </Pressable>
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          className="px-6 mt-6"
          contentContainerStyle={{ paddingBottom: insets.bottom }}
          showsVerticalScrollIndicator={false}
        >
          <Text className="mb-4 text-2xl font-bold text-gray-800">
            Edit Info
          </Text>
          <View className="mb-4">
            <Label>Full Name</Label>
            <InputBox>
              <TextInput
                value={form.fullName}
                onChangeText={(v) => setForm({ ...form, fullName: v })}
                className="text-lg text-gray-900"
              />
            </InputBox>
          </View>

          <View className="mb-4">
            <Label>Contact Number</Label>
            <InputBox>
              <TextInput
                value={form.contactNumber}
                placeholder="(+62) xxxxxxxxx"
                onChangeText={(v) => setForm({ ...form, contactNumber: v })}
                className="text-lg text-gray-900"
              />
            </InputBox>
          </View>

          <View className="mb-4">
            <Label>Address</Label>
            <InputBox>
              <TextInput
                value={form.address}
                onChangeText={(v) => setForm({ ...form, address: v })}
                className="text-lg text-gray-900"
              />
            </InputBox>
          </View>

          <View className="mb-4">
            <Label>Birth Date</Label>

            <Pressable onPress={() => setOpenDate(!openDate)}>
              <InputBox>
                <View className="flex-row justify-between items-center">
                  <Text className="text-lg text-gray-900">
                    {formatDate(form.birthDate)}
                  </Text>
                  <ChevronDown size={16} color="#9CA3AF" />
                </View>
              </InputBox>
            </Pressable>

            {openDate && (
              <View>
                <DateTimePicker
                  value={form.birthDate}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={handleBirthDateChange}
                />
                {Platform.OS === "ios" && (
                  <Pressable onPress={() => setOpenDate(false)}>
                    <Text className="text-base font-semibold text-gray-700">
                      Done
                    </Text>
                  </Pressable>
                )}
              </View>
            )}
          </View>

          <View className="mb-4">
            <Label>Gender</Label>

            <Pressable onPress={() => setOpenGender(!openGender)}>
              <InputBox>
                <View className="flex-row items-center justify-between">
                  <Text className="text-lg text-gray-900">
                    {form.gender || "Select gender"}
                  </Text>
                  <ChevronDown size={16} color="#9CA3AF" />
                </View>
              </InputBox>
            </Pressable>

            {openGender && (
              <View className="mt-2 bg-white border border-gray-200 rounded-lg overflow-hidden">
                {["Male", "Female"].map((g) => (
                  <Pressable
                    key={g}
                    onPress={() => {
                      setForm({ ...form, gender: g });
                      setOpenGender(false);
                    }}
                    className="px-4 py-3 border-b last:border-b-0 border-gray-200"
                  >
                    <Text className="text-lg text-gray-900">{g}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          {isTrainer && (
            <>
              <Text className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                Trainer Info
              </Text>
              <View className="mb-4">
                <Label>Certification</Label>
                <InputBox>
                  <TextInput
                    value={form.certification}
                    onChangeText={(v) => setForm({ ...form, certification: v })}
                    className="text-lg text-gray-900"
                  />
                </InputBox>
              </View>

              <View className="mb-4">
                <Label>Experience</Label>
                <InputBox>
                  <TextInput
                    value={form.experience}
                    onChangeText={(v) => setForm({ ...form, experience: v })}
                    className="text-lg text-gray-900"
                  />
                </InputBox>
              </View>

              <View className="mb-4">
                <Label>Availability</Label>
                <InputBox>
                  <TextInput
                    value={form.availability}
                    onChangeText={(v) => setForm({ ...form, availability: v })}
                    className="text-lg text-gray-900"
                  />
                </InputBox>
              </View>
            </>
          )}

          <Text className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            Body Info
          </Text>
          <View className="mb-4">
            <Label>Weight</Label>
            <InputBox>
              <View className="flex-row items-center">
                <TextInput
                  value={form.weight}
                  onChangeText={(v) => setForm({ ...form, weight: v })}
                  keyboardType="numeric"
                  className="text-lg text-gray-900 flex-1"
                />
                <Text className="text-lg text-gray-400 ml-2">kg</Text>
              </View>
            </InputBox>
          </View>

          <View className="mb-4">
            <Label>Height</Label>
            <InputBox>
              <View className="flex-row items-center">
                <TextInput
                  value={form.height}
                  onChangeText={(v) => setForm({ ...form, height: v })}
                  keyboardType="numeric"
                  className="text-lg text-gray-900 flex-1"
                />
                <Text className="text-lg text-gray-400 ml-2">cm</Text>
              </View>
            </InputBox>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View
        style={{
          paddingBottom: insets.bottom + 30,
          paddingRight: insets.right + 16,
          paddingLeft: insets.left + 16,
        }}
      >
        <Pressable
          onPress={handleSave}
          className="w-full h-12 rounded-lg bg-[#0E8BAA] items-center justify-center"
        >
          <Text className="text-white font-semibold text-base">Save</Text>
        </Pressable>
      </View>
    </View>
  );
}
