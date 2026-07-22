import { AppError } from "@deepn/errors";
import { prisma } from "@deepn/database";
import { auth } from "../index";

export interface DeePnSessionUser {
  id: string;
  email: string;
  name?: string | null;
  emailVerified?: boolean;
  onboardingCompletedAt?: Date | null;
}

export interface DeePnSession {
  session: { id: string; token?: string; expiresAt: Date; userId: string };
  user: DeePnSessionUser;
}

export async function getSessionFromHeaders(headers: Headers): Promise<DeePnSession | null> {
  const session = await auth.api.getSession({ headers });
  return session as DeePnSession | null;
}

export async function requireSession(headers: Headers): Promise<DeePnSession> {
  const session = await getSessionFromHeaders(headers);
  if (!session?.user?.id) {
    throw new AppError("UNAUTHORIZED", "Authentication is required.");
  }
  return session;
}

export async function getUserWithPrivacySettings(userId: string) {
  const user = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null },
    include: { privacySettings: true },
  });
  if (!user) throw new AppError("UNAUTHORIZED", "Authentication is required.");
  return user;
}
