import { z } from "zod";

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

export type LoginResponse = {
  access_token: string;
  refresh_token: string;
};

export type StoredAuth = {
  accessToken: string;
  refreshToken: string;
  accessPayload: AccessTokenPayload;
  refreshPayload: RefreshTokenPayload;
};

export type RefreshResponse = {
  access_token: string;
  refresh_token: string;
};
