import { fetcher } from "@/lib/fetcher";
import type { CommissionProgressResponse } from "@/type/commission";

export function getCommissionProgress(payload: {
  trainer_profile_id: string;
  date_from: string;
  date_to: string;
}) {
  return fetcher<CommissionProgressResponse>("/commission/progress", {
    body: payload,
    auth: true,
  });
}
