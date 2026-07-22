ALTER TYPE "AuditEventType" ADD VALUE IF NOT EXISTS 'ONBOARDING_COMPLETED';
ALTER TYPE "AuditEventType" ADD VALUE IF NOT EXISTS 'ACCOUNT_SETTINGS_UPDATED';
ALTER TYPE "AuditEventType" ADD VALUE IF NOT EXISTS 'PRIVACY_SETTINGS_UPDATED';
ALTER TYPE "AuditEventType" ADD VALUE IF NOT EXISTS 'SESSION_REVOKED';

ALTER TABLE "User"
  ADD COLUMN IF NOT EXISTS "name" TEXT,
  ADD COLUMN IF NOT EXISTS "emailVerified" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "image" TEXT,
  ADD COLUMN IF NOT EXISTS "onboardingCompletedAt" TIMESTAMP(3);

UPDATE "User"
SET "emailVerified" = true
WHERE "emailVerifiedAt" IS NOT NULL;

ALTER TABLE "Session"
  ADD COLUMN IF NOT EXISTS "ipAddress" TEXT,
  ADD COLUMN IF NOT EXISTS "userAgent" TEXT;

ALTER TABLE "Account"
  ADD COLUMN IF NOT EXISTS "accessToken" TEXT,
  ADD COLUMN IF NOT EXISTS "refreshToken" TEXT,
  ADD COLUMN IF NOT EXISTS "idToken" TEXT,
  ADD COLUMN IF NOT EXISTS "accessTokenExpiresAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "refreshTokenExpiresAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "scope" TEXT,
  ADD COLUMN IF NOT EXISTS "password" TEXT;

CREATE TABLE IF NOT EXISTS "Verification" (
  "id" TEXT NOT NULL,
  "identifier" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3),
  CONSTRAINT "Verification_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "Verification_identifier_idx" ON "Verification"("identifier");

CREATE TABLE IF NOT EXISTS "UserPrivacySettings" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "defaultPrivacyLevel" "PrivacyLevel" NOT NULL DEFAULT 'PRIVATE',
  "aiProcessingDefault" BOOLEAN NOT NULL DEFAULT false,
  "audioTranscriptionDefault" BOOLEAN NOT NULL DEFAULT false,
  "memoryEnabled" BOOLEAN NOT NULL DEFAULT false,
  "analyticsEnabled" BOOLEAN NOT NULL DEFAULT false,
  "dataExportFormat" TEXT NOT NULL DEFAULT 'JSON',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "UserPrivacySettings_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "UserPrivacySettings_userId_key" ON "UserPrivacySettings"("userId");
ALTER TABLE "UserPrivacySettings" ADD CONSTRAINT "UserPrivacySettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
