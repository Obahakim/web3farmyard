import { headers } from "next/headers";

export async function getRequestContext() {
  const h = await headers();
  return {
    headers: h,
    ip: h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip"),
    userAgent: h.get("user-agent"),
    requestId: h.get("x-request-id") ?? undefined,
  };
}
