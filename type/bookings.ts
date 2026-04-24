import { z } from "zod";
import { BaseListParams, paginationSchema } from "./pagination";

export const bookingSchema = z.object({
  booking_id: z.string(),
  schedule_id: z.string(),
  schedule_type: z.string(),

  day_of_week: z.number(),

  time_start: z.string(),
  time_end: z.string(),

  schedule_date: z.string(),

  trainer_id: z.string().optional(),
  trainer_name: z.string().optional(),

  product_name: z.string(),
  location: z.string().optional(),
  package_cover_image: z.string().optional(),

  member_profile_id: z.string(),
  member_name: z.string(),

  booking_status_id: z.number(),
  booking_status_name: z.string(),

  created_at: z.string(),
  created_by: z.string(),

  updated_at: z.string().optional(),
  updated_by: z.string().optional(),

  cancel_reason: z.string().optional(),
});
export type BookingSchema = z.infer<typeof bookingSchema>;

export const bookingDetailSchema = z.object({
  booking_id: z.string(),
  booking_name: z.string(),
  schedule_type: z.string(),

  class_schedule_detail: z
    .object({
      id: z.string(),
      product_id: z.string(),
      product_name: z.string(),
      location: z.string(),
      day_of_week: z.number(),
      time_start: z.string(),
      time_end: z.string(),
      schedule_date: z.string(),
      capacity: z.number(),
      is_full: z.boolean(),
      trainers: z.array(
        z.object({
          class_schedule_trainer_id: z.number(),
          class_schedule_id: z.string(),
          trainer_profile_id: z.string(),
          trainer_profile_name: z.string(),
          trainer_profile_birth_date: z.string(),
          trainer_profile_gender: z.string(),
          trainer_profile_identity_no: z.string(),
          trainer_profile_picture_url: z.string().optional(),
          trainer_profile_contact_number: z.string().optional(),
          trainer_profile_address: z.string().optional(),
          action_at: z.string(),
          action_by: z.string(),
        }),
      ),
      created_at: z.string(),
      created_by: z.string(),
      updated_at: z.string().optional(),
      updated_by: z.string().optional(),
      deleted_at: z.string().optional(),
      deleted_by: z.string().optional(),
    })
    .optional()
    .optional(),

  trainer_schedule_detail: z
    .object({
      id: z.string(),
      trainer_id: z.string(),
      trainer_name: z.string(),
      trainer_picture_url: z.string().optional(),
      day_of_week: z.number(),
      time_start: z.string(),
      time_end: z.string(),
      schedule_date: z.string(),
      created_at: z.string(),
      created_by: z.string(),
      updated_at: z.string().optional(),
      updated_by: z.string().optional(),
      deleted_at: z.string().optional(),
      deleted_by: z.string().optional(),
    })
    .optional()
    .optional(),

  member_profile_id: z.string(),
  member_name: z.string(),
  member_gender: z.string(),
  member_picture_url: z.string().optional(),
  purchase_id: z.string(),
  purchase_invoice_number: z.string(),
  booking_status_id: z.union([z.string(), z.number()]),
  booking_status_name: z.string(),
  cancel_reason: z.string().optional(),
  created_at: z.string(),
  created_by: z.string(),
  updated_at: z.string().optional(),
  updated_by: z.string().optional(),
  deleted_at: z.string().optional(),
  deleted_by: z.string().optional(),
});
export type BookingDetail = z.infer<typeof bookingDetailSchema>;

export const bookingPaginationSchema = paginationSchema(bookingSchema);
export type BookingPagination = z.infer<typeof bookingPaginationSchema>;

export type BookingListParams = BaseListParams & {
  page: number;
  limit: number;
  is_not_expired: boolean;
  member_profile_id?: string;
  booking_status_id?: string | number;
  // schedule_type?: string;
};

export type BookingDetailParams = {
  booking_id: string;
};
