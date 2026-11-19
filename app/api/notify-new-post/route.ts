import { NextResponse } from 'next/server'

// Email delivery now runs through the authenticated Hostinger PHP proxy.
// This route is deliberately disabled to prevent unauthenticated email relay
// and bulk-mail abuse if the project is deployed on a Next.js server.
export async function POST() {
  return NextResponse.json(
    { error: 'This endpoint is disabled. Use the Web3Farmyard server-side API proxy.' },
    { status: 410 }
  )
}
