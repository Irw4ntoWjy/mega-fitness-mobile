import { ComboboxItem } from "@/type/combobox";
import { getClassScheduleList } from "../schedule";

export async function getClassScheduleCombobox(payload?: {
  product_id: string;
  is_full: false;
}): Promise<{ data: ComboboxItem[] }> {
  const res = await getClassScheduleList(payload);
  return {
    data: (res?.data ?? []).map((item) => ({
      label: `${item.day_of_week} (${item.time_start} - ${item.time_end}) `,
      value: String(item.id),
      data: item,
    })),
  };
}
