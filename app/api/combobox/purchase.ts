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
  const filteredData = data?.data.filter(
    (item) => !item.package_name?.toLowerCase().includes("membership"),
  );

  return {
    data: (filteredData ?? []).map((item) => ({
      label: `${item.package_name} - ${item.product_name}\nPurchase Date: ${item.requested_at.split(" ")[0]}`,
      value: String(item.id),
      data: item,
    })),
  };
}
