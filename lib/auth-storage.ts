import { StoredAuth } from "@/type/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AUTH_KEY = "auth_data";

export async function getAuth(): Promise<StoredAuth | null> {
  const raw = await AsyncStorage.getItem(AUTH_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function clearAuth() {
  await AsyncStorage.removeItem(AUTH_KEY);
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

export async function logout() {
  await clearAuth();
}
