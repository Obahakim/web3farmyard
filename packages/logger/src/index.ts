import pino from "pino";

const redactions = [
  "DATABASE_URL",
  "REDIS_URL",
  "OPENAI_API_KEY",
  "BETTER_AUTH_SECRET",
  "FIELD_ENCRYPTION_MASTER_KEY_BASE64",
  "S3_SECRET_ACCESS_KEY",
  "*.encryptedContent",
  "*.content",
  "*.transcript",
  "*.journal",
  "*.audio",
];

export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  redact: { paths: redactions, censor: "[REDACTED]" },
  base: { service: process.env.SERVICE_NAME ?? "deepn" },
});

export type Logger = typeof logger;
