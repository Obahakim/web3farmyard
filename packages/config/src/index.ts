import { z } from "zod";

const boolFromString = z
  .enum(["true", "false"])
  .transform((value) => value === "true");

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_APP_NAME: z.string().default("DeePn"),
  NEXT_PUBLIC_APP_TAGLINE: z.string().default("Your Private Emotional Vault"),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().url(),
  QUEUE_PREFIX: z.string().default("deepn"),
  BETTER_AUTH_SECRET: z.string().min(16),
  BETTER_AUTH_URL: z.string().url(),
  MAGIC_LINK_FROM_EMAIL: z.string().email(),
  EMAIL_PROVIDER: z.enum(["console", "resend"]).default("console"),
  RESEND_API_KEY: z.string().optional(),
  FIELD_ENCRYPTION_MASTER_KEY_BASE64: z.string().min(32),
  LOCKED_VAULT_ARGON2_MEMORY_KIB: z.coerce.number().int().positive().default(65536),
  LOCKED_VAULT_ARGON2_ITERATIONS: z.coerce.number().int().positive().default(3),
  LOCKED_VAULT_ARGON2_PARALLELISM: z.coerce.number().int().positive().default(1),
  AI_DEFAULT_PROVIDER: z.enum(["openai", "local", "disabled"]).default("openai"),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_TEXT_MODEL: z.string().default("gpt-4.1-mini"),
  OPENAI_TRANSCRIPTION_MODEL: z.string().default("gpt-4o-mini-transcribe"),
  OPENAI_EMBEDDING_MODEL: z.string().default("text-embedding-3-small"),
  STORAGE_PROVIDER: z.enum(["local", "s3"]).default("local"),
  LOCAL_STORAGE_ROOT: z.string().default("./local-storage"),
  S3_ENDPOINT: z.string().url().optional(),
  S3_REGION: z.string().default("us-east-1"),
  S3_BUCKET: z.string().optional(),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_ACCESS_KEY: z.string().optional(),
  S3_FORCE_PATH_STYLE: boolFromString.default("true"),
  RATE_LIMIT_ENABLED: boolFromString.default("true"),
  AUDIT_LOG_RETENTION_DAYS: z.coerce.number().int().positive().default(365),
  FEATURE_FLAGS_SOURCE: z.enum(["env", "database"]).default("env"),
});

export type DeePnEnv = z.infer<typeof envSchema>;

let cachedEnv: DeePnEnv | undefined;

export function getEnv(source: NodeJS.ProcessEnv = process.env): DeePnEnv {
  if (!cachedEnv) {
    cachedEnv = envSchema.parse(source);
  }
  return cachedEnv;
}

export function resetEnvCache(): void {
  cachedEnv = undefined;
}
