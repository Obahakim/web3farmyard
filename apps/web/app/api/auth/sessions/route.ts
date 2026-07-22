import { NextResponse } from "next/server";
import { revokeSessionSchema } from "@deepn/auth/schemas";
import { requireSession } from "@deepn/auth/server";
import { prisma } from "@deepn/database";
import { writeAuditLog } from "@deepn/audit";
import { AppError, toProblemJson } from "@deepn/errors";

export async function GET(request: Request) {
  try {
    const current = await requireSession(request.headers);
    const sessions = await prisma.session.findMany({
      where: { userId: current.user.id, expiresAt: { gt: new Date() } },
      orderBy: { updatedAt: "desc" },
      select: { id: true, expiresAt: true, createdAt: true, updatedAt: true, ipAddress: true, userAgent: true },
    });
    return NextResponse.json({ currentSessionId: current.session.id, sessions });
  } catch (error) {
    const problem = toProblemJson(error);
    return NextResponse.json(problem, { status: problem.status });
  }
}

export async function DELETE(request: Request) {
  try {
    const current = await requireSession(request.headers);
    const payload = revokeSessionSchema.parse(await request.json());
    if (payload.sessionId === current.session.id) {
      throw new AppError("BAD_REQUEST", "Use sign out to revoke the current session.");
    }
    const deleted = await prisma.session.deleteMany({ where: { id: payload.sessionId, userId: current.user.id } });
    if (deleted.count === 0) throw new AppError("NOT_FOUND", "Session not found.");
    await writeAuditLog({ userId: current.user.id, eventType: "SESSION_REVOKED", metadata: { resourceId: payload.sessionId, resourceType: "session" } });
    return NextResponse.json({ revoked: true });
  } catch (error) {
    const problem = toProblemJson(error);
    return NextResponse.json(problem, { status: problem.status });
  }
}
