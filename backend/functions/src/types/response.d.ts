type ApiResponse = Promise<{
  success: boolean;
  data?: Record<string, unknown> | string[] | null;
  message?: string;
} | null>;
