import { getAssessmentList } from "@/app/api/assessment";
import AssessmentHeader from "@/components/assessment/AssessmentHeader";
import BottomNavbar from "@/components/assessment/BottomNavbar";
import PhysicalQuestionCard from "@/components/assessment/PhysicalQuestionCard";
import { BackgroundGlow } from "@/components/Theme/background";
import { useAuth } from "@/hooks/useAuth";
import { AnswerValue, SectionSchema } from "@/type/assessment";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function AssessmentDetail() {
  const { auth, loading: loadingAuth } = useAuth();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SectionSchema[]>([]);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);

  const currentSection = data[currentStep];

  // ================= FETCH + MAP =================
  useEffect(() => {
    if (loadingAuth) return;

    const profileId = auth?.accountDetail?.profile_id;
    if (!profileId) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await getAssessmentList({
          limit: 1,
          profile_id: profileId,
        });

        const resData = res.data;
        const answerJson = (resData as any)?.data?.[0]?.answer_json;

        setData(answerJson);

        // 🔥 MAP API → UI STATE
        const initialAnswers: Record<string, AnswerValue> = {};

        answerJson?.forEach((section: any) => {
          section.data?.forEach((item: any) => {
            const key = `${section.section}-${item.key.en}`;
            const val = item.value;

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

        console.log("mapped answers", initialAnswers);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [loadingAuth, auth]);

  // ================= VALIDATION =================
  const isCurrentStepValid = () => {
    return currentSection?.data?.every((q: any) => {
      console.log(q);
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

  // ================= SUBMIT =================
  const handleSubmit = () => {
    console.log("FINAL ANSWERS:", answers);

    // 🔥 (Next step: map back to API format)
  };

  return (
    <View className="flex-1">
      <BackgroundGlow showText />

      {/* HEADER */}
      <View className="mt-20 h-14 px-4 flex-row items-center justify-between">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center"
        >
          <ChevronLeft size={22} color="#000" />
        </Pressable>

        <Pressable
          onPress={() => setIsEditMode((prev) => !prev)}
          className="px-3 h-10 items-center justify-center"
        >
          <Text className="text-[#0E8BAA] text-xl underline">
            {isEditMode ? "Done" : "Edit"}
          </Text>
        </Pressable>
      </View>

      {/* SECTION HEADER */}
      {currentSection && (
        <AssessmentHeader
          currentStep={currentStep + 1}
          totalSteps={data.length}
          sectionLabel={`Section ${currentSection.section}`}
          title={currentSection.subtitle}
        />
      )}

      {/* QUESTIONS */}
      <ScrollView className="flex-1 mb-30" showsVerticalScrollIndicator={false}>
        <View className="px-6 mt-6">
          {currentSection?.data?.map((q: any, index: number) => {
            const key = `${currentSection.section}-${q.key.en}`;

            return (
              <PhysicalQuestionCard
                key={key}
                q={q}
                index={index}
                value={answers[key]}
                disabled={!isEditMode}
                setAnswer={(k, value) => {
                  setAnswers((prev) => ({
                    ...prev,
                    [k]: value,
                  }));
                }}
              />
            );
          })}
        </View>
      </ScrollView>

      {/* NAVBAR */}
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
        nextDisabled={!isCurrentStepValid()}
        isLastStep={currentStep === data.length - 1}
      />
    </View>
  );
}
