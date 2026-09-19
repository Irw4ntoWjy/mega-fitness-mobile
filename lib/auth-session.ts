import {
  clearAuth,
  getAuth,
  getStoredAccountDetail,
  isAccessTokenValid,
  isRefreshTokenValid,
  saveStoredAccountDetail,
} from "@/lib/auth-storage";
import { tryRefreshToken } from "@/lib/fetcher";
import { AccountDetail } from "@/type/detail-account";

type AccountDetailApiResponse<T> = {
  success?: boolean;
  data?: T | null;
  message?: string;
};

export async function syncAccountDetailFromAuth(force = false) {
  try {
    const auth = await getAuth();
    const accountCode = auth?.accessPayload?.account_code;
    const accessToken = auth?.accessToken;

    if (!accountCode || !accessToken) {
      return false;
    }

    if (!force) {
      const cached = await getStoredAccountDetail();
      if (cached?.account_code === accountCode) {
        return true;
      }
    }

    const baseUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
    if (!baseUrl) {
      return false;
    }

    const response = await fetch(`${baseUrl}/account/detail/code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ account_code: accountCode }),
    });

    if (!response.ok) {
      return false;
    }

    const payload =
      ((await response.json()) as AccountDetailApiResponse<AccountDetail>) ??
      null;

    if (!payload?.success || !payload.data?.account_code) {
      return false;
    }

    const normalizedDetail: AccountDetail = {
      ...payload.data,
      picture_url: baseUrl + payload.data.picture_url,
    };

    await saveStoredAccountDetail(normalizedDetail);
    return true;
  } catch {
    return false;
  }
}

export async function checkSession() {
  if (!(await isAccessTokenValid())) {
    if (!(await isRefreshTokenValid())) {
      await clearAuth();
      return false;
    }
    if (!(await tryRefreshToken())) {
      return false;
    }
  }

  await syncAccountDetailFromAuth();
  return true;
}
