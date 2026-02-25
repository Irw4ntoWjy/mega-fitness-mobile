import { z } from "zod";

export const roleEnum = z.enum(["Member", "Trainer", "Admin"]);

export const accountDetail = z.object({
  account_id: z.string(),
  //   account_status_id: z.string(),
  //   account_status_name: z.string(),
  account_code: z.string(),
  account_role: roleEnum,
  profile_name: z.string(),
  birth_date: z.string(),
  gender: z.string(),
  picture_url: z.string().optional(),
  contact_number: z.string().optional(),
  trainer_detail: z
    .object({
      specialization: z.string().optional(),
      certifications: z.string().optional(),
      experience_year: z.number().optional(),
      trainer_title: z.string().optional(),
      biography: z.string().optional(),
      weight: z.number().optional(),
      height: z.number().optional(),
      salary: z.number(),
      commission: z.string().optional(),
      bonus: z.boolean(),
    })
    .optional(),
});
export type AccountDetail = z.infer<typeof accountDetail>;

export const accountUpdatePayload = z.object({
  account_id: z.string(),
  employee_name: z.string(),
  birth_date: z.string(),
  gender: z.string(),
  identity_no: z.string().length(16, "Nomor induk kependudukan harus 16 digit"),
  email: z.string().optional(),
  role: roleEnum,
  picture_url: z.string().optional(),
  contact_number: z.string().optional(),
  specialization: z.string().optional(),
  certifications: z.string().optional(),
  experience_year: z.number().optional(),
  trainer_title: z.string().optional(),
  biography: z.string().optional(),
  weight: z.number().optional(),
  height: z.number().optional(),
  salary: z.number(),
  commission: z.string().optional(),
  bonus: z.boolean(),
});
export type AccountUpdatePayload = z.infer<typeof accountUpdatePayload>;
