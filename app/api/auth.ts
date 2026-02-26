import { fetcher } from "@/lib/fetcher";
import {
  LoginPayload,
  LoginResponse,
  OtpRequestPayload,
  OtpRequestResponse,
  RefreshResponse,
  SignUpPayload,
  VerifyAccountPayload,
  VerifyAccountResponse,
} from "@/type/auth";

export function login(payload: LoginPayload) {
  return fetcher<LoginResponse>("/auth/login/mobile", {
    body: payload,
  });
}

export function signUp(payload: SignUpPayload) {
  return fetcher("/auth/sign-up", {
    body: payload,
  });
}

export function requestOtp(payload: OtpRequestPayload) {
  return fetcher<OtpRequestResponse>("/otp/request", {
    body: payload,
  });
}

export function verifyAccount(payload: VerifyAccountPayload) {
  return fetcher<VerifyAccountResponse>("/account/verify", {
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
