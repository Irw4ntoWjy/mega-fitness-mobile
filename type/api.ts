export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T | null;
  status: number;
  error?: string;
};
