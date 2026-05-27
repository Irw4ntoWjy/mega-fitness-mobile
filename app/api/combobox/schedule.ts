import { ComboboxItem } from "@/type/combobox";
import { getClassScheduleList, getTrainerScheduleList } from "../schedule";

export enum DayOfWeek {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
}

export async function getClassScheduleCombobox(payload?: {
  product_id: string;
  is_full: false;
  date_from: string;
  date_to: string;
}): Promise<{ data: ComboboxItem[] }> {
  const res = await getClassScheduleList(payload);
  console.log("response", res);
  return {
    data: (res?.data ?? []).map((item) => ({
      label: `${DayOfWeek[item.day_of_week ?? 0]}, ${item.schedule_date} \n(${item.time_start} - ${item.time_end})`,
      value: String(item.id),
      data: item,
    })),
  };
}

export async function getTrainerScheduleCombobox(payload?: {
  trainer_id: string;
  is_booked: boolean;
  date_from: string;
  date_to: string;
}): Promise<{ data: ComboboxItem[] }> {
  const res = await getTrainerScheduleList(payload);
  console.log(res);
  return {
    data: (res?.data ?? []).map((item) => ({
      label: `${DayOfWeek[item.day_of_week ?? 0]}, ${item.schedule_date} \n(${item.time_start} - ${item.time_end})`,
      value: String(item.id),
      data: item,
    })),
  };
}
