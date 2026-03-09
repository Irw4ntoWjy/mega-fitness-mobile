// Bookings.tsx
import { BackgroundGlow } from "@/components/Theme/background";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";


type Transaction = {
  id: string
  invoice_number: string
  requested_at: string
}

const extraItem: Transaction = {
  id: "demo",
  invoice_number: "INV-DEMO",
  requested_at: new Date().toISOString(),
};

function TransactionCard({ item }: { item: Transaction }) {
  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/transactions/[id]/detail",
          params: { id: item.id },
        })
      }
      className="mb-4"
    >
      <View className="rounded-2xl bg-white p-3 shadow-sm">
        <View className="flex-row items-center justify-between">
          <Text className="text-lg text-slate-500">
            {new Date(item.requested_at).toLocaleDateString()}
          </Text>

          <Text className="text-lg text-slate-400">
            {item.invoice_number}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

export default function Transactions() {
  const [list, setList] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const customerProfileId = "1";

        const res = await fetch(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/purchase/list?customer_profile_id=${customerProfileId}`
        );

        const data = await res.json();

        setList(data.data ?? []);
      } catch (error) {
        console.log("Fetch error:", error);
      }
    };

    fetchTransactions();
  }, []);


  return (
    <View className="flex-1 mb-20">
      <BackgroundGlow showText={true} />

      <View className="mx-3 mt-20">
        <Text className="mt-4 text-3xl font-extrabold tracking-wide text-slate-900">
          TRANSACTIONS
        </Text>
      </View>

      <View className="flex-1 px-4 pt-3">
        <FlatList
          // data={list}
          data={[extraItem, ...list]}
          keyExtractor={(i) => String(i.id)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => <TransactionCard item={item} />}
          ListEmptyComponent={
            <View className="mt-10 items-center">
              <Text className="text-sm text-slate-500">
                No transactions.
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
}
