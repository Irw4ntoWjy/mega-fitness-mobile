import { fetcher } from "@/lib/fetcher";
import { JournalPagination } from "@/type/journal";
import { buildListPayload } from "@/type/pagination";

export function createJournal(payload: {
  session_log_id: string;
  journal_json: Record<string, unknown>;
}) {
  return fetcher("/journal/create", {
    body: {
      session_log_id: payload.session_log_id,
      journal_json: payload.journal_json,
    },
    auth: true,
  });
}

export function updateJournal(payload: {
  journal_id: number | string;
  session_log_id: string;
  journal_json: Record<string, unknown>;
}) {
  return fetcher("/journal/update", {
    body: {
      journal_id: payload.journal_id,
      session_log_id: payload.session_log_id,
      journal_json: payload.journal_json,
    },
    auth: true,
  });
}

export function getJournalList(payload?: {
  q?: string | null;
  page?: number;
  limit?: number;
  session_log_id?: string;
}) {
  return fetcher<JournalPagination>("/journal/list", {
    body: buildListPayload(payload),
    auth: true,
  });
}
