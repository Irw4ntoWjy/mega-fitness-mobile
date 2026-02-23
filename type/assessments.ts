export type QuestionType = "boolean" | "text";

export type Question = {
  key: string;
  en: string;
  id: string;
  type?: QuestionType;
};

export type AnswerValue = {
  value?: boolean;
  detail?: string;
  text?: string;
};
