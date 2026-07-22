import { NextResponse } from "next/server";
import { requireSession } from "@deepn/auth/server";
import { prisma } from "@deepn/database";
import { toProblemJson } from "@deepn/errors";

export async function GET(request: Request) {
  try {
    const session = await requireSession(request.headers);
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: session.user.id },
      select: { id: true, email: true, name: true, emailVerified: true, timezone: true, locale: true, onboardingCompletedAt: true },
    });
    return NextResponse.json({ user });
  } catch (error) {
    const problem = toProblemJson(error);
    return NextResponse.json(problem, { status: problem.status });
  }
}
