import { ComboboxItem } from "@/type/combobox";
import { getPurchaseList } from "../purchase";

export async function getPurchaseCombobox(payload?: {
  q?: string | null;
  page?: number;
  limit?: number;
  customer_profile_id?: string;
}): Promise<{ data: ComboboxItem[] }> {
  const res = await getPurchaseList(payload);
  const data = res.data;
  return {
    data: (data?.data ?? []).map((item) => ({
      label: item.product_name,
      value: String(item.id),
    })),
  };
}
