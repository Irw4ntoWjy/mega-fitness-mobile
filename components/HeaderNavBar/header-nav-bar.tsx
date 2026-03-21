import { AssessmentPages } from "@/app/assessment/dummy_question";
import { router } from "expo-router";
import {
  Bell,
  ChevronLeft,
  FileQuestionMark,
  History,
} from "lucide-react-native";
import { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type HeaderNavBarProps = {
  title?: string;
  backOnly?: boolean;
  showSave?: boolean;
  onSave?: () => void;
  saveLabel?: string;
  onBack?: () => void;
};

export default function HeaderNavBar({
  title,
  backOnly = false,
  showSave = false,
  onSave,
  saveLabel = "Save",
  onBack,
}: HeaderNavBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flexDirection: "row",
        width: "100%",
        paddingTop: insets.top + 8,
        paddingRight: insets.right + 8,
        paddingLeft: insets.left + 8,
        paddingBottom: 8,
        alignItems: "center",
      }}
    >
      <Pressable
        onPress={onBack ?? (() => router.push("/(tabs)"))}
        className="w-10 h-10 items-center justify-center"
      >
        <ChevronLeft size={22} color="#000" />
      </Pressable>

      {title ? <Text className="text-2xl font-bold ml-2">{title}</Text> : null}

      {showSave ? (
        <Pressable
          onPress={onSave}
          className="ml-auto items-center justify-center mr-2"
        >
          <Text className="text-2xl text-cyan-600">{saveLabel}</Text>
        </Pressable>
      ) : null}

      {!backOnly && !showSave ? (
        <View className="flex-row items-center ml-auto gap-3 mr-2">
          <HeaderIcon onPress={() => router.push("/history/history")}>
            <History size={18} color="black" />
          </HeaderIcon>
          <HeaderIcon
            onPress={() =>
              router.push({
                pathname: "/assessment/[section]/[id]/detail",
                params: {
                  section: AssessmentPages.PHYSICAL_ACTIVITY_READINESS,
                  // TODO update use userId
                  id: "1",
                },
              })
            }
          >
            <FileQuestionMark size={18} color="black" />
          </HeaderIcon>
          <HeaderIcon>
            <Bell size={18} color="black" />
          </HeaderIcon>
          {/* <HeaderIcon onPress={() => router.push("/profile/settings-list")}>
            <Settings size={18} color="black" />
          </HeaderIcon> */}
        </View>
      ) : null}
    </View>
  );
}

function HeaderIcon({
  children,
  onPress,
}: {
  children: ReactNode;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="w-10 h-10 rounded-xl items-center justify-center bg-white shadow-sm"
    >
      {children}
    </Pressable>
  );
}
