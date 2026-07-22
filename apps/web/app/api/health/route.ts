import { NextResponse } from "next/server";
import { getFeatureFlags } from "@deepn/feature-flags";

export async function GET() {
  return NextResponse.json({ status: "ok", service: "deepn-web", features: getFeatureFlags() });
}
