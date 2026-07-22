import { NextResponse } from "next/server";
import { requireSession } from "@deepn/auth/server";
import { prisma } from "@deepn/database";
import { toProblemJson } from "@deepn/errors";

export async function GET(request: Request) {
  try {
    const session = await requireSession(request.headers);
    const settings = await prisma.userPrivacySettings.upsert({
      where: { userId: session.user.id },
      create: { userId: session.user.id },
      update: {},
    });
    return NextResponse.json({ settings });
  } catch (error) {
    const problem = toProblemJson(error);
    return NextResponse.json(problem, { status: problem.status });
  }
}
