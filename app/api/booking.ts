import { fetcher } from "@/lib/fetcher";
import {
  BookingDetail,
  BookingDetailParams,
  BookingListParams,
  BookingPagination,
} from "@/type/bookings";
import { buildListPayload } from "@/type/pagination";

export function getBookingList(payload?: BookingListParams) {
  const body = buildListPayload(payload);
  if ("is_not_expired" in body) {
    (body as any).IS_NOT_EXPIRED = (body as any).is_not_expired;
  }
  if ("booking_status_id" in body) {
    (body as any).booking_status_Id = (body as any).booking_status_id;
  }
  return fetcher<BookingPagination>("/booking/list", {
    body,
    auth: true,
  });
}

export function cancelBooking(payload: {
  booking_id: string;
  cancel_reason: string;
}) {
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

export function getBookingDetail(payload: BookingDetailParams) {
  return fetcher<BookingDetail>("/booking/detail", {
    body: payload,
    auth: true,
  });
}
