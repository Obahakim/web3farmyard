import { AppError, normalizeError } from "@deepn/errors";

export type ActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: { code: string; message: string } };

export function actionOk<T>(data: T): ActionResult<T> {
  return { ok: true, data };
}

export function actionError(error: unknown): ActionResult<never> {
  const validationError = isZodError(error)
    ? new AppError("VALIDATION_FAILED", "The request payload is invalid.")
    : undefined;
  const normalized = validationError ?? normalizeError(error);
  return { ok: false, error: { code: normalized.code, message: normalized.safeMessage } };
}

function isZodError(error: unknown): boolean {
  return Boolean(error && typeof error === "object" && "issues" in error && (error as { name?: string }).name === "ZodError");
}
