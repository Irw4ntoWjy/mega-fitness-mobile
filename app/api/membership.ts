import { fetcher } from "@/lib/fetcher";
import { MembershipSessionLogListResponse } from "@/type/membership";

export function getMembershipSessionLogList(payload: {
  member_profile_id: string;
  date_from: string;
  date_to: string;
}) {
  return fetcher<MembershipSessionLogListResponse>(
    "/membership-session-log/list",
    {
      body: payload,
      auth: true,
    },
  );
}
