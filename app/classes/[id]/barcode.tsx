import { getBookingDetail } from "@/app/api/booking";
import { getPurchaseDetail } from "@/app/api/purchase";
import { BackgroundGlow } from "@/components/Theme/background";
import { BookingDetail } from "@/type/bookings";
import { router, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  CheckCheck,
  Clock,
  User as UserIcon,
} from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function BarcodePages() {
  const { id, trainer, membership } = useLocalSearchParams<{
    id?: string;
    trainer?: string;
    membership?: string;
  }>();

  const isMembership = membership === "true";
  const bookingId = !isMembership ? (id ?? null) : null;
  const purchaseId = isMembership ? (id ?? null) : null;
  const isTrainer = trainer === "true";

  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [packageId, setPackageId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isRefreshed, setIsRefreshed] = useState(isTrainer);
  const [membershipProductName, setMembershipProductName] =
    useState<string>("-");

  useEffect(() => {
    if (isMembership) {
      if (!purchaseId) return;
      let cancelled = false;
      setLoading(true);
      getPurchaseDetail({ purchase_id: purchaseId })
        .then((res) => {
          if (cancelled) return;
          if (res.success && res.data) {
            setMembershipProductName(res.data.product_name || "-");
          } else {
            setMembershipProductName("-");
          }
        })
        .finally(() => {
          if (cancelled) return;
          setLoading(false);
        });
      return () => {
        cancelled = true;
      };
    } else {
      if (!bookingId) return;
      let cancelled = false;
      setLoading(true);
      getBookingDetail({ booking_id: bookingId })
        .then(async (res) => {
          if (cancelled) return;
          if (!res.success || !res.data) {
            setBooking(null);
            setPackageId(null);
            return;
          }

          setBooking(res.data);

          if (
            res.data.booking_status_id === 2 ||
            res.data.booking_status_name === "Selesai"
          ) {
            setIsRefreshed(true);
          } else {
            setIsRefreshed(false);
          }

          const purchaseId = res.data.purchase_id;
          if (!purchaseId) {
            setPackageId(null);
            return;
          }

          const purchaseRes = await getPurchaseDetail({
            purchase_id: purchaseId,
          });
          if (cancelled) return;
          if (!purchaseRes.success || !purchaseRes.data) {
            setPackageId(null);
            return;
          }

          setPackageId(purchaseRes.data.package_id);
        })
        .finally(() => {
          if (cancelled) return;
          setLoading(false);
        });
      return () => {
        cancelled = true;
      };
    }
  }, [bookingId, purchaseId, isMembership]);

  const classDetail = booking?.class_schedule_detail;
  const trainerScheduleDetail = booking?.trainer_schedule_detail;
  const classTimeStart = classDetail?.time_start?.trim();
  const classTimeEnd = classDetail?.time_end?.trim();
  const trainerTimeStart = trainerScheduleDetail?.time_start?.trim();
  const trainerTimeEnd = trainerScheduleDetail?.time_end?.trim();
  const timeRange =
    classTimeStart && classTimeEnd
      ? `${classTimeStart} - ${classTimeEnd}`
      : trainerTimeStart && trainerTimeEnd
        ? `${trainerTimeStart} - ${trainerTimeEnd}`
        : "-";
  const trainerName = useMemo(() => {
    const classTrainerNames =
      classDetail?.trainers?.map(
        (t: { trainer_profile_name: string }) => t.trainer_profile_name,
      ) || [];
    const trainerScheduleName = booking?.trainer_schedule_detail?.trainer_name;
    if (classTrainerNames.length > 0) {
      return classTrainerNames.join(", ");
    } else if (trainerScheduleName) {
      return trainerScheduleName;
    } else {
      return "-";
    }
  }, [classDetail, booking]);

  const scheduleTitle = isMembership
    ? membershipProductName
    : booking?.schedule_name;

  const productName = isMembership ? undefined : booking?.product_name;

  const qrValue = useMemo(() => {
    if (isMembership) {
      if (!purchaseId) return "";
      return JSON.stringify({ purchase_id: purchaseId });
    } else {
      if (!bookingId) return "";
      return JSON.stringify({ booking_id: bookingId });
    }
  }, [isMembership, bookingId, purchaseId]);

  return (
    <View style={{ flex: 1 }}>
      <BackgroundGlow showText={true} />
      <View className="px-6 pt-2 mt-20">
        <Pressable
          onPress={() => router.back()}
          className="h-12 w-12 rounded-xl bg-zinc-300 items-center justify-center"
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <ArrowLeft color="#fff" size={22} />
        </Pressable>
      </View>

      <View
        className="flex-1 "
        style={{
          paddingTop: isRefreshed ? 48 : 0,
          paddingHorizontal: 24,
        }}
      >
        <View className="mt-10 items-center">
          <View className="w-full max-w-[520px]  rounded-3xl bg-white shadow-lg px-8 py-9">
            {!isRefreshed ? (
              <View className="items-center">
                <View className="w-fit h-fit rounded-2xl p-10 items-center justify-center overflow-hidden">
                  {qrValue ? (
                    <QRCode
                      value={qrValue}
                      size={240}
                      backgroundColor="white"
                    />
                  ) : (
                    <View className="h-20 items-center justify-center">
                      <Text className="text-sm text-gray-400">
                        Loading QR...
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            ) : (
              <View className="items-center justify-center py-10">
                <CheckCheck size={242} color="#000" />
              </View>
            )}
          </View>
        </View>

        <View className="mt-10 items-center">
          {loading ? (
            <Text className="text-xl font-semibold text-gray-900">
              Loading...
            </Text>
          ) : (
            <>
              <Text className="text-xl font-semibold text-gray-900">
                {productName}
              </Text>

              <Text className="mt-2 text-xl font-normal text-gray-900">
                {scheduleTitle}
              </Text>
            </>
          )}

          {!isMembership && (
            <View className="mt-4 w-full max-w-[520px] space-y-4">
              <View className="flex-row items-center">
                <View className="h-10 w-10 rounded-xl bg-gray-200 items-center justify-center">
                  <Clock size={20} color="#111827" />
                </View>
                <Text className="ml-4 text-lg text-gray-800 font-semibold">
                  {timeRange}
                </Text>
              </View>

              <View className="flex-row items-center mt-2">
                <View className="h-10 w-10 rounded-xl bg-gray-200 items-center justify-center">
                  <UserIcon size={20} color="#111827" />
                </View>
                <Text className="ml-4 text-lg text-gray-800 font-semibold">
                  {trainerName}
                </Text>
              </View>
            </View>
          )}
        </View>
        <View className="h-37" />
        {!isMembership && !isRefreshed && (
          <View className="bottom-2 left-0 right-0 bg-zinc-100/60 px-[40px] pb-[18px] pt-2">
            <Pressable
              onPress={async () => {
                if (!bookingId) return;
                setLoading(true);
                try {
                  const res = await getBookingDetail({ booking_id: bookingId });
                  if (res.success && res.data) {
                    if (
                      res.data.booking_status_id === 4 ||
                      res.data.booking_status_name === "Sedang Berlangsung"
                    ) {
                      setIsRefreshed(true);
                    }
                    setBooking(res.data);
                  }
                } finally {
                  setLoading(false);
                }
              }}
              className={`w-full h-14 rounded-xl items-center justify-center bg-cyan-600`}
            >
              <Text className="text-white text-xl font-semibold">Refresh</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}
