// Bookings.tsx
import { BackgroundGlow } from "@/components/Theme/background";
import { router } from "expo-router";
import { ArrowLeft, CheckCircle, Clock, XCircle } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
    FlatList,
    Image,
    Pressable,
    Text,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { transactions } from "../transactions/dummy_data";

const statusConfig = {
  Completed: {
    icon: CheckCircle,
    color: "#0891B2",
    label: "Completed",
  },
  Pending: {
    icon: Clock,
    color: "#EAB308",
    label: "Pending",
  },
  Rejected: {
    icon: XCircle,
    color: "#E11D48",
    label: "Rejected",
  },
};

type Status = "Completed" | "Pending" | "Rejected";
type StatusBadgeProps = {
  status: Status;
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    
  const { icon: Icon, color, label } = statusConfig[status];

  return (
    <View className="mt-1 flex-row items-center gap-1">
      <Icon size={14} color={color} />
      <Text className="text-[12px]" style={{ color }}>
        {label}
      </Text>
    </View>
  );
};


type TabKey = "All" | "Completed" | "Pending" | "Rejected";
const TABS: TabKey[] = ["All", "Completed", "Pending", "Rejected"];

type Transaction = (typeof transactions)[number];

function TabPill({
    label,
    active,
    onPress,
}: {
    label: TabKey;
    active: boolean;
    onPress: () => void;
}) {
    return (
        <Pressable
            onPress={onPress}
            className={[
                "flex-1 items-center justify-center rounded-xl py-2",
                active ? "bg-[#0891B2]" : "bg-transparent",
            ].join(" ")}
            android_ripple={{ color: "rgba(0,0,0,0.08)", borderless: false }}
        >
            <Text
                className={[
                    "text-sm font-semibold",
                    active ? "text-white" : "text-slate-600",
                ].join(" ")}
            >
                {label}
            </Text>
        </Pressable>
    );
}

function TransactionCard({
    item,
}: {
    item: Transaction;
}) {
    
    return (
        <View className="mb-4">

            <View className="rounded-2xl bg-white p-3 shadow-sm">
                <View className="flex-row items-center justify-between px-2">
                    <Text className="text-xs text-slate-500">{item.date}</Text>
                    <Text className="text-[10px] text-slate-400">{item.orderNo}</Text>
                </View>

                <View className="mt-2 flex-row">
                    <Image
                        source={{ uri: item.image }}
                        className="h-18 w-18 rounded-xl"
                        resizeMode="cover"
                    />

                    <View className="ml-3 flex-1">
                        <Text className="text-base font-bold tracking-wide text-slate-900">
                            {item.packageName}
                        </Text>

                        <StatusBadge status={item.status as Status} />
                    </View>

                    <View className="ml-2 items-end justify-center flex flex-col gap-4">
                        <Text className="text-base tracking-wide text-slate-900">
                            {item.price}
                        </Text>
                        <Pressable
                            onPress={() =>
                                    router.push({
                                    pathname: "/transactions/[id]/detail",
                                    params: { id: item.id },
                                    })
                                }
                            className="w-[92px] items-center justify-center rounded-md bg-[#DAA770] px-3 py-2"
                        >
                            <Text className="text-xs font-bold text-white">
                                See Reciept
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </View>
    );
}


export default function Transactions() {
    const [tab, setTab] = useState<TabKey>("All");
    const [list, setList] = useState<Transaction[]>(transactions);
    const data = useMemo(() => {
        if (tab === "All") return list;
        return list.filter((b) => b.status === tab);

    }, [list, tab]);

    return (
        <SafeAreaView style={{ flex: 1 }} >

            <BackgroundGlow showText={true} />
            <View className="h-14 px-4 justify-center">
                <Pressable
                className="h-11 w-11 rounded-xl bg-zinc-300 items-center justify-center"
                onPress={() => router.back()}
                >
                <ArrowLeft size={22} color="#fff" />
                </Pressable>
            </View>

            <View className="mx-3">

                <Text className="mt-4 text-3xl font-extrabold tracking-wide text-slate-900">
                    Transactions
                </Text>

                <View className="mt-4 flex-row rounded-2xl bg-white px-1 py-1">
                    {TABS.map((t) => (
                        <TabPill
                            key={t}
                            label={t}
                            active={tab === t}
                            onPress={() => setTab(t)}
                        />
                    ))}
                </View>
            </View>

            <View className="flex-1 px-4 pt-3">
                <FlatList
                    data={data}
                    keyExtractor={(i) => String(i.id)}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 24 }}
                    renderItem={({ item }) => (
                        <TransactionCard
                            item={item}
                        />
                    )}
                    ListEmptyComponent={
                        <View className="mt-10 items-center">
                            <Text className="text-sm text-slate-500">
                                No {tab.toLowerCase()} transactions.
                            </Text>
                        </View>
                    }
                />
            </View>

      </SafeAreaView>
    );
}
