import { fetcher } from "@/lib/fetcher";
import { buildListPayload } from "@/type/pagination";
import { ScheduleClassSchema, TrainerSchedule } from "@/type/schedule";

export function getClassScheduleList(payload?: {
  product_id?: string;
  is_full: false;
  date_from: string;
  date_to: string;
}) {
  return fetcher<ScheduleClassSchema[]>("/class-schedule/list", {
    body: buildListPayload(payload),
    auth: true,
  });
}

export function getTrainerScheduleList(payload?: {
  trainer_id: string;
  is_booked?: boolean;
  date_from?: string | null;
  date_to?: string | null;
  this_week?: boolean;
}) {
  return fetcher<TrainerSchedule[]>("/trainer-schedule/list", {
    body: payload,
    auth: true,
  });
}

export function getMasterTrainerScheduleList(payload?: { trainer_id: string }) {
  return fetcher<TrainerSchedule[]>("/master-trainer-schedule/list", {
    body: buildListPayload(payload),
    auth: true,
  });
}

export function bookTrainerSchedule(payload?: {
  schedule_id: string;
  member_profile_id: string;
}) {
  return fetcher("/booking/trainer-booking/book", {
    body: buildListPayload(payload),
    auth: true,
  });
}

export function bookClassSchedule(payload?: {
  schedule_id: string;
  member_profile_id: string;
  purchase_id: string;
  schedule_type: string;
}) {
  return fetcher("/booking/book", {
    body: buildListPayload(payload),
    auth: true,
  });
}
