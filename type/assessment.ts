import z from "zod";
import { paginationSchema } from "./pagination";
/**
 * Value Types
 */
export const ValueTypeEnum = z.enum(["BOOL", "BOOL_TEXT", "TEXT", "CHOICE"]);

export const KeySchema = z.object({
  en: z.string(),
  id: z.string(),
});

export const ValueSchema = z.object({
  type: ValueTypeEnum,
  value: z.union([z.boolean(), z.string()]).optional(),
  desc: z.string().optional(),
  options: z.array(z.string()).optional(),
  noHint: z.string().optional(),
  single: z.boolean().optional(),
});

export const DataItemSchema = z.object({
  group: z.string().optional(),
  parent: z.string().optional(),
  trainerOnly: z.boolean().optional(),
  key: KeySchema,
  value: ValueSchema,
});

export const sectionSchema = z.object({
  section: z.union([z.number(), z.string()]), // 1, "2A", "2B", 3
  subtitle: z.string(),
  data: z.array(DataItemSchema),
});
export type SectionSchema = z.infer<typeof sectionSchema>;

export const assessmentItemSchema = z.object({
  assessment_id: z.number(),
  profile_id: z.string(),
  profile_name: z.string(),
  answer_json: z.array(z.array(sectionSchema)),
  created_at: z.string().optional(),
  created_by: z.string().optional(),
  created_name: z.string().optional(),
  updated_at: z.string().optional(),
  updated_by: z.string().optional(),
  deleted_at: z.string().optional(),
  deleted_by: z.string().optional(),
});

export type AssessmentItem = z.infer<typeof assessmentItemSchema>;

export const assessmentPaginationSchema =
  paginationSchema(assessmentItemSchema);
export type AssessmentPagination = z.infer<typeof assessmentPaginationSchema>;
type QuestionKey = {
  en: string;
  id?: string;
};

export type Question = {
  group?: string;
  parent?: string;
  trainerOnly?: boolean;
  key: QuestionKey;
  value: AnswerValue;
};

export type AnswerValue =
  | { type: "BOOL"; value: boolean; noHint?: string }
  | { type: "BOOL_TEXT"; value?: boolean; desc?: string; noHint?: string }
  | { type: "TEXT"; desc?: string }
  | { type: "CHOICE"; desc?: string; options?: string[]; single?: boolean };

export const checkAssessmentResponse = z.object({
  done_assessment: z.boolean(),
});

export type CheckAssessmentResponse = z.infer<typeof checkAssessmentResponse>;
