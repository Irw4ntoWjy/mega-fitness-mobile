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
}) {
  return fetcher<SessionLogHistoryPagination>("/session-log/history/member", {
    body: {
      page: payload?.page ?? 1,
      limit: payload?.limit ?? -1,
      member_profile_id: payload?.member_profile_id,
    },
    auth: true,
  });
}

export function getTrainerSessionLogHistory(payload: {
  page: number;
  limit: number;
  trainer_profile_id: string;
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
