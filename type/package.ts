import { z } from "zod";

export const trainerPackageSchema = z.object({
  package_trainer_id: z.string(),
  package_detail_id: z.string(),
  trainer_profile_id: z.string(),
  trainer_profile_name: z.string(),
  trainer_profile_birth_date: z.string(),
  trainer_profile_gender: z.string(),
  trainer_profile_identity_no: z.string(),
  trainer_profile_picture_url: z.string().optional(),
  trainer_profile_contact_number: z.string(),
  trainer_profile_address: z.string().optional(),
  action_at: z.string(),
  action_by: z.string(),
});

export type TrainerPackage = z.infer<typeof trainerPackageSchema>;
