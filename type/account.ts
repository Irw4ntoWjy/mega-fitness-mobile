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
