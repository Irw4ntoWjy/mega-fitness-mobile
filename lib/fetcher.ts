export type FetchResponse<T> = {
  data?: T;
  error?: string;
};

/**
 * Generic fetcher using Expo public backend URL from .env
 * @param endpoint endpoint path starting with /
 * @param options fetch options
 */
export async function fetcher<T>(
  endpoint: string,
  options?: {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    headers?: Record<string, string>;
    body?: any;
  }
): Promise<FetchResponse<T>> {
  try {
    const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}${endpoint}`;

    const response = await fetch(url, {
      method: options?.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: options?.body ? JSON.stringify(options.body) : undefined,
    });

    const json = await response.json();

    if (!response.ok) {
      return { error: json?.message || "Something went wrong" };
    }

    return { data: json };
  } catch (err: any) {
    return { error: err.message || "Network error" };
  }
}
