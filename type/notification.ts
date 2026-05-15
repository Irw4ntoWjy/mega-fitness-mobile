import { paginationSchema } from "@/type/pagination";
import { z } from "zod";

export const notificationSchema = z.object({
  id: z.number(),
  profile_id: z.string(),
  title: z.string(),
  body: z.string(),
  is_read: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Notification = z.infer<typeof notificationSchema>;

export const notificationPaginationSchema =
  paginationSchema(notificationSchema);

export type NotificationSchema = z.infer<typeof notificationPaginationSchema>;
