import { fetcher } from "@/lib/fetcher";
import { AccountDetail } from "@/type/detail-account";

export type AccountDetailPayload = {
  account_code: string;
};

export function getAccountDetailByCode(payload: AccountDetailPayload) {
  return fetcher<AccountDetail>("/account/detail/code", {
    method: "POST",
    body: payload,
    auth: true,
  });
}
