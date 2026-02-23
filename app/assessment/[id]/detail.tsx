import PhysicalQuestionCard from "@/components/assessment/PhysicalQuestionCard";
import { BackgroundGlow } from "@/components/Theme/background";
import { AnswerValue } from "@/type/assessments";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { assessmentAnswer, assessmentQuestion } from "../dummy_question";

export default function PhysicalActivityReadiness() {
  const questions = assessmentQuestion.PHYSICAL_ACTIVITY_READINESS.questions;

  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});

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
          {questions.map((q, index) => (
            <PhysicalQuestionCard
              key={q.key}
              q={q}
              index={index}
              value={answers[q.key]}
              setAnswer={setAnswer}
            />
          ))}
        </View>
        <Text className="py-10">Doctor Recommendation Masi Di pikirkan</Text>
        <Text className="text-2xl font-bold text-center">
          PHYSIOLOGY CONDITION ASSESSMENT
        </Text>

        <Text className="text-center text-gray-500 mt-1 mb-6">
          Penilaian Kondisi Fisiologis
        </Text>
      </ScrollView>
    </View>
  );
}
