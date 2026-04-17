import z from "zod";
import { paginationSchema } from "./pagination";

export const purchaseItemSchema = z.object({
  id: z.string(),
  invoice_number: z.string(),
  member_profile_id: z.string(),
  member_profile_name: z.string(),
  package_detail_id: z.string(),
  package_id: z.string(),
  package_name: z.string(),
  package_session_quota: z.number().optional(),
  package_expiry: z.number().optional(),
  package_trainer_id: z.string().nullable().optional(),
  package_trainer_name: z.string().nullable().optional(),
  product_id: z.string(),
  product_name: z.string(),
  product_type_id: z.string().optional(),
  product_type_name: z.string().optional(),
  package_cover_image: z.string().optional(),
  purchase_status_id: z.string(),
  purchase_status_name: z.string(),
  requested_at: z.string(),
  requested_by: z.string(),
  updated_at: z.string().nullable().optional(),
  updated_by: z.string().nullable().optional(),
});

export type PurchaseItemSchema = z.infer<typeof purchaseItemSchema>;

export const purchaseItemMapping = z.object({
  id: z.string(),
  member_profile_id: z.string(),
  member_profile_name: z.string(),
  package_detail_id: z.string(),
  package_id: z.string(),
  package_name: z.string(),
  product_id: z.string().array(),
  product_name: z.string().array(),
  package_trainer_id: z.string().optional(),
  package_trainer_name: z.string().optional(),
  purchase_status_id: z.string(),
  purchase_status_name: z.string(),
  requested_at: z.string(),
  requested_by: z.string(),
  updated_at: z.string().optional(),
  updated_by: z.string().optional(),
});

export type PurchaseItemMapping = z.infer<typeof purchaseItemMapping>;

export const purchasePaginationSchema = paginationSchema(purchaseItemSchema);
export type PurchasePagination = z.infer<typeof purchasePaginationSchema>;

export const purchaseReminderSchema = z.object({
  purchase_id: z.string(),
  package_name: z.string(),
  time_remaining: z.number().nullable().optional(),
  session_remaining: z.number().nullable().optional(),
  expiry_remaining: z.number().nullable().optional(),
});

export type PurchaseReminder = z.infer<typeof purchaseReminderSchema>;
