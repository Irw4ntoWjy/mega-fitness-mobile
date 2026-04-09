import { paginationSchema } from "@/type/pagination";
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

export const packageSchema = z.object({
  package_id: z.string(),
  package_name: z.string(),
  package_description: z.string().nullable(),
  package_tag: z.string().nullable(),
  package_cover_image: z.string().nullable(),
  product_type_id: z.string(),
  product_type_name: z.string(),
  package_price: z.number(),
  package_expiry: z.number(),
  package_purchase_limit: z.number().nullable(),
  package_active_from: z.string().nullable(),
  package_active_to: z.string().nullable(),
  package_status_id: z.string(),
  package_status_name: z.string(),
  created_at: z.string(),
  created_by: z.string(),
  updated_at: z.string().nullable(),
  updated_by: z.string().nullable(),
  deleted_at: z.string().nullable(),
  deleted_by: z.string().nullable(),
});

export type Package = z.infer<typeof packageSchema>;

export const packagePaginationSchema = paginationSchema(packageSchema);

export type PackagePagination = z.infer<typeof packagePaginationSchema>;
