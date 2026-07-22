export type ErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "VALIDATION_FAILED"
  | "AI_PROVIDER_ERROR"
  | "STORAGE_ERROR"
  | "ENCRYPTION_ERROR"
  | "INTERNAL_ERROR";

const statusByCode: Record<ErrorCode, number> = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  RATE_LIMITED: 429,
  VALIDATION_FAILED: 422,
  AI_PROVIDER_ERROR: 502,
  STORAGE_ERROR: 502,
  ENCRYPTION_ERROR: 500,
  INTERNAL_ERROR: 500,
};

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly status: number;
  readonly safeMessage: string;
  readonly context?: Record<string, unknown>;

  constructor(code: ErrorCode, safeMessage: string, context?: Record<string, unknown>) {
    super(safeMessage);
    this.name = "AppError";
    this.code = code;
    this.status = statusByCode[code];
    this.safeMessage = safeMessage;
    this.context = context;
  }
}

export function normalizeError(error: unknown): AppError {
  if (error instanceof AppError) return error;
  if (isValidationError(error)) {
    return new AppError("VALIDATION_FAILED", "The request payload is invalid.");
  }
  if (error instanceof Error) {
    return new AppError("INTERNAL_ERROR", "An unexpected error occurred.", { cause: error.message });
  }
  return new AppError("INTERNAL_ERROR", "An unexpected error occurred.");
}

function isValidationError(error: unknown): boolean {
  return Boolean(error && typeof error === "object" && "issues" in error && (error as { name?: string }).name === "ZodError");
}

export function toProblemJson(error: unknown, requestId?: string) {
  const appError = normalizeError(error);
  return {
    type: `https://deepn.app/problems/${appError.code.toLowerCase()}`,
    title: appError.code,
    status: appError.status,
    detail: appError.safeMessage,
    requestId,
  };
}
