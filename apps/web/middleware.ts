import { NextResponse, type NextRequest } from "next/server";
import { requestIdHeader, securityHeaders } from "@deepn/security";

const protectedPrefixes = ["/dashboard", "/onboarding", "/settings"];
const authCookieNames = ["better-auth.session_token", "__Secure-better-auth.session_token"];

function hasAuthCookie(request: NextRequest): boolean {
  return authCookieNames.some((name) => Boolean(request.cookies.get(name)?.value));
}

export function middleware(request: NextRequest) {
  const requestId = request.headers.get(requestIdHeader) ?? crypto.randomUUID();
  const pathname = request.nextUrl.pathname;

  if (protectedPrefixes.some((prefix) => pathname.startsWith(prefix)) && !hasAuthCookie(request)) {
    const signInUrl = request.nextUrl.clone();
    signInUrl.pathname = "/sign-in";
    signInUrl.searchParams.set("callbackUrl", pathname);
    const redirect = NextResponse.redirect(signInUrl);
    redirect.headers.set(requestIdHeader, requestId);
    for (const [header, value] of Object.entries(securityHeaders)) redirect.headers.set(header, value);
    return redirect;
  }

  const response = NextResponse.next({ request: { headers: request.headers } });
  response.headers.set(requestIdHeader, requestId);
  for (const [header, value] of Object.entries(securityHeaders)) response.headers.set(header, value);
  return response;
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
