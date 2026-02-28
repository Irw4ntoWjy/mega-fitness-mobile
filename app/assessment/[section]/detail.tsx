import AssessmentHeader from "@/components/assessment/AssessmentHeader";
import BottomNavbar from "@/components/assessment/BottomNavbar";
import PhysicalQuestionCard from "@/components/assessment/PhysicalQuestionCard";
import {
  getNextStep,
  getStepIndex,
  getTotalSteps,
  stepOrder,
} from "@/components/assessment/utils/AssessmentSteps";
import { BackgroundGlow } from "@/components/Theme/background";
import { AnswerValue } from "@/type/assessments";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { Fragment, useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import {
  assessmentAnswer,
  assessmentHeaderDummy,
  AssessmentPages,
  assessmentQuestion,
} from "../dummy_question";

export default function AssessmentDetail() {
  const { section } = useLocalSearchParams<{ section?: string }>();

  const safeSection =
    section && section in assessmentQuestion
      ? section
      : AssessmentPages.PHYSICAL_ACTIVITY_READINESS;
  const currentPage = safeSection as AssessmentPages;
  console.log("currentPage:", currentPage);
  console.log("stepIndex:", getStepIndex(currentPage));
  console.log("totalSteps:", getTotalSteps());
  console.log("STEP ORDER:", stepOrder);

  const headerData = assessmentHeaderDummy[currentPage];

  const currentStep = getStepIndex(currentPage) + 1;
  const totalSteps = getTotalSteps();
  const nextPage = getNextStep(currentPage);
  const [isEditMode, setIsEditMode] = useState(false);

  const sectionConfig = assessmentQuestion[currentPage];

  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});

  const questions = "questions" in sectionConfig ? sectionConfig.questions : [];

  const medicationsValue = answers["medications"]?.value;

  const hasAnyTrueBoolean = useMemo(() => {
    return questions.some((q: any) => {
      if (q.type === "boolean" || q.type === "boolean_without_description") {
        return answers[q.key]?.value === true;
      }
      return false;
    });
  }, [answers, questions]);

  const setAnswer = (key: string, value: AnswerValue) => {
    setAnswers((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    const dummy = assessmentAnswer[currentPage];

    if (!dummy || !("answers" in dummy)) return;

    const mapped = Object.fromEntries(
      Object.entries(dummy.answers).map(([key, value]: [string, any]) => [
        key,
        {
          value: value.value ?? null,
          detail: value.detail ?? "",
          text: value.text ?? "",
        },
      ]),
    );

    setAnswers(mapped);
  }, [currentPage]);

  const renderSection = () => {
    if (!("questions" in sectionConfig)) return null;

    return questions.map((q: any, index: number) => {
      if (
        (q.key === "medication_list" || q.key === "medication_effect") &&
        medicationsValue !== true
      )
        return null;

      if (
        (q.key === "doctor_recommendations" ||
          q.key === "physio_recommendations") &&
        !hasAnyTrueBoolean
      )
        return null;

      return (
        <Fragment key={q.key}>
          {q.key === "doctor_recommendations" && hasAnyTrueBoolean && (
            <View className="bg-yellow-50 border border-yellow-300 rounded-3xl p-4 mb-4">
              <Text className="text-md text-gray-700 leading-6 text-justify">
                Bicaralah dengan dokter Anda melalui telepon atau secara
                langsung SEBELUM Anda mulai menjadi lebih aktif secara fisik.
                {"\n\n"}
                Anda mungkin dapat melakukan aktivitas apa pun yang Anda
                inginkan — selama Anda memulainya dengan perlahan dan
                meningkatkannya secara bertahap.
                {"\n\n"}
                Atau, Anda mungkin perlu membatasi aktivitas Anda pada aktivitas
                yang aman bagi Anda. Bicaralah dengan dokter Anda tentang jenis
                aktivitas yang ingin Anda ikuti dan ikuti sarannya.
                {"\n\n"}
                Cari tahu program mana yang aman dan bermanfaat bagi Anda.
              </Text>
            </View>
          )}

          <PhysicalQuestionCard
            q={q}
            index={index}
            value={answers[q.key]}
            setAnswer={setAnswer}
            disabled={!isEditMode}
          />
        </Fragment>
      );
    });
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
          onPress={() => setIsEditMode((prev) => !prev)}
          className="px-3 h-10 items-center justify-center"
        >
          <Text className="text-[#0E8BAA]  text-xl underline">
            {isEditMode ? "Done" : "Edit"}
          </Text>
        </Pressable>
      </View>

      <AssessmentHeader
        currentStep={currentStep}
        totalSteps={totalSteps}
        sectionLabel={headerData?.section}
        title={currentPage.replace(/-/g, " ").toUpperCase()}
        subtitle={headerData?.subtitle}
      />

      <ScrollView
        className="flex-1 px-5 pt-6 mb-25"
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        {renderSection()}
      </ScrollView>

      <BottomNavbar
        onNext={() => {
          if (!nextPage) {
            console.log("Submit Assessment");
            return;
          }
          router.push(`/assessment/${nextPage}/detail`);
        }}
        nextDisabled={false}
      />
    </View>
  );
}
