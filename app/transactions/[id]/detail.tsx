// OrderFormReadonlyScreen.tsx
import { BackgroundGlow } from "@/components/Theme/background";
import { router, useLocalSearchParams } from "expo-router";
import {
    ArrowLeft,
    CalendarDays,
    ClipboardList,
    Contact,
    MapPin,
    Package2,
    Phone,
    User,
    Users
} from "lucide-react-native";
import React, { useMemo } from "react";
import {
    Image,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { transactions } from "../dummy_data";


type Props = {
    navigation?: { goBack: () => void };
    route?: { params?: { id?: number; orderNo?: string } };
};

const statusPill = (status: string) => {
    const base = "px-3 py-1 rounded-full border";
    switch (status) {
        case "Completed":
            return `${base} bg-green-50 border-green-200`;
        case "Rejected":
            return `${base} bg-red-50 border-red-200`;
        default:
            return `${base} bg-amber-50 border-amber-200`;
    }
};

const statusText = (status: string) => {
    switch (status) {
        case "Completed":
            return "text-green-700";
        case "Rejected":
            return "text-red-700";
        default:
            return "text-amber-700";
    }
};

function ReadonlyField({
    label,
    value,
    icon,
}: {
    label: string;
    value: string;
    icon?: React.ReactNode;
}) {
    return (
        <View className="mb-4">
            <Text className="text-xs text-zinc-500 mb-2">{label}</Text>
            <View className="flex-row items-center gap-2 bg-zinc-100/20 border border-zinc-200/60 rounded-xl px-3 py-3">
                {icon ? <View className="opacity-70">{icon}</View> : null}
                <TextInput
                    value={value}
                    editable={false}
                    selectTextOnFocus={false}
                    className="flex-1 text-zinc-900"
                />
            </View>
        </View>
    );
}

export default function Transaction({ navigation, route }: Props) {
    const tx = useMemo(() => {
        const { id } = useLocalSearchParams<{ id?: string }>();


        if (typeof id === "number") return transactions.find((t) => t.id === id);

        return transactions[0];
    }, [route?.params?.id, route?.params?.orderNo]);

    if (!tx) {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Text className="text-zinc-900">Transaction not found.</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <BackgroundGlow showText={true} />
            <View className="h-14 px-4 justify-center">
                <Pressable
                    className="h-11 w-11 rounded-xl bg-zinc-300 items-center justify-center"
                    onPress={() => router.back()}
                >
                    <ArrowLeft size={22} color="#fff" />
                </Pressable>
            </View>
            <View className="px-4 pt-3 pb-2 flex-row items-center gap-3">


                <View className="flex-1">
                    <Text className="text-3xl font-extrabold tracking-tight">
                        ORDER FORM
                    </Text>
                    <Text className="text-zinc-500 mt-1">{tx.orderNo}</Text>
                </View>
            </View>

            <ScrollView className="flex-1">
                <View className="px-4 mt-2">
                    <View className="rounded-2xl overflow-hidden bg-zinc-100">
                        <Image
                            source={{ uri: tx.image }}
                            className="w-full h-44"
                            resizeMode="cover"
                        />
                    </View>

                    <Text className="text-3xl font-extrabold mt-5 tracking-tight">
                        {tx.packageName}
                    </Text>

                    <View className="flex-row items-center justify-between mt-3">
                        <View className="flex-row items-center gap-2">
                            <ClipboardList size={18} color="#111827" />
                            <Text className="text-zinc-800 font-semibold">{tx.price}</Text>
                        </View>

                        <View className={statusPill(tx.status)}>
                            <Text className={`text-xs font-semibold ${statusText(tx.status)}`}>
                                {tx.status}
                            </Text>
                        </View>
                    </View>

                    <View className="mt-6">
                        <ReadonlyField
                            label="Full Name"
                            value={tx.contactName}
                            icon={<User size={18} color="#111827" />}
                        />
                        <ReadonlyField
                            label="Contact Number"
                            value={tx.contactNumber}
                            icon={<Phone size={18} color="#111827" />}
                        />
                        <ReadonlyField
                            label="Address"
                            value={tx.address}
                            icon={<MapPin size={18} color="#111827" />}
                        />
                        <ReadonlyField
                            label="Gender"
                            value={tx.gender}
                            icon={<Users size={18} color="#111827" />}
                        />
                        <ReadonlyField
                            label="Birth Date"
                            value={tx.birthDate}
                            icon={<CalendarDays size={18} color="#111827" />}
                        />
                        <ReadonlyField
                            label="Personal Trainer"
                            value={tx.personalTrainer}
                            icon={<Contact size={18} color="#111827" />}
                        />
                        <ReadonlyField 
                            label="Order Date"
                            value={tx.date}
                            icon={<CalendarDays size={18} color="#111827" />} />
                        <ReadonlyField 
                            label="Package Name" 
                            value={tx.packageName} 
                            icon={<Package2 size={18} color="#111827"/>}/>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
