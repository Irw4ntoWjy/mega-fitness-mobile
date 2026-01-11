import Combobox from "@/components/Combobox/combobox";
import HeaderNavBar from "@/components/HeaderNavBar/header-nav-bar";
import { BackgroundGlow } from "@components/Theme/background";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import {
  ChevronRight,
  ChevronUp,
  Frown,
  NotepadText,
  Pencil,
  Plus,
  Trash,
  X,
} from "lucide-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  BackHandler,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Journal = () => {
  const insets = useSafeAreaInsets();
  const activityGroupOptions = [
    "Strength Training",
    "Cardio",
    "Mobility",
    "HIIT",
    "Recovery",
  ];
  const activityGroupDurations: Record<string, string> = {
    "Strength Training": "01:00",
    Cardio: "00:45",
    Mobility: "00:30",
    HIIT: "00:40",
    Recovery: "00:25",
  };
  const exerciseOptions = [
    "Bench Press",
    "Squat",
    "Deadlift",
    "Pull Up",
    "Push Up",
  ];
  const [activityGroupTitle, setActivityGroupTitle] = useState<string | null>(
    null
  );
  const [activityGroupDuration, setActivityGroupDuration] = useState<
    string | null
  >(null);
  const [activityGroupModalOpen, setActivityGroupModalOpen] = useState(false);
  const [activityGroupPickerOpen, setActivityGroupPickerOpen] = useState(false);
  const [activityGroupEditing, setActivityGroupEditing] = useState(false);
  const [notes, setNotes] = useState("");
  const [notesDraft, setNotesDraft] = useState("");
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const savedSnapshot = useRef("");
  const [setGroups, setActivityGroups] = useState<
    {
      title: string;
      isOpen: boolean;
      sets: { weight: string; reps: string }[];
    }[]
  >([]);
  const [pickerOpenIndex, setPickerOpenIndex] = useState<number | null>(null);
  const weightInputRefs = useRef<(TextInput | null)[][]>([]);
  const shouldFocusOnAdd = useRef<{
    groupIndex: number;
    setIndex: number;
  } | null>(null);

  const createEmptyGroup = () => ({
    title: "",
    isOpen: true,
    sets: [{ weight: "", reps: "" }],
  });

  const handleAddGroup = () => {
    if (!activityGroupTitle) {
      Alert.alert(
        "Pilih activity group dulu",
        "Tentukan activity group sebelum menambah activity."
      );
      return;
    }
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
    setActivityGroups((prev) => [...prev, createEmptyGroup()]);
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

  const handlePickExercise = (groupIndex: number, title: string) => {
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

  const handlePickActivityGroup = (title: string) => {
    if (!title) {
      return;
    }
    if (activityGroupTitle && activityGroupEditing) {
      Alert.alert(
        "Ubah activity group?",
        "Mengubah activity group akan menghapus semua data yang sudah diisi.",
        [
          { text: "Batal", style: "cancel" },
          {
            text: "Lanjut",
            style: "destructive",
            onPress: () => {
              setActivityGroupTitle(title);
              setActivityGroupDuration(
                activityGroupDurations[title] ?? "01:00"
              );
              setActivityGroupModalOpen(false);
              setActivityGroupPickerOpen(false);
              setActivityGroupEditing(false);
              setActivityGroups([createEmptyGroup()]);
              setPickerOpenIndex(null);
              setNotes("");
              setNotesDraft("");
              savedSnapshot.current = "";
            },
          },
        ]
      );
      return;
    }

    setActivityGroupTitle(title);
    setActivityGroupDuration(activityGroupDurations[title] ?? "01:00");
    setActivityGroupModalOpen(false);
    setActivityGroupPickerOpen(false);
    setActivityGroupEditing(false);
    setActivityGroups([createEmptyGroup()]);
    setNotes("");
    setNotesDraft("");
    savedSnapshot.current = "";
  };

  const handleEditActivityGroup = () => {
    setActivityGroupEditing(true);
    setActivityGroupModalOpen(true);
  };

  const openNotesModal = () => {
    setNotesDraft(notes);
    setNotesModalOpen(true);
  };

  const handleCloseNotesModal = () => {
    setNotesModalOpen(false);
  };

  const handleSaveNotes = () => {
    setNotes(notesDraft);
    setNotesModalOpen(false);
  };

  const buildPayload = useCallback(
    () => ({
      "activity-group": activityGroupTitle,
      "activity-group-duration": activityGroupDuration ?? "01:00",
      notes,
      activities: setGroups.map((group) => ({
        "activity-title": group.title,
        sets: group.sets.map((set) => ({
          weight: set.weight,
          reps: set.reps,
        })),
      })),
    }),
    [activityGroupTitle, activityGroupDuration, notes, setGroups]
  );

  const hasContent = useCallback(
    () =>
      Boolean(
        notes.trim() ||
          setGroups.some(
            (group) =>
              group.title || group.sets.some((set) => set.weight || set.reps)
          )
      ),
    [notes, setGroups]
  );

  const isDirty = useCallback(() => {
    if (!hasContent()) {
      return false;
    }
    return JSON.stringify(buildPayload()) !== savedSnapshot.current;
  }, [buildPayload, hasContent]);

  const confirmLeaveIfDirty = useCallback(
    (onLeave: () => void) => {
      if (!isDirty()) {
        onLeave();
        return;
      }
      Alert.alert(
        "Perubahan belum disimpan",
        "Perubahan yang dibuat akan hilang jika keluar tanpa menyimpan.",
        [
          { text: "Batal", style: "cancel" },
          { text: "Tetap keluar", style: "destructive", onPress: onLeave },
        ]
      );
    },
    [isDirty]
  );

  const handleBackPress = useCallback(() => {
    confirmLeaveIfDirty(() => router.back());
  }, [confirmLeaveIfDirty]);

  const handleSaveJournal = () => {
    if (!activityGroupTitle) {
      Alert.alert(
        "Pilih activity group dulu",
        "Tentukan activity group sebelum menyimpan journal."
      );
      return;
    }
    const hasIncompleteGroup = setGroups.some(
      (group) =>
        !group.title || group.sets.some((set) => !set.weight || !set.reps)
    );
    if (hasIncompleteGroup) {
      Alert.alert(
        "Data belum lengkap",
        "Lengkapi aktivitas dan set sebelum menyimpan journal."
      );
      return;
    }
    if (!notes.trim()) {
      Alert.alert(
        "Notes belum diisi",
        "Tambahkan catatan sebelum menyimpan journal."
      );
      return;
    }

    const payload = buildPayload();

    console.log("[journal] payload", JSON.stringify(payload));
    savedSnapshot.current = JSON.stringify(payload);
    Alert.alert("Journal tersimpan", "Catatan dan aktivitas sudah disimpan.", [
      {
        text: "OK",
        onPress: () => router.back(),
      },
    ]);
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

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        confirmLeaveIfDirty(() => router.back());
        return true;
      };
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );
      return () => subscription.remove();
    }, [confirmLeaveIfDirty])
  );

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
      <HeaderNavBar
        backOnly
        title="Journal"
        showSave={Boolean(activityGroupTitle)}
        onSave={handleSaveJournal}
        onBack={handleBackPress}
      />

      {activityGroupTitle ? (
        <ScrollView>
          <View className="p-4 gap-4 pb-28">
            <View className="w-full flex flex-row justify-between items-center p-3 h-fit rounded-2xl">
              <View className="flex-row items-center gap-3">
                <Text className="text-2xl">{activityGroupTitle}</Text>
                <Pressable
                  className="w-8 h-8 items-center justify-center"
                  onPress={handleEditActivityGroup}
                >
                  <Pencil size={16} color="#6B7280" />
                </Pressable>
              </View>
              <View className="flex-col items-center">
                <Text className="text-2xl">
                  {activityGroupDuration ?? "01:00"}
                </Text>
                <Text className="text-md font-light">Duration</Text>
              </View>
            </View>

            <Pressable
              className="w-full shadow-sm shadow-neutral-300 bg-white/80 rounded-2xl gap-3 p-4"
              onPress={openNotesModal}
            >
              <View className="flex-row items-center gap-3 ">
                <View className="bg-gray-100 rounded-full p-2">
                  <NotepadText size={20} color="#0891B2" />
                </View>
                <Text className="text-2xl">Notes</Text>
                <View className="ml-auto">
                  <ChevronRight size={20} color="#888888" />
                </View>
              </View>
              <Text
                className={`text-md ${
                  notes ? "text-gray-600" : "text-gray-400"
                }`}
                numberOfLines={2}
              >
                {notes || "Tambahkan catatan untuk sesi latihan ini."}
              </Text>
            </Pressable>

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
                          options={exerciseOptions}
                          open={pickerOpenIndex === groupIndex}
                          onOpenChange={(nextOpen) =>
                            setPickerOpenIndex(nextOpen ? groupIndex : null)
                          }
                          onSelect={(value) =>
                            handlePickExercise(groupIndex, value)
                          }
                          showIcon={false}
                          textClassName="text-2xl text-gray-900"
                          placeholderTextClassName="text-2xl text-gray-400"
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
                      <Text className="flex-1 text-lg text-gray-500">
                        Weight
                      </Text>
                      <Text className="flex-1 text-lg text-gray-500">Reps</Text>
                      <View className="w-6" />
                    </View>

                    {group.sets.map((set, setIndex) => (
                      <View
                        key={`group-${groupIndex}-set-${setIndex}`}
                        className="flex-row items-center gap-2 bg-gray-100 rounded-lg p-2"
                      >
                        <View className="w-7 h-7 bg-gray-300 rounded-md items-center justify-center">
                          <Text className="text-xl text-white">
                            {setIndex + 1}
                          </Text>
                        </View>
                        <View className="flex-1 bg-white rounded-md px-2">
                          <TextInput
                            ref={(ref) => {
                              if (!weightInputRefs.current[groupIndex]) {
                                weightInputRefs.current[groupIndex] = [];
                              }
                              weightInputRefs.current[groupIndex][setIndex] =
                                ref;
                            }}
                            className="text-normal text-gray-700"
                            keyboardType="numeric"
                            placeholder="0"
                            value={set.weight}
                            onChangeText={(value) =>
                              handleSetChange(
                                groupIndex,
                                setIndex,
                                "weight",
                                value
                              )
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
                              handleSetChange(
                                groupIndex,
                                setIndex,
                                "reps",
                                value
                              )
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
                      <Text className="text-md text-red-500">
                        Hapus Activity
                      </Text>
                    </Pressable>
                  </View>
                ) : null}
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <View className="flex-1 items-center justify-center px-6">
          <View className="w-full  p-6 items-center gap-4">
            <View className="w-16 h-16 rounded-full bg-cyan-50 items-center justify-center">
              <Frown size={28} color="#0891B2" />
            </View>
            <View className="items-center gap-2">
              <Text className="text-2xl text-gray-900 text-center">
                Activity group belum dipilih
              </Text>
              <Text className="text-md text-gray-500 text-center">
                Pilih activity group terlebih dahulu sebelum bisa mengisi
                catatan dan aktivitas.
              </Text>
            </View>
            <Pressable
              className="px-5 py-3 rounded-full bg-cyan-600"
              onPress={() => setActivityGroupModalOpen(true)}
            >
              <Text className="text-md text-white font-semibold">
                Pilih Activity Group
              </Text>
            </Pressable>
          </View>
        </View>
      )}

      {activityGroupTitle ? (
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
      ) : null}

      <Modal
        animationType="fade"
        transparent
        visible={notesModalOpen}
        onRequestClose={handleCloseNotesModal}
      >
        <Pressable
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
          onPress={handleCloseNotesModal}
        >
          <Pressable className="w-5/6 max-h-[80%] bg-white shadow-neutral-400/50 shadow-sm rounded-4xl overflow-hidden">
            <View className="p-6 gap-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-xl font-semibold text-gray-900">
                  Notes
                </Text>
                <Pressable onPress={handleCloseNotesModal}>
                  <X size={18} color="#6B7280" />
                </Pressable>
              </View>
              <TextInput
                className="min-h-[120px] max-h-[180px] bg-gray-50 rounded-2xl p-4 text-base text-gray-800"
                placeholder="Tulis catatan latihan di sini..."
                multiline
                scrollEnabled
                textAlignVertical="top"
                value={notesDraft}
                onChangeText={setNotesDraft}
              />
              <Pressable
                className="px-5 py-3 rounded-full bg-cyan-600 items-center"
                onPress={handleSaveNotes}
              >
                <Text className="text-md text-white font-semibold">
                  Simpan Notes
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        animationType="fade"
        transparent
        visible={activityGroupModalOpen}
        onRequestClose={() => {
          setActivityGroupModalOpen(false);
          setActivityGroupPickerOpen(false);
          setActivityGroupEditing(false);
        }}
      >
        <Pressable
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
          onPress={() => {
            setActivityGroupModalOpen(false);
            setActivityGroupPickerOpen(false);
            setActivityGroupEditing(false);
          }}
        >
          <Pressable className="w-5/6 max-h-[80%] bg-white shadow-neutral-400/50 shadow-sm rounded-4xl overflow-hidden">
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="p-6 gap-4">
                <View>
                  <Text className="text-xl font-semibold text-gray-900">
                    {activityGroupEditing
                      ? "Edit activity group"
                      : "Pilih activity group"}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    {activityGroupEditing
                      ? "Perubahan ini akan menghapus semua yang telah diisi sebelumnya."
                      : "Pilih activity group sebelum dapat melanjutkan pengisian catatan dan aktivitas."}
                  </Text>
                </View>
                <Combobox
                  value={activityGroupTitle ?? ""}
                  placeholder="Activity group"
                  options={activityGroupOptions}
                  open={activityGroupPickerOpen}
                  onOpenChange={setActivityGroupPickerOpen}
                  onSelect={handlePickActivityGroup}
                  showClear={!activityGroupEditing}
                  dropdownPortal
                  triggerClassName="min-h-10 px-4 py-3 rounded-2xl"
                  textClassName="text-base text-gray-800"
                  placeholderTextClassName="text-base text-gray-400"
                  searchPlaceholder="Cari activity group..."
                />
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export default Journal;
