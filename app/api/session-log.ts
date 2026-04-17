import { fetcher } from "@/lib/fetcher";
import {
  SessionLogHistoryPagination,
  TrainerMember,
  TrainerSessionLogHistoryPagination,
} from "@/type/session-log";

export function getSessionLogHistoryList(payload?: {
  page?: number;
  limit?: number;
  member_profile_id?: string;
  date_from?: string;
  date_to?: string;
}) {
  return fetcher<SessionLogHistoryPagination>("/session-log/history/member", {
    body: {
      page: payload?.page ?? 1,
      limit: payload?.limit ?? -1,
      member_profile_id: payload?.member_profile_id,
      date_from: payload?.date_from,
      date_to: payload?.date_to,
    },
    auth: true,
  });
}

export function getTrainerSessionLogHistory(payload: {
  page: number;
  limit: number;
  trainer_profile_id: string;
  product_type_id?: string;
  date_from?: string;
  date_to?: string;
  session_log_status_id?: number;
}) {
  return fetcher<TrainerSessionLogHistoryPagination>(
    "/session-log/history/trainer",
    {
      body: payload,
      auth: true,
    },
  );
}

export function getTrainerMembers(payload: { trainer_profile_id: string }) {
  return fetcher<TrainerMember[]>("/session-log/trainer-members", {
    body: payload,
    auth: true,
  });
}

export function approveSessionLog(session_log_id: string) {
  return fetcher("/session-log/approve", {
    method: "POST",
    body: { session_log_id },
    auth: true,
  });
}

export function createTrainerAttendance({
  trainer_profile_id,
  longitude,
  latitude,
}: {
  trainer_profile_id: string;
  longitude: string;
  latitude: string;
}) {
  return fetcher("/trainer-attendance/create", {
    method: "POST",
    body: { trainer_profile_id, longitude, latitude },
    auth: true,
  });
}
