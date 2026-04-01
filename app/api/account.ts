import { fetcher } from "@/lib/fetcher";
import { AccountPagination } from "@/type/account";
import { buildListPayload } from "@/type/pagination";

export function getTrainerList(payload?: {
  q?: string | null;
  page?: number;
  limit?: number;
  role: "trainer";
}) {
  return fetcher<AccountPagination>("/account/list", {
    body: buildListPayload(payload),
    auth: true,
  });
}
