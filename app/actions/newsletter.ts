
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

// Initialize clients (server-side only - keys are safe here)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPA_URL!,
  process.env.NEXT_PUBLIC_SUPA_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY!)

// Types
interface SubscribeResult {
  success: boolean
  message: string
  email?: string
}

// Security: Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length < 255
}

// Security: Validate farmer name
function sanitizeFarmerName(name: string): string {
  return name
    .trim()
    .substring(0, 100)
    .replace(/[<>]/g, '') // Remove potential HTML tags
}

// Main subscription action
export async function subscribeNewsletter(
  email: string,
  farmerName?: string
): Promise<SubscribeResult> {
  try {
    // Security: Validate inputs
    if (!email) {
      return { success: false, message: 'Email is required' }
    }

    const cleanEmail = email.trim().toLowerCase()

    if (!isValidEmail(cleanEmail)) {
      return { success: false, message: 'Please enter a valid email' }
    }

    if (farmerName && farmerName.trim().length > 100) {
      return { success: false, message: 'Farmer name is too long' }
    }

    // Check if already subscribed
    const { data: existing } = await supabase
      .from('subscribers')
      .select('id, subscribed, farmer_name')
      .eq('email', cleanEmail)
      .single()

    if (existing && existing.subscribed) {
      return { 
        success: false, 
        message: 'You are already subscribed! Check your email for the latest posts.' 
      }
    }

    // If exists but unsubscribed, reactivate
    if (existing && !existing.subscribed) {
      const { error: updateError } = await supabase
        .from('subscribers')
        .update({
          subscribed: true,
          subscribed_at: new Date().toISOString(),
          unsubscribed_at: null,
          farmer_name: farmerName ? sanitizeFarmerName(farmerName) : existing.farmer_name,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)

      if (updateError) throw updateError

      // Send welcome email for re-subscription
      await sendWelcomeEmail(cleanEmail, farmerName || existing.farmer_name)

      return {
        success: true,
        message: 'Welcome back! Check your email for a welcome message.',
        email: cleanEmail
      }
    }

    // New subscriber - insert into Supabase
    const { error: insertError } = await supabase
      .from('subscribers')
      .insert([
        {
          email: cleanEmail,
          farmer_name: farmerName ? sanitizeFarmerName(farmerName) : null,
          subscribed: true,
          subscribed_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])

    if (insertError) {
      // Check if it's a unique constraint error
      if (insertError.code === '23505') {
        return { 
          success: false, 
          message: 'This email is already subscribed.' 
        }
      }
      throw insertError
    }

    // Send welcome email via Resend
    await sendWelcomeEmail(cleanEmail, farmerName)

    return {
      success: true,
      message: 'Welcome to Web3Farmyard! Check your email for a welcome message.',
      email: cleanEmail
    }
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return {
      success: false,
      message: 'Something went wrong. Please try again later.'
    }
  }
}

// Send welcome email via Resend
async function sendWelcomeEmail(email: string, farmerName?: string | null) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn('Resend API key not configured')
      return
    }

    const displayName = farmerName || 'Farmer'

    await resend.emails.send({
      from: 'Web3Farmyard <noreply@web3farmyard.com>',
      to: email,
      subject: 'Welcome to Web3Farmyard, ' + displayName + '!',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: 'Space Mono', monospace; background: #f5f5f5; }
              .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; }
              h1 { color: #1a6b00; font-size: 28px; margin-bottom: 20px; }
              p { color: #333; line-height: 1.6; margin-bottom: 15px; }
              .cta { background: #1a6b00; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0; }
              .footer { border-top: 1px solid #e0e0e0; padding-top: 20px; margin-top: 30px; color: #999; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Welcome to Web3Farmyard, ${displayName}! 🌾</h1>
              
              <p>You're now part of a growing community of farmers learning DeFi, discovering airdrops, and building wealth on-chain.</p>
              
              <h2 style="color: #0a0a0a; font-size: 18px; margin-top: 30px;">Here's what you get:</h2>
              <ul>
                <li>Weekly airdrop alerts & opportunities</li>
                <li>DeFi strategies from experienced farmers</li>
                <li>Live chain metrics & yield updates</li>
                <li>Community insights & risk analysis</li>
              </ul>
              
              <p><strong>Start your journey:</strong></p>
              <a href="https://web3farmyard.com/onboarding/day-1" class="cta">Begin 7-Day Learning Path →</a>
              
              <p>Or explore:</p>
              <ul>
                <li><a href="https://web3farmyard.com/airdrops" style="color: #1a6b00;">View Active Airdrops</a></li>
                <li><a href="https://web3farmyard.com/showroom" style="color: #1a6b00;">Live DeFi Metrics</a></li>
                <li><a href="https://web3farmyard.com/blog" style="color: #1a6b00;">Read Blog Posts</a></li>
              </ul>
              
              <p>Questions? Reply to this email. We read everything.</p>
              
              <p>Happy farming,<br><strong>Web3Farmyard Team</strong></p>
              
              <div class="footer">
                <p>You're receiving this because you subscribed to Web3Farmyard newsletter.</p>
                <p><a href="https://web3farmyard.com/unsubscribe?email=${encodeURIComponent(email)}" style="color: #999;">Unsubscribe</a></p>
              </div>
            </div>
          </body>
        </html>
      `
    })
  } catch (error) {
    console.error('Error sending welcome email:', error)
    // Don't throw - email failure shouldn't block subscription
  }
}