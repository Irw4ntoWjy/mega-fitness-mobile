import Combobox from "@/components/Combobox/combobox";
import { useToast } from "@/components/Toast/toast-provider";
import { useAuth } from "@/hooks/useAuth";
import { ComboboxItem } from "@/type/combobox";
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

    router.replace("/(tabs)/bookings");
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
    const res = await getPurchaseCombobox({
      page: 1,
      limit: -1,
    });

    const map: Record<string, ComboboxItem> = {};

    res.data.forEach((item) => {
      map[item.label] = {
        label: item.label,
        value: item.value,
        data: item.data,
      };
    });

    setPackageMap(map);
    setPackages(res.data.map((item) => item.label));
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

    const res = await getTrainerScheduleCombobox({
      trainer_id: (selected.data as any).trainer_profile_id,
      is_booked: false,
      date_from: new Date().toISOString(),
      date_to: new Date(Date.now() + 7 * 86400000).toISOString(),
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
    const res = await getClassScheduleCombobox({
      product_id: product,
      is_full: false,
      date_from: new Date().toISOString(),
      date_to: new Date(Date.now() + 7 * 86400000).toISOString(),
    });
    console.log({
      date_from: new Date().toISOString(),
      date_to: new Date(Date.now() + 7 * 86400000).toISOString(),
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
    if (isPrivate) {
      if (!selectedTrainerSchedule || !auth.accountDetail.profile_id) {
        showToast({
          message: "Mohon untuk memilih jadwal booking yang ada",
          variant: "error",
        });
        return;
      }
    } else {
      if (
        !selectedSchedule ||
        !selectedPackage ||
        !auth.accountDetail.profile_id
      ) {
        showToast({
          message: "Mohon untuk memilih jadwal booking yang ada",
          variant: "error",
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
      member_profile_id: auth.accountDetail.profile_id,
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
    if (visible) {
      fetchPackages();
    }
  }, [visible]);

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
          className="w-full max-w-md rounded-2xl bg-white p-6 min-h-100 shadow-lg"
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text className="mb-6 text-xl font-bold text-slate-900 ">
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
                    console.log(label, packageMap[label]);
                    setOpenPicker(null);
                    const selected = packageMap[label];
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
                    />
                  </View>
                </View>

                {/* SCHEDULE */}
                <View className="mb-6">
                  <Text className="mb-3 font-semibold text-slate-700">
                    Schedule
                  </Text>

                  <View className="flex-row flex-wrap gap-2">
                    {trainerSchedules.map((item) => (
                      <Pressable
                        key={item}
                        onPress={() => setSelectedTrainerSchedule(item)}
                        className={`rounded-full border px-4 py-2 ${
                          selectedTrainerSchedule === item
                            ? "border-[#0891B2] bg-[#0891B2]/10"
                            : "border-slate-300"
                        }`}
                      >
                        <Text className="text-slate-800 flex-warp">{item}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              </>
            )}

            {selectedPackage && !isPrivate && (
              <>
                {/* SCHEDULE */}
                <View className="mb-6">
                  <Text className="mb-3 font-semibold text-slate-700">
                    Schedule
                  </Text>

                  <View className="flex-row flex-wrap gap-2">
                    {schedules.map((item) => (
                      <Pressable
                        key={item}
                        onPress={() => setSelectedSchedule(item)}
                        className={`rounded-full border px-4 py-2 ${
                          selectedSchedule === item
                            ? "border-[#0891B2] bg-[#0891B2]/10"
                            : "border-slate-300"
                        }`}
                      >
                        <Text className="text-slate-800 flex-warp">{item}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              </>
            )}

            {/* BUTTONS */}
          </ScrollView>
          <View className="flex-row justify-end gap-3">
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
