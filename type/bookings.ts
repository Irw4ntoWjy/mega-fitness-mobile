import { z } from "zod";
import { paginationSchema } from "./pagination";

export const bookingSchema = z.object({
  booking_id: z.string(),
  schedule_id: z.string(),
  schedule_type: z.string(),

  day_of_week: z.number(),

  time_start: z.string(),
  time_end: z.string(),

  schedule_date: z.string(),

  member_profile_id: z.string(),
  member_name: z.string(),

  booking_status_id: z.string(),
  booking_status_name: z.string(),

  created_at: z.string(),
  created_by: z.string(),

  //   package_trainer_id: z.string(),
  //   package_trainer_name: z.string(),

  updated_at: z.string().optional(),
  updated_by: z.string().optional(),
});
export type BookingSchema = z.infer<typeof bookingSchema>;

export const bookingPaginationSchema = paginationSchema(bookingSchema);
export type BookingPagination = z.infer<typeof bookingPaginationSchema>;
