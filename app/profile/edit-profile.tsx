import { BackgroundGlow } from "@components/Theme/background";
import { router } from "expo-router";
import { ChevronDown, ChevronLeft } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const mockAccount = {
  profile_name: "Member",
  contact_number: "",
  address: "Jl. Lychee, Cemara Asri",
  birth_date: "2000-11-11T00:00:00Z",
  gender: "Male",
};

function formatDate(date: Date) {
  return date.toLocaleDateString("en-GB");
}

function Label({ children }: { children: React.ReactNode }) {
  return <Text className="text-xs text-gray-500 mb-1">{children}</Text>;
}

function InputBox({ children }: { children: React.ReactNode }) {
  return (
    <View className="bg-white border border-gray-300 rounded-lg px-3 py-3">
      {children}
    </View>
  );
}

export default function EditProfile() {
  const insets = useSafeAreaInsets();

  const initialBirthDate = useMemo(() => new Date(mockAccount.birth_date), []);
  const [openGender, setOpenGender] = useState(false);

  const [openDate, setOpenDate] = useState(false);
  const years = Array.from({ length: 80 }, (_, i) => 2025 - i);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const [form, setForm] = useState({
    fullName: mockAccount.profile_name,
    contactNumber: mockAccount.contact_number,
    address: mockAccount.address,
    birthDate: initialBirthDate,
    gender: mockAccount.gender,
  });

  const handleSave = () => {
    console.log("SAVE:", form);
    router.back();
  };

  return (
    <View className="flex-1 bg-[#F3F3F3]">
      <BackgroundGlow />

      <View
        style={{
          paddingTop: insets.top + 8,
          paddingRight: insets.right + 16,
          paddingLeft: insets.left + 16,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          className="w-12 h-12 m-4 rounded-lg bg-gray-200 items-center justify-center"
        >
          <ChevronLeft size={24} color="#000" />
        </Pressable>

        <Text className="m-4 text-2xl font-bold text-gray-900">Edit Info</Text>
      </View>

      <ScrollView
        className="px-8 mt-6"
        contentContainerStyle={{ paddingBottom: insets.bottom + 140 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-4">
          <Label>Full Name</Label>
          <InputBox>
            <TextInput
              value={form.fullName}
              onChangeText={(v) => setForm({ ...form, fullName: v })}
              className="text-sm text-gray-900 p-0"
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
              className="text-sm text-gray-900 p-0"
            />
          </InputBox>
        </View>

        <View className="mb-4">
          <Label>Address</Label>
          <InputBox>
            <TextInput
              value={form.address}
              onChangeText={(v) => setForm({ ...form, address: v })}
              className="text-sm text-gray-900 p-0"
            />
          </InputBox>
        </View>

        <View className="mb-4">
          <Label>Birth Date</Label>

          <Pressable onPress={() => setOpenDate(!openDate)}>
            <InputBox>
              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-gray-900">
                  {formatDate(form.birthDate)}
                </Text>
                <ChevronDown size={16} color="#9CA3AF" />
              </View>
            </InputBox>
          </Pressable>

          {openDate && (
            <View className="mt-2 bg-white border border-gray-200 rounded-lg p-3 gap-3">
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {years.map((y) => (
                  <Pressable
                    key={y}
                    onPress={() => {
                      const d = new Date(form.birthDate);
                      d.setFullYear(y);
                      setForm({ ...form, birthDate: d });
                    }}
                    className="px-3 py-2 mr-2 rounded-lg bg-gray-100"
                  >
                    <Text className="text-sm">{y}</Text>
                  </Pressable>
                ))}
              </ScrollView>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {months.map((m, i) => (
                  <Pressable
                    key={m}
                    onPress={() => {
                      const d = new Date(form.birthDate);
                      d.setMonth(i);
                      setForm({ ...form, birthDate: d });
                    }}
                    className="px-3 py-2 mr-2 rounded-lg bg-gray-100"
                  >
                    <Text className="text-sm">{m}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        <View className="mb-4">
          <Label>Gender</Label>

          <Pressable onPress={() => setOpenGender(!openGender)}>
            <InputBox>
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-gray-900">
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
                  <Text className="text-sm text-gray-900">{g}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

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
