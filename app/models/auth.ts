// models/User.ts
export enum Gender {
  Male = "Laki-laki",
  Female = "Perempuan",
  Other = "lainnya",
}

export interface User {
  email: string;
  password: string;
  name: string;
  birth_date: string; // ISO string, e.g., "1998-04-12T00:00:00Z"
  gender: Gender;
  identity_no: string;
  picture_url?: string | null; // optional
  contact_number?: string | null; // optional
}
