import { createHash } from "node:crypto";
import { prisma } from "@deepn/database";
import type { AuditEventMetadata, UserId } from "@deepn/types";

export type AuditEventType =
  | "USER_CREATED"
  | "LOGIN_SUCCEEDED"
  | "LOGIN_FAILED"
  | "MAGIC_LINK_REQUESTED"
  | "WALLET_LINKED"
  | "WALLET_UNLINKED"
  | "VAULT_ENTRY_CREATED"
  | "VAULT_ENTRY_UPDATED"
  | "VAULT_ENTRY_DELETED"
  | "LOCKED_VAULT_UNLOCK_ATTEMPTED"
  | "AI_PROCESSING_STARTED"
  | "AI_PROCESSING_COMPLETED"
  | "DATA_EXPORT_REQUESTED"
  | "ACCOUNT_DELETION_REQUESTED"
  | "STORAGE_OBJECT_DELETED"
  | "ONBOARDING_COMPLETED"
  | "ACCOUNT_SETTINGS_UPDATED"
  | "PRIVACY_SETTINGS_UPDATED"
  | "SESSION_REVOKED";

export function hashNetworkValue(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  return createHash("sha256").update(value).digest("hex");
}

export async function writeAuditLog(input: {
  userId?: UserId;
  eventType: AuditEventType;
  ip?: string | null;
  userAgent?: string | null;
  metadata?: AuditEventMetadata;
}): Promise<void> {
  await prisma.auditLog.create({
    data: {
      userId: input.userId,
      eventType: input.eventType,
      ipHash: hashNetworkValue(input.ip),
      userAgentHash: hashNetworkValue(input.userAgent),
      metadata: input.metadata,
    },
  });
}
