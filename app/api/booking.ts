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

export function cancelBooking(payload: { booking_id: string }) {
  return fetcher("/booking/cancel", {
    method: "POST",
    body: payload,
    auth: true,
  });
}
