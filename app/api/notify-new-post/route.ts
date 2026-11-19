// app/api/notify-new-post/route.ts
// Copy this to your Next.js project as app/api/notify-new-post/route.ts
// Call this when you publish a new blog post

import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPA_URL || '',
  process.env.NEXT_PUBLIC_SUPA_KEY || ''
)

const FROM_EMAIL = 'newsletter@web3farmyard.com'
const SITE_URL = 'https://web3farmyard.com'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, slug, excerpt, featured_image } = body

    if (!title || !slug) {
      return NextResponse.json(
        { error: 'Title and slug required' },
        { status: 400 }
      )
    }

    // Get all active subscribers
    const { data: subscribers } = await supabase
      .from('subscribers')
      .select('email, farmer_name')
      .eq('subscribed', true)

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json(
        { error: 'No active subscribers' },
        { status: 400 }
      )
    }

    const postUrl = `${SITE_URL}/blog/${slug}`
    const subject = `🌾 New Article: ${title}`

    // HTML email template
    const emailHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1a6b00 0%, #0f4600 100%); padding: 20px; border-radius: 10px; text-align: center;">
          <h1 style="color: white; margin: 0;">Web3Farmyard</h1>
          <p style="color: #c8ff00; margin: 10px 0;">New Article Published</p>
        </div>
        
        <div style="padding: 30px; background: white;">
          <h2 style="color: #1a6b00; margin-bottom: 15px;">${title}</h2>
          
          ${
            featured_image
              ? `<img src="${featured_image}" style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 10px; margin-bottom: 20px;" />`
              : ''
          }
          
          <p style="color: #333; font-size: 1.1em; line-height: 1.6;">
            ${excerpt || 'Check out our latest Web3 guide and ecosystem insights.'}
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${postUrl}" style="background: #1a6b00; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Read Full Article →
            </a>
          </div>
        </div>
        
        <div style="background: #f5f5f5; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0;">
          <h3 style="color: #1a6b00; margin-bottom: 15px;">🎁 Don't miss upcoming airdrops!</h3>
          <a href="${SITE_URL}/airdrops" style="color: #1a6b00; text-decoration: none; font-weight: bold;">
            View Active Airdrops →
          </a>
        </div>
        
        <div style="border-top: 1px solid #ddd; padding-top: 20px; margin-top: 20px; text-align: center; color: #999; font-size: 0.85em;">
          <p>
            <a href="${SITE_URL}" style="color: #1a6b00;">Web3Farmyard</a> |
            <a href="${SITE_URL}/blog" style="color: #1a6b00;">Blog</a> |
            <a href="${SITE_URL}/airdrops" style="color: #1a6b00;">Airdrops</a> |
            <a href="${SITE_URL}/toolkit" style="color: #1a6b00;">Toolkit</a>
          </p>
          <p>
            Follow us: 
            <a href="https://twitter.com/web3farmyard" style="color: #1a6b00;">Twitter</a> |
            <a href="https://tiktok.com/@web3farmyard" style="color: #1a6b00;">TikTok</a>
          </p>
          <p style="margin-top: 15px;">
            You're receiving this because you subscribed to Web3Farmyard newsletter.
            <a href="${SITE_URL}/unsubscribe" style="color: #1a6b00;">Unsubscribe</a>
          </p>
        </div>
      </div>
    `

    // Send to all subscribers
    let successCount = 0
    let failureCount = 0

    for (const subscriber of subscribers) {
      try {
        const response = await resend.emails.send({
          from: FROM_EMAIL,
          to: subscriber.email,
          subject,
          html: emailHTML,
        })

        if (!response.error) {
          successCount++
        } else {
          failureCount++
          console.error(`Failed to send to ${subscriber.email}:`, response.error)
        }
      } catch (err) {
        failureCount++
        console.error(`Error sending to ${subscriber.email}:`, err)
      }
    }

    // Log the notification
    await supabase.from('newsletter_sends').insert({
      subject,
      content: emailHTML,
      recipient_count: subscribers.length,
      sent_count: successCount,
      status: 'sent',
      sent_at: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      message: `Notified ${successCount} subscribers (${failureCount} failed)`,
      successCount,
      failureCount,
      totalSubscribers: subscribers.length,
    })
  } catch (err) {
    console.error('Notify post API error:', err)
    return NextResponse.json(
      { error: 'Failed to notify subscribers' },
      { status: 500 }
    )
  }
}
