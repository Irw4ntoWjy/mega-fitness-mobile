import { StoredAuth } from "@/type/auth";
import { AccountDetail } from "@/type/detail-account";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AUTH_KEY = "auth_data";
export const ACCOUNT_DETAIL_KEY = "account_detail_data";

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

export async function getAuth(): Promise<StoredAuth | null> {
  const raw = await AsyncStorage.getItem(AUTH_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function clearAuth() {
  await AsyncStorage.multiRemove([AUTH_KEY, ACCOUNT_DETAIL_KEY]);
}

export async function isAuthenticated(): Promise<boolean> {
  const auth = await getAuth();
  if (!auth?.accessPayload?.exp) return false;

  const now = Math.floor(Date.now() / 1000);

  // token expired
  if (auth.accessPayload.exp < now) {
    await clearAuth();
    return false;
  }

  return true;
}

export async function saveAuth(auth: StoredAuth) {
  await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(auth));
}

export async function getStoredAccountDetail(): Promise<AccountDetail | null> {
  const raw = await AsyncStorage.getItem(ACCOUNT_DETAIL_KEY);
  if (!raw) return null;

  const detail = JSON.parse(raw) as AccountDetail;
  return {
    ...detail,
    picture_url: toAbsolutePictureUrl(detail.picture_url),
  };
}

export async function saveStoredAccountDetail(detail: AccountDetail) {
  const normalizedDetail: AccountDetail = {
    ...detail,
    picture_url: toAbsolutePictureUrl(detail.picture_url),
  };
  await AsyncStorage.setItem(ACCOUNT_DETAIL_KEY, JSON.stringify(normalizedDetail));
}

export async function logout() {
  await clearAuth();
}
