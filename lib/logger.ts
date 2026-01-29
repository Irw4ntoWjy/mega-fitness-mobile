const reset = "\x1b[0m";
const red = "\x1b[31m";
const green = "\x1b[32m";
const yellow = "\x1b[33m";
const cyan = "\x1b[36m";
const magenta = "\x1b[35m";

export const logger = {
  requestStart() {
    console.log(cyan + "╔══════════════════════════════╗" + reset);
    console.log(cyan + "║      API REQUEST START       ║" + reset);
    console.log(cyan + "╚══════════════════════════════╝" + reset);
  },

  url(url: string) {
    console.log(magenta + "URL: " + reset + url);
  },

  method(method: string) {
    console.log(yellow + "METHOD: " + reset + method);
  },

  body(body: unknown) {
    console.log(cyan + "BODY: " + reset + JSON.stringify(body));
  },

  status(status: number, ok: boolean) {
    console.log(
      ok
        ? green + `STATUS: ${status}` + reset
        : red + `STATUS: ${status}` + reset,
    );
  },

  message(message?: string) {
    if (message) {
      console.log(green + "MESSAGE: " + reset + message);
    }
  },

  data(data: unknown) {
    if (data !== undefined) {
      console.log(cyan + "DATA: " + reset + JSON.stringify(data));
    }
  },

  error(message?: string) {
    console.log(red + "ERROR: " + reset + message);
  },

  authSaved() {
    console.log(green + "AUTH SAVED" + reset);
  },

  user(payload: unknown) {
    console.log(green + "USER: " + reset + JSON.stringify(payload));
  },

  refreshing() {
    console.log(yellow + "TOKEN EXPIRED → TRY REFRESH" + reset);
  },

  refreshed() {
    console.log(green + "TOKEN REFRESHED → RETRY REQUEST" + reset);
  },

  networkError(message?: string) {
    console.log(red + "NETWORK ERROR" + reset, message);
  },
};
