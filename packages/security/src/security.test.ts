import { describe, expect, it } from "vitest";
import { InMemoryRateLimiter, assertValid, enforceRateLimit, securityHeaders } from "./index";
import { z } from "zod";

describe("security helpers", () => {
  it("sets strict baseline headers", () => {
    expect(securityHeaders["X-Frame-Options"]).toBe("DENY");
    expect(securityHeaders["X-Content-Type-Options"]).toBe("nosniff");
  });

  it("validates payloads with safe errors", () => {
    expect(assertValid(z.object({ email: z.string().email() }), { email: "a@b.com" })).toEqual({ email: "a@b.com" });
    expect(() => assertValid(z.object({ email: z.string().email() }), { email: "nope" })).toThrow();
  });

  it("enforces rate limits", async () => {
    const limiter = new InMemoryRateLimiter(1, 60_000);
    await expect(enforceRateLimit(limiter, "user")).resolves.toBeUndefined();
    await expect(enforceRateLimit(limiter, "user")).rejects.toThrow("Too many requests");
  });
});
