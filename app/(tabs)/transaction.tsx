// Bookings.tsx
import { BackgroundGlow } from "@/components/Theme/background";
import { useAuth } from "@/hooks/useAuth";
import { PurchaseItemSchema } from "@/type/purchase";
import { CheckCircle, Clock, XCircle } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { getPurchaseList } from "../api/purchase";
import { transactions } from "../transactions/dummy_data";

const statusConfig = {
  "1": {
    icon: CheckCircle,
    color: "#0891B2",
    label: "Completed",
  },
  "0": {
    icon: Clock,
    color: "#EAB308",
    label: "Pending",
  },
  "-1": {
    icon: XCircle,
    color: "#E11D48",
    label: "Rejected",
  },
};

type Status = "1" | "0" | "-1";
type StatusBadgeProps = {
  status: Status;
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const { icon: Icon, color, label } = statusConfig[status];

  return (
    <View className="flex-row items-center gap-1">
      <Icon size={14} color={color} />
      <Text className="text-[12px]" style={{ color }}>
        {label}
      </Text>
    </View>
  );
};

type TabKey = "All" | "Completed" | "Pending" | "Rejected";
const TABS: TabKey[] = ["All", "Completed", "Pending", "Rejected"];

const tabToStatus: Record<Exclude<TabKey, "All">, Status> = {
  Completed: "1",
  Pending: "0",
  Rejected: "-1",
};

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
    >
      <Text
        className={[
          "text-md font-semibold",
          active ? "text-white" : "text-slate-600",
        ].join(" ")}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function TransactionCard({ item }: { item: PurchaseItemSchema }) {
  return (
    // <Pressable
    //   onPress={() =>
    //     router.push({
    //       pathname: "/transactions/[id]/detail",
    //       params: { id: item.id },
    //     })
    //   }
    // >
    <View className="rounded-2xl bg-white p-3 shadow-sm mb-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-lg text-slate-500">{item.requested_at}</Text>
        {/* <Text className="text-lg text-slate-400">{item.orderNo}</Text> */}
      </View>

      <View className="mt-2 flex-row">
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            className="h-24 w-24 rounded-xl"
            resizeMode="cover"
          />
        ) : (
          <View className="h-24 w-24 rounded-xl bg-black" />
        )}

        <View className="ml-3 flex-1">
          <Text className="text-base font-bold tracking-wide text-slate-900">
            {item.package_name}
          </Text>
          <Text className="text-base tracking-wide text-slate-900">
            {item.product_name}
          </Text>
          <View className="mt-6 items-end justify-between flex-1">
            <StatusBadge status={item.purchase_status_id as Status} />
          </View>
        </View>
      </View>
    </View>
    // </Pressable>
  );
}

export default function Transactions() {
  const [tab, setTab] = useState<TabKey>("All");
  const [list, setList] = useState<Transaction[]>(transactions);
  const { auth, loading: loadingAuth } = useAuth();
  const [data, setData] = useState<PurchaseItemSchema[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loadingAuth) return;

    const profileId = auth?.accountDetail?.profile_id;
    if (!profileId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getPurchaseList({
          customer_profile_id: profileId,
        });
        const data = res.data;
        if (data) setData(data.data ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [loadingAuth, auth]);

  const filteredData =
    tab === "All"
      ? data
      : data.filter((item) => item.purchase_status_id === tabToStatus[tab]);

  if (loadingAuth) return;

  return (
    <View className="flex-1 mb-20">
      <BackgroundGlow showText={true} />

      <View className="mx-3 mt-20">
        <Text className="mt-4 text-3xl font-extrabold tracking-wide text-slate-900">
          TRANSACTIONS
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
          key={tab}
          data={filteredData}
          keyExtractor={(i) => String(i.id)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => <TransactionCard item={item} />}
          ListEmptyComponent={
            <View className="mt-10 items-center">
              <Text className="text-sm text-slate-500">
                No {tab.toLowerCase()} transactions.
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
}
