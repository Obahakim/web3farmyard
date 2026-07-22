export type UserId = string;
export type EntryId = string;
export type AudioDumpId = string;
export type ConversationId = string;

export type Mood =
  | "angry"
  | "anxious"
  | "calm"
  | "confused"
  | "grateful"
  | "lonely"
  | "numb"
  | "overwhelmed"
  | "sad"
  | "hopeful";

export type PrivacyLevel = "private" | "locked" | "hidden" | "local_only";
export type AiMode = "gentle" | "coach" | "truth";
export type AiProviderName = "openai" | "local" | "disabled";
export type StorageProviderName = "local" | "s3";
export type QueueName = "ai" | "transcription" | "timeline" | "deletion" | "export" | "moderation";

export interface EncryptedPayload {
  ciphertext: string;
  nonce: string;
  keyVersion: number;
  algorithm: "aes-256-gcm";
}

export interface AuditEventMetadata {
  requestId?: string;
  resourceId?: string;
  resourceType?: string;
  reason?: string;
  [key: string]: unknown;
}
