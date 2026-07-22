CREATE TYPE "AuthProvider" AS ENUM ('EMAIL', 'WALLET', 'PASSKEY', 'OAUTH');
CREATE TYPE "PrivacyLevel" AS ENUM ('PRIVATE', 'LOCKED', 'HIDDEN', 'LOCAL_ONLY');
CREATE TYPE "AiMode" AS ENUM ('GENTLE', 'COACH', 'TRUTH');
CREATE TYPE "AiRole" AS ENUM ('USER', 'ASSISTANT', 'SYSTEM');
CREATE TYPE "AiProvider" AS ENUM ('OPENAI', 'LOCAL', 'DISABLED');
CREATE TYPE "StorageProvider" AS ENUM ('LOCAL', 'S3');
CREATE TYPE "TranscriptionStatus" AS ENUM ('NOT_REQUESTED', 'QUEUED', 'PROCESSING', 'COMPLETE', 'FAILED');
CREATE TYPE "AuditEventType" AS ENUM ('USER_CREATED', 'LOGIN_SUCCEEDED', 'LOGIN_FAILED', 'MAGIC_LINK_REQUESTED', 'WALLET_LINKED', 'WALLET_UNLINKED', 'VAULT_ENTRY_CREATED', 'VAULT_ENTRY_UPDATED', 'VAULT_ENTRY_DELETED', 'LOCKED_VAULT_UNLOCK_ATTEMPTED', 'AI_PROCESSING_STARTED', 'AI_PROCESSING_COMPLETED', 'DATA_EXPORT_REQUESTED', 'ACCOUNT_DELETION_REQUESTED', 'STORAGE_OBJECT_DELETED');

CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "email" TEXT,
  "emailVerifiedAt" TIMESTAMP(3),
  "authProvider" "AuthProvider" NOT NULL DEFAULT 'EMAIL',
  "privacyMode" TEXT NOT NULL DEFAULT 'standard',
  "aiEnabledDefault" BOOLEAN NOT NULL DEFAULT false,
  "timezone" TEXT NOT NULL DEFAULT 'UTC',
  "locale" TEXT NOT NULL DEFAULT 'en-US',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "deletedAt" TIMESTAMP(3),
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "User_deletedAt_idx" ON "User"("deletedAt");

CREATE TABLE "Session" ("id" TEXT NOT NULL, "userId" TEXT NOT NULL, "token" TEXT NOT NULL, "expiresAt" TIMESTAMP(3) NOT NULL, "ipHash" TEXT, "userAgentHash" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "Session_pkey" PRIMARY KEY ("id"));
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

CREATE TABLE "Account" ("id" TEXT NOT NULL, "userId" TEXT NOT NULL, "accountId" TEXT NOT NULL, "providerId" TEXT NOT NULL, "accessTokenEncrypted" TEXT, "refreshTokenEncrypted" TEXT, "expiresAt" TIMESTAMP(3), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "Account_pkey" PRIMARY KEY ("id"));
CREATE UNIQUE INDEX "Account_providerId_accountId_key" ON "Account"("providerId", "accountId");

CREATE TABLE "Passkey" ("id" TEXT NOT NULL, "userId" TEXT NOT NULL, "credentialId" TEXT NOT NULL, "publicKey" TEXT NOT NULL, "counter" INTEGER NOT NULL DEFAULT 0, "transports" TEXT[], "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "Passkey_pkey" PRIMARY KEY ("id"));
CREATE UNIQUE INDEX "Passkey_credentialId_key" ON "Passkey"("credentialId");

CREATE TABLE "UserWallet" ("id" TEXT NOT NULL, "userId" TEXT NOT NULL, "walletAddress" TEXT NOT NULL, "chain" TEXT NOT NULL DEFAULT 'solana', "walletProvider" TEXT, "verifiedAt" TIMESTAMP(3) NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "UserWallet_pkey" PRIMARY KEY ("id"));
CREATE UNIQUE INDEX "UserWallet_chain_walletAddress_key" ON "UserWallet"("chain", "walletAddress");

CREATE TABLE "VaultEntry" ("id" TEXT NOT NULL, "userId" TEXT NOT NULL, "title" TEXT, "encryptedContent" TEXT NOT NULL, "contentNonce" TEXT NOT NULL, "contentKeyVersion" INTEGER NOT NULL DEFAULT 1, "mood" TEXT, "moodIntensity" INTEGER, "privacyLevel" "PrivacyLevel" NOT NULL DEFAULT 'PRIVATE', "isLocked" BOOLEAN NOT NULL DEFAULT false, "isHidden" BOOLEAN NOT NULL DEFAULT false, "aiProcessingAllowed" BOOLEAN NOT NULL DEFAULT false, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, "deletedAt" TIMESTAMP(3), CONSTRAINT "VaultEntry_pkey" PRIMARY KEY ("id"));
CREATE INDEX "VaultEntry_userId_createdAt_idx" ON "VaultEntry"("userId", "createdAt");
CREATE INDEX "VaultEntry_userId_deletedAt_idx" ON "VaultEntry"("userId", "deletedAt");

CREATE TABLE "AudioDump" ("id" TEXT NOT NULL, "userId" TEXT NOT NULL, "storageKey" TEXT NOT NULL, "storageProvider" "StorageProvider" NOT NULL DEFAULT 'LOCAL', "encryptedStorageKey" TEXT, "durationSeconds" INTEGER, "mimeType" TEXT NOT NULL, "fileSize" BIGINT NOT NULL, "mood" TEXT, "privacyLevel" "PrivacyLevel" NOT NULL DEFAULT 'PRIVATE', "isLocked" BOOLEAN NOT NULL DEFAULT false, "aiProcessingAllowed" BOOLEAN NOT NULL DEFAULT false, "transcriptionStatus" "TranscriptionStatus" NOT NULL DEFAULT 'NOT_REQUESTED', "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "deletedAt" TIMESTAMP(3), CONSTRAINT "AudioDump_pkey" PRIMARY KEY ("id"));
CREATE INDEX "AudioDump_userId_createdAt_idx" ON "AudioDump"("userId", "createdAt");

CREATE TABLE "AudioTranscript" ("id" TEXT NOT NULL, "audioDumpId" TEXT NOT NULL, "userId" TEXT NOT NULL, "encryptedTranscript" TEXT NOT NULL, "transcriptNonce" TEXT NOT NULL, "language" TEXT, "confidenceScore" DOUBLE PRECISION, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "deletedAt" TIMESTAMP(3), CONSTRAINT "AudioTranscript_pkey" PRIMARY KEY ("id"));
CREATE UNIQUE INDEX "AudioTranscript_audioDumpId_key" ON "AudioTranscript"("audioDumpId");

CREATE TABLE "AiConversation" ("id" TEXT NOT NULL, "userId" TEXT NOT NULL, "mode" "AiMode" NOT NULL, "title" TEXT, "privacyLevel" "PrivacyLevel" NOT NULL DEFAULT 'PRIVATE', "isLocked" BOOLEAN NOT NULL DEFAULT false, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, "deletedAt" TIMESTAMP(3), CONSTRAINT "AiConversation_pkey" PRIMARY KEY ("id"));
CREATE TABLE "AiMessage" ("id" TEXT NOT NULL, "conversationId" TEXT NOT NULL, "userId" TEXT NOT NULL, "role" "AiRole" NOT NULL, "encryptedContent" TEXT NOT NULL, "contentNonce" TEXT NOT NULL, "modelProvider" "AiProvider", "modelName" TEXT, "safetyClassification" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "AiMessage_pkey" PRIMARY KEY ("id"));
CREATE INDEX "AiMessage_conversationId_createdAt_idx" ON "AiMessage"("conversationId", "createdAt");

CREATE TABLE "MoodCheckin" ("id" TEXT NOT NULL, "userId" TEXT NOT NULL, "mood" TEXT NOT NULL, "intensity" INTEGER NOT NULL, "notesEncrypted" TEXT, "notesNonce" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "MoodCheckin_pkey" PRIMARY KEY ("id"));
CREATE INDEX "MoodCheckin_userId_createdAt_idx" ON "MoodCheckin"("userId", "createdAt");

CREATE TABLE "Theme" ("id" TEXT NOT NULL, "name" TEXT NOT NULL, "description" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "Theme_pkey" PRIMARY KEY ("id"));
CREATE UNIQUE INDEX "Theme_name_key" ON "Theme"("name");
CREATE TABLE "EntryTheme" ("id" TEXT NOT NULL, "userId" TEXT NOT NULL, "entryId" TEXT NOT NULL, "themeId" TEXT NOT NULL, "confidence" DOUBLE PRECISION NOT NULL, "source" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "EntryTheme_pkey" PRIMARY KEY ("id"));
CREATE UNIQUE INDEX "EntryTheme_entryId_themeId_source_key" ON "EntryTheme"("entryId", "themeId", "source");

CREATE TABLE "AiMemoryItem" ("id" TEXT NOT NULL, "userId" TEXT NOT NULL, "memoryType" TEXT NOT NULL, "encryptedSummary" TEXT NOT NULL, "summaryNonce" TEXT NOT NULL, "embeddingId" TEXT, "confidence" DOUBLE PRECISION NOT NULL, "sourceEntryId" TEXT, "userApproved" BOOLEAN NOT NULL DEFAULT false, "expiresAt" TIMESTAMP(3), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "deletedAt" TIMESTAMP(3), CONSTRAINT "AiMemoryItem_pkey" PRIMARY KEY ("id"));
CREATE TABLE "AuditLog" ("id" TEXT NOT NULL, "userId" TEXT, "eventType" "AuditEventType" NOT NULL, "ipHash" TEXT, "userAgentHash" TEXT, "metadata" JSONB, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id"));
CREATE INDEX "AuditLog_userId_createdAt_idx" ON "AuditLog"("userId", "createdAt");
CREATE INDEX "AuditLog_eventType_createdAt_idx" ON "AuditLog"("eventType", "createdAt");
CREATE TABLE "FeatureFlagOverride" ("id" TEXT NOT NULL, "userId" TEXT, "flag" TEXT NOT NULL, "enabled" BOOLEAN NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "FeatureFlagOverride_pkey" PRIMARY KEY ("id"));
CREATE UNIQUE INDEX "FeatureFlagOverride_userId_flag_key" ON "FeatureFlagOverride"("userId", "flag");

ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Passkey" ADD CONSTRAINT "Passkey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UserWallet" ADD CONSTRAINT "UserWallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "VaultEntry" ADD CONSTRAINT "VaultEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AudioDump" ADD CONSTRAINT "AudioDump_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AudioTranscript" ADD CONSTRAINT "AudioTranscript_audioDumpId_fkey" FOREIGN KEY ("audioDumpId") REFERENCES "AudioDump"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AudioTranscript" ADD CONSTRAINT "AudioTranscript_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AiConversation" ADD CONSTRAINT "AiConversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AiMessage" ADD CONSTRAINT "AiMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "AiConversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MoodCheckin" ADD CONSTRAINT "MoodCheckin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EntryTheme" ADD CONSTRAINT "EntryTheme_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "VaultEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EntryTheme" ADD CONSTRAINT "EntryTheme_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "Theme"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AiMemoryItem" ADD CONSTRAINT "AiMemoryItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AiMemoryItem" ADD CONSTRAINT "AiMemoryItem_sourceEntryId_fkey" FOREIGN KEY ("sourceEntryId") REFERENCES "VaultEntry"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "FeatureFlagOverride" ADD CONSTRAINT "FeatureFlagOverride_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
