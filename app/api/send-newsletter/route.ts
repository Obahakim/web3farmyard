// FILE: app/api/send-newsletter/route.ts
// SEND NEWSLETTER - Bulk email to all subscribers via Resend

import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const resend = new Resend(process.env.RESEND_API_KEY!)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPA_URL!,
  process.env.NEXT_PUBLIC_SUPA_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { subject, content } = await request.json()

    // Validate inputs
    if (!subject || typeof subject !== 'string') {
      return NextResponse.json(
        { error: 'Invalid subject' },
        { status: 400 }
      )
    }

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Invalid content' },
        { status: 400 }
      )
    }

    // Get all subscribed users
    const { data: subscribers, error: fetchError } = await supabase
      .from('subscribers')
      .select('email, farmer_name')
      .eq('subscribed', true)

    if (fetchError) {
      throw fetchError
    }

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json(
        { successCount: 0, message: 'No subscribers to send to' },
        { status: 200 }
      )
    }

    // Send emails in batches (Resend has rate limits)
    let successCount = 0
    let failureCount = 0

    for (const subscriber of subscribers) {
      try {
        await resend.emails.send({
          from: 'Web3Farmyard <noreply@web3farmyard.com>',
          to: subscriber.email,
          subject: subject,
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <style>
                  body { font-family: 'Space Mono', monospace; background: #f5f5f5; margin: 0; padding: 0; }
                  .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
                  h1 { color: #1a6b00; font-size: 24px; margin: 0 0 20px 0; }
                  p { color: #333; line-height: 1.6; margin: 0 0 15px 0; }
                  .content { color: #333; line-height: 1.8; margin: 20px 0; }
                  .footer { border-top: 1px solid #e0e0e0; padding-top: 20px; margin-top: 30px; color: #999; font-size: 12px; }
                  .footer a { color: #999; text-decoration: none; }
                </style>
              </head>
              <body>
                <div class="container">
                  <h1>Hey ${subscriber.farmer_name || 'Web3 learner'}!</h1>
                  <div class="content">
                    ${content}
                  </div>
                  <div class="footer">
                    <p>You're receiving this because you subscribed to Web3Farmyard newsletter.</p>
                    <p><a href="https://web3farmyard.com">Visit Web3Farmyard</a></p>
                  </div>
                </div>
              </body>
            </html>
          `
        })

        // Update last_email_sent timestamp
        await supabase
          .from('subscribers')
          .update({ last_email_sent: new Date().toISOString() })
          .eq('email', subscriber.email)

        successCount++
      } catch (err) {
        console.error(`Failed to send to ${subscriber.email}:`, err)
        failureCount++
      }

      // Rate limiting - small delay between sends
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    return NextResponse.json(
      { 
        successCount, 
        failureCount,
        total: subscribers.length,
        message: `Sent to ${successCount} subscribers${failureCount > 0 ? `, ${failureCount} failed` : ''}`
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error sending newsletter:', error)
    return NextResponse.json(
      { error: 'Failed to send newsletter' },
      { status: 500 }
    )
  }
}