export type QuestionType = "boolean" | "text" | "boolean_without_description";

export type Question = {
  key: string;
  en: string;
  id?: string;
  type: QuestionType;
};

export type AnswerValue = {
  value?: boolean;
  detail?: string;
  text?: string;
};
