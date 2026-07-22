import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { magicLink } from "better-auth/plugins";
import { getEnv } from "@deepn/config";
import { prisma } from "@deepn/database";
import { logger } from "@deepn/logger";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  secret: getEnv().BETTER_AUTH_SECRET,
  baseURL: getEnv().BETTER_AUTH_URL,
  trustedOrigins: [getEnv().NEXT_PUBLIC_APP_URL],
  emailAndPassword: { enabled: false },
  user: {
    modelName: "User",
    fields: { emailVerified: "emailVerified" },
    additionalFields: {
      onboardingCompletedAt: { type: "date", required: false },
      timezone: { type: "string", required: false },
      locale: { type: "string", required: false },
    },
  },
  session: {
    modelName: "Session",
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
    cookieCache: { enabled: true, maxAge: 60 * 5 },
  },
  account: { modelName: "Account" },
  verification: { modelName: "Verification" },
  plugins: [
    magicLink({
      expiresIn: 60 * 10,
      storeToken: "hashed",
      sendMagicLink: async ({ email, url }) => {
        // Production swaps this for the email provider module. Dev intentionally logs only destination and URL.
        logger.info({ email, url }, "DeePn magic link requested");
      },
    }),
  ],
});

export type Auth = typeof auth;

export interface WalletAuthChallenge {
  domain: string;
  nonce: string;
  issuedAt: string;
  expiresAt: string;
  statement: "Sign in to DeePn. This does not grant wallet transaction permissions.";
}

export * from "./schemas";
