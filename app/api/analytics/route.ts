// app/api/analytics/route.ts
// Copy this to your Next.js project as app/api/analytics/route.ts

import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPA_URL || '',
      process.env.NEXT_PUBLIC_SUPA_KEY || ''
    )

    // Insert event into analytics table
    const { error } = await supabase
      .from('analytics_events')
      .insert({
        event_type: body.event_type,
        page: body.page,
        user_email: body.user_email,
        metadata: body.metadata,
        duration_ms: body.duration_ms,
        timestamp: new Date().toISOString(),
      })

    if (error) {
      console.error('Analytics insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Analytics API error:', err)
    return NextResponse.json({ error: 'Failed to track event' }, { status: 500 })
  }
}
