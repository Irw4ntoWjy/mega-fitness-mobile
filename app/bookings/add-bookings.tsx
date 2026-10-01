import Combobox from "@/components/Combobox/combobox";
import { useToast } from "@/components/Toast/toast-provider";
import { useAuth } from "@/hooks/useAuth";
import { ComboboxItem } from "@/type/combobox";
import { ScheduleClassSchema, TrainerSchedule } from "@/type/schedule";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { getTrainerPackageCombobox } from "../api/combobox/package";
import { getPurchaseCombobox } from "../api/combobox/purchase";
import {
  getClassScheduleCombobox,
  getTrainerScheduleCombobox,
} from "../api/combobox/schedule";
import { bookClassSchedule } from "../api/schedule";

type AddBookingModalProps = {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function AddBookingModal({
  visible,
  onClose,
  onSuccess,
}: AddBookingModalProps) {
  const handleClose = () => {
    // reset flags
    setIsPrivate(false);

    // package
    setPackages([]);
    setPackageMap({});
    setSelectedPackage("");

    // trainer
    setTrainer([]);
    setTrainerMap({});
    setSelectedTrainer("");

    // trainer schedule
    setTrainerSchedule([]);
    setTrainerScheduleMap({});
    setSelectedTrainerSchedule(null);

    // class schedule
    setSchedule([]);
    setScheduleMap({});
    setSelectedSchedule(null);

    // UI state
    setOpenPicker(null);

    // finally close modal
    onClose();

    router.push("/(tabs)/bookings");
  };
  const { auth, loading: loadingAuth } = useAuth();
  const { showToast } = useToast();
  const [isPrivate, setIsPrivate] = useState<boolean>(false);

  const [packages, setPackages] = useState<string[]>([]);
  const [packageMap, setPackageMap] = useState<Record<string, ComboboxItem>>(
    {},
  );
  const [selectedPackage, setSelectedPackage] = useState("");
  const fetchPackages = async () => {
    const profileId = auth?.accountDetail?.profile_id;
    if (!profileId) return;

    const res = await getPurchaseCombobox({
      page: 1,
      limit: -1,
      customer_profile_id: profileId,
    });

    const map: Record<string, ComboboxItem> = {};

    const list = (res.data ?? []).filter((item) => {
      const status =
        (item.data as { purchase_status_id?: string })?.purchase_status_id ??
        "";
      return String(status) !== "-1";
    });

    list.forEach((item) => {
      map[item.label] = {
        label: item.label,
        value: item.value,
        data: item.data,
      };
    });

    setPackageMap(map);
    setPackages(list.map((item) => item.label));
  };

  const [trainers, setTrainer] = useState<string[]>([]);
  const [trainerMap, setTrainerMap] = useState<Record<string, ComboboxItem>>(
    {},
  );
  const [selectedTrainer, setSelectedTrainer] = useState("");

  const fetchTrainer = async () => {
    const res = await getTrainerPackageCombobox({
      package_detail_id: (packageMap[selectedPackage].data as any)
        .package_detail_id,
    });

    const map: Record<string, ComboboxItem> = {};

    res.data.forEach((item) => {
      map[item.label] = {
        label: item.label,
        value: item.value,
        data: item.data,
      };
    });

    setTrainerMap(map);
    setTrainer(res.data.map((item) => item.label));
  };
  const [trainerSchedules, setTrainerSchedule] = useState<string[]>([]);
  const [trainerScheduleMap, setTrainerScheduleMap] = useState<
    Record<string, ComboboxItem>
  >({});
  const [selectedTrainerSchedule, setSelectedTrainerSchedule] = useState<
    string | null
  >(null);
  const fetchTrainerSchedule = async (trainer: string) => {
    const selected = trainerMap[trainer];
    if (!selected) return;
    const today = new Date();
    const nextWeek = new Date(Date.now() + 7 * 86400000);

    const res = await getTrainerScheduleCombobox({
      trainer_id: (selected.data as any).trainer_profile_id,
      is_booked: false,
      date_from: today.toISOString().slice(0, 10),
      date_to: nextWeek.toISOString().slice(0, 10),
    });

    const map: Record<string, ComboboxItem> = {};

    res.data.forEach((item) => {
      map[item.label] = item;
    });

    setTrainerScheduleMap(map);

    setTrainerSchedule(res.data.map((item) => item.label));
  };

  const [schedules, setSchedule] = useState<string[]>([]);
  const [scheduleMap, setScheduleMap] = useState<Record<string, ComboboxItem>>(
    {},
  );
  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null);

  const fetchClassSchedule = async (product: string) => {
    const today = new Date();
    const nextWeek = new Date(Date.now() + 7 * 86400000);

    const res = await getClassScheduleCombobox({
      product_id: product,
      is_full: false,

      date_from: today.toISOString().slice(0, 10),
      date_to: nextWeek.toISOString().slice(0, 10),
    });
    const map: Record<string, ComboboxItem> = {};

    res.data.forEach((item) => {
      map[item.label] = {
        label: item.label,
        value: item.value,
        data: item.data,
      };
    });

    setScheduleMap(map);
    setSchedule(res.data.map((item) => item.label));
  };

  const [openPicker, setOpenPicker] = useState<string | null>(null);
  const handleSubmit = async () => {
    const now = new Date();

    if (isPrivate) {
      if (!selectedTrainerSchedule || !auth?.accountDetail?.profile_id) {
        showToast({
          message: "Mohon untuk memilih jadwal booking yang ada",
          variant: "error",
        });
        return;
      } else if (selectedTrainerSchedule) {
        const data = trainerScheduleMap[selectedTrainerSchedule]
          .data as TrainerSchedule;
        const startTime = new Date(`${data.schedule_date}T${data.time_start}`);

        const diffMs = startTime.getTime() - now.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);

        if (diffHours >= 12) {
          showToast({
            message: "Bookings can't be created 12 Hours before session.",
            variant: "warning",
            duration: 2500,
          });
          return;
        } else if (diffHours <= 6) {
          showToast({
            message: "Bookings can't be created 6 Hours before session.",
            variant: "warning",
            duration: 2500,
          });
          return;
        }
      }
    } else {
      if (
        !selectedSchedule ||
        !selectedPackage ||
        !auth?.accountDetail?.profile_id
      ) {
        showToast({
          message: "Mohon untuk memilih jadwal booking yang ada",
          variant: "error",
        });
        return;
      }
      const data = scheduleMap[selectedSchedule].data as ScheduleClassSchema;
      const startTime = new Date(`${data.schedule_date}T${data.time_start}`);

      const diffMs = startTime.getTime() - now.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      if (diffHours <= 1) {
        showToast({
          message: "Bookings can't be created 1 Hours before class.",
          variant: "warning",
          duration: 2500,
        });
        return;
      }
    }
    const selectedPrivateSchedule =
      trainerScheduleMap[selectedTrainerSchedule!];
    const selectedPurchase = packageMap[selectedPackage];
    const selectedClassSchedule = scheduleMap[selectedSchedule!];

    const res = await bookClassSchedule({
      schedule_id: isPrivate
        ? String((selectedPrivateSchedule.data as any).id)
        : String((selectedClassSchedule.data as any).id),
      purchase_id: String((selectedPurchase.data as any).id),
      member_profile_id: auth!.accountDetail.profile_id,
      schedule_type: isPrivate ? "trainer" : "class",
    });

    showToast({
      message: res.message,
      variant: res.success === true ? "success" : "error",
    });
    onSuccess();
    handleClose();
  };

  useEffect(() => {
    if (visible && auth?.accountDetail?.profile_id) {
      fetchPackages();
    }
  }, [visible, auth?.accountDetail?.profile_id]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 24,
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
        onPress={handleClose}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg"
          style={{ height: "80%" }}
        >
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 16 }}
            showsVerticalScrollIndicator={false}
            scrollEnabled={openPicker === null}
            nestedScrollEnabled
          >
            <Text className="mb-6 text-xl font-bold text-slate-900">
              Add Booking
            </Text>

            {/* PACKAGE */}
            <View className="mb-5">
              <Text className="mb-2 font-semibold text-slate-700">Package</Text>
              <View className="rounded-lg border border-slate-300">
                <Combobox
                  value={selectedPackage}
                  placeholder="Select package"
                  options={packages}
                  open={openPicker === "package"}
                  onOpenChange={(nextOpen) => {
                    setOpenPicker(nextOpen ? "package" : null);
                    if (nextOpen) fetchPackages();
                  }}
                  onSelect={(label) => {
                    setSelectedPackage(label);
                    setOpenPicker(null);

                    // reset dependent selections
                    setTrainer([]);
                    setTrainerMap({});
                    setSelectedTrainer("");
                    setTrainerSchedule([]);
                    setTrainerScheduleMap({});
                    setSelectedTrainerSchedule(null);
                    setSchedule([]);
                    setScheduleMap({});
                    setSelectedSchedule(null);

                    const selected = packageMap[label];
                    if (!selected) {
                      // package was cleared
                      setIsPrivate(false);
                      return;
                    }
                    if (
                      selected &&
                      (selected.data as any)?.product_type_name === "Private"
                    ) {
                      setIsPrivate(true);
                    } else {
                      setIsPrivate(false);
                      fetchClassSchedule((selected.data as any)?.product_id);
                    }
                  }}
                  dropdownPortal
                />
              </View>
            </View>

            {selectedPackage && isPrivate && (
              <>
                {/* TRAINER */}
                <View className="mb-5">
                  <Text className="mb-2 font-semibold text-slate-700">
                    Trainer
                  </Text>
                  <View className="rounded-lg border border-slate-300">
                    <Combobox
                      value={selectedTrainer}
                      placeholder="Select trainer"
                      options={trainers}
                      open={openPicker === "trainer"}
                      onOpenChange={(nextOpen) => {
                        setOpenPicker(nextOpen ? "trainer" : null);
                        if (nextOpen) fetchTrainer();
                      }}
                      onSelect={(value) => {
                        if (!value) {
                          setTrainerSchedule([]);
                          setTrainerScheduleMap({});
                          setSelectedTrainer("");
                        }
                        setSelectedTrainer(value);
                        fetchTrainerSchedule(value);
                        setOpenPicker(null);
                      }}
                      dropdownPortal
                    />
                  </View>
                </View>

                {/* TRAINER SCHEDULE */}
                <View className="mb-6">
                  <Text className="mb-3 font-semibold text-slate-700">
                    Schedule
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    {trainerSchedules.length === 0 && selectedTrainer ? (
                      <View>
                        <Text className="text-red-500 text-xl">
                          No schedule found
                        </Text>
                        <Text className="text-red-500">
                          Please contact admin for more information
                        </Text>
                      </View>
                    ) : (
                      <View className="flex-row flex-wrap gap-2">
                        {trainerSchedules.map((item, index) => (
                          <Pressable
                            key={`${item} ${index}`}
                            onPress={() => setSelectedTrainerSchedule(item)}
                            className={`rounded-xl border px-4 py-2 mb-2 ${
                              selectedTrainerSchedule === item
                                ? "border-[#0891B2] bg-[#0891B2]/10"
                                : "border-slate-300"
                            }`}
                          >
                            <Text className="text-slate-800 flex-wrap">
                              {item}
                            </Text>
                          </Pressable>
                        ))}
                      </View>
                    )}
                  </View>
                </View>
              </>
            )}

            {selectedPackage && !isPrivate && (
              <View className="mb-6">
                <Text className="mb-3 font-semibold text-slate-700">
                  Schedule
                </Text>
                {schedules.length === 0 ? (
                  <View>
                    <Text className="text-red-500 text-xl">
                      No schedule found
                    </Text>
                    <Text className="text-red-500">
                      Please contact admin for more information
                    </Text>
                  </View>
                ) : (
                  <View className="gap-3">
                    {schedules.map((item, index) => {
                      const entry = scheduleMap[item];
                      const sched =
                        (entry?.data as ScheduleClassSchema) || null;
                      const isSelected = selectedSchedule === item;
                      const coaches = (sched?.trainers ?? [])
                        .map((t) => t.trainer_profile_name || t.trainer_name)
                        .filter((n): n is string => !!n);
                      if (coaches.length === 0 && sched?.trainer_name) {
                        coaches.push(sched.trainer_name);
                      }
                      const dateLabel = sched?.schedule_date
                        ? new Date(
                            `${sched.schedule_date}T00:00:00`,
                          ).toLocaleDateString("id-ID", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                          })
                        : "";
                      const timeLabel = sched?.time_start
                        ? `${sched.time_start.slice(0, 5)}${
                            sched.time_end
                              ? ` - ${sched.time_end.slice(0, 5)}`
                              : ""
                          }`
                        : item;
                      return (
                        <Pressable
                          key={`${item} ${index}`}
                          onPress={() => setSelectedSchedule(item)}
                          className={`flex-row items-center rounded-xl border-2 p-3 ${
                            isSelected
                              ? "border-[#0891B2] bg-[#0891B2]/10"
                              : "border-slate-200 bg-white"
                          }`}
                        >
                          <View
                            className={`mr-3 items-center justify-center rounded-lg px-3 py-2 ${
                              isSelected ? "bg-[#0891B2]" : "bg-slate-100"
                            }`}
                          >
                            <Text
                              className={`text-xs font-semibold ${
                                isSelected ? "text-white" : "text-slate-500"
                              }`}
                            >
                              {dateLabel}
                            </Text>
                            <Text
                              className={`text-sm font-bold ${
                                isSelected ? "text-white" : "text-slate-800"
                              }`}
                            >
                              {timeLabel}
                            </Text>
                          </View>
                          <View className="flex-1">
                            <Text
                              className="text-base font-bold text-slate-900"
                              numberOfLines={2}
                            >
                              {sched?.name || sched?.product_name || item}
                            </Text>
                            {coaches.length > 0 ? (
                              <Text className="mt-1 text-sm text-slate-500">
                                {coaches.length > 1 ? "Coaches" : "Coach"}:{" "}
                                {coaches.join(", ")}
                              </Text>
                            ) : null}
                          </View>
                          <View
                            className={`h-5 w-5 items-center justify-center rounded-full border-2 ${
                              isSelected
                                ? "border-[#0891B2] bg-[#0891B2]"
                                : "border-slate-300"
                            }`}
                          >
                            {isSelected ? (
                              <View className="h-2 w-2 rounded-full bg-white" />
                            ) : null}
                          </View>
                        </Pressable>
                      );
                    })}
                  </View>
                )}
              </View>
            )}
          </ScrollView>

          {/* BUTTONS */}
          <View className="flex-row justify-end gap-3 pt-3">
            <Pressable
              onPress={handleClose}
              className="rounded-lg bg-slate-200 px-8 py-4"
            >
              <Text className="font-semibold text-slate-700">Cancel</Text>
            </Pressable>
            <Pressable
              onPress={handleSubmit}
              className="rounded-lg bg-[#0891B2] px-8 py-4"
            >
              <Text className="font-semibold text-white">Save</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
