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
    (item) =>
      !item.package_name?.toLowerCase().includes("membership") &&
      ["1", "2"].includes(item.purchase_status_id),
  );

  return {
    data: (filteredData ?? []).map((item) => ({
      label: `${item.package_name} - ${item.product_name}\nActive Date: ${getActivePeriod(item)}`,
      value: String(item.id),
      data: item,
    })),
  };
}

export function getActivePeriod(item: {
  activated_at?: string | null;
  expired_at?: string | null;
}) {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

  // not activated yet -> show today as the start date
  const activated = item.activated_at?.split(/[ T]/)[0] || today;
  const expired = item.expired_at?.split(/[ T]/)[0];
  // no expiry yet -> show only the start date instead of a dangling "-"
  return expired ? `${activated} - ${expired}` : activated;
}
