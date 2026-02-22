import { fetcher } from "@/lib/fetcher";

// Type for signup payload (optional but recommended)
export interface SignUpPayload {
  email: string;
  password: string;
  name: string;
  birth_date: string;
  gender: string;
  identity_no: string;
  picture_url?: string | null;
  contact_number?: string | null;
}

// Example dummy data
const dummyUser: SignUpPayload = {
  email: "alex101@gmail.com",
  password: "Strong123!",
  name: "John Doe",
  birth_date: "1998-04-12T00:00:00Z",
  gender: "Laki-laki",
  identity_no: "3201123456789012",
  picture_url: null,
  contact_number: null,
};

// EXAMPLE
export async function signUp() {
  return fetcher("/auth/sign-up", {
    method: "POST",
    body: dummyUser,
  });
}
