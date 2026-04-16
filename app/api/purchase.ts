import { fetcher } from "@/lib/fetcher";
import { buildListPayload } from "@/type/pagination";
import { PurchaseItemSchema, PurchasePagination } from "@/type/purchase";

export function getPurchaseList(payload?: {
  q?: string | null;
  page?: number;
  limit?: number;
  customer_profile_id?: string;
}) {
  return fetcher<PurchasePagination>("/purchase/list", {
    body: buildListPayload(payload),
    auth: true,
  });
}

export function getPurchaseDetail(payload: { purchase_id: string }) {
  return fetcher<PurchaseItemSchema>("/purchase/detail", {
    body: {
      purchase_id: payload.purchase_id,
    },
    auth: true,
  });
}
