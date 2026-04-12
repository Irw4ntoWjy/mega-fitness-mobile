import { fetcher } from "@/lib/fetcher";
import {
  ActivityGroupDetail,
  ActivityGroupPagination,
} from "@/type/activity-group";
import { buildListPayload } from "@/type/pagination";

export function getActivityGroupList(payload?: {
  q?: string | null;
  page?: number;
  limit?: number;
  activity_group_status_id?: string | null;
}) {
  return fetcher<ActivityGroupPagination>("/activity-group/list", {
    body: buildListPayload(payload),
    auth: true,
  });
}

export function getActivityGroupDetail(payload: { activity_group_id: string }) {
  return fetcher<ActivityGroupDetail>("/activity-group/detail", {
    body: payload,
    auth: true,
  });
}
