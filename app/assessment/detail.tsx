import { createAssessment, getAssessmentList } from "@/app/api/assessment";
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
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { QUESTION_META } from "./dummy_question";

export default function AssessmentDetail() {
  const { auth, loading: loadingAuth } = useAuth();
  const isTrainer = auth?.accountDetail?.account_role === "Trainer";
  const { memberProfileId } = useLocalSearchParams<{
    memberProfileId?: string;
  }>();
  const { showToast } = useToast();
  const [, setLoading] = useState(false);
  const [data, setData] = useState<SectionSchema[]>([]);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const currentSection = data[currentStep];
  const isReadOnlySection = (section?: number) =>
    isTrainer && (section === 1 || section === 2);
  const isTrainerReadOnlySection = isReadOnlySection(currentSection?.section);

  const parseBodyComposition = (text: string) => {
    const get = (label: string) => {
      const match = text.match(new RegExp(`${label}: ([^,]+)`));
      return match ? match[1].replace(/[^\d.]/g, "") : "";
    };

    return {
      height: get("Height"),
      weight: get("Weight"),
      bodyFat: get("Body Fat"),
      muscleMass: get("Muscle Mass"),
      bmi: get("BMI"),
    };
  };

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
          limit: 1,
          profile_id: profileId,
        });

        const resData = res.data;
        const rawAnswerJson = (resData as any)?.data?.[0]?.answer_json;

        const isEditMode = !rawAnswerJson;

        const answerJson = rawAnswerJson ?? QUESTION_META;

        setIsEditMode(isEditMode);

        setData(answerJson);

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

            if (val.type === "TEXT") {
              initialAnswers[key] = {
                type: "TEXT",
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

        setAnswers(initialAnswers);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [loadingAuth, auth, memberProfileId]);

  useEffect(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: false });
  }, [currentStep]);

  const isCurrentStepValid = () => {
    if (isTrainerReadOnlySection) {
      return true;
    }

    return currentSection?.data?.every((q: any) => {
      const key = `${currentSection.section}-${q.key.en}`;
      const answer = answers[key];

      if (!answer) return false;

      if (answer.type === "BOOL") {
        return answer.value !== undefined;
      }

      if (answer.type === "TEXT") {
        return !!answer.desc;
      }

      if (answer.type === "BOOL_TEXT") {
        return (
          answer.value !== undefined &&
          (answer.value === false || !!answer.desc)
        );
      }

      return false;
    });
  };

  const cleanKey = (key: string) => key.replace(/^\d+-/, "");

  const mapValue = (metaType: string, answer?: any) => {
    if (!answer) return { type: metaType };

    if (metaType === "BOOL") {
      return {
        type: "BOOL",
        value: answer.value ?? false,
      };
    }

    if (metaType === "BOOL_TEXT") {
      return {
        type: "BOOL_TEXT",
        value: answer.value ?? false,
        ...(answer.desc ? { desc: answer.desc } : {}),
      };
    }

    if (metaType === "TEXT") {
      return {
        type: "TEXT",
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

        const medicationKeyName = "Medications";
        const effectKeyName = "Effect";

        const doctorKey =
          "Harap Anda/Dokter sebutkan rekomendasi atau batasan apa pun yang sesuai untuk Anda dalam program Latihan ini:";
        const physioKey =
          "Harap Physiotherapist sebutkan rekomendasi atau batasan apa pun yang sesuai untuk Anda dalam program Latihan ini:";

        const isMedicationField =
          q.key.en === medicationKeyName || q.key.en === effectKeyName;

        const isDoctorOrPhysio =
          q.key.en === doctorKey || q.key.en === physioKey;

        if (
          !answer ||
          (answer == undefined && (isMedicationField || isDoctorOrPhysio))
        ) {
          answer = {
            type: "TEXT",
            desc: "-",
          };
        }
        return {
          key: q.key,
          value: mapValue(q.value.type, answer),
          rawAnswer: answer,
        };
      });

      if ((section.section === 1 || section.section === 2) && !isTrainer) {
        for (const q of data) {
          const answer = q.rawAnswer;
          let isValid = true;

          if (!answer) {
            isValid = false;
          } else {
            switch (answer.type) {
              case "BOOL":
                isValid = typeof answer.value === "boolean";
                break;
              case "BOOL_TEXT":
                isValid = typeof answer.value === "boolean";
                break;
              case "TEXT":
                isValid =
                  typeof answer.desc === "string" && answer.desc.trim() !== "";
                break;
              default:
                isValid = false;
            }
          }

          if (!isValid) {
            showToast({
              message: `Question missing required answer in section ${section.section}: "${q.key.en}"`,
              variant: "warning",
              duration: 3500,
            });
            return;
          }
        }
      }

      result.push({
        section: section.section,
        subtitle: section.subtitle,
        data: data.map(({ key, value }) => ({ key, value })),
      });
    }

    try {
      const res = await createAssessment({
        profile_id: profileId,
        answer_json: result,
      });

      showToast({
        message: res.message,
        variant: res.success === true ? "success" : "error",
        duration: 2500,
      });

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
    <View className="flex-1">
      <BackgroundGlow showText />

      <View className="mt-20 h-14 px-4 flex-row items-center justify-between">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center"
        >
          <ChevronLeft size={22} color="#000" />
        </Pressable>

        <Pressable
          onPress={() => {
            if (isEditMode) {
              handleSubmit();
            } else {
              setIsEditMode(true);
            }
          }}
          className="px-3 h-10 items-center justify-center"
        >
          <Text className="text-[#0E8BAA] text-xl underline">
            {isEditMode ? "Done" : "Edit"}
          </Text>
        </Pressable>
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
        className="flex-1 mb-30"
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 mt-6">
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
              (isDoctorOrPhysioField && !hasAnyTrueAnswer);

            return (
              <View key={key} style={{ display: hidden ? "none" : "flex" }}>
                <PhysicalQuestionCard
                  key={key}
                  questionKey={key}
                  q={q}
                  index={index}
                  value={answers[key]}
                  disabled={!isEditMode || isTrainerReadOnlySection}
                  setAnswer={(k, value) => {
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
            handleSubmit();
            return;
          }
          setCurrentStep((prev) => prev + 1);
        }}
        onBack={() => setCurrentStep((prev) => prev - 1)}
        backDisabled={currentStep === 0}
        // nextDisabled={!isCurrentStepValid()}
        isLastStep={currentStep === data.length - 1}
        hideNext={currentStep === data.length - 1}
      />
    </View>
  );
}
