import { AssessmentPages } from "@/app/assessment/dummy_question";

export const stepOrder: AssessmentPages[] = [
  AssessmentPages.PHYSICAL_ACTIVITY_READINESS,
  AssessmentPages.PHYSIOLOGY_CONDITION_ASSESSMENT,
  AssessmentPages.POSTURE_ASSESSMENT,
  AssessmentPages.MOVEMENT_ANALYSIS,
  AssessmentPages.PHYSICAL_TESTS,
  AssessmentPages.GOAL_SETTING,
];

export const getStepIndex = (page: AssessmentPages) => {
  return stepOrder.indexOf(page);
};

export const getTotalSteps = () => stepOrder.length;

export const getNextStep = (page: AssessmentPages) => {
  const index = stepOrder.indexOf(page);
  return stepOrder[index + 1] ?? null;
};

export const getPrevStep = (page: AssessmentPages) => {
  const index = stepOrder.indexOf(page);
  return stepOrder[index - 1] ?? null;
};
