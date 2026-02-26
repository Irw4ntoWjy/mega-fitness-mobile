import PhysicalQuestionCard from "@/components/assessment/PhysicalQuestionCard";
import { BackgroundGlow } from "@/components/Theme/background";
import { AnswerValue } from "@/type/assessments";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { Fragment, useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { assessmentAnswer, assessmentQuestion } from "../dummy_question";

export default function PhysicalActivityReadiness() {
  const questions = assessmentQuestion.PHYSICAL_ACTIVITY_READINESS.questions;

  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const medicationsValue = answers["medications"]?.value;

  const hasAnyTrueBoolean = questions.some((q) => {
    if (q.type === "boolean" || q.type === "boolean_without_description") {
      return answers[q.key]?.value === true;
    }
    return false;
  });

  const setAnswer = (key: string, value: AnswerValue) => {
    setAnswers((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    const dummy = assessmentAnswer.PHYSICAL_ACTIVITY_READINESS.answers;

    const mapped = Object.fromEntries(
      Object.entries(dummy).map(
        ([key, { value, detail, text }]: [string, AnswerValue]) => [
          key,
          {
            value: value,
            detail: detail,
            text: text,
          },
        ],
      ),
    );

    setAnswers(mapped);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <BackgroundGlow showText={true} />

      <View className="mt-20 h-14 px-4 justify-center">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center"
        >
          <ChevronLeft size={22} color="#000" />
        </Pressable>
      </View>
      <ScrollView className="px-5 pt-10" showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-bold text-center">
          PHYSICAL ACTIVITY READINESS
        </Text>

        <Text className="text-center text-gray-500 mt-1 mb-6">
          Kesiapan Aktivitas Fisik — Jawab dengan jujur
        </Text>
        <View className="pt-4">
          {questions.map((q, index) => {
            if (
              (q.key === "medication_list" || q.key === "medication_effect") &&
              medicationsValue !== true
            ) {
              return null;
            }

            if (
              (q.key === "doctor_recommendations" ||
                q.key === "physio_recommendations") &&
              !hasAnyTrueBoolean
            ) {
              return null;
            }

            return (
              <Fragment key={q.key}>
                {q.key === "doctor_recommendations" && (
                  <View className="bg-yellow-50 border border-yellow-300 rounded-4xl p-4 mb-4">
                    <Text className="text-md text-gray-700 leading-6 text-justify">
                      Bicaralah dengan dokter Anda melalui telepon atau secara
                      langsung SEBELUM Anda mulai menjadi lebih aktif secara
                      fisik.
                      {"\n\n"}
                      Anda mungkin dapat melakukan aktivitas apa pun yang Anda
                      inginkan — selama Anda memulainya dengan perlahan dan
                      meningkatkannya secara bertahap.
                      {"\n\n"}
                      Atau, Anda mungkin perlu membatasi aktivitas Anda pada
                      aktivitas yang aman bagi Anda. Bicaralah dengan dokter
                      Anda tentang jenis aktivitas yang ingin Anda ikuti dan
                      ikuti sarannya.
                      {"\n\n"}
                      Cari tahu program mana yang aman dan bermanfaat bagi Anda.
                    </Text>
                  </View>
                )}

                <PhysicalQuestionCard
                  key={q.key}
                  q={q}
                  index={index}
                  value={answers[q.key]}
                  setAnswer={setAnswer}
                />
              </Fragment>
            );
          })}
        </View>
        {/* <Text className="text-2xl font-bold text-center">
          PHYSIOLOGY CONDITION ASSESSMENT
        </Text>

        <Text className="text-center text-gray-500 mt-1 mb-6">
          Penilaian Kondisi Fisiologis
        </Text> */}
      </ScrollView>
    </View>
  );
}
