import { ComboboxItem } from "@/type/combobox";
import { getPackageTrainerList } from "../package";

export async function getTrainerPackageCombobox(payload?: {
  package_detail_id: string;
}): Promise<{ data: ComboboxItem[] }> {
  const res = await getPackageTrainerList(payload);
  const data = res.data;
  return {
    data: (data ?? []).map((item) => ({
      label: item.trainer_profile_name,
      value: String(item.trainer_profile_id),
      data: item,
    })),
  };
}
