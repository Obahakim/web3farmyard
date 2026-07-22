import { describe, expect, it } from "vitest";
import { accountSettingsSchema, onboardingSchema, privacySettingsSchema, requestMagicLinkSchema } from "../schemas";

describe("auth validation schemas", () => {
  it("normalizes magic-link email and rejects external callback URLs", () => {
    const parsed = requestMagicLinkSchema.parse({ email: "USER@Example.COM", callbackURL: "/settings/account" });
    expect(parsed.email).toBe("user@example.com");
    expect(() => requestMagicLinkSchema.parse({ email: "user@example.com", callbackURL: "https://evil.example" })).toThrow();
    expect(() => requestMagicLinkSchema.parse({ email: "user@example.com", callbackURL: "//evil.example" })).toThrow();
  });

  it("accepts safe onboarding settings", () => {
    const parsed = onboardingSchema.parse({ displayName: "Alex", aiEnabledDefault: false, defaultPrivacyLevel: "PRIVATE" });
    expect(parsed.displayName).toBe("Alex");
    expect(parsed.timezone).toBe("UTC");
  });

  it("validates account and privacy settings", () => {
    expect(accountSettingsSchema.parse({ displayName: "Sam", timezone: "America/New_York", locale: "en-US" }).locale).toBe("en-US");
    expect(privacySettingsSchema.parse({
      defaultPrivacyLevel: "LOCKED",
      aiProcessingDefault: false,
      audioTranscriptionDefault: false,
      memoryEnabled: false,
      analyticsEnabled: false,
    }).dataExportFormat).toBe("JSON");
  });
});
