import HeaderNavBar from "@/components/HeaderNavBar/header-nav-bar";
import { useAuth } from "@/hooks/useAuth";
import { BackgroundGlow } from "@components/Theme/background";
import { router } from "expo-router";
import { ChevronLeft, ChevronRight, Timer } from "lucide-react-native";
import React, { useCallback, useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

type Response = {
  id: string;
  start_at: string;
  end_at: string;
  title: string;
  coach: string;
  color?: string;
};

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function dayKeyFromISO(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function formatMonthLabelFromKey(dayKey: string) {
  const [y, m, d] = dayKey.split("-").map((x) => Number(x));
  const dt = new Date(y, m - 1, d);
  return new Intl.DateTimeFormat("en", { month: "long" }).format(dt);
}

function formatDayNumberFromKey(dayKey: string) {
  return Number(dayKey.split("-")[2]);
}

function formatTimeRange(startISO: string, endISO: string) {
  const start = new Date(startISO);
  const end = new Date(endISO);
  const fmt = (d: Date) =>
    d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return `${fmt(start)} - ${fmt(end)}`;
}

function EventCard({
  title,
  coach,
  time,
  bgColor,
  status,
  durationMinutes,
  onFirstLayout,
  onPress,
}: {
  title: string;
  coach: string;
  time: string;
  bgColor: string;
  status?: "completed" | "upcoming";
  durationMinutes?: number;
  onFirstLayout?: (height: number) => void;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress}>
      <View className="flex-col">
        <View style={{ backgroundColor: bgColor, borderRadius: 16 }}>
          <View
            className="rounded-2xl p-4 shadow-sm max-w-full"
            onLayout={(e) => {
              if (!onFirstLayout) return;
              onFirstLayout(e.nativeEvent.layout.height);
            }}
          >
            <View className="flex-row">
              <View className="justify-between">
                <Text
                  className="text-white font-extrabold text-lg uppercase"
                  numberOfLines={2}
                >
                  {title}
                </Text>

                <View className="flex-row justify-between w-full">
                  <Text className="text-white/90 text-sm" numberOfLines={1}>
                    {coach}
                  </Text>

                  <Text className="text-white text-sm font-semibold ml-auto">
                    {time}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View className="flex-row gap-2 mt-3">
          <View className="bg-white/90 px-3 py-1 rounded-full flex-row items-center shadow-sm shadow-neutral-400/50">
            <Text className="text-xs font-semibold text-gray-800 leading-none">
              {status === "completed" ? "Completed" : "Upcoming"}
            </Text>
          </View>

          <View className="bg-white/90 px-3 py-1 rounded-full flex-row items-center gap-1 shadow-sm shadow-neutral-400/50">
            <Timer size={16} color="black" />
            <Text className="text-xs font-semibold text-gray-800 leading-none">
              {durationMinutes} mins
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function DayRow({
  dayNumber,
  monthLabel,
  events,
  firstEventHeight,
  eventsHeight,
  onEventsColumnLayout,
  onFirstCardHeight,
  onEventPress,
}: {
  dayNumber: number;
  monthLabel: string;
  events: {
    id: string;
    title: string;
    coach: string;
    time: string;
    color?: string;
  }[];
  firstEventHeight: number | null;
  eventsHeight: number | null;
  onEventsColumnLayout: (height: number) => void;
  onFirstCardHeight: (height: number) => void;
  onEventPress: () => void;
}) {
  return (
    <View className="flex-row justify-between gap-6">
      <View
        style={
          firstEventHeight
            ? { height: firstEventHeight, justifyContent: "center" }
            : { justifyContent: "center" }
        }
      >
        <Text className="text-4xl font-bold text-gray-900 text-center">
          {dayNumber}
        </Text>
        <Text className="text-xl  text-gray-500 text-center">{monthLabel}</Text>
      </View>

      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          height: eventsHeight ?? undefined,
        }}
      >
        <View
          style={{
            alignSelf: "stretch",
            minHeight: eventsHeight ?? undefined,
            borderLeftWidth: 3,
            borderColor: "#D1D5DB",
          }}
        />
        {firstEventHeight ? (
          <View
            style={{
              position: "absolute",
              top: (firstEventHeight ?? 0) / 2,
              width: 14,
              height: 14,
              borderRadius: 7,
              backgroundColor: "#fff",
              borderWidth: 2,
              borderColor: "#9CA3AF",
            }}
          />
        ) : null}
      </View>

      <View
        style={{
          gap: 16,
          paddingBottom: 16,
          flexShrink: 1,
        }}
        onLayout={(e) => {
          const h = e.nativeEvent.layout.height;
          onEventsColumnLayout(h);
        }}
      >
        {events.map((ev, idx) => {
          return (
            <EventCard
              key={ev.id}
              title={ev.title}
              coach={ev.coach}
              time={ev.time}
              bgColor={idx % 2 === 0 ? "#DAA770" : "#0891B2"}
              status="completed"
              durationMinutes={60}
              onFirstLayout={idx === 0 ? onFirstCardHeight : undefined}
              onPress={onEventPress}
            />
          );
        })}
      </View>
    </View>
  );
}

export default function Profile() {
  const { auth } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [pickerOpen, setPickerOpen] = useState(false);

  const [firstEventHeightByDay, setFirstEventHeightByDay] = useState<
    Record<string, number | null>
  >({});
  const [eventsHeightByDay, setEventsHeightByDay] = useState<
    Record<string, number | null>
  >({});

  const { monthLabel, year } = useMemo(() => {
    const formatter = new Intl.DateTimeFormat("en", { month: "long" });
    return {
      monthLabel: formatter.format(selectedDate),
      year: selectedDate.getFullYear(),
    };
  }, [selectedDate]);

  const months = useMemo(
    () => [
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
    ],
    [],
  );

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(monthIndex);
    setSelectedDate(newDate);
    setPickerOpen(false);
  };

  const changeYear = useCallback(
    (delta: number) => {
      const newDate = new Date(selectedDate);
      newDate.setFullYear(selectedDate.getFullYear() + delta);
      setSelectedDate(newDate);
    },
    [selectedDate],
  );

  const response: Response[] = useMemo(
    () => [
      {
        id: "e1",
        start_at: "2026-1-06T09:00:00.000Z",
        end_at: "2026-1-06T10:00:00.000Z",
        title: "t",
        coach: "Test Coach",
      },
      {
        id: "e2",
        start_at: "2026-1-06T09:00:00.000Z",
        end_at: "2026-1-06T10:00:00.000Z",
        title: "test eventttttttttttttttttttttttttttttttttttttt",
        coach: "Test Coach",
      },
      {
        id: "e3",
        start_at: "2026-1-07T09:00:00.000Z",
        end_at: "2026-1-07T10:00:00.000Z",
        title: "test eventttttttttttttttttttttttttttttttttttttt",
        coach: "Test Coach",
      },
      {
        id: "e4",
        start_at: "2026-1-07T09:00:00.000Z",
        end_at: "2026-1-07T10:00:00.000Z",
        title: "test eventttttttttttttttttttttttttttttttttttttt",
        coach: "Test Coach",
      },
      {
        id: "e5",
        start_at: "2026-1-08T09:00:00.000Z",
        end_at: "2026-1-08T10:00:00.000Z",
        title: "test eventttttttttttttttttttttttttttttttttttttt",
        coach: "Test Coach",
      },
      {
        id: "e6",
        start_at: "2026-1-08T09:00:00.000Z",
        end_at: "2026-1-08T10:00:00.000Z",
        title: "test eventttttttttttttttttttttttttttttttttttttt",
        coach: "Test Coach",
      },
      {
        id: "e7",
        start_at: "2026-1-08T09:00:00.000Z",
        end_at: "2026-1-08T10:00:00.000Z",
        title: "test eventttttttttttttttttttttttttttttttttttttt",
        coach: "Test Coach",
      },
    ],
    [],
  );

  const eventsInSelectedMonth = useMemo(() => {
    return response.filter((ev) => {
      const d = new Date(ev.start_at);
      return (
        d.getFullYear() === selectedDate.getFullYear() &&
        d.getMonth() === selectedDate.getMonth()
      );
    });
  }, [response, selectedDate]);

  const eventsByDay = useMemo(() => {
    const grouped: Record<string, Response[]> = {};
    for (const ev of eventsInSelectedMonth) {
      const key = dayKeyFromISO(ev.start_at);
      (grouped[key] ||= []).push(ev);
    }
    Object.keys(grouped).forEach((k) => {
      grouped[k].sort((a, b) => +new Date(a.start_at) - +new Date(b.start_at));
    });
    return grouped;
  }, [eventsInSelectedMonth]);

  const dayKeysSorted = useMemo(() => {
    return Object.keys(eventsByDay).sort((a, b) => +new Date(a) - +new Date(b));
  }, [eventsByDay]);

  const handleEventPress = useCallback(() => {
    if (auth?.accountDetail?.account_role === "Member") {
      router.push("/journal/journal");
    }
  }, [auth?.accountDetail?.account_role]);

  return (
    <View className="flex-1">
      <BackgroundGlow />
      <HeaderNavBar backOnly title="History" />

      <View className="mx-6 mt-2 mb-4">
        <Pressable
          className="bg-white shadow-neutral-400/50 shadow-sm rounded-2xl p-4"
          onPress={() => setPickerOpen(true)}
        >
          <View className="flex-row items-center justify-between">
            <View className="w-10 h-10 rounded-full bg-gray-300 items-center justify-center">
              <Text className="text-2xl font-semibold text-white">
                {eventsInSelectedMonth.length}
              </Text>
            </View>

            <View className="items-end">
              <Text className="font-semibold text-2xl uppercase text-gray-800">
                {monthLabel}
              </Text>
              <Text className="text-lg text-gray-800">{year}</Text>
            </View>
          </View>
        </Pressable>

        <Modal
          animationType="fade"
          visible={pickerOpen}
          transparent
          onRequestClose={() => setPickerOpen(false)}
        >
          <Pressable
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
            onPress={() => setPickerOpen(false)}
          >
            <Pressable className="w-6/8 bg-white shadow-neutral-400/50 shadow-sm rounded-4xl pb-6">
              <View className="flex-row items-center justify-between mb-4 px-6 py-4">
                <Pressable onPress={() => changeYear(-1)} className="p-2">
                  <ChevronLeft size={24} color="black" />
                </Pressable>
                <Text className="text-xl font-bold text-black">{year}</Text>
                <Pressable onPress={() => changeYear(1)} className="p-2">
                  <ChevronRight size={24} color="black" />
                </Pressable>
              </View>

              <View className="flex-row flex-wrap -mx-1">
                {months.map((m, idx) => {
                  const isSelected = idx === selectedDate.getMonth();
                  return (
                    <Pressable
                      key={m}
                      onPress={() => handleMonthSelect(idx)}
                      className="w-1/3 px-6 mb-2"
                    >
                      <View
                        className={`rounded-lg py-3 items-center ${
                          isSelected ? "bg-cyan-600" : "bg-white"
                        }`}
                      >
                        <Text
                          className={`text-xl font-semibold ${
                            isSelected ? "text-white" : "text-gray-400"
                          }`}
                        >
                          {m}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      </View>

      <View className="flex-1 background-white">
        <ScrollView showsVerticalScrollIndicator={false} className="mb-36">
          <View className="bg-white rounded-2xl px-8 py-6">
            <View className="flex-col">
              {dayKeysSorted.length === 0 ? (
                <Text className="text-gray-400 text-center text-xl py-6">
                  No events in this month.
                </Text>
              ) : null}

              {dayKeysSorted.map((dayKey, idx) => {
                const dayEvents = eventsByDay[dayKey];

                const cardEvents = dayEvents.map((ev) => ({
                  id: ev.id,
                  title: ev.title,
                  coach: ev.coach,
                  time: formatTimeRange(ev.start_at, ev.end_at),
                  color: ev.color,
                }));

                const firstEventHeight = firstEventHeightByDay[dayKey] ?? null;
                const eventsHeight = eventsHeightByDay[dayKey] ?? null;

                return (
                  <DayRow
                    key={dayKey}
                    dayNumber={formatDayNumberFromKey(dayKey)}
                    monthLabel={formatMonthLabelFromKey(dayKey)}
                    events={cardEvents}
                    firstEventHeight={firstEventHeight}
                    eventsHeight={eventsHeight}
                    onEventsColumnLayout={(h) =>
                      setEventsHeightByDay((prev) => ({ ...prev, [dayKey]: h }))
                    }
                    onFirstCardHeight={(h) =>
                      setFirstEventHeightByDay((prev) => {
                        if (prev[dayKey]) return prev;
                        return { ...prev, [dayKey]: h };
                      })
                    }
                    onEventPress={handleEventPress}
                  />
                );
              })}
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
