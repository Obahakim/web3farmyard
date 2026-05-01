// app/api/send-newsletter/route.ts
// Copy this to your Next.js project as app/api/send-newsletter/route.ts

import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPA_URL || '',
  process.env.NEXT_PUBLIC_SUPA_KEY || ''
)

const FROM_EMAIL = 'newsletter@web3farmyard.com'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { subject, content, sendToAll = true, recipientEmails } = body

    if (!subject || !content) {
      return NextResponse.json(
        { error: 'Subject and content required' },
        { status: 400 }
      )
    }

    // Get subscriber emails
    let emails: string[] = []
    
    if (sendToAll) {
      const { data } = await supabase
        .from('subscribers')
        .select('email')
        .eq('subscribed', true)
      
      emails = data?.map((s: any) => s.email) || []
    } else {
      emails = recipientEmails || []
    }

    if (emails.length === 0) {
      return NextResponse.json(
        { error: 'No subscribers found' },
        { status: 400 }
      )
    }

    // Send newsletter via Resend
    let successCount = 0
    let failureCount = 0

    for (const email of emails) {
      try {
        const response = await resend.emails.send({
          from: FROM_EMAIL,
          to: email,
          subject,
          html: content,
        })

        if (response.error) {
          console.error(`Failed to send to ${email}:`, response.error)
          failureCount++
        } else {
          successCount++
        }
      } catch (err) {
        console.error(`Error sending to ${email}:`, err)
        failureCount++
      }
    }

    // Log newsletter send
    await supabase.from('newsletter_sends').insert({
      subject,
      content,
      recipient_count: emails.length,
      sent_count: successCount,
      status: 'sent',
      sent_at: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      message: `Sent to ${successCount} subscribers (${failureCount} failed)`,
      successCount,
      failureCount,
    })
  } catch (err) {
    console.error('Newsletter API error:', err)
    return NextResponse.json(
      { error: 'Failed to send newsletter' },
      { status: 500 }
    )
  }
}
