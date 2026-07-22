import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSessionFromHeaders } from "@deepn/auth/server";

export default async function ProtectedLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getSessionFromHeaders(await headers());
  if (!session) redirect("/sign-in");
  return children;
}
