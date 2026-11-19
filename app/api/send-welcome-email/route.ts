// FILE: app/api/send-welcome-email/route.ts
// API ROUTE - Sends welcome email via Resend (keeps key secure)
// Called from client-side form

import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { email, farmerName } = await request.json()

    // Validate inputs
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Invalid email' },
        { status: 400 }
      )
    }

    if (typeof farmerName !== 'string' || farmerName.trim().length < 2 || farmerName.trim().length > 40) {
      return NextResponse.json(
        { error: 'Invalid username' },
        { status: 400 }
      )
    }
    const username = farmerName.trim().replace(/[\r\n]/g, '')
    const htmlEscapes: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }
    const safeUsername = username.replace(/[&<>"']/g, character => htmlEscapes[character])

    // Send email via Resend
    const response = await resend.emails.send({
      from: 'Web3Farmyard <noreply@web3farmyard.com>',
      to: email,
      subject: 'Welcome to Web3Farmyard, ' + username + '!',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: 'Space Mono', monospace; background: #f5f5f5; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
              h1 { color: #1a6b00; font-size: 28px; margin: 0 0 20px 0; }
              h2 { color: #0a0a0a; font-size: 18px; margin: 30px 0 15px 0; }
              p { color: #333; line-height: 1.6; margin: 0 0 15px 0; }
              ul { color: #333; line-height: 1.8; margin: 15px 0; padding-left: 20px; }
              li { margin-bottom: 10px; }
              .cta { display: inline-block; background: #1a6b00; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
              .cta:hover { background: #134f00; }
              .links { margin: 20px 0; }
              .links a { color: #1a6b00; text-decoration: none; font-weight: bold; display: block; margin: 8px 0; }
              .links a:hover { text-decoration: underline; }
              .footer { border-top: 1px solid #e0e0e0; padding-top: 20px; margin-top: 30px; color: #999; font-size: 12px; }
              .footer a { color: #999; text-decoration: none; }
              .footer a:hover { text-decoration: underline; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Welcome to Web3Farmyard, ${safeUsername}!</h1>
              
              <p>You're now part of a community exploring Web3 through beginner-friendly lessons, practical guides, and ecosystem insights.</p>
              
              <h2>Here's what you get:</h2>
              <ul>
                <li>New Web3 guides and explainers</li>
                <li>DeFi chain metrics and market snapshots</li>
                <li>Wallet and tool safety resources</li>
                <li>Curated ecosystem updates</li>
              </ul>
              
              <p><strong>Start your journey:</strong></p>
              <a href="https://web3farmyard.com/onboarding/day-1" class="cta">Begin 7-Day Learning Path →</a>
              
              <p>Or explore:</p>
              <div class="links">
                <a href="https://web3farmyard.com/airdrops">View Active Airdrops</a>
                <a href="https://web3farmyard.com/showroom">Live DeFi Metrics</a>
                <a href="https://web3farmyard.com/blog">Read Blog Posts</a>
              </div>
              
              <p>Questions? Reply to this email. We read everything.</p>
              
              <p>Happy exploring,<br><strong>Web3Farmyard Team</strong></p>
              
              <div class="footer">
                <p>You're receiving this because you subscribed to Web3Farmyard newsletter.</p>
                <p><a href="https://web3farmyard.com">Visit Web3Farmyard</a></p>
              </div>
            </div>
          </body>
        </html>
      `
    })

    return NextResponse.json(
{ success: true, message: 'Welcome email sent' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}