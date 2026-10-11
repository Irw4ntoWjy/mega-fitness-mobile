import { getAssessmentList } from "@/app/api/assessment";
import Combobox from "@/components/Combobox/combobox";
import { BackgroundGlow } from "@/components/Theme/background";
import { useAuth } from "@/hooks/useAuth";
import { formatDate } from "@/utils/datetimeFormat";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft, ChevronRight, ClipboardList } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

type HistoryItem = {
  assessment_id: number;
  created_at?: string;
  created_by?: string;
  created_name?: string;
};

type SortOrder = "Latest" | "Oldest";

const SORT_OPTIONS: SortOrder[] = ["Latest", "Oldest"];

export default function AssessmentHistory() {
  const { auth, loading: loadingAuth } = useAuth();
  const { memberProfileId } = useLocalSearchParams<{
    memberProfileId?: string;
  }>();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<SortOrder>("Latest");
  const [sortOpen, setSortOpen] = useState(false);

  const profileId = memberProfileId
    ? String(memberProfileId)
    : auth?.accountDetail?.profile_id;

  useEffect(() => {
    // wait until auth has resolved and the profile id is available
    if (loadingAuth || !profileId) return;

    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getAssessmentList({
          limit: -1,
          profile_id: profileId,
        });
        const list = (res.data as any)?.data ?? [];
        if (!cancelled) setItems(list);
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [loadingAuth, profileId]);

  const isWaiting = loadingAuth || !profileId || loading;

  const sortedItems = useMemo(() => {
    const toTime = (value?: string) => {
      if (!value) return 0;
      const time = new Date(value).getTime();
      return Number.isNaN(time) ? 0 : time;
    };

    return [...items].sort((a, b) => {
      const diff = toTime(a.created_at) - toTime(b.created_at);
      return sortOrder === "Latest" ? -diff : diff;
    });
  }, [items, sortOrder]);

  return (
    <View className="flex-1">
      <BackgroundGlow showText />

      <View className="mt-20 h-14 px-4 flex-row items-center">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center"
        >
          <ChevronLeft size={22} color="#000" />
        </Pressable>
        <Text className="ml-2 text-xl font-bold text-black">
          Assessment History
        </Text>
      </View>

      <View className="px-4">
        <Combobox
          value={sortOrder}
          placeholder="Sort by date"
          options={SORT_OPTIONS}
          open={sortOpen}
          onOpenChange={setSortOpen}
          onSelect={(value) => {
            if (value === "Latest" || value === "Oldest") setSortOrder(value);
            setSortOpen(false);
          }}
          showClear={false}
          dropdownInline
        />
      </View>

      {isWaiting ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      ) : items.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <ClipboardList size={40} color="#9CA3AF" />
          <Text className="mt-3 text-gray-500">No assessment history yet</Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {sortedItems.map((item) => (
            <Pressable
              key={item.assessment_id}
              onPress={() =>
                router.push({
                  pathname: "/assessment/detail",
                  params: {
                    assessmentId: String(item.assessment_id),
                    ...(memberProfileId
                      ? { memberProfileId: String(memberProfileId) }
                      : {}),
                  },
                })
              }
              className="mb-3 flex-row items-center justify-between rounded-xl border border-[#30B8C4] bg-white px-4 py-4"
            >
              <View>
                <Text className="text-base font-semibold text-black">
                  {formatDate(item.created_at)}
                </Text>
                <Text className="mt-1 text-sm text-black/60">
                  Last Update by: {item.created_name || item.created_by || "-"}
                </Text>
              </View>
              <ChevronRight size={20} color="#0F6B7E" />
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
