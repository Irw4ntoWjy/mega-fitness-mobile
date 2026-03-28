import { fetcher } from "@/lib/fetcher";
import { buildListPayload } from "@/type/pagination";
import { ScheduleClassSchema, TrainerSchedule } from "@/type/schedule";

export function getClassScheduleList(payload?: {
  product_id?: string;
  is_full: false;
}) {
  return fetcher<ScheduleClassSchema[]>("/class-schedule/list", {
    body: buildListPayload(payload),
    auth: true,
  });
}

export function getTrainerScheduleList(payload?: {
  trainer_id: string;
  is_booked: boolean;
}) {
  return fetcher<TrainerSchedule[]>("/trainer-schedule/list", {
    body: buildListPayload(payload),
    auth: true,
  });
}
