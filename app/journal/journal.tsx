import { getActivityGroupDetail } from "@/app/api/activity-group";
import { getActivityGroupCombobox } from "@/app/api/combobox/activity-group";
import {
  createJournal,
  getJournalDetail,
  updateJournal,
} from "@/app/api/journal";
import Combobox from "@/components/Combobox/combobox";
import HeaderNavBar from "@/components/HeaderNavBar/header-nav-bar";
import ConfirmModal from "@/components/Journal/ConfirmModal";
import FeedbackModal from "@/components/Journal/FeedbackModal";
import { useAuth } from "@/hooks/useAuth";
import { ComboboxItem } from "@/type/combobox";
import { BackgroundGlow } from "@components/Theme/background";
import { useFocusEffect } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
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
  ActivityIndicator,
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
  const { sessionLogId, sessionDuration, editable, membership, eventType } =
    useLocalSearchParams<{
      sessionLogId?: string;
      sessionDuration?: string;
      editable?: string;
      membership?: string;
      eventType?: "Class" | "Private" | "Member";
    }>();
  const { auth } = useAuth();
  const isTrainer = auth?.accountDetail?.account_role === "Trainer";
  const isMembership = membership === "true" || eventType === "Member";
  const isPrivateEvent = eventType === "Private";
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);

  const [activityGroupOptions, setActivityGroupOptions] = useState<
    ComboboxItem[]
  >([]);
  const [activityOptions, setActivityOptions] = useState<string[]>([]);
  const [pickerOpenIndex, setPickerOpenIndex] = useState<number | null>(null);
  const [activityOptionsLoading, setActivityOptionsLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [activityGroupId, setActivityGroupId] = useState<string | null>(null);
  const [activityGroupTitle, setActivityGroupTitle] = useState<string | null>(
    null,
  );
  const [activityGroupDuration, setActivityGroupDuration] = useState<
    string | null
  >(null);
  const [isEditMode, setIsEditMode] = useState(
    (editable !== "false" || (isTrainer && isPrivateEvent)) &&
      (!isPrivateEvent || isTrainer),
  );
  const [currentJournalId, setCurrentJournalId] = useState<
    number | string | null
  >(null);
  const [activityGroupModalOpen, setActivityGroupModalOpen] = useState(false);
  const [activityGroupPickerOpen, setActivityGroupPickerOpen] = useState(false);
  const [activityGroupEditing, setActivityGroupEditing] = useState(false);
  const [notes, setNotes] = useState("");
  const [notesDraft, setNotesDraft] = useState("");
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState<{
    visible: boolean;
    title: string;
    message: string;
  }>({
    visible: false,
    title: "",
    message: "",
  });
  const [confirmModal, setConfirmModal] = useState<{
    visible: boolean;
    title: string;
    message: string;
    confirmText?: string;
  }>({
    visible: false,
    title: "",
    message: "",
    confirmText: "",
  });
  const feedbackOnCloseRef = useRef<(() => void) | null>(null);
  const confirmOnConfirmRef = useRef<(() => void) | null>(null);
  const savedSnapshot = useRef("");
  const [setGroups, setActivityGroups] = useState<
    {
      title: string;
      isOpen: boolean;
      sets: { weight: string; reps: string }[];
    }[]
  >([]);
  const weightInputRefs = useRef<(TextInput | null)[][]>([]);
  const shouldFocusOnAdd = useRef<{
    groupIndex: number;
    setIndex: number;
  } | null>(null);

  const isForcedReadOnly =
    (!isTrainer && editable === "false") || (isPrivateEvent && !isTrainer);
  const isReadOnlyMode =
    isForcedReadOnly || (currentJournalId != null && !isEditMode);

  const createEmptyGroup = () => ({
    title: "",
    isOpen: true,
    sets: [{ weight: "", reps: "" }],
  });

  const closeActivityGroupModal = () => {
    setActivityGroupModalOpen(false);
    setActivityGroupPickerOpen(false);
    setActivityGroupEditing(false);
  };

  const applySelectedActivityGroup = (
    title: string,
    nextGroupId: string | null,
  ) => {
    setActivityGroupTitle(title);
    setActivityGroupId(nextGroupId);
    setActivityGroupDuration(sessionDuration ?? null);
    closeActivityGroupModal();
    setActivityGroups([createEmptyGroup()]);
    setNotes("");
    setNotesDraft("");
    savedSnapshot.current = "";

    void loadActivitiesByGroupId(nextGroupId ?? undefined);
  };

  const openFeedbackModal = (
    title: string,
    message: string,
    onClose?: () => void,
  ) => {
    feedbackOnCloseRef.current = onClose ?? null;
    setFeedbackModal({
      visible: true,
      title,
      message,
    });
  };

  const closeFeedbackModal = () => {
    setFeedbackModal((prev) => ({
      ...prev,
      visible: false,
    }));

    const callback = feedbackOnCloseRef.current;
    feedbackOnCloseRef.current = null;
    callback?.();
  };

  const openConfirmModal = (
    title: string,
    message: string,
    onConfirm: () => void,
    confirmText?: string,
  ) => {
    confirmOnConfirmRef.current = onConfirm;
    setConfirmModal({
      visible: true,
      title,
      message,
      confirmText,
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal((prev) => ({
      ...prev,
      visible: false,
    }));
    confirmOnConfirmRef.current = null;
  };

  const confirmModalAction = () => {
    const callback = confirmOnConfirmRef.current;
    closeConfirmModal();
    callback?.();
  };

  const handleAddGroup = () => {
    if (!activityGroupTitle) {
      openFeedbackModal(
        "Pilih activity group dulu",
        "Tentukan activity group sebelum menambah activity.",
      );
      return;
    }
    const hasIncompleteGroup = setGroups.some(
      (group) =>
        !group.title || group.sets.some((set) => !set.weight || !set.reps),
    );
    if (hasIncompleteGroup) {
      openFeedbackModal(
        "Data belum lengkap",
        "Lengkapi aktivitas dan set sebelum menambah group baru.",
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
      openFeedbackModal(
        "Data belum lengkap",
        "Lengkapi aktivitas dan set sebelum menutup aktivitas.",
      );
      return;
    }
    setActivityGroups((prev) =>
      prev.map((group, index) => {
        if (index !== groupIndex) {
          return group;
        }
        return { ...group, isOpen: !group.isOpen };
      }),
    );
  };

  const handleExerciseTitleChange = (groupIndex: number, title: string) => {
    const hasDuplicate = setGroups.some(
      (group, index) => index !== groupIndex && group.title === title,
    );
    if (title && hasDuplicate) {
      openFeedbackModal("Aktivitas sudah ada", "Pilih aktivitas yang berbeda.");
      return;
    }

    setActivityGroups((prev) =>
      prev.map((group, index) =>
        index === groupIndex ? { ...group, title } : group,
      ),
    );

    setPickerOpenIndex(null);
  };

  const loadActivitiesByGroupId = useCallback(async (groupId?: string) => {
    if (!groupId) {
      setActivityOptions([]);
      return;
    }

    try {
      setActivityOptionsLoading(true);
      const res = await getActivityGroupDetail({ activity_group_id: groupId });

      if (!res.success || !res.data) {
        setActivityOptions([]);
        return;
      }

      setActivityOptions(
        (res.data.activities ?? []).map((activity) => activity.activity_name),
      );
    } catch (error) {
      console.error(error);
      setActivityOptions([]);
    } finally {
      setActivityOptionsLoading(false);
    }
  }, []);

  const handlePickActivityGroup = (title: string) => {
    if (!title) {
      return;
    }

    const selected = activityGroupOptions.find((item) => item.label === title);
    const nextGroupId =
      String((selected?.data as any)?.activity_group_id ?? "") || null;

    if (activityGroupTitle && activityGroupEditing) {
      openConfirmModal(
        "Ubah activity group?",
        "Mengubah activity group akan menghapus semua data yang sudah diisi.",
        () => applySelectedActivityGroup(title, nextGroupId),
        "Lanjut",
      );
      return;
    }

    applySelectedActivityGroup(title, nextGroupId);
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

  const handleHeaderAction = () => {
    if (isForcedReadOnly) {
      return;
    }
    if (isReadOnlyMode) {
      setIsEditMode(true);
      return;
    }
    void handleSaveJournal();
  };

  useEffect(() => {
    if (isPrivateEvent && !isTrainer) {
      setIsEditMode(false);
    }
  }, [isPrivateEvent, isTrainer]);

  const buildJournalJson = useCallback(
    () => ({
      notes,
      activities: setGroups.map((group) => ({
        activity_name: group.title,
        sets: group.sets.map((set) => ({
          reps: set.reps,
          weight: set.weight,
        })),
      })),
      activity_group_id: activityGroupId,
      activity_group_name: activityGroupTitle,
      activity_group_duration: activityGroupDuration ?? sessionDuration ?? null,
    }),
    [
      activityGroupTitle,
      activityGroupId,
      activityGroupDuration,
      sessionDuration,
      notes,
      setGroups,
    ],
  );

  const hasContent = useCallback(
    () =>
      Boolean(
        notes.trim() ||
        setGroups.some(
          (group) =>
            group.title || group.sets.some((set) => set.weight || set.reps),
        ),
      ),
    [notes, setGroups],
  );

  const isDirty = useCallback(() => {
    if (!hasContent()) {
      return false;
    }
    return JSON.stringify(buildJournalJson()) !== savedSnapshot.current;
  }, [buildJournalJson, hasContent]);

  const confirmLeaveIfDirty = useCallback(
    (onLeave: () => void) => {
      if (currentJournalId != null && !isEditMode) {
        onLeave();
        return;
      }

      if (!isDirty()) {
        onLeave();
        return;
      }
      openConfirmModal(
        "Perubahan belum disimpan",
        "Perubahan yang dibuat akan hilang jika keluar tanpa menyimpan.",
        onLeave,
        "Tetap keluar",
      );
    },
    [currentJournalId, isDirty, isEditMode],
  );

  const handleBackPress = useCallback(() => {
    confirmLeaveIfDirty(() => router.back());
  }, [confirmLeaveIfDirty]);

  async function handleSaveJournal() {
    if (!sessionLogId) {
      openFeedbackModal(
        "Session log tidak ditemukan",
        "Silakan kembali dari halaman History lalu coba lagi.",
      );
      return;
    }

    if (saving) {
      return;
    }

    if (!activityGroupTitle) {
      openFeedbackModal(
        "Pilih activity group dulu",
        "Tentukan activity group sebelum menyimpan journal.",
      );
      return;
    }
    const hasIncompleteGroup = setGroups.some(
      (group) =>
        !group.title || group.sets.some((set) => !set.weight || !set.reps),
    );
    if (hasIncompleteGroup) {
      openFeedbackModal(
        "Data belum lengkap",
        "Lengkapi aktivitas dan set sebelum menyimpan journal.",
      );
      return;
    }
    if (!notes.trim()) {
      openFeedbackModal(
        "Notes belum diisi",
        "Tambahkan catatan sebelum menyimpan journal.",
      );
      return;
    }

    const journalJson = buildJournalJson();

    try {
      setSaving(true);
      const res =
        currentJournalId != null
          ? await updateJournal({
              journal_id: currentJournalId,
              session_log_id: sessionLogId,
              journal_json: journalJson,
            })
          : await createJournal({
              session_log_id: sessionLogId,
              journal_json: journalJson,
            });

      if (!res.success) {
        openFeedbackModal(
          "Gagal menyimpan journal",
          res.message || "Terjadi kesalahan saat menyimpan journal.",
        );
        return;
      }

      savedSnapshot.current = JSON.stringify(journalJson);
      openFeedbackModal(
        "Journal tersimpan",
        res.message || "Catatan dan aktivitas sudah disimpan.",
        () => router.back(),
      );

      setIsEditMode(false);
    } catch (error) {
      console.error(error);
      openFeedbackModal(
        "Gagal menyimpan journal",
        "Terjadi kesalahan saat menyimpan journal.",
      );
    } finally {
      setSaving(false);
    }
  }

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
      }),
    );
  };

  const handleRemoveSet = (groupIndex: number, setIndexToRemove: number) => {
    const group = setGroups[groupIndex];
    if (group?.sets.length <= 1) {
      openConfirmModal(
        "Hapus aktivitas?",
        "Aksi ini akan menghapus keseluruhan aktivitas. Lanjutkan?",
        () => {
          setActivityGroups((prev) =>
            prev.filter((_, index) => index !== groupIndex),
          );
        },
        "Hapus",
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
            (_, setIndex) => setIndex !== setIndexToRemove,
          ),
        };
      }),
    );
  };

  const handleSetChange = (
    groupIndex: number,
    setIndexToUpdate: number,
    field: "weight" | "reps",
    value: string,
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
              : set,
          ),
        };
      }),
    );
  };

  const handleRemoveGroup = (groupIndex: number) => {
    openConfirmModal(
      "Hapus aktivitas?",
      "Aksi ini akan menghapus keseluruhan aktivitas. Lanjutkan?",
      () => {
        setActivityGroups((prev) =>
          prev.filter((_, index) => index !== groupIndex),
        );
      },
      "Hapus",
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
        onBackPress,
      );
      return () => subscription.remove();
    }, [confirmLeaveIfDirty]),
  );

  useEffect(() => {
    const fetchActivityGroupCombobox = async () => {
      try {
        const res = await getActivityGroupCombobox({
          q: null,
          page: 1,
          limit: -1,
          activity_group_status_id: null,
        });

        setActivityGroupOptions(res.data);
      } catch (error) {
        console.error(error);
        setActivityGroupOptions([]);
      }
    };

    fetchActivityGroupCombobox();
  }, []);

  useEffect(() => {
    const fetchJournalData = async () => {
      setLoading(true);
      if (!sessionLogId) {
        setCurrentJournalId(null);
        setIsEditMode(isForcedReadOnly ? false : true);
        setLoading(false);
        return;
      }

      try {
        const res = await getJournalDetail({
          session_log_id: sessionLogId,
        });

        const journalItem = res.data;
        if (!res.success || !journalItem?.journal_json) {
          setCurrentJournalId(null);
          setIsEditMode(isForcedReadOnly ? false : true);
          setLoading(false);
          return;
        }

        const journalJson = journalItem.journal_json;
        const loadedGroups =
          journalJson.activities?.map((activity) => ({
            title: activity.activity_name,
            isOpen: true,
            sets: activity.sets.map((set) => ({
              reps: set.reps,
              weight: set.weight,
            })),
          })) ?? [];

        setActivityGroupId(journalJson.activity_group_id);
        setActivityGroupTitle(journalJson.activity_group_name);
        setActivityGroupDuration(journalJson.activity_group_duration);
        setNotes(journalJson.notes ?? "");
        setNotesDraft(journalJson.notes ?? "");
        setActivityGroups(
          loadedGroups.length > 0 ? loadedGroups : [createEmptyGroup()],
        );
        setCurrentJournalId(journalItem.journal_id);

        savedSnapshot.current = JSON.stringify(journalJson);
        setIsEditMode(isForcedReadOnly ? false : true);

        void loadActivitiesByGroupId(journalJson.activity_group_id);
      } catch (error) {
        console.error(error);
        setCurrentJournalId(null);
        setIsEditMode(isForcedReadOnly ? false : true);
      } finally {
        setLoading(false);
      }
    };

    fetchJournalData();
  }, [isForcedReadOnly, loadActivitiesByGroupId, sessionLogId]);

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
        showSave={!isForcedReadOnly && Boolean(activityGroupTitle)}
        onSave={handleHeaderAction}
        saveLabel={isForcedReadOnly ? "" : isReadOnlyMode ? "Edit" : "Save"}
        onBack={handleBackPress}
      />

      <View className="flex-1">
        {activityGroupTitle ? (
          <ScrollView>
            <View className="p-4 gap-4 pb-28">
              <View className="w-full flex flex-row justify-between items-center p-3 h-fit rounded-2xl">
                <View className="flex-row items-center gap-3">
                  <Text className="text-2xl">{activityGroupTitle}</Text>
                  {!isReadOnlyMode ? (
                    <Pressable
                      className="w-8 h-8 items-center justify-center"
                      onPress={handleEditActivityGroup}
                    >
                      <Pencil size={16} color="#6B7280" />
                    </Pressable>
                  ) : null}
                </View>
                {!isMembership && (
                  <View className="flex-col items-center">
                    <Text className="text-2xl">
                      {activityGroupDuration ?? sessionDuration}
                    </Text>
                    <Text className="text-md font-light">Duration</Text>
                  </View>
                )}
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
                          {isReadOnlyMode ? (
                            <Text className="flex-1 text-2xl text-gray-900">
                              {group.title || "Select activity"}
                            </Text>
                          ) : (
                            <Combobox
                              value={group.title}
                              placeholder={
                                activityOptionsLoading
                                  ? "Loading activity..."
                                  : "Select activity"
                              }
                              options={activityOptions}
                              open={pickerOpenIndex === groupIndex}
                              onOpenChange={(nextOpen) =>
                                setPickerOpenIndex(nextOpen ? groupIndex : null)
                              }
                              onSelect={(value) =>
                                handleExerciseTitleChange(groupIndex, value)
                              }
                              showIcon={false}
                              textClassName="text-2xl text-gray-900"
                              placeholderTextClassName="text-2xl text-gray-400"
                              searchPlaceholder="Cari activity..."
                            />
                          )}
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
                        <Text className="flex-1 text-lg text-gray-500">
                          Reps
                        </Text>
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
                              editable={!isReadOnlyMode}
                              onChangeText={(value) =>
                                handleSetChange(
                                  groupIndex,
                                  setIndex,
                                  "weight",
                                  value,
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
                              editable={!isReadOnlyMode}
                              onChangeText={(value) =>
                                handleSetChange(
                                  groupIndex,
                                  setIndex,
                                  "reps",
                                  value,
                                )
                              }
                            />
                          </View>
                          {!isReadOnlyMode ? (
                            <Pressable
                              className="w-7 h-7 items-center justify-center rounded-md bg-red-100"
                              onPress={() =>
                                handleRemoveSet(groupIndex, setIndex)
                              }
                            >
                              <X size={14} color="#EF4444" />
                            </Pressable>
                          ) : null}
                        </View>
                      ))}

                      {!isReadOnlyMode ? (
                        <Pressable
                          className="p-4 w-full flex-row justify-center gap-2 bg-white shadow-sm items-center rounded-2xl shadow-neutral-300"
                          onPress={() => handleAddSet(groupIndex)}
                        >
                          <Plus size={20} color="#0891B2" />
                          <Text className="text-md text-gray-700">Add Set</Text>
                        </Pressable>
                      ) : null}
                      {!isReadOnlyMode ? (
                        <Pressable
                          className="p-4 w-full flex-row justify-center gap-2 bg-red-50 shadow-sm items-center rounded-2xl shadow-neutral-200"
                          onPress={() => handleRemoveGroup(groupIndex)}
                        >
                          <Trash size={20} color="#EF4444" />
                          <Text className="text-md text-red-500">
                            Hapus Activity
                          </Text>
                        </Pressable>
                      ) : null}
                    </View>
                  ) : null}
                </View>
              ))}
            </View>
          </ScrollView>
        ) : loading ? (
          <View className="flex-1 items-center justify-center px-6">
            <View className="w-full p-6 items-center gap-4">
              <View className="w-16 h-16 rounded-full bg-cyan-50 items-center justify-center">
                <ActivityIndicator size="large" color="#0891B2" />
              </View>
              <Text className="text-md text-gray-500 text-center mt-2">
                Loading...
              </Text>
            </View>
          </View>
        ) : isForcedReadOnly ? (
          <View className="flex-1 items-center justify-center px-6">
            <View className="w-full p-6 items-center gap-4">
              <View className="w-16 h-16 rounded-full bg-cyan-50 items-center justify-center">
                <Frown size={28} color="#0891B2" />
              </View>
              <View className="items-center gap-2">
                <Text className="text-2xl text-gray-900 text-center">
                  Journal Belum Diisi Trainer
                </Text>
                <Text className="text-md text-gray-500 text-center">
                  Journal untuk sesi ini masih kosong. Harap menunggu trainer
                  mengisi journal setelah sesi selesai.
                </Text>
              </View>
            </View>
          </View>
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
                onPress={
                  isReadOnlyMode
                    ? undefined
                    : () => setActivityGroupModalOpen(true)
                }
              >
                <Text className="text-md text-white font-semibold">
                  Pilih Activity Group
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        {activityGroupTitle && !isReadOnlyMode ? (
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
      </View>

      <Modal
        animationType="fade"
        transparent
        visible={notesModalOpen}
        onRequestClose={handleCloseNotesModal}
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Pressable
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
            onPress={handleCloseNotesModal}
          />
          <View className="w-5/6 max-h-[80%] bg-white shadow-neutral-400/50 shadow-sm rounded-4xl overflow-hidden">
            <View className="p-6 gap-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-xl font-semibold text-gray-900">
                  Notes
                </Text>
                <Pressable onPress={handleCloseNotesModal}>
                  <X size={18} color="#6B7280" />
                </Pressable>
              </View>
              {isReadOnlyMode ? (
                <View className="min-h-[120px] max-h-[180px] bg-gray-50 rounded-2xl p-4">
                  <ScrollView
                    nestedScrollEnabled
                    scrollEnabled
                    keyboardShouldPersistTaps="handled"
                  >
                    <Text className="text-base text-gray-800">
                      {notesDraft || "-"}
                    </Text>
                  </ScrollView>
                </View>
              ) : (
                <TextInput
                  className="min-h-[120px] max-h-[180px] bg-gray-50 rounded-2xl p-4 text-base text-gray-800"
                  placeholder="Tulis catatan latihan di sini..."
                  multiline
                  scrollEnabled
                  textAlignVertical="top"
                  value={notesDraft}
                  onChangeText={setNotesDraft}
                />
              )}
              {isReadOnlyMode ? (
                <Pressable
                  className="px-5 py-3 rounded-full bg-gray-600 items-center"
                  onPress={handleCloseNotesModal}
                >
                  <Text className="text-md text-white font-semibold">
                    Tutup
                  </Text>
                </Pressable>
              ) : (
                <Pressable
                  className="px-5 py-3 rounded-full bg-cyan-600 items-center"
                  onPress={handleSaveNotes}
                >
                  <Text className="text-md text-white font-semibold">
                    Simpan Notes
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent
        visible={activityGroupModalOpen}
        onRequestClose={closeActivityGroupModal}
      >
        <Pressable
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
          onPress={closeActivityGroupModal}
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
                  options={activityGroupOptions.map((item) => item.label)}
                  open={activityGroupPickerOpen}
                  onOpenChange={setActivityGroupPickerOpen}
                  onSelect={handlePickActivityGroup}
                  showClear={!activityGroupEditing}
                  dropdownInline
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

      <FeedbackModal
        visible={feedbackModal.visible}
        title={feedbackModal.title}
        message={feedbackModal.message}
        onClose={closeFeedbackModal}
      />

      <ConfirmModal
        visible={confirmModal.visible}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        onCancel={closeConfirmModal}
        onConfirm={confirmModalAction}
      />
    </View>
  );
};

export default Journal;
