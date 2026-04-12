import {
  getAuth,
  getStoredAccountDetail,
  isAuthenticated,
  saveStoredAccountDetail,
} from "@/lib/auth-storage";
import { AccountDetail } from "@/type/detail-account";

type AccountDetailApiResponse<T> = {
  success?: boolean;
  data?: T | null;
  message?: string;
};

const assetBaseUrl =
  process.env.EXPO_PUBLIC_ASSET_BASE_URL ?? "http://164.152.166.4:9000";

function toAbsolutePictureUrl(pictureUrl?: string) {
  if (!pictureUrl) return pictureUrl;
  if (pictureUrl.startsWith("http://") || pictureUrl.startsWith("https://")) {
    return encodeURI(pictureUrl);
  }

  const normalizedBase = assetBaseUrl.endsWith("/")
    ? assetBaseUrl.slice(0, -1)
    : assetBaseUrl;
  const normalizedPath = pictureUrl.startsWith("/")
    ? pictureUrl.slice(1)
    : pictureUrl;

  return encodeURI(`${normalizedBase}/${normalizedPath}`);
}

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
      picture_url: toAbsolutePictureUrl(payload.data.picture_url),
    };

    await saveStoredAccountDetail(normalizedDetail);
    return true;
  } catch {
    return false;
  }
}

export async function checkSession() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return false;
  }

  await syncAccountDetailFromAuth();
  return true;
}
