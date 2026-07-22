import { NextResponse } from "next/server";
import { getSessionFromHeaders } from "@deepn/auth/server";
import { getUserWithPrivacySettings } from "@deepn/auth/server";
import { toProblemJson } from "@deepn/errors";

export async function GET(request: Request) {
  try {
    const session = await getSessionFromHeaders(request.headers);
    if (!session) return NextResponse.json({ authenticated: false }, { status: 401 });
    const user = await getUserWithPrivacySettings(session.user.id);
    return NextResponse.json({
      authenticated: true,
      session: { id: session.session.id, expiresAt: session.session.expiresAt },
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        onboardingCompletedAt: user.onboardingCompletedAt,
        timezone: user.timezone,
        locale: user.locale,
        privacySettings: user.privacySettings,
      },
    });
  } catch (error) {
    const problem = toProblemJson(error);
    return NextResponse.json(problem, { status: problem.status });
  }
}
