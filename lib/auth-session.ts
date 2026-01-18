import { isAuthenticated } from "@/lib/auth-storage";

export async function checkSession() {
  return isAuthenticated();
}
