import { getAuth } from "@/lib/auth-storage";
import { fetcher } from "@/lib/fetcher";
import { AccountDetailResponse } from "@/type/account";
import { AccountForm, AccountSchema } from "@/type/profile";

export function profileDetail(payload: { account_id: string }) {
  return fetcher<AccountSchema>("/account/detail", {
    body: payload,
    auth: true,
  });
}

export async function updateProfile(payload: AccountForm) {
  const resUpdate = await fetcher("/account/update-member", {
    body: payload,
    auth: true,
  });

  if (resUpdate.success) {
    const auth = await getAuth();
    const accountCode = auth?.accessPayload?.account_code;

    await fetcher<AccountDetailResponse>("/account/detail/code", {
      auth: true,
      body: {
        account_code: accountCode,
      },
    });
  }

  return resUpdate;
}
