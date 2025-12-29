import HeaderNavBar from "@/components/HeaderNavBar/header-nav-bar";
import { BackgroundGlow } from "@components/Theme/background";
import { router } from "expo-router";
import { ChevronRight, Trash2, User, X } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  Keyboard,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

export default function SettingsList() {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const username = "Jovan Torio";
  const normalizedUsername = useMemo(
    () => username.trim().toLowerCase(),
    [username]
  );
  const canDelete =
    deleteInput.trim().toLowerCase() === normalizedUsername &&
    deleteInput.length > 0;

  React.useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardVisible(true)
    );
    const hideSub = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardVisible(false)
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const items = [
    {
      title: "Edit Account",
      icon: <User size={20} color="#1F2933" />,
      onPress: () => router.push("/profile/edit-account"),
    },
    {
      title: "Delete Account",
      icon: <Trash2 size={20} color="#B91C1C" />,
      onPress: () => setDeleteOpen(true),
    },
  ];

  return (
    <View className="flex-1">
      <BackgroundGlow showText={true} />
      <HeaderNavBar title="Settings" backOnly />

      <View
        style={{
          flex: 1,
        }}
      >
        <ScrollView
          className="px-4 mt-4"
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 24,
          }}
        >
          {items.map((item, index) => (
            <Pressable key={index} className="mb-3" onPress={item.onPress}>
              <View className="flex-row items-center justify-between bg-white rounded-2xl border border-[#F1E6F4] px-4 py-4 shadow-sm">
                <View className="flex-row items-center">
                  <View className="w-9 h-9 rounded-full bg-[#FFF3E0] items-center justify-center mr-3">
                    {item.icon}
                  </View>
                  <Text className="text-gray-800 text-lg">{item.title}</Text>
                </View>
                <ChevronRight size={18} color="#9CA3AF" />
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>
      <Modal
        transparent
        visible={deleteOpen}
        animationType="fade"
        onRequestClose={() => setDeleteOpen(false)}
      >
        <Pressable
          onPress={() => {
            if (keyboardVisible) {
              Keyboard.dismiss();
              return;
            }
            setDeleteOpen(false);
            setDeleteInput("");
          }}
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 24,
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <Pressable
            onPress={() => {}}
            className="w-full rounded-2xl bg-white p-5 shadow-lg"
          >
            <Pressable
              onPress={() => {
                setDeleteOpen(false);
                setDeleteInput("");
              }}
              className="w-8 h-8 rounded-md bg-gray-100 items-center justify-center ml-auto"
            >
              <X size={20} color="#6B7280" />
            </Pressable>
            <Text className="text-lg text-gray-900 mt-2">
              Are you sure you want to{" "}
              <Text className="font-semibold">delete account</Text>?
            </Text>
            <Text className="text-md text-gray-600 mt-2">
              This action is permanent. {"\n"}Type your username to confirm.
            </Text>
            <View className="mt-4">
              <Text className="text-lg font-semibold text-gray-900">
                {username}
              </Text>
              <Text className="text-md text-gray-500 mt-1">
                You must type the exact username below.
              </Text>
            </View>
            <View className="mt-3 bg-[#F5F5F5] rounded-xl px-3 py-1 border border-gray-200">
              <TextInput
                value={deleteInput}
                onChangeText={setDeleteInput}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Type username to confirm"
                className="text-base text-gray-900"
              />
            </View>
            <Text className="text-xs text-red-500 mt-3 text-center">
              This action can’t be undone!
            </Text>
            <View className="flex-row mt-4">
              <Pressable
                onPress={() => {
                  setDeleteOpen(false);
                  setDeleteInput("");
                }}
                className="flex-1 h-12 rounded-xl border border-gray-300 items-center justify-center mr-2"
              >
                <Text className="text-gray-800 font-semibold">Cancel</Text>
              </Pressable>
              <Pressable
                disabled={!canDelete}
                onPress={() => {
                  console.log("Hapus Akun Ges");
                  setDeleteOpen(false);
                  setDeleteInput("");
                }}
                className={`flex-1 h-12 rounded-xl items-center justify-center ${
                  canDelete ? "bg-red-600" : "bg-red-200"
                }`}
              >
                <Text className="text-white font-semibold">Delete</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
