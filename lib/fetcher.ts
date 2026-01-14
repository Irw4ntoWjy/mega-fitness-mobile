export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T | null;
  error?: string;
};

export async function fetcher<T>(
  endpoint: string,
  options?: {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    headers?: Record<string, string>;
    body?: any;
  }
): Promise<ApiResponse<T>> {
  try {
    const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}${endpoint}`;

    const reset = "\x1b[0m";
    const red = "\x1b[31m";
    const green = "\x1b[32m";
    const yellow = "\x1b[33m";
    const cyan = "\x1b[36m";
    const magenta = "\x1b[35m";

    console.log(cyan + "╔══════════════════════════════╗" + reset);
    console.log(cyan + "║      API REQUEST START       ║" + reset);
    console.log(cyan + "╚══════════════════════════════╝" + reset);

    console.log(magenta + "🌐 URL: " + reset + url);
    console.log(yellow + "📤 METHOD: " + reset + (options?.method || "POST"));

    if (options?.body) {
      console.log(cyan + "📦 BODY:" + reset, options.body);
    }

    const response = await fetch(url, {
      method: options?.method || "POST",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: options?.body ? JSON.stringify(options.body) : undefined,
    });

    console.log(
      response.ok
        ? green + `✅ STATUS: ${response.status}` + reset
        : red + `❌ STATUS: ${response.status}` + reset
    );

    const contentType = response.headers.get("content-type") ?? "";

    let payload: any;
    if (contentType.includes("application/json")) {
      payload = await response.json();
    } else {
      const text = await response.text();
      payload = { message: text, data: null, success: false };
    }

    // ─────────────────────────────────────────────
    // 📥 RESPONSE BOX
    // ─────────────────────────────────────────────
    if (!response.ok) {
      console.log(red + "╔══════════════════════════════╗" + reset);
      console.log(red + "║         API ERROR (X)        ║" + reset);
      console.log(red + "╚══════════════════════════════╝" + reset);

      console.log(
        red + "🧨 MESSAGE: " + reset + (payload?.message || "Request failed")
      );

      return {
        success: false,
        message: payload?.message || "Request failed",
        data: null,
        error: payload?.message,
      };
    }

    console.log(green + "╔══════════════════════════════╗" + reset);
    console.log(green + "║        API SUCCESS           ║" + reset);
    console.log(green + "╚══════════════════════════════╝" + reset);

    console.log(green + "💬 MESSAGE: " + reset + (payload?.message ?? "OK"));

    return {
      success: payload?.success ?? true,
      message: payload?.message ?? "OK",
      data: (payload?.data as T) ?? null,
    };
  } catch (err: any) {
    const reset = "\x1b[0m";
    const red = "\x1b[31m";

    console.log(red + "╔══════════════════════════════╗" + reset);
    console.log(red + "║      NETWORK ERROR           ║" + reset);
    console.log(red + "╚══════════════════════════════╝" + reset);

    console.log(red + "🧨 ERROR: " + reset + (err?.message || "Network error"));

    return {
      success: false,
      message: "Network error",
      data: null,
      error: err?.message || "Network error",
    };
  }
}
