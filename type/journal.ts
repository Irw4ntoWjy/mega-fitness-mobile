import { z } from "zod";

export const journalSetSchema = z.object({
  reps: z.string(),
  weight: z.string(),
});

export const journalActivitySchema = z.object({
  sets: z.array(journalSetSchema),
  activity_name: z.string(),
});

export const journalJsonSchema = z.object({
  notes: z.string(),
  activities: z.array(journalActivitySchema),
  activity_group_id: z.string(),
  activity_group_name: z.string(),
  activity_group_duration: z.string().nullable(),
});

export type JournalJson = z.infer<typeof journalJsonSchema>;

export const journalItemSchema = z.object({
  journal_id: z.union([z.number(), z.string()]),
  session_log_id: z.string(),
  journal_json: journalJsonSchema,
  created_at: z.string(),
  created_by: z.string(),
  updated_at: z.string().nullable().optional(),
  updated_by: z.string().nullable().optional(),
});

export type JournalItem = z.infer<typeof journalItemSchema>;

export type JournalDetail = {
  journal_id: number | string;
  session_log_id: string;
  member_profile_id: string;
  member_name: string;
  journal_json: JournalJson;
  created_at: string;
  created_by: string;
  updated_at: string | null;
  updated_by: string | null;
};
