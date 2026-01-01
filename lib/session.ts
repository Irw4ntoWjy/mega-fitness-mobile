const memorySession: Record<string, string> = {};

/**
 * Save a value into temporary session memory.
 */
export const saveSession = async (key: string, value: string) => {
  memorySession[key] = value;
};

/**
 * Get a value from temporary session memory.
 */
export const getSession = async (key: string) => {
  return memorySession[key] ?? null;
};

/**
 * Remove a session value.
 */
export const clearSession = async (key: string) => {
  delete memorySession[key];
};
