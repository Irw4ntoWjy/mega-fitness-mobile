import { z } from "zod";

export const scheduleClassSchema = z.object({
  id: z.string().optional(),
  product_id: z.string().optional(),
  product_name: z.string().optional(),
  location: z.string().optional(),

  day_of_week: z.number().optional(),

  time_start: z.string().optional(),
  time_end: z.string().optional(),
  scheduleClass_date: z.string().optional(),

  capacity: z.number().optional(),

  created_at: z.string().optional(),
  created_by: z.string().optional(),

  updated_at: z.string().optional(),
  updated_by: z.string().optional(),

  deleted_at: z.string().optional(),
  deleted_by: z.string().optional(),
});

export type ScheduleClassSchema = z.infer<typeof scheduleClassSchema>;
