import { fetcher } from "@/lib/fetcher";
import { AssessmentPagination } from "@/type/assessment";
import { buildListPayload } from "@/type/pagination";

export function getAssessmentList(payload?: {
  q?: string;
  page?: number;
  limit?: number;
  profile_id: string;
}) {
  return fetcher<AssessmentPagination[]>("/assessment/list", {
    body: buildListPayload(payload),
    auth: true,
  });
}
