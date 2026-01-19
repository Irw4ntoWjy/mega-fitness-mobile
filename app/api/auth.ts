import { fetcher } from "@/lib/fetcher";
import { LoginPayload, LoginResponse, RefreshResponse } from "@/type/auth";

export function login(payload: LoginPayload) {
  return fetcher<LoginResponse>("/auth/login/mobile", {
    body: payload,
  });
}

/**
 * Refresh token API
 * NOTE: NO auth header (access token already invalid)
 */
export function refreshToken(refreshToken: string) {
  return fetcher<RefreshResponse>("/auth/refresh", {
    body: {
      refresh_token: refreshToken,
    },
  });
}
