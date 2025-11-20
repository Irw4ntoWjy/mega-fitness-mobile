import { BackgroundGlow } from "@components/Theme/background";
import { router } from "expo-router";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type AccountProfile = {
  account_id: string;
  account_code: string;
  account_email: string;
  account_status_id: string;
  account_status_name: string;
  account_role: string;
  profile_name: string;
  birth_date: string | null;
  gender: string | null;
  identity_no: string | null;
  picture_url: string | null;
  contact_number: string | null;
};

// TODO: ganti dengan data dari API
const mockAccount: AccountProfile = {
  account_id: "81a297ef-1bd3-4df7-8d2b-8b762e786d32",
  account_code: "MFC-080925-EM-25002",
  account_email: "member@gmail.com",
  account_status_id: "1",
  account_status_name: "Aktif",
  account_role: "Member",
  profile_name: "Member",
  birth_date: "2004-12-06T00:00:00Z",
  gender: "Perempuan",
  identity_no: "1234123412341234",
  picture_url: null,
  contact_number: null,
};

type EditableFieldKey =
  | "fullName"
  | "email"
  | "contactNumber"
  | "identityNumber"
  | "birthDate"
  | "gender";

const fieldConfig: Record<
  EditableFieldKey,
  { label: string; helper?: string; maxLength?: number }
> = {
  fullName: {
    label: "Full Name",
    helper: "",
    maxLength: 60,
  },
  email: {
    label: "Email",
    helper: "",
    maxLength: 80,
  },
  contactNumber: {
    label: "Contact Number",
    helper: "Include country code if needed.",
    maxLength: 20,
  },
  identityNumber: {
    label: "Identity Number",
    helper: "",
    maxLength: 32,
  },
  birthDate: {
    label: "Birth Date",
    helper: "Format: dd/MM/yyyy",
    maxLength: 10,
  },
  gender: {
    label: "Gender",
    helper: "",
    maxLength: 20,
  },
};

function formatBirthDate(input: string | null) {
  if (!input) return "";
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB"); // dd/MM/yyyy
}

export default function EditProfile() {
  const insets = useSafeAreaInsets();
  const account = mockAccount;

  const initialBirth = useMemo(
    () => formatBirthDate(account.birth_date),
    [account.birth_date]
  );

  const [form, setForm] = useState({
    fullName: account.profile_name ?? "",
    memberId: account.account_code ?? "",
    email: account.account_email ?? "",
    contactNumber: account.contact_number ?? "",
    identityNumber: account.identity_no ?? "",
    birthDate: initialBirth,
    gender: account.gender ?? "",
  });

  const [activeField, setActiveField] = useState<EditableFieldKey | null>(null);
  const [tempValue, setTempValue] = useState("");

  const openEditor = (key: EditableFieldKey) => {
    setActiveField(key);
    setTempValue(form[key]);
  };

  const closeEditor = () => {
    setActiveField(null);
    setTempValue("");
  };

  const handleSaveField = () => {
    if (!activeField) return;
    setForm((prev) => ({
      ...prev,
      [activeField]: tempValue,
    }));
    closeEditor();
  };

  const currentConfig = activeField ? fieldConfig[activeField] : null;
  const maxLen = currentConfig?.maxLength;

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
        }}
        className="px-4"
      >
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center"
        >
          <ChevronLeft size={22} color="#000" />
        </Pressable>

        <View className="flex-row items-center">
          <Text className="text-gray-900 text-lg font-semibold ml-2">
            Profile
          </Text>
        </View>
      </View>

      <ScrollView
        className="px-4"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="-mx-4 px-4 pt-2 pb-6">
          <View className="bg-white rounded-3xl border border-[#F1E6F4] px-4 py-2 shadow-sm">
            <ProfileRow
              label="Full Name"
              value={form.fullName || "-"}
              onPress={() => openEditor("fullName")}
            />
            <ProfileRow label="Member ID" value={form.memberId} disabled />
            <ProfileRow
              label="Email"
              value={form.email || "-"}
              onPress={() => openEditor("email")}
            />
            <ProfileRow
              label="Contact Number"
              value={form.contactNumber || "-"}
              onPress={() => openEditor("contactNumber")}
            />
            <ProfileRow
              label="Identity Number"
              value={form.identityNumber || "-"}
              onPress={() => openEditor("identityNumber")}
            />
            <ProfileRow
              label="Birth Date"
              value={form.birthDate || "-"}
              onPress={() => openEditor("birthDate")}
            />
            <ProfileRow
              label="Gender"
              value={form.gender || "-"}
              onPress={() => openEditor("gender")}
            />
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={!!activeField}
        transparent
        animationType="fade"
        onRequestClose={closeEditor}
      >
        <KeyboardAvoidingView
          className="flex-1 justify-end"
          style={{ backgroundColor: "rgba(0,0,0,0.1)" }}
        >
          <Pressable className="flex-1" onPress={closeEditor} />

          <View
            style={{
              paddingBottom: insets.bottom,
              paddingTop: insets.top,
              paddingHorizontal: 20,
              backgroundColor: "#FFFFFF",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
            }}
            className="bg-[#FFFFFF] rounded-t-3xl px-5 pt-4 pb-6 shadow-xl"
          >
            <View className="items-center mb-3">
              <View className="w-10 h-1.5 rounded-full bg-gray-300" />
            </View>

            <View className="flex-row items-center mb-4">
              <Text className="text-base font-semibold text-gray-900">
                {currentConfig?.label}
              </Text>

              <Pressable onPress={handleSaveField} className="ml-auto">
                <Text className="text-sm font-semibold text-[#00A0D2]">
                  Save
                </Text>
              </Pressable>
            </View>

            <View className="rounded-2xl bg-[#F3F5F9] px-4 py-3 mb-2 border border-[#E5E7EB]">
              <TextInput
                value={tempValue}
                onChangeText={(t) =>
                  maxLen ? setTempValue(t.slice(0, maxLen)) : setTempValue(t)
                }
                placeholder={currentConfig?.helper}
                placeholderTextColor="#9CA3AF"
                className="text-sm text-gray-900 h-fit p-0"
                autoFocus
              />
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-gray-400">
                {currentConfig?.helper}
              </Text>

              {maxLen && (
                <Text className="text-sm text-gray-400">
                  {tempValue.length}/{maxLen}
                </Text>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

function ProfileRow({
  label,
  value,
  disabled,
  onPress,
}: {
  label: string;
  value: string;
  disabled?: boolean;
  onPress?: () => void;
}) {
  const content = (
    <View className="flex-row items-center py-3 border-b border-[#F3F4F6] last:border-b-0">
      <View className="flex-1">
        <Text className="text-sm text-gray-400">{label}</Text>
      </View>
      <View className="flex-row items-center max-w-[70%]">
        <Text
          className="text-sm text-gray-900 mr-2"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {value}
        </Text>
        {!disabled && <ChevronRight size={16} color="#9CA3AF" />}
      </View>
    </View>
  );

  if (disabled) {
    return <View>{content}</View>;
  }

  return (
    <Pressable onPress={onPress} android_ripple={{ color: "#E5E7EB" }}>
      {content}
    </Pressable>
  );
}
