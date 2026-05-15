import { z } from "zod";

export const commissionProgressItemSchema = z.object({
  commission_code: z.string(),
  product_id: z.string(),
  product_name: z.string(),
  product_type_id: z.string(),
  product_type_name: z.string(),
  session_count: z.coerce.number(),
  progress_percentage: z.coerce.number(),
});

export type CommissionProgressItem = z.infer<
  typeof commissionProgressItemSchema
>;

export const commissionProgressSchema = z.object({
  commissions_progress: z.array(commissionProgressItemSchema),
});

export type CommissionProgressResponse = z.infer<
  typeof commissionProgressSchema
>;
