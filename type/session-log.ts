import { z } from "zod";
import { paginationSchema } from "./pagination";

export const sessionLogTrainerSchema = z.object({
  trainer_id: z.string(),
  trainer_name: z.string(),
});

export const sessionLogProductTypeSchema = z.enum(["Private", "Class"]);
export type SessionLogProductType = z.infer<typeof sessionLogProductTypeSchema>;

export const sessionLogHistorySchema = z.object({
  session_log_id: z.string(),
  booking_id: z.string(),
  purchase_id: z.string(),
  purchase_invoice_number: z.string(),
  package_detail_id: z.string(),
  package_id: z.string(),
  package_name: z.string(),
  product_id: z.string(),
  product_name: z.string(),
  product_type_id: z.string(),
  product_type_name: sessionLogProductTypeSchema,
  member_profile_id: z.string(),
  member_name: z.string(),
  schedule_id: z.string(),
  schedule_type: z.string(),
  schedule_date: z.string(),
  time_start: z.string(),
  time_end: z.string(),
  location: z.string().nullable(),
  trainers: z.array(sessionLogTrainerSchema),
  session_log_status_id: z.number(),
  session_log_status_name: z.string(),
  created_at: z.string(),
  created_by: z.string(),
  created_by_name: z.string(),
});

export type SessionLogHistorySchema = z.infer<typeof sessionLogHistorySchema>;

export const sessionLogHistoryPaginationSchema = paginationSchema(
  sessionLogHistorySchema,
);
export type SessionLogHistoryPagination = z.infer<
  typeof sessionLogHistoryPaginationSchema
>;
