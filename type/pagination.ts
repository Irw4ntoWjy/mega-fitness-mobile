import z from "zod";

export interface BaseListParams {
  q?: string | null;
  page?: number;
  limit?: number;
}

export function buildListPayload<T extends object>(
  params?: BaseListParams & T,
) {
  return {
    q: params?.q ?? null,
    page: params?.page ?? 1,
    limit: params?.limit ?? -1,
    ...params, // 🔥 allow extra fields like customer_profile_id
  };
}

export const paginationSchema = <T extends z.ZodTypeAny>(item: T) =>
  z.object({
    current_page: z.number(),
    total_page: z.number(),
    total_data: z.number(),
    data: z.array(item),
  });

export type PaginationSchema = z.infer<typeof paginationSchema>;
