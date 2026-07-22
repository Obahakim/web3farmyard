import { z } from "zod";

const appRelativePath = z
  .string()
  .trim()
  .default("/dashboard")
  .refine((value) => value.startsWith("/") && !value.startsWith("//") && !value.includes("://"), {
    message: "Callback URL must be an app-relative path.",
  });

export const requestMagicLinkSchema = z.object({
  email: z.string().trim().email().max(320).transform((value) => value.toLowerCase()),
  callbackURL: appRelativePath,
  newUserCallbackURL: appRelativePath.default("/onboarding"),
  errorCallbackURL: appRelativePath.default("/sign-in?error=magic-link"),
});

export const onboardingSchema = z.object({
  displayName: z.string().trim().min(1).max(80),
  timezone: z.string().trim().min(1).max(80).default("UTC"),
  locale: z.string().trim().min(2).max(20).default("en-US"),
  aiEnabledDefault: z.boolean().default(false),
  defaultPrivacyLevel: z.enum(["PRIVATE", "LOCKED", "HIDDEN", "LOCAL_ONLY"]).default("PRIVATE"),
});

export const accountSettingsSchema = z.object({
  displayName: z.string().trim().min(1).max(80),
  timezone: z.string().trim().min(1).max(80),
  locale: z.string().trim().min(2).max(20),
});

export const privacySettingsSchema = z.object({
  defaultPrivacyLevel: z.enum(["PRIVATE", "LOCKED", "HIDDEN", "LOCAL_ONLY"]),
  aiProcessingDefault: z.boolean(),
  audioTranscriptionDefault: z.boolean(),
  memoryEnabled: z.boolean(),
  analyticsEnabled: z.boolean(),
  dataExportFormat: z.enum(["JSON", "MARKDOWN"]).default("JSON"),
});

export const revokeSessionSchema = z.object({
  sessionId: z.string().min(1),
});

export type RequestMagicLinkInput = z.infer<typeof requestMagicLinkSchema>;
export type OnboardingInput = z.infer<typeof onboardingSchema>;
export type AccountSettingsInput = z.infer<typeof accountSettingsSchema>;
export type PrivacySettingsInput = z.infer<typeof privacySettingsSchema>;
export type RevokeSessionInput = z.infer<typeof revokeSessionSchema>;
