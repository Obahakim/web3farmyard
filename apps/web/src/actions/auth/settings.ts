"use server";

import { revalidatePath } from "next/cache";
import { accountSettingsSchema, privacySettingsSchema, revokeSessionSchema } from "@deepn/auth/schemas";
import { requireSession } from "@deepn/auth/server";
import { prisma } from "@deepn/database";
import { writeAuditLog } from "@deepn/audit";
import { AppError } from "@deepn/errors";
import { actionError, actionOk, type ActionResult } from "../../server/action-result";
import { getRequestContext } from "../../server/request-context";

export async function updateAccountSettingsAction(input: unknown): Promise<ActionResult<{ updated: true }>> {
  try {
    const payload = accountSettingsSchema.parse(input);
    const context = await getRequestContext();
    const session = await requireSession(context.headers);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { name: payload.displayName, timezone: payload.timezone, locale: payload.locale },
    });

    await writeAuditLog({ userId: session.user.id, eventType: "ACCOUNT_SETTINGS_UPDATED", ip: context.ip, userAgent: context.userAgent, metadata: { requestId: context.requestId } });
    revalidatePath("/settings/account");
    return actionOk({ updated: true });
  } catch (error) {
    return actionError(error);
  }
}

export async function updatePrivacySettingsAction(input: unknown): Promise<ActionResult<{ updated: true }>> {
  try {
    const payload = privacySettingsSchema.parse(input);
    const context = await getRequestContext();
    const session = await requireSession(context.headers);

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: session.user.id },
        data: { aiEnabledDefault: payload.aiProcessingDefault },
      });
      await tx.userPrivacySettings.upsert({
        where: { userId: session.user.id },
        create: { userId: session.user.id, ...payload },
        update: payload,
      });
    });

    await writeAuditLog({ userId: session.user.id, eventType: "PRIVACY_SETTINGS_UPDATED", ip: context.ip, userAgent: context.userAgent, metadata: { requestId: context.requestId } });
    revalidatePath("/settings/privacy");
    return actionOk({ updated: true });
  } catch (error) {
    return actionError(error);
  }
}

export async function revokeSessionAction(input: unknown): Promise<ActionResult<{ revoked: true }>> {
  try {
    const payload = revokeSessionSchema.parse(input);
    const context = await getRequestContext();
    const session = await requireSession(context.headers);

    if (payload.sessionId === session.session.id) {
      throw new AppError("BAD_REQUEST", "Use sign out to revoke the current session.");
    }

    const deleted = await prisma.session.deleteMany({ where: { id: payload.sessionId, userId: session.user.id } });
    if (deleted.count === 0) throw new AppError("NOT_FOUND", "Session not found.");

    await writeAuditLog({ userId: session.user.id, eventType: "SESSION_REVOKED", ip: context.ip, userAgent: context.userAgent, metadata: { requestId: context.requestId, resourceId: payload.sessionId, resourceType: "session" } });
    return actionOk({ revoked: true });
  } catch (error) {
    return actionError(error);
  }
}
