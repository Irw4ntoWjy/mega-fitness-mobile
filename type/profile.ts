import { z } from "zod";

export const accountSchema = z.object({
  account_id: z.string(),
  account_code: z.string(),
  account_email: z.string(),

  account_status_id: z.string(),
  account_status_name: z.string(),

  account_role: z.enum(["Member", "Trainer"]),

  profile_id: z.string(),
  profile_name: z.string(),
  address: z.string().optional(),

  birth_date: z.string(),

  gender: z.enum(["Laki-laki", "Perempuan"]),

  identity_no: z.string(),

  picture_url: z.string().optional(),

  contact_number: z.string().optional(),

  employee_detail: z.unknown().optional(),
  trainer_detail: z.unknown().optional(),

  created_at: z.string(),
  created_by: z.string(),

  updated_at: z.string().optional(),
  updated_by: z.string().optional(),

  deleted_at: z.string().optional(),
  deleted_by: z.string().nullable(),
});

export type AccountSchema = z.infer<typeof accountSchema>;

export const accountForm = z.object({
  account_id: z.string(),
  member_name: z.string(),
  birth_date: z.string(),
  gender: z.string(),
  contact_number: z.string().optional(),
  address: z.string().optional(),
});

export type AccountForm = z.infer<typeof accountForm>;

export const trainerScheduleSchema = z.object({
  id: z.string(),
  trainer_id: z.string(),
  trainer_name: z.string(),
  day_of_week: z.number(),
  time_start: z.string(),
  time_end: z.string(),
  created_at: z.string(),
  created_by: z.string(),
  updated_at: z.string().nullable(),
  updated_by: z.string().nullable(),
  deleted_at: z.string().nullable(),
  deleted_by: z.string().nullable(),
});

export type TrainerSchedule = z.infer<typeof trainerScheduleSchema>;
