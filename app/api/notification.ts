import { fetcher } from "@/lib/fetcher";
import { NotificationSchema } from "@/type/notification";
import { buildListPayload } from "@/type/pagination";

export function getNotificationList(payload?: {
  q?: string | null;
  page?: number;
  limit?: number;
  profile_id?: string;
}) {
  return fetcher<NotificationSchema>("/notification/list", {
    body: buildListPayload(payload),
    auth: true,
  });
}

export function updateNotification(payload?: {
  id: number;
  profile_id: string;
  title: string;
  body: string;
  is_read: boolean;
}) {
  return fetcher("/notification/update", {
    body: buildListPayload(payload),
    auth: true,
  });
}
