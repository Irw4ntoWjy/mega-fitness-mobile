import { fetcher } from "@/lib/fetcher";
import { BookingPagination } from "@/type/bookings";
import { buildListPayload } from "@/type/pagination";

export function getBookingList(payload?: {
  q?: string | null;
  page?: number;
  limit?: number;
  member_profile_id?: string;
}) {
  return fetcher<BookingPagination>("/booking/list", {
    body: buildListPayload(payload),
    auth: true,
  });
}
