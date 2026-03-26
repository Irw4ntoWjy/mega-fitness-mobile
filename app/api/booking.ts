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

export function addClassBooking(payload: {
  member_profile_id: string;
  schedule_id: string;
  schedule_type: string;
  purchase_id: string;
}) {
  return fetcher("/booking/book", {
    method: "POST",
    body: payload,
    auth: true,
  });
}

export function addTrainerBooking(payload: {
  schedule_id: string;
  member_profile_id: string;
}) {
  return fetcher("/booking/trainer-booking/book", {
    method: "POST",
    body: payload,
    auth: true,
  });
}
