import { fetcher } from "@/lib/fetcher";

export type VariableDetail = {
  variable_id: number;
  variable: string;
  value: number | null;
  value_string: string | null;
};

export function getVariableDetail(payload: { variable: string }) {
  return fetcher<VariableDetail>("/variable/detail", {
    body: { variable: payload.variable },
    auth: true,
  });
}
