import { AppError } from "@deepn/errors";
import { z } from "zod";

export const requestIdHeader = "x-request-id";

export const securityHeaders: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(self), geolocation=()",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-origin",
};

export function assertValid<T>(schema: z.Schema<T>, value: unknown): T {
  const parsed = schema.safeParse(value);
  if (!parsed.success) {
    throw new AppError("VALIDATION_FAILED", "The request payload is invalid.", {
      issues: parsed.error.flatten(),
    });
  }
  return parsed.data;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

export interface RateLimiter {
  limit(identifier: string): Promise<RateLimitResult>;
}

export class InMemoryRateLimiter implements RateLimiter {
  private readonly hits = new Map<string, { count: number; reset: number }>();

  constructor(private readonly max = 60, private readonly windowMs = 60_000) {}

  async limit(identifier: string): Promise<RateLimitResult> {
    const now = Date.now();
    const current = this.hits.get(identifier);
    if (!current || current.reset < now) {
      const reset = now + this.windowMs;
      this.hits.set(identifier, { count: 1, reset });
      return { success: true, limit: this.max, remaining: this.max - 1, reset };
    }
    current.count += 1;
    return {
      success: current.count <= this.max,
      limit: this.max,
      remaining: Math.max(0, this.max - current.count),
      reset: current.reset,
    };
  }
}

export async function enforceRateLimit(limiter: RateLimiter, identifier: string): Promise<void> {
  const result = await limiter.limit(identifier);
  if (!result.success) {
    throw new AppError("RATE_LIMITED", "Too many requests. Please slow down.", { reset: result.reset });
  }
}
