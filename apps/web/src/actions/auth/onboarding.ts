"use server";

import { revalidatePath } from "next/cache";
import { onboardingSchema } from "@deepn/auth/schemas";
import { requireSession } from "@deepn/auth/server";
import { prisma } from "@deepn/database";
import { writeAuditLog } from "@deepn/audit";
import { actionError, actionOk, type ActionResult } from "../../server/action-result";
import { getRequestContext } from "../../server/request-context";

export async function completeOnboardingAction(input: unknown): Promise<ActionResult<{ completed: true }>> {
  try {
    const payload = onboardingSchema.parse(input);
    const context = await getRequestContext();
    const session = await requireSession(context.headers);

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: session.user.id },
        data: {
          name: payload.displayName,
          timezone: payload.timezone,
          locale: payload.locale,
          aiEnabledDefault: payload.aiEnabledDefault,
          onboardingCompletedAt: new Date(),
        },
      });
      await tx.userPrivacySettings.upsert({
        where: { userId: session.user.id },
        create: {
          userId: session.user.id,
          defaultPrivacyLevel: payload.defaultPrivacyLevel,
          aiProcessingDefault: payload.aiEnabledDefault,
        },
        update: {
          defaultPrivacyLevel: payload.defaultPrivacyLevel,
          aiProcessingDefault: payload.aiEnabledDefault,
        },
      });
    });

    await writeAuditLog({
      userId: session.user.id,
      eventType: "ONBOARDING_COMPLETED",
      ip: context.ip,
      userAgent: context.userAgent,
      metadata: { requestId: context.requestId },
    });

    revalidatePath("/onboarding");
    revalidatePath("/settings/account");
    return actionOk({ completed: true });
  } catch (error) {
    return actionError(error);
  }
}
