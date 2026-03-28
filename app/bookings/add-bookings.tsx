import Combobox from "@/components/Combobox/combobox";
import { ComboboxItem } from "@/type/combobox";
import { useEffect, useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { getTrainerPackageCombobox } from "../api/combobox/package";
import { getPurchaseCombobox } from "../api/combobox/purchase";
import { getTrainerScheduleCombobox } from "../api/combobox/schedule";

type AddBookingModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function AddBookingModal({
  visible,
  onClose,
}: AddBookingModalProps) {
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

  const fetchTrainerSchedule = async () => {
    const res = await getTrainerScheduleCombobox({
      trainer_id: (trainerMap[selectedTrainer].data as any).trainer_profile_id,
      is_booked: false,
    });
    const map: Record<string, ComboboxItem> = {};

    res.data.forEach((item) => {
      map[item.label] = {
        label: item.label,
        value: item.value,
        data: item.data,
      };
    });

    setTrainerScheduleMap(map);
    setTrainerSchedule(res.data.map((item) => item.label));
    console.log("schedule", trainerSchedules);
  };

  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null);

  const [openPicker, setOpenPicker] = useState<string | null>(null);

  const handleSubmit = () => {
    const booking = {
      package: selectedPackage,
      trainer: selectedTrainer,
      schedule: selectedSchedule,
    };
    onClose();
  };

  useEffect(() => {
    if (visible) {
      fetchPackages();
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 24,
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <View className="w-full max-w-md rounded-2xl bg-white p-6 min-h-80 shadow-lg">
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
                    setOpenPicker(null);
                    const selected = packageMap[label];
                    if (
                      selected &&
                      (selected.data as any)?.product_type_name === "Private"
                    ) {
                      setIsPrivate(true);
                    } else {
                      setIsPrivate(false);
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
                        setSelectedTrainer(value);
                        fetchTrainerSchedule();
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
                        <Text className="text-slate-800">{item}</Text>
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
                        <Text className="text-slate-800">{item}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              </>
            )}

            {/* BUTTONS */}
            <View className="flex-row justify-end gap-3">
              <Pressable
                onPress={onClose}
                className="rounded-lg bg-slate-200 px-4 py-2"
              >
                <Text className="font-semibold text-slate-700">Cancel</Text>
              </Pressable>

              <Pressable
                onPress={handleSubmit}
                className="rounded-lg bg-[#0891B2] px-4 py-2"
              >
                <Text className="font-semibold text-white">Save</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
