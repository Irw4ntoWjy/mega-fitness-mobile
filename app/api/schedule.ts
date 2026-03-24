import { fetcher } from "@/lib/fetcher";
import { buildListPayload } from "@/type/pagination";
import { ScheduleClassSchema } from "@/type/schedule";

export function getClassScheduleList(payload?: {
  product_id?: string;
  is_full: false;
}) {
  return fetcher<ScheduleClassSchema[]>("/class-schedule/list", {
    body: buildListPayload(payload),
    auth: true,
  });
}
