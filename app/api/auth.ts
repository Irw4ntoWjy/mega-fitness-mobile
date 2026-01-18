import { fetcher } from "@/lib/fetcher";
import { LoginPayload, LoginResponse } from "@/type/auth";

export function login(payload: LoginPayload) {
  return fetcher<LoginResponse>("/auth/login/mobile", {
    body: payload,
  });
}
