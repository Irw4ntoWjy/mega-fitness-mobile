import { z } from "zod";
import { paginationSchema } from "./pagination";

export const membershipSessionLogSchema = z.object({
  membership_session_log_id: z.string(),
  purchase_id: z.string(),
  purchase_invoice_number: z.string(),
  package_detail_id: z.string(),
  package_id: z.string(),
  package_name: z.string(),
  product_id: z.string(),
  product_name: z.string(),
  product_type_id: z.string(),
  product_type_name: z.string(),
  member_profile_id: z.string(),
  member_name: z.string(),
  time_start: z.string(),
  created_at: z.string(),
  created_by: z.string(),
  created_by_name: z.string(),
});

export type MembershipSessionLogSchema = z.infer<
  typeof membershipSessionLogSchema
>;

export const membershipSessionLogListSchema = paginationSchema(
  membershipSessionLogSchema,
);
export type MembershipSessionLogListResponse = z.infer<
  typeof membershipSessionLogListSchema
>;
