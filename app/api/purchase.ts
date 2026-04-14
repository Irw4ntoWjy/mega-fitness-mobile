import { fetcher } from "@/lib/fetcher";
import { buildListPayload } from "@/type/pagination";
import { PurchasePagination } from "@/type/purchase";

export function getPurchaseList(payload?: {
  q?: string | null;
  page?: number;
  limit?: number;
  customer_profile_id?: string;
  purchase_status_id?: string;
}) {
  return fetcher<PurchasePagination>("/purchase/list", {
    body: buildListPayload(payload),
    auth: true,
  });
}
