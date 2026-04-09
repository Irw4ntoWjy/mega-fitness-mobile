import { fetcher } from "@/lib/fetcher";

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
