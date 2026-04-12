import { ComboboxItem } from "@/type/combobox";
import { getActivityGroupList } from "../activity-group";

export async function getActivityGroupCombobox(payload?: {
  q?: string | null;
  page?: number;
  limit?: number;
  activity_group_status_id?: string | null;
}): Promise<{ data: ComboboxItem[] }> {
  const res = await getActivityGroupList(payload);
  const data = res.data?.data;

  return {
    data: (data ?? []).map((item) => ({
      label: item.activity_group_name,
      value: String(item.activity_group_name),
      data: item,
    })),
  };
}
