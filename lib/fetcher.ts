import { refreshToken as refreshTokenApi } from "@/app/api/auth";
import { clearAuth, getAuth, saveAuth } from "@/lib/auth-storage";
import { parseJwt } from "@/lib/jwt";
import { logger } from "@/lib/logger";
import { ApiResponse } from "@/type/api";

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function tryRefreshToken(): Promise<boolean> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  logger.refreshing();

  refreshPromise = (async () => {
    const auth = await getAuth();
    if (!auth?.refreshToken) {
      await clearAuth();
      return false;
    }

    const res = await refreshTokenApi(auth.refreshToken);

    if (!res.success || !res.data) {
      await clearAuth();
      return false;
    }

    const accessToken = res.data.access_token;
    const refreshToken = res.data.refresh_token;

    await saveAuth({
      accessToken,
      refreshToken,
      accessPayload: parseJwt(accessToken),
      refreshPayload: parseJwt(refreshToken),
    });

    logger.authSaved();
    logger.user(parseJwt(accessToken));

    return true;
  })();

  const result = await refreshPromise;
  isRefreshing = false;
  refreshPromise = null;

  if (result) {
    logger.refreshed();
  }

  return result;
}

export async function fetcher<T>(
  endpoint: string,
  options?: {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    headers?: Record<string, string>;
    body?: any;
    auth?: boolean;
    _retry?: boolean;
  },
): Promise<ApiResponse<T>> {
  try {
    const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}${endpoint}`;

    logger.requestStart();
    logger.url(url);
    logger.method(options?.method ?? "POST");

    if (options?.body) {
      logger.body(options.body);
    }

    let authHeader: Record<string, string> = {};
    if (options?.auth) {
      const auth = await getAuth();
      if (auth?.accessToken) {
        authHeader.Authorization = `Bearer ${auth.accessToken}`;
      }
    }

    const response = await fetch(url, {
      method: options?.method || "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader,
        ...options?.headers,
      },
      body: options?.body ? JSON.stringify(options.body) : undefined,
    });

    logger.status(response.status, response.ok);

    const contentType = response.headers.get("content-type") ?? "";
    const payload = contentType.includes("application/json")
      ? await response.json()
      : { success: false, message: await response.text(), data: null };

    if (response.status === 401 && options?.auth && !options._retry) {
      const refreshed = await tryRefreshToken();
      if (refreshed) {
        return fetcher<T>(endpoint, { ...options, _retry: true });
      }
      await clearAuth();
    }

    if (!response.ok) {
      logger.error(payload?.message);
      return {
        success: false,
        message: payload?.message || "Request failed",
        data: null,
        error: payload?.error || payload?.message,
      };
    }

    if (payload?.data?.access_token && payload?.data?.refresh_token) {
      const accessToken = payload.data.access_token;
      const refreshToken = payload.data.refresh_token;

      const accessPayload = parseJwt(accessToken);

      await saveAuth({
        accessToken,
        refreshToken,
        accessPayload,
        refreshPayload: parseJwt(refreshToken),
      });

      logger.authSaved();
      logger.user(accessPayload);
    }

    logger.message(payload?.message);

    return {
      success: payload?.success ?? true,
      message: payload?.message ?? "OK",
      data: payload?.data as T,
    };
  } catch (err: any) {
    logger.networkError(err?.message);
    return {
      success: false,
      message: "Network error",
      data: null,
      error: err?.message,
    };
  }
}
