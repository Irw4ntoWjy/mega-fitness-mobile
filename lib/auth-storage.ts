import { StoredAuth } from "@/type/auth";
import { AccountDetail } from "@/type/detail-account";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AUTH_KEY = "auth_data";
export const ACCOUNT_DETAIL_KEY = "account_detail_data";

type AuthChangeListener = () => void;
const authChangeListeners = new Set<AuthChangeListener>();

export function subscribeAuthChange(listener: AuthChangeListener) {
  authChangeListeners.add(listener);
  return () => authChangeListeners.delete(listener);
}

function notifyAuthChange() {
  authChangeListeners.forEach((listener) => listener());
}

const assetBaseUrl =
  process.env.EXPO_PUBLIC_ASSET_BASE_URL ?? "http://164.152.166.4:9000";

export async function getAuth(): Promise<StoredAuth | null> {
  const raw = await AsyncStorage.getItem(AUTH_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function clearAuth() {
  await AsyncStorage.multiRemove([AUTH_KEY, ACCOUNT_DETAIL_KEY]);
  notifyAuthChange();
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
  notifyAuthChange();
}

export async function getStoredAccountDetail(): Promise<AccountDetail | null> {
  const raw = await AsyncStorage.getItem(ACCOUNT_DETAIL_KEY);
  if (!raw) return null;

  const detail = JSON.parse(raw) as AccountDetail;
  return {
    ...detail,
    picture_url: assetBaseUrl + detail.picture_url,
  };
}

export async function saveStoredAccountDetail(detail: AccountDetail) {
  const normalizedDetail: AccountDetail = {
    ...detail,
    picture_url: assetBaseUrl + detail.picture_url,
  };
  await AsyncStorage.setItem(
    ACCOUNT_DETAIL_KEY,
    JSON.stringify(normalizedDetail),
  );
}

export async function logout() {
  await clearAuth();
}
