import { z } from "zod";
import { AccountDetailResponse } from "./account";

/**
 * Parsed JWT payload (access token)
 * Tambahin field kalau backend nambah claim
 */
export type AccessTokenPayload = {
  account_code: string;
  account_role: string;
  iss: string;
  exp: number;
  iat: number;
};

/**
 * Parsed JWT payload (refresh token)
 */
export type RefreshTokenPayload = {
  sid: string;
  iss: string;
  exp: number;
  iat: number;
};

export const signInSchema = z.object({
  email: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginPayload = z.infer<typeof signInSchema>;

export const signUpSchema = z.object({
  email: z.string().min(1, "Email wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
  name: z.string().min(1, "Nama wajib diisi"),
  birth_date: z.string().min(1, "Tanggal lahir wajib diisi"),
  gender: z.string().min(1, "Gender wajib diisi"),
  contact_number: z.string().optional(),
});
export type SignUpPayload = z.infer<typeof signUpSchema>;

export const otpRequestSchema = z.object({
  email: z.string().min(1, "Email wajib diisi"),
});
export type OtpRequestPayload = z.infer<typeof otpRequestSchema>;

export const verifyAccountSchema = z.object({
  email: z.string().min(1, "Email wajib diisi"),
  otp: z.string().min(1, "OTP wajib diisi"),
});
export type VerifyAccountPayload = z.infer<typeof verifyAccountSchema>;

export type LoginResponse = {
  access_token: string;
  refresh_token: string;
};

export type StoredAuth = {
  accessToken: string;
  refreshToken: string;
  accessPayload: AccessTokenPayload;
  refreshPayload: RefreshTokenPayload;
  accountDetail?: AccountDetailResponse;
};

export type RefreshResponse = {
  access_token: string;
  refresh_token: string;
};

export type OtpRequestResponse = string;
export type VerifyAccountResponse = null;
