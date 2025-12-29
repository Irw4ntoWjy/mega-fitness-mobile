import HeaderNavBar from "@/components/HeaderNavBar/header-nav-bar";
import { BackgroundGlow } from "@components/Theme/background";
import { router } from "expo-router";
import React, { useState } from "react";
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

function Label({ children }: { children: React.ReactNode }) {
  return <Text className="text-lg text-gray-500 mb-1">{children}</Text>;
}

function InputBox({ children }: { children: React.ReactNode }) {
  return (
    <View className="bg-white border border-gray-300 rounded-lg px-3 py-3">
      {children}
    </View>
  );
}

export default function EditAccount() {
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState({
    email: "jovan.torio@email.com",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const passwordsMatch =
    form.newPassword.length > 0 && form.newPassword === form.confirmPassword;
  const canSave =
    form.email.trim().length > 0 &&
    form.oldPassword.length > 0 &&
    form.newPassword.length > 0 &&
    form.confirmPassword.length > 0 &&
    passwordsMatch;

  const handleSave = () => {
    if (!passwordsMatch) {
      return;
    }
    console.log("SAVE_ACCOUNT:", form);
    router.back();
  };

  return (
    <View className="flex-1 bg-[#F3F3F3]">
      <BackgroundGlow />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <HeaderNavBar title="Edit Account" backOnly />

        <ScrollView
          className="px-6 mt-6"
          contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          <View className="mb-4">
            <Label>Email</Label>
            <InputBox>
              <TextInput
                value={form.email}
                onChangeText={(v) => setForm({ ...form, email: v })}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                className="text-lg text-gray-900 p-0"
              />
            </InputBox>
          </View>

          <View className="mb-4">
            <Label>Old Password</Label>
            <InputBox>
              <TextInput
                value={form.oldPassword}
                onChangeText={(v) => setForm({ ...form, oldPassword: v })}
                secureTextEntry
                className="text-lg text-gray-900 p-0"
              />
            </InputBox>
          </View>

          <View className="mb-4">
            <Label>New Password</Label>
            <InputBox>
              <TextInput
                value={form.newPassword}
                onChangeText={(v) => setForm({ ...form, newPassword: v })}
                secureTextEntry
                className="text-lg text-gray-900 p-0"
              />
            </InputBox>
          </View>

          <View className="mb-4">
            <Label>Confirm New Password</Label>
            <InputBox>
              <TextInput
                value={form.confirmPassword}
                onChangeText={(v) => setForm({ ...form, confirmPassword: v })}
                secureTextEntry
                className="text-lg text-gray-900 p-0"
              />
            </InputBox>
            {form.confirmPassword.length > 0 && !passwordsMatch && (
              <Text className="text-sm text-red-500 mt-2">
                Password confirmation doesn’t match.
              </Text>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View
        style={{
          paddingBottom: insets.bottom + 30,
          paddingRight: insets.right + 20,
          paddingLeft: insets.left + 20,
        }}
      >
        <Pressable
          onPress={handleSave}
          disabled={!canSave}
          className={`w-full h-12 rounded-lg items-center justify-center ${
            canSave ? "bg-[#0E8BAA]" : "bg-[#9CCED9]"
          }`}
        >
          <Text className="text-white font-semibold text-base">Save</Text>
        </Pressable>
      </View>
    </View>
  );
}
