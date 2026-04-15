import { BackgroundGlow } from "@/components/Theme/background";
import { ChevronRight } from "lucide-react-native";
import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";

export type MemberItem = {
  id: string;
  name: string;
  picture_url?: string | null;
};
type MemberActionListProps = {
  title: string;
  subtitle: string;
  emptyLabel: string;
  members: MemberItem[];
  onSelectMember: (memberItem: MemberItem) => void;
};

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export default function MemberActionList({
  title,
  subtitle,
  emptyLabel,
  members,
  onSelectMember,
}: MemberActionListProps) {
  return (
    <View className="flex-1 mb-20">
      <BackgroundGlow showText={true} />

      <View className="mx-5 mt-20 mb-4">
        <Text className="text-3xl font-extrabold tracking-wide text-slate-900">
          {title}
        </Text>
        <Text className="mt-2 text-base text-slate-500">{subtitle}</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View className="mx-5 gap-4">
          {members.length === 0 ? (
            <View className="rounded-2xl bg-white px-4 py-6 shadow-sm">
              <Text className="text-center text-slate-500">{emptyLabel}</Text>
            </View>
          ) : (
            members.map((memberItem: MemberItem) => (
              <Pressable
                key={memberItem.id}
                onPress={() => onSelectMember(memberItem)}
                className="rounded-2xl bg-white p-4 shadow-sm"
              >
                <View className="flex-row items-center gap-4">
                  <View className="h-14 w-14 items-center justify-center rounded-full bg-cyan-100 overflow-hidden">
                    {memberItem.picture_url ? (
                      <Image
                        source={{ uri: memberItem.picture_url }}
                        className="h-14 w-14 rounded-full"
                        resizeMode="cover"
                      />
                    ) : (
                      <Text className="text-lg font-bold text-cyan-700">
                        {getInitials(memberItem.name)}
                      </Text>
                    )}
                  </View>

                  <View className="flex-1">
                    <Text className="text-lg font-bold text-slate-900">
                      {memberItem.name}
                    </Text>
                    <Text className="mt-1 text-sm text-slate-500">
                      Member ID {memberItem.id}
                    </Text>
                  </View>

                  <ChevronRight size={20} color="#64748B" />
                </View>
              </Pressable>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
