import Combobox from "@/components/Combobox/combobox";
import HeaderNavBar from "@/components/HeaderNavBar/header-nav-bar";
import { BackgroundGlow } from "@components/Theme/background";
import {
  ChevronRight,
  ChevronUp,
  NotepadText,
  Plus,
  Trash,
  X,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Journal = () => {
  const insets = useSafeAreaInsets();
  const activityOptions = [
    "Bench Press",
    "Squat",
    "Deadlift",
    "Pull Up",
    "Push Up",
  ];
  const [setGroups, setActivityGroups] = useState([
    {
      title: "Bench Press",
      isOpen: true,
      sets: [
        { weight: "20", reps: "5" },
        { weight: "10", reps: "9" },
      ],
    },
  ]);
  const [pickerOpenIndex, setPickerOpenIndex] = useState<number | null>(null);
  const weightInputRefs = useRef<(TextInput | null)[][]>([]);
  const shouldFocusOnAdd = useRef<{
    groupIndex: number;
    setIndex: number;
  } | null>(null);

  const handleAddGroup = () => {
    const hasIncompleteGroup = setGroups.some(
      (group) =>
        !group.title || group.sets.some((set) => !set.weight || !set.reps)
    );
    if (hasIncompleteGroup) {
      Alert.alert(
        "Data belum lengkap",
        "Lengkapi aktivitas dan set sebelum menambah group baru."
      );
      return;
    }
    setActivityGroups((prev) => [
      ...prev,
      {
        title: "",
        isOpen: true,
        sets: [{ weight: "", reps: "" }],
      },
    ]);
  };

  const handleToggleGroup = (groupIndex: number) => {
    const group = setGroups[groupIndex];
    if (
      group?.isOpen &&
      (!group.title || group.sets.some((set) => !set.weight || !set.reps))
    ) {
      Alert.alert(
        "Data belum lengkap",
        "Lengkapi aktivitas dan set sebelum menutup aktivitas."
      );
      return;
    }
    if (setGroups[groupIndex]?.isOpen && pickerOpenIndex === groupIndex) {
      setPickerOpenIndex(null);
    }
    setActivityGroups((prev) =>
      prev.map((group, index) => {
        if (index !== groupIndex) {
          return group;
        }
        return { ...group, isOpen: !group.isOpen };
      })
    );
  };

  const handlePickActivity = (groupIndex: number, title: string) => {
    if (!title) {
      setActivityGroups((prev) =>
        prev.map((group, index) =>
          index === groupIndex ? { ...group, title: "" } : group
        )
      );
      return;
    }
    const hasDuplicate = setGroups.some(
      (group, index) => index !== groupIndex && group.title === title
    );
    if (hasDuplicate) {
      Alert.alert("Aktivitas sudah ada", "Pilih aktivitas yang berbeda.");
      return;
    }
    setActivityGroups((prev) =>
      prev.map((group, index) =>
        index === groupIndex ? { ...group, title } : group
      )
    );
    setPickerOpenIndex(null);
  };

  const handleAddSet = (groupIndex: number) => {
    setActivityGroups((prev) =>
      prev.map((group, index) => {
        if (index !== groupIndex) {
          return group;
        }
        const nextSets = [...group.sets, { weight: "", reps: "" }];
        shouldFocusOnAdd.current = {
          groupIndex,
          setIndex: nextSets.length - 1,
        };
        return { ...group, sets: nextSets };
      })
    );
  };

  const handleRemoveSet = (groupIndex: number, setIndexToRemove: number) => {
    const group = setGroups[groupIndex];
    if (group?.sets.length <= 1) {
      Alert.alert(
        "Hapus aktivitas?",
        "Aksi ini akan menghapus keseluruhan aktivitas. Lanjutkan?",
        [
          { text: "Batal", style: "cancel" },
          {
            text: "Hapus",
            style: "destructive",
            onPress: () => {
              setActivityGroups((prev) =>
                prev.filter((_, index) => index !== groupIndex)
              );
            },
          },
        ]
      );
      return;
    }
    setActivityGroups((prev) =>
      prev.map((groupItem, index) => {
        if (index !== groupIndex) {
          return groupItem;
        }
        return {
          ...groupItem,
          sets: groupItem.sets.filter(
            (_, setIndex) => setIndex !== setIndexToRemove
          ),
        };
      })
    );
  };

  const handleSetChange = (
    groupIndex: number,
    setIndexToUpdate: number,
    field: "weight" | "reps",
    value: string
  ) => {
    const sanitizedValue = value.replace(/[^0-9]/g, "");
    setActivityGroups((prev) =>
      prev.map((group, index) => {
        if (index !== groupIndex) {
          return group;
        }
        return {
          ...group,
          sets: group.sets.map((set, setIndex) =>
            setIndex === setIndexToUpdate
              ? { ...set, [field]: sanitizedValue }
              : set
          ),
        };
      })
    );
  };

  const handleRemoveGroup = (groupIndex: number) => {
    Alert.alert(
      "Hapus aktivitas?",
      "Aksi ini akan menghapus keseluruhan aktivitas. Lanjutkan?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: () => {
            setActivityGroups((prev) =>
              prev.filter((_, index) => index !== groupIndex)
            );
          },
        },
      ]
    );
  };

  useEffect(() => {
    if (!shouldFocusOnAdd.current) {
      return;
    }

    const { groupIndex, setIndex } = shouldFocusOnAdd.current;
    const input = weightInputRefs.current[groupIndex]?.[setIndex];
    if (input) {
      input.focus();
    }
    shouldFocusOnAdd.current = null;
  }, [setGroups]);

  return (
    <View className="flex-1">
      <BackgroundGlow />
      <HeaderNavBar backOnly title="Journal" />

      <ScrollView contentContainerClassName="p-4 gap-4 pb-28">
        <View className="w-full flex flex-row justify-between items-center p-3 h-fit rounded-2xl">
          <Text className="text-2xl">Strength Training</Text>
          <View className="flex-col items-center">
            <Text className="text-2xl">01:00</Text>
            <Text className="text-md font-light">Duration</Text>
          </View>
        </View>

        <View className="w-full flex gap-3 flex-row shadow-sm shadow-neutral-300 bg-white/80 h-fit rounded-2xl items-center p-4">
          <View className="bg-gray-100 rounded-full p-2">
            <NotepadText size={20} color="#0891B2" />
          </View>
          <Text className="text-2xl">Notes</Text>

          <View className="ml-auto">
            <ChevronRight size={20} color="#888888" />
          </View>
        </View>

        {setGroups.map((group, groupIndex) => (
          <View key={`group-${groupIndex}`} className="w-full gap-0">
            <View
              className={`shadow-sm w-full flex bg-white/80 p-4 gap-3 ${
                group.isOpen ? "rounded-t-2xl" : "rounded-2xl"
              }`}
            >
              <View className="flex-row items-center w-full gap-4">
                {group.isOpen ? (
                  <>
                    <Combobox
                      value={group.title}
                      placeholder="Select activity"
                      options={activityOptions}
                      open={pickerOpenIndex === groupIndex}
                      onOpenChange={(nextOpen) =>
                        setPickerOpenIndex(nextOpen ? groupIndex : null)
                      }
                      onSelect={(value) =>
                        handlePickActivity(groupIndex, value)
                      }
                      showIcon={false}
                      triggerClassName="bg-transparent shadow-none px-0 py-0 rounded-none pr-4"
                      textClassName="text-2xl text-gray-900"
                      placeholderTextClassName="text-2xl text-gray-400"
                      dropdownClassName="mt-2 rounded-2xl shadow-xl shadow-neutral-200"
                    />
                    <Pressable
                      className="ml-auto"
                      onPress={() => handleToggleGroup(groupIndex)}
                    >
                      <ChevronUp size={20} color="#888888" />
                    </Pressable>
                  </>
                ) : (
                  <>
                    <Pressable
                      className="flex-1 flex-row items-center"
                      onPress={() => handleToggleGroup(groupIndex)}
                    >
                      <Text className="flex-1 text-2xl">
                        {group.title || "Select activity"}
                      </Text>
                      <ChevronRight size={20} color="#888888" />
                    </Pressable>
                  </>
                )}
              </View>
            </View>

            {group.isOpen ? (
              <View className="shadow-sm w-full flex bg-white/80 rounded-b-2xl p-4 pt-2 gap-3">
                <View className="flex-row items-center">
                  <Text className="w-10 text-center text-lg text-gray-500">
                    Set
                  </Text>
                  <Text className="flex-1 text-lg text-gray-500">Weight</Text>
                  <Text className="flex-1 text-lg text-gray-500">Reps</Text>
                  <View className="w-6" />
                </View>

                {group.sets.map((set, setIndex) => (
                  <View
                    key={`group-${groupIndex}-set-${setIndex}`}
                    className="flex-row items-center gap-2 bg-gray-100 rounded-lg p-2"
                  >
                    <View className="w-7 h-7 bg-gray-300 rounded-md items-center justify-center">
                      <Text className="text-xl text-white">{setIndex + 1}</Text>
                    </View>
                    <View className="flex-1 bg-white rounded-md px-2">
                      <TextInput
                        ref={(ref) => {
                          if (!weightInputRefs.current[groupIndex]) {
                            weightInputRefs.current[groupIndex] = [];
                          }
                          weightInputRefs.current[groupIndex][setIndex] = ref;
                        }}
                        className="text-normal text-gray-700"
                        keyboardType="numeric"
                        placeholder="0"
                        value={set.weight}
                        onChangeText={(value) =>
                          handleSetChange(groupIndex, setIndex, "weight", value)
                        }
                      />
                    </View>
                    <View className="flex-1 bg-white rounded-md px-2">
                      <TextInput
                        className="text-normal text-gray-700"
                        keyboardType="numeric"
                        placeholder="0"
                        value={set.reps}
                        onChangeText={(value) =>
                          handleSetChange(groupIndex, setIndex, "reps", value)
                        }
                      />
                    </View>
                    <Pressable
                      className="w-7 h-7 items-center justify-center rounded-md bg-red-100"
                      onPress={() => handleRemoveSet(groupIndex, setIndex)}
                    >
                      <X size={14} color="#EF4444" />
                    </Pressable>
                  </View>
                ))}

                <Pressable
                  className="p-4 w-full flex-row justify-center gap-2 bg-white shadow-sm items-center rounded-2xl shadow-neutral-300"
                  onPress={() => handleAddSet(groupIndex)}
                >
                  <Plus size={20} color="#0891B2" />
                  <Text className="text-md text-gray-700">Add Set</Text>
                </Pressable>
                <Pressable
                  className="p-4 w-full flex-row justify-center gap-2 bg-red-50 shadow-sm items-center rounded-2xl shadow-neutral-200"
                  onPress={() => handleRemoveGroup(groupIndex)}
                >
                  <Trash size={20} color="#EF4444" />
                  <Text className="text-md text-red-500">Hapus Activity</Text>
                </Pressable>
              </View>
            ) : null}
          </View>
        ))}
      </ScrollView>

      <Pressable
        onPress={handleAddGroup}
        style={{
          position: "absolute",
          right: 20,
          bottom: insets.bottom + 20,
        }}
      >
        <View
          className={`
        w-16 h-16 rounded-full
        items-center justify-center
        shadow-lg bg-[#0891B2]
      `}
        >
          <Plus size={24} color="#FFFFFF" />
        </View>
      </Pressable>
    </View>
  );
};

export default Journal;
