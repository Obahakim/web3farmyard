"use server";

import { auth } from "@deepn/auth";
import { requestMagicLinkSchema } from "@deepn/auth/schemas";
import { writeAuditLog } from "@deepn/audit";
import { AppError } from "@deepn/errors";
import { InMemoryRateLimiter, enforceRateLimit } from "@deepn/security";
import { actionError, actionOk, type ActionResult } from "../../server/action-result";
import { getRequestContext } from "../../server/request-context";

const magicLinkLimiter = new InMemoryRateLimiter(5, 15 * 60_000);

export async function requestMagicLinkAction(input: unknown): Promise<ActionResult<{ sent: true }>> {
  try {
    const payload = requestMagicLinkSchema.parse(input);
    const context = await getRequestContext();
    await enforceRateLimit(magicLinkLimiter, `magic-link:${payload.email}:${context.ip ?? "unknown"}`);

    await auth.api.signInMagicLink({
      body: payload,
      headers: context.headers,
    });

    await writeAuditLog({
      eventType: "MAGIC_LINK_REQUESTED",
      ip: context.ip,
      userAgent: context.userAgent,
      metadata: { requestId: context.requestId },
    });

    return actionOk({ sent: true });
  } catch (error) {
    if (error instanceof AppError) return actionError(error);
    return actionError(error);
  }
}
