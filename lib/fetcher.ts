import { clearAuth, getAuth, saveAuth } from "@/lib/auth-storage";
import { parseJwt } from "@/lib/jwt";
import { ApiResponse } from "@/type/api";

export async function fetcher<T>(
  endpoint: string,
  options?: {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    headers?: Record<string, string>;
    body?: any;
    auth?: boolean;
  },
): Promise<ApiResponse<T>> {
  try {
    const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}${endpoint}`;

    const reset = "\x1b[0m";
    const red = "\x1b[31m";
    const green = "\x1b[32m";
    const yellow = "\x1b[33m";
    const cyan = "\x1b[36m";
    const magenta = "\x1b[35m";

    console.log(cyan + "╔══════════════════════════════╗" + reset);
    console.log(cyan + "║      API REQUEST START       ║" + reset);
    console.log(cyan + "╚══════════════════════════════╝" + reset);

    console.log(magenta + "URL: " + reset + url);
    console.log(yellow + "METHOD: " + reset + (options?.method || "POST"));

    let authHeader: Record<string, string> = {};
    if (options?.auth) {
      const auth = await getAuth();
      if (auth?.accessToken) {
        authHeader.Authorization = `Bearer ${auth.accessToken}`;
      }
    }

    if (options?.body) {
      console.log(cyan + "BODY:" + reset, options.body);
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

    console.log(
      response.ok
        ? green + `STATUS: ${response.status}` + reset
        : red + `STATUS: ${response.status}` + reset,
    );

    const contentType = response.headers.get("content-type") ?? "";
    let payload: any;

    if (contentType.includes("application/json")) {
      payload = await response.json();
    } else {
      const text = await response.text();
      payload = { success: false, message: text, data: null };
    }

    if (!response.ok) {
      console.log(red + "ERROR:" + reset, payload?.message);

      if (response.status === 401) {
        await clearAuth();
      }

      return {
        success: false,
        message: payload?.message || "Request failed",
        data: null,
        error: payload?.message,
      };
    }

    if (payload?.data?.access_token && payload?.data?.refresh_token) {
      const accessToken = payload.data.access_token;
      const refreshToken = payload.data.refresh_token;

      const accessPayload = parseJwt(accessToken);
      const refreshPayload = parseJwt(refreshToken);

      await saveAuth({
        accessToken,
        refreshToken,
        accessPayload,
        refreshPayload,
      });

      console.log(green + "AUTH SAVED" + reset);
      console.log(green + "USER:" + reset, accessPayload);
    }

    console.log(green + "MESSAGE:" + reset, payload?.message);

    return {
      success: payload?.success ?? true,
      message: payload?.message ?? "OK",
      data: payload?.data as T,
    };
  } catch (err: any) {
    console.log("\x1b[31mNETWORK ERROR\x1b[0m", err?.message);

    return {
      success: false,
      message: "Network error",
      data: null,
      error: err?.message || "Network error",
    };
  }
}
