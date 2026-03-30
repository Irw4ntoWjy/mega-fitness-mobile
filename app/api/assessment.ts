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

export function createAssessment(payload?: {
  profile_id: string;
  answer_json: any;
}) {
  return fetcher("/assessment/create", {
    body: {
      profile_id: payload?.profile_id,
      answer_json: payload?.answer_json,
    },
    auth: true,
  });
}
