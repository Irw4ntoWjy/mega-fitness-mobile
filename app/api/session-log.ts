import { fetcher } from "@/lib/fetcher";
import { SessionLogCount, SessionLogHistoryPagination } from "@/type/session-log";

export function getSessionLogHistoryList(payload?: {
  page?: number;
  limit?: number;
  member_profile_id?: string;
}) {
  return fetcher<SessionLogHistoryPagination>("/session-log/history/list", {
    body: {
      page: payload?.page ?? 1,
      limit: payload?.limit ?? -1,
      member_profile_id: payload?.member_profile_id,
    },
    auth: true,
  });
}

export function getSessionLogCount(payload?: { member_profile_id?: string }) {
  const memberProfileId = payload?.member_profile_id;

  return fetcher<SessionLogCount>("/session-log/count", {
    method: "POST",
    body: {
      member_profile_id: memberProfileId,
      customer_profile_id: memberProfileId,
    },
    auth: true,
  }).then((res) => {
    if (res.success && res.data) return res;
    if (!memberProfileId) return res;

    return fetcher<SessionLogCount>(
      `/session-log/count?member_profile_id=${encodeURIComponent(memberProfileId)}&customer_profile_id=${encodeURIComponent(memberProfileId)}`,
      { method: "GET", auth: true },
    );
  });
}
