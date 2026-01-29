export type BackendFieldError = {
  field: string;
  message: string;
};

export type BackendErrorPayload = {
  success?: boolean;
  message?: string;
  data?: unknown;
};

export function mapFieldErrors<T extends string>(
  payload: BackendErrorPayload | null | undefined,
  fieldMap: Record<string, T>,
): Partial<Record<T, string>> {
  if (!payload?.data || !Array.isArray(payload.data)) return {};

  return payload.data.reduce<Partial<Record<T, string>>>((acc, item) => {
    if (!item || typeof item !== "object") {
      return acc;
    }
    const field = (item as BackendFieldError).field;
    const message = (item as BackendFieldError).message;
    if (!field || !message) {
      return acc;
    }
    const key = fieldMap[field];
    if (key) {
      acc[key] = message;
    }
    return acc;
  }, {});
}
