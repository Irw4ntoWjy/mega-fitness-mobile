import { clearAuth, getAuth } from "@/lib/auth-storage";
import { fetcher } from "@/lib/fetcher";
import { AccountDetailResponse } from "@/type/account";
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

export async function login(payload: LoginPayload) {
  await clearAuth();
  const loginRes = await fetcher<LoginResponse>("/auth/login/mobile", {
    body: payload,
  });

  if (loginRes.success) {
    const auth = await getAuth();
    const accountCode = auth?.accessPayload?.account_code;

    await fetcher<AccountDetailResponse>("/account/detail/code", {
      auth: true,
      body: {
        account_code: accountCode,
      },
    });
  }

  return loginRes;
}

export async function update_password(payload: {
  email: string;
  otp: string;
  new_password: string;
}) {
  return fetcher<LoginResponse>("/account/update-password", {
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
