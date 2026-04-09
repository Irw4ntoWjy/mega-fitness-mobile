import { z } from "zod";
import { paginationSchema } from "./pagination";

export const activityGroupSchema = z.object({
  activity_group_id: z.string(),
  activity_group_name: z.string(),
  activity_group_description: z.string().nullable().optional(),
  activity_group_status_id: z.string(),
  activity_group_status_name: z.string(),
  total_activity: z.number(),
  created_at: z.string(),
  created_by: z.string(),
  updated_at: z.string().nullable().optional(),
  updated_by: z.string().nullable().optional(),
  deleted_at: z.string().nullable().optional(),
  deleted_by: z.string().nullable().optional(),
});

export type ActivityGroup = z.infer<typeof activityGroupSchema>;

export const activitySchema = z.object({
  activity_id: z.string(),
  activity_name: z.string(),
  activity_description: z.string().nullable().optional(),
  activity_status_id: z.string(),
  activity_status_name: z.string(),
  activity_video_path: z.string().nullable().optional(),
  activity_set: z.number(),
  activity_repetition: z.number(),
  activity_time_duration: z.number(),
  created_at: z.string(),
  created_by: z.string(),
  updated_at: z.string().nullable().optional(),
  updated_by: z.string().nullable().optional(),
  deleted_at: z.string().nullable().optional(),
  deleted_by: z.string().nullable().optional(),
});

export type Activity = z.infer<typeof activitySchema>;

export const activityGroupDetailSchema = activityGroupSchema.extend({
  activities: z.array(activitySchema),
});
export type ActivityGroupDetail = z.infer<typeof activityGroupDetailSchema>;

export const activityGroupPaginationSchema =
  paginationSchema(activityGroupSchema);
export type ActivityGroupPagination = z.infer<
  typeof activityGroupPaginationSchema
>;
