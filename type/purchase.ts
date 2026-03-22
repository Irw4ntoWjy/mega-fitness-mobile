import z from "zod";
import { paginationSchema } from "./pagination";

export const purchaseItemSchema = z.object({
  id: z.string(),
  member_profile_id: z.string(),
  member_profile_name: z.string(),
  package_detail_id: z.string(),
  package_id: z.string(),
  package_name: z.string(),
  product_id: z.string(),
  product_name: z.string(),
  package_trainer_id: z.string().optional(),
  package_trainer_name: z.string().optional(),
  purchase_status_id: z.string(),
  purchase_status_name: z.string(),
  requested_at: z.string(),
  requested_by: z.string(),
  updated_at: z.string().optional(),
  updated_by: z.string().optional(),
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
