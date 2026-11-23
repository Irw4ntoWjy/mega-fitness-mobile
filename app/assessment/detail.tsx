import {
  createAssessment,
  getAssessmentList,
  updateAssessment,
} from "@/app/api/assessment";
import AssessmentHeader from "@/components/assessment/AssessmentHeader";
import BottomNavbar from "@/components/assessment/BottomNavbar";
import MultiFieldCard from "@/components/assessment/MultiFieldCard";
import PhysicalQuestionCard from "@/components/assessment/PhysicalQuestionCard";
import {
  PARSE_CONFIG,
  parseKeyValueText,
} from "@/components/assessment/utils/parseAssessment";
import { BackgroundGlow } from "@/components/Theme/background";
import { useToast } from "@/components/Toast/toast-provider";
import { useAuth } from "@/hooks/useAuth";
import { AnswerValue, SectionSchema } from "@/type/assessment";
import { toYmd } from "@/utils/datetimeFormat";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { PARQ_DECLARATION, QUESTION_META } from "./dummy_question";

const cleanKey = (key: string) => key.replace(/^\d+[A-Z]?-/, "");

function toCurrentQuestions(saved: Record<string, AnswerValue>) {
  const byText: Record<string, AnswerValue> = {};
  for (const [k, v] of Object.entries(saved)) byText[cleanKey(k)] = v;
  const remapped: Record<string, AnswerValue> = {};
  for (const s of QUESTION_META)
    for (const q of s.data)
      if (byText[q.key.en])
        remapped[`${s.section}-${q.key.en}`] = byText[q.key.en];
  return remapped;
}

export default function AssessmentDetail() {
  const { auth, loading: loadingAuth } = useAuth();
  const isTrainer = auth?.accountDetail?.account_role === "Trainer";
  const { memberProfileId, assessmentId, edit } = useLocalSearchParams<{
    memberProfileId?: string;
    assessmentId?: string;
    edit?: string;
  }>();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<SectionSchema[]>([]);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const ios = Platform.OS === "ios";
    const show = Keyboard.addListener(
      ios ? "keyboardWillShow" : "keyboardDidShow",
      (e) => setKeyboardHeight(e.endCoordinates.height),
    );
    const hide = Keyboard.addListener(
      ios ? "keyboardWillHide" : "keyboardDidHide",
      () => setKeyboardHeight(0),
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  const latestRef = useRef<{ id: number; createdAt?: string } | null>(null);

  const currentSection = data[currentStep];
  const isReadOnlySection = (section?: number | string) =>
    isTrainer
      ? section === "2A" || section === "2B" || section === 2 // 2 = older saved assessments
      : section === 3;
  const isTrainerReadOnlySection = isReadOnlySection(currentSection?.section);
  const isYes = (a?: AnswerValue) => !!a && "value" in a && a.value === true;

  useEffect(() => {
    if (loadingAuth) return;

    const profileId = memberProfileId
      ? String(memberProfileId)
      : auth?.accountDetail?.profile_id;
    if (!profileId) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await getAssessmentList({
          limit: -1,
          profile_id: profileId,
        });

        const resData = res.data;
        const rows: any[] = (resData as any)?.data ?? [];
        const toTime = (v?: string) => {
          const t = v ? new Date(v).getTime() : 0;
          return Number.isNaN(t) ? 0 : t;
        };
        const latest = rows.reduce<any>(
          (best, r) =>
            !best || toTime(r.created_at) > toTime(best.created_at) ? r : best,
          null,
        );
        latestRef.current = latest
          ? { id: latest.assessment_id, createdAt: latest.created_at }
          : null;
        const selected = assessmentId
          ? rows.find((r) => String(r.assessment_id) === String(assessmentId))
          : latest;
        const rawAnswerJson = selected?.answer_json;

        const isEditMode = !rawAnswerJson || edit === "1";

        const answerJson = rawAnswerJson ?? QUESTION_META;

        setIsEditMode(isEditMode);
        // trainer on the member's latest assessment still needs Edit to fill section 3
        setIsReadOnly(
          !!rawAnswerJson && edit !== "1" && !(isTrainer && !assessmentId),
        );

        // editing always uses the current questions; viewing shows what was saved
        setData(isEditMode ? (QUESTION_META as SectionSchema[]) : answerJson);

        const initialAnswers: Record<string, AnswerValue> = {};

        answerJson?.forEach((section: any) => {
          section.data?.forEach((item: any) => {
            const key = `${section.section}-${item.key.en}`;
            const val = item.value;

            const config = PARSE_CONFIG[item.key.en];

            if (config && val?.value) {
              const parsed = parseKeyValueText(val.value, config);

              Object.entries(parsed).forEach(([k, v]) => {
                initialAnswers[`${section.section}-${item.key.en}-${k}`] = {
                  type: "TEXT",
                  desc: v,
                };
              });

              return;
            }

            if (!val) return;

            if (val.type === "TEXT" || val.type === "CHOICE") {
              initialAnswers[key] = {
                type: val.type,
                desc: val.value,
              };
            }

            if (val.type === "BOOL") {
              initialAnswers[key] = {
                type: "BOOL",
                value: val.value,
              };
            }

            if (val.type === "BOOL_TEXT") {
              initialAnswers[key] = {
                type: "BOOL_TEXT",
                value: val.value,
                desc: val.desc,
              };
            }
          });
        });

        setAnswers(
          isEditMode ? toCurrentQuestions(initialAnswers) : initialAnswers,
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [loadingAuth, auth, isTrainer, memberProfileId, assessmentId, edit]);

  useEffect(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: false });
  }, [currentStep]);

  // required questions left empty on submit: red-highlighted, first one scrolled into view
  const [missing, setMissing] = useState<Set<string>>(new Set());
  const [jumpTo, setJumpTo] = useState<string | null>(null);
  const positions = useRef<Record<string, number>>({});

  useEffect(() => {
    if (!jumpTo) return;
    // wait for the (possibly new) page to lay out
    const t = setTimeout(() => {
      const y = positions.current[jumpTo];
      if (y != null)
        scrollViewRef.current?.scrollTo({
          y: Math.max(y - 16, 0),
          animated: true,
        });
      setJumpTo(null);
    }, 300);
    return () => clearTimeout(t);
  }, [jumpTo, currentStep]);

  const flagMissing = (subtitle: string, keys: string[], message: string) => {
    showToast({ message, variant: "warning", duration: 3500 });
    setMissing(new Set(keys));
    const step = data.findIndex((s) => s.subtitle === subtitle);
    if (step >= 0) setCurrentStep(step);
    setJumpTo(keys[0]);
  };

  const isAnswered = (a?: AnswerValue) => {
    if (!a) return false;
    if (a.type === "BOOL" || a.type === "BOOL_TEXT")
      return typeof a.value === "boolean";
    return typeof a.desc === "string" && a.desc.trim() !== "" && a.desc !== "-";
  };

  const mapValue = (metaType: string, answer?: any) => {
    if (!answer) return { type: metaType };

    if (metaType === "BOOL") {
      return {
        type: "BOOL",
        ...(typeof answer.value === "boolean" ? { value: answer.value } : {}),
      };
    }

    if (metaType === "BOOL_TEXT") {
      return {
        type: "BOOL_TEXT",
        ...(typeof answer.value === "boolean" ? { value: answer.value } : {}),
        ...(answer.desc ? { desc: answer.desc } : {}),
      };
    }

    if (metaType === "TEXT" || metaType === "CHOICE") {
      return {
        type: metaType,
        value: answer.desc ?? "",
      };
    }

    return { type: metaType };
  };

  const handleSubmit = async () => {
    const profileId = memberProfileId
      ? String(memberProfileId)
      : auth?.accountDetail?.profile_id;

    if (!profileId) {
      showToast({
        message: "Profile ID not found.",
        variant: "error",
        duration: 2500,
      });
      return;
    }

    const result = [];

    for (const section of QUESTION_META) {
      const data = section.data.map((q) => {
        const config = PARSE_CONFIG[q.key.en];

        if (config) {
          const baseKey = `${section.section}-${q.key.en}`;
          const isFilled = config.every((f) => {
            const val = (answers[`${baseKey}-${f.key}`] as any)?.desc;
            return typeof val === "string" && val.trim() !== "";
          });

          const desc = config
            .map(
              (f) =>
                `${f.label}: ${(answers[`${baseKey}-${f.key}`] as any)?.desc ?? ""}`,
            )
            .join(", ");

          const answer: AnswerValue = {
            type: "TEXT",
            desc: isFilled ? desc : "",
          };

          return {
            key: q.key,
            value: mapValue(q.value.type, answer),
            rawAnswer: answer,
          };
        }

        const answerEntry = Object.entries(answers).find(
          ([key]) => cleanKey(key) === q.key.en,
        );
        let answer = answerEntry?.[1];

        if (!answer) {
          answer = {
            type: "TEXT",
            desc: "-",
          };
        }
        return {
          ...q,
          value: { ...q.value, ...mapValue(q.value.type, answer) },
          rawAnswer: answerEntry?.[1],
        };
      });

      if (section.section === 1 && !isTrainer) {
        const missingKeys = data
          .filter((q) => !isAnswered(q.rawAnswer))
          .map((q) => `${section.section}-${q.key.en}`);

        if (missingKeys.length) {
          flagMissing(
            section.subtitle,
            missingKeys,
            `${missingKeys.length} required question(s) in section ${section.section} not answered yet`,
          );
          return;
        }
      }

      const declaration = data.find((q) => q.key.en === PARQ_DECLARATION.en);
      const checked =
        declaration?.rawAnswer && "desc" in declaration.rawAnswer
          ? (declaration.rawAnswer.desc ?? "").split("; ").filter(Boolean)
          : [];
      const started = data.some(
        (q) => q !== declaration && isAnswered(q.rawAnswer),
      );
      if (
        declaration &&
        started &&
        !isTrainer &&
        PARQ_DECLARATION.options.some((o) => !checked.includes(o))
      ) {
        flagMissing(
          section.subtitle,
          [`${section.section}-${PARQ_DECLARATION.en}`],
          "Please check the PAR-Q+ declaration before submitting",
        );
        return;
      }

      result.push({
        section: section.section,
        subtitle: section.subtitle,
        data: data.map(({ rawAnswer, ...q }) => q),
      });
    }

    try {
      const latest = latestRef.current;
      const isLatestToday =
        !!latest?.createdAt &&
        toYmd(new Date(latest.createdAt)) === toYmd(new Date());

      const res =
        latest && isLatestToday
          ? await updateAssessment({
              assessment_id: latest.id,
              profile_id: profileId,
              answer_json: result,
            })
          : await createAssessment({
              profile_id: profileId,
              answer_json: result,
            });

      showToast({
        message: res.message,
        variant: res.success === true ? "success" : "error",
        duration: 2500,
      });

      if (res.success === true && !(latest && isLatestToday)) {
        // a new record was created: remember it so the next save today updates it
        const listRes = await getAssessmentList({
          limit: 1,
          profile_id: profileId,
        });
        const row = ((listRes.data as any)?.data ?? [])[0];
        if (row) {
          latestRef.current = {
            id: row.assessment_id,
            createdAt: row.created_at,
          };
        }
      }

      setIsEditMode(false);
    } catch (err) {
      console.error(err);
      showToast({
        message: "Failed to submit assessment.",
        variant: "error",
        duration: 2500,
      });
    }
  };

  return (
    <View style={{ flex: 1, paddingBottom: keyboardHeight }}>
      <BackgroundGlow showText />

      <View className="mt-20 h-14 px-4 flex-row items-center justify-between">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center"
        >
          <ChevronLeft size={22} color="#000" />
        </Pressable>

        {!loading && !isReadOnly && (
          <Pressable
            onPress={() => {
              if (isEditMode) {
                handleSubmit();
              } else {
                setData(QUESTION_META as SectionSchema[]);
                setAnswers((prev) => toCurrentQuestions(prev));
                setCurrentStep(0);
                setIsEditMode(true);
              }
            }}
            className="px-4 h-10 items-center justify-center rounded-xl bg-[#0E8BAA]"
          >
            <Text className="text-white text-base font-semibold">
              {isEditMode ? "Done" : "Edit"}
            </Text>
          </Pressable>
        )}
      </View>

      {currentSection && (
        <AssessmentHeader
          currentStep={currentStep + 1}
          totalSteps={data.length}
          sectionLabel={`Section ${currentSection.section}`}
          title={currentSection.subtitle}
        />
      )}

      <ScrollView
        ref={scrollViewRef}
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 mt-6">
          {isTrainerReadOnlySection && (
            <View className="mb-4 p-3 rounded-xl bg-gray-100 border border-gray-200">
              <Text className="text-gray-600 font-semibold">
                {isTrainer
                  ? "Filled in by the member"
                  : "Filled in by your trainer"}
              </Text>
              {!isTrainer &&
                !currentSection.data.some((q) => {
                  const a = answers[`${currentSection.section}-${q.key.en}`];
                  return (
                    !q.trainerOnly &&
                    !!a &&
                    "desc" in a &&
                    !!a.desc &&
                    a.desc !== "-"
                  );
                }) && (
                  <Text className="text-gray-500 mt-1">
                    Your trainer hasn&apos;t filled this in yet.
                  </Text>
                )}
            </View>
          )}
          {currentSection?.data?.map((q: any, index: number) => {
            const key = `${currentSection.section}-${q.key.en}`;

            const config = PARSE_CONFIG[q.key.en];

            if (config) {
              const baseKey = `${currentSection.section}-${q.key.en}`;

              return (
                <MultiFieldCard
                  key={key}
                  title={q.key.en}
                  baseKey={baseKey}
                  fields={config}
                  answers={answers}
                  setAnswers={setAnswers}
                  isEditMode={isEditMode}
                  isTrainerReadOnlySection={isTrainerReadOnlySection}
                />
              );
            }
            const medicationKey = `${currentSection.section}-Do you currently take any medications?`;
            const isMedicationTrue = (() => {
              const ans = answers[medicationKey];
              if (!ans) return false;
              if (ans.type === "BOOL" || ans.type === "BOOL_TEXT")
                return ans.value === true;
              return false;
            })();

            const dependsOnMedication =
              q.key.en === "Medications" || q.key.en === "Effect";

            if (dependsOnMedication && !isMedicationTrue) return null;

            const doctorKey =
              "Harap Anda/Dokter sebutkan rekomendasi atau batasan apa pun yang sesuai untuk Anda dalam program Latihan ini:";
            const physioKey =
              "Harap Physiotherapist sebutkan rekomendasi atau batasan apa pun yang sesuai untuk Anda dalam program Latihan ini:";

            const isDoctorOrPhysioField =
              q.key.en === doctorKey || q.key.en === physioKey;

            const hasAnyTrueAnswer = currentSection.data.some((item: any) => {
              if (item.value.type !== "BOOL" && item.value.type !== "BOOL_TEXT")
                return false;
              const itemKey = `${currentSection.section}-${item.key.en}`;
              const ans = answers[itemKey];
              if (!ans) return false;
              if (ans.type === "BOOL" || ans.type === "BOOL_TEXT")
                return ans.value === true;
              return false;
            });

            if (isDoctorOrPhysioField) {
              if (!hasAnyTrueAnswer) return null;
            }

            const hidden =
              (dependsOnMedication && !isMedicationTrue) ||
              (isDoctorOrPhysioField && !hasAnyTrueAnswer) ||
              (!!q.trainerOnly && !isTrainer) ||
              (!!q.parent &&
                !isYes(answers[`${currentSection.section}-${q.parent}`]));

            return (
              <View
                key={key}
                style={{ display: hidden ? "none" : "flex" }}
                onLayout={(e) => {
                  positions.current[key] = e.nativeEvent.layout.y;
                }}
              >
                {q.group &&
                  q.group !== currentSection.data[index - 1]?.group && (
                    <Text className="font-bold text-lg mt-2 mb-3">
                      {isTrainer
                        ? q.group
                        : q.group.replace(/^Module \d+: /, "")}
                    </Text>
                  )}
                <PhysicalQuestionCard
                  key={key}
                  questionKey={key}
                  q={q}
                  index={index}
                  value={answers[key]}
                  disabled={!isEditMode || isTrainerReadOnlySection}
                  error={missing.has(key)}
                  setAnswer={(k, value) => {
                    setMissing((prev) => {
                      if (!prev.has(k)) return prev;
                      const next = new Set(prev);
                      next.delete(k);
                      return next;
                    });
                    setAnswers((prev) => {
                      const updated = { ...prev, [k]: value };
                      const section = currentSection.section;

                      const doctorKey =
                        "Harap Anda/Dokter sebutkan rekomendasi atau batasan apa pun yang sesuai untuk Anda dalam program Latihan ini:";
                      const physioKey =
                        "Harap Physiotherapist sebutkan rekomendasi atau batasan apa pun yang sesuai untuk Anda dalam program Latihan ini:";

                      const doctorFullKey = `${section}-${doctorKey}`;
                      const physioFullKey = `${section}-${physioKey}`;

                      const allFalse = currentSection.data
                        .filter(
                          (item: any) =>
                            item.value.type === "BOOL" ||
                            item.value.type === "BOOL_TEXT",
                        )
                        .every((item: any) => {
                          const itemKey = `${section}-${item.key.en}`;
                          const ans = updated[itemKey];

                          if (!ans) return true;

                          if (ans.type === "BOOL" || ans.type === "BOOL_TEXT") {
                            return ans.value === false;
                          }

                          return true;
                        });

                      if (allFalse) {
                        delete updated[doctorFullKey];
                        delete updated[physioFullKey];
                      }

                      if ("value" in value && value.value === false) {
                        for (const item of currentSection.data) {
                          if (`${section}-${item.parent}` === k)
                            delete updated[`${section}-${item.key.en}`];
                        }
                      }

                      if (
                        k === medicationKey &&
                        (value as any)?.value === false
                      ) {
                        delete updated[`${currentSection.section}-Medications`];
                        delete updated[`${currentSection.section}-Effect`];
                      }

                      return updated;
                    });
                  }}
                />
              </View>
            );
          })}
        </View>
      </ScrollView>

      <BottomNavbar
        onNext={() => {
          if (currentStep === data.length - 1) {
            if (isReadOnly) return;
            handleSubmit();
            return;
          }
          setCurrentStep((prev) => prev + 1);
        }}
        onBack={() => setCurrentStep((prev) => prev - 1)}
        backDisabled={currentStep === 0}
        isLastStep={currentStep === data.length - 1}
        hideNext={currentStep === data.length - 1}
      />
    </View>
  );
}
