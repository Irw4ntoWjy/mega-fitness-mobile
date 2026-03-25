import Combobox from "@/components/Combobox/combobox";
import { useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

type AddBookingModalProps = {
  visible: boolean;
  onClose: () => void;
};

const packages = ["Basic Package", "Premium Package", "VIP Package"];
const trainers = ["John", "Michael", "Sarah"];
const schedules = ["08:00 - 09:00", "10:00 - 11:00", "16:00 - 17:00"];

export default function AddBookingModal({
  visible,
  onClose,
}: AddBookingModalProps) {
  const [selectedPackage, setSelectedPackage] = useState("");
  const [selectedTrainer, setSelectedTrainer] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null);

  const [openPicker, setOpenPicker] = useState<string | null>(null);

  const handleSubmit = () => {
    const booking = {
      package: selectedPackage,
      trainer: selectedTrainer,
      schedule: selectedSchedule,
    };

    console.log("Booking:", booking);
    onClose();
  };

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
        <View className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
          <ScrollView showsVerticalScrollIndicator={false}>
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
                  onOpenChange={(nextOpen) =>
                    setOpenPicker(nextOpen ? "package" : null)
                  }
                  onSelect={(value) => {
                    setSelectedPackage(value);
                    setOpenPicker(null);
                  }}
                />
              </View>
            </View>

            {/* TRAINER */}
            <View className="mb-5">
              <Text className="mb-2 font-semibold text-slate-700">Trainer</Text>

              <View className="rounded-lg border border-slate-300">
                <Combobox
                  value={selectedTrainer}
                  placeholder="Select trainer"
                  options={trainers}
                  open={openPicker === "trainer"}
                  onOpenChange={(nextOpen) =>
                    setOpenPicker(nextOpen ? "trainer" : null)
                  }
                  onSelect={(value) => {
                    setSelectedTrainer(value);
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
                {schedules.map((schedule) => (
                  <Pressable
                    key={schedule}
                    onPress={() => setSelectedSchedule(schedule)}
                    className={`rounded-full border px-4 py-2 ${
                      selectedSchedule === schedule
                        ? "border-[#0891B2] bg-[#0891B2]/10"
                        : "border-slate-300"
                    }`}
                  >
                    <Text className="text-slate-800">{schedule}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

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
