import { z } from "zod";
import { paginationSchema } from "./pagination";

export type AccountDetailResponse = {
  account_id: string;
  account_code: string;
  account_email: string;
  account_status_id: string;
  account_status_name: string;
  account_role: string;

  profile_id: string;
  profile_name: string;
  birth_date: string;
  gender: string;
  identity_no: string;

  picture_url: string | null;
  contact_number: string | null;

  employee_detail: unknown | null;
  trainer_detail: unknown | null;

  created_at: string;
  created_by: string;
  updated_at: string | null;
  updated_by: string | null;
  deleted_at: string | null;
  deleted_by: string | null;
};

export const roleEnum = z.enum([
  "Member",
  "Trainer",
  "Supervisor",
  "Admin",
  "Office Boy",
]);

export const accountList = z.object({
  profile_id: z.string(),
  account_id: z.string(),
  account_code: z.string(),
  account_role: roleEnum,
  profile_name: z.string(),
  birth_date: z.string(),
  gender: z.string(),
  identity_no: z.string(),
  picture_url: z.string(),
  contact_number: z.string().optional(),
  account_status_id: z.string(),
  account_status_name: z.string(),
  created_at: z.string(),
  created_by: z.string(),
  updated_at: z.string().optional(),
  updated_by: z.string().optional(),
  deleted_at: z.string().optional(),
  deleted_by: z.string().optional(),
});

export type AccountListSchema = z.infer<typeof accountList>;
export const accountPaginationSchema = paginationSchema(accountList);
export type AccountPagination = z.infer<typeof accountPaginationSchema>;
