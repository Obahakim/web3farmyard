// FILE: app/api/send-welcome-email/route.ts
// ✅ FIXED: Proper type handling for Resend API response

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { email, farmerName } = await request.json()

    if (!email || !farmerName) {
      return Response.json(
        { error: 'Email and farmer name are required' },
        { status: 400 }
      )
    }

    // Send welcome email via Resend
    const response = await resend.emails.send({
      from: 'Web3Farmyard <onboarding@web3farmyard.com>',
      to: email,
      subject: `Welcome to Web3Farmyard, ${farmerName}! 🌾 Your Airdrop Farming Begins Now`,
      html: generateWelcomeEmailHTML(farmerName),
    })

    // ✅ FIXED: Check if response has error, not data.id
    if (response.error) {
      console.error('Resend error:', response.error)
      return Response.json(
        { error: 'Failed to send email', details: response.error },
        { status: 500 }
      )
    }

    return Response.json(
      {
        success: true,
        message: 'Welcome email sent successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Resend error:', error)
    return Response.json(
      { error: 'Failed to send email', details: String(error) },
      { status: 500 }
    )
  }
}

// ✅ PROFESSIONAL WELCOME EMAIL WITH ECOSYSTEM DESCRIPTION
function generateWelcomeEmailHTML(farmerName: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #333; line-height: 1.6; }
        .container { max-width: 650px; margin: 0 auto; background: #f9f9f9; padding: 0; border-radius: 12px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #1a6b00 0%, #0f4600 100%); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
        .header p { margin: 10px 0 0 0; opacity: 0.95; font-size: 16px; }
        .content { padding: 40px 30px; }
        .section { margin-bottom: 30px; }
        .section h2 { color: #1a6b00; margin: 0 0 15px 0; font-size: 20px; font-weight: 600; }
        .section p { margin: 0 0 10px 0; color: #555; }
        .page-card { background: white; border: 2px solid #e8f0e0; border-radius: 8px; padding: 18px; margin-bottom: 12px; }
        .page-card h3 { color: #1a6b00; margin: 0 0 8px 0; font-size: 16px; font-weight: 600; display: flex; align-items: center; gap: 8px; }
        .page-card p { margin: 0; color: #666; font-size: 14px; }
        .icon { font-size: 20px; }
        .funnel { background: #f0f8e8; border-left: 4px solid #1a6b00; padding: 18px; border-radius: 6px; margin: 20px 0; }
        .funnel h3 { color: #1a6b00; margin: 0 0 12px 0; }
        .step { display: flex; gap: 12px; margin-bottom: 12px; font-size: 14px; }
        .step-num { background: #1a6b00; color: white; width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-weight: bold; }
        .step-text { flex: 1; color: #555; }
        .cta-button { display: inline-block; background: #1a6b00; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; margin: 20px 0; }
        .cta-button:hover { background: #0f4600; }
        .highlight { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 6px; margin: 15px 0; }
        .highlight strong { color: #856404; }
        .footer { background: #f5f5f5; padding: 30px; text-align: center; font-size: 13px; color: #888; border-top: 1px solid #ddd; }
        .footer a { color: #1a6b00; text-decoration: none; }
        .divider { height: 1px; background: #e0e0e0; margin: 25px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        
        <!-- Header -->
        <div class="header">
          <h1>🌾 Welcome to Web3Farmyard, ${farmerName}!</h1>
          <p>You've just joined the fastest path to profitable airdrop farming</p>
        </div>

        <!-- Main Content -->
        <div class="content">
          
          <div class="section">
            <p style="font-size: 16px; color: #333;">
              <strong>You're about to discover something most crypto beginners never find:</strong> A structured ecosystem where learning, task farming, and airdrops aren't separate activities—they're one continuous journey.
            </p>
          </div>

          <!-- The Ecosystem -->
          <div class="section">
            <h2>🗺️ Your Web3Farmyard Ecosystem</h2>
            <p style="margin-bottom: 20px; color: #666;">
              Web3Farmyard isn't just a website. It's a complete ecosystem designed to take you from zero Web3 knowledge to profitable airdrop farmer in 7 days. Here's what you're now part of:
            </p>

            <!-- 7-Day Onboarding -->
            <div class="page-card">
              <h3><span class="icon">📚</span> 7-Day Structured Onboarding</h3>
              <p><strong>/onboarding</strong> — Your step-by-step path:</p>
              <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #666; font-size: 14px;">
                <li><strong>Day 1:</strong> Create your first wallet, claim testnet ETH (no real money)</li>
                <li><strong>Day 2:</strong> Execute real swaps, bridges, and lending transactions</li>
                <li><strong>Day 3:</strong> Join TaskOn and start farming rewards (XP + tokens)</li>
                <li><strong>Day 4:</strong> Complete Zealy quests to build on-chain reputation</li>
                <li><strong>Day 5:</strong> Get Galxe credentials and network on Web3 socials</li>
                <li><strong>Day 6:</strong> Practice advanced strategies and deepen your knowledge</li>
                <li><strong>Day 7:</strong> Graduate and claim your first real airdrop</li>
              </ul>
            </div>

            <!-- Live Airdrops -->
            <div class="page-card">
              <h3><span class="icon">🎁</span> Live Airdrop Tracker</h3>
              <p><strong>/airdrops</strong> — Real-time opportunities, risk-rated:</p>
              <p>After Day 7, you'll use this page constantly. We track active airdrops, verify legitimacy, flag scams, and show you exactly what tasks to complete. No guessing. No wasted time on dead projects.</p>
            </div>

            <!-- DeFi Showroom -->
            <div class="page-card">
              <h3><span class="icon">📊</span> Live DeFi Chain Rankings</h3>
              <p><strong>/showroom</strong> — Real-time metrics for 191+ blockchains:</p>
              <p>Track TVL, protocol counts, 24h changes. Understand which chains are growing (good airdrop opportunities) vs declining (avoid). This is professional-grade data most beginners never see.</p>
            </div>

            <!-- Web3 Toolkit -->
            <div class="page-card">
              <h3><span class="icon">🛠️</span> Complete Web3 Toolkit</h3>
              <p><strong>/toolkit</strong> — 30+ essential tools for farmers:</p>
              <p>MetaMask, OKX Web3, Zerion, Galxe, Zealy, TaskOn, Uniswap, Aave, and more. Each tool links to its setup guide. No trial-and-error. Just go through your checklist.</p>
            </div>

            <!-- Educational Blog -->
            <div class="page-card">
              <h3><span class="icon">📖</span> Educational Blog</h3>
              <p><strong>/blog</strong> — Deep dives on crypto security and airdrop strategy:</p>
              <p>Articles on wallet security, identifying scams, understanding smart contracts, and airdrop farming tactics. Read while you eat breakfast. Become an expert while others are still confused.</p>
            </div>

            <!-- Crypto Graveyard -->
            <div class="page-card">
              <h3><span class="icon">☠️</span> The Crypto Graveyard</h3>
              <p><strong>/junkyard</strong> — Learn from 70+ major crypto failures:</p>
              <p>Luna, FTX, BitConnect, Celsius... We document every major rug pull and collapse. Learn what went wrong, how to spot the warning signs, and never lose money to obvious scams again.</p>
            </div>
          </div>

          <!-- The Funnel -->
          <div class="funnel">
            <h3>🎯 Your 7-Day Learning Funnel</h3>
            <div class="step">
              <div class="step-num">1</div>
              <div class="step-text"><strong>Day 1:</strong> Set up wallet, understand blockchain basics (testnet practice)</div>
            </div>
            <div class="step">
              <div class="step-num">2</div>
              <div class="step-text"><strong>Days 2-6:</strong> Complete on-chain transactions (swaps, bridges, lending) + task farming on TaskOn, Zealy, Galxe</div>
            </div>
            <div class="step">
              <div class="step-num">3</div>
              <div class="step-text"><strong>Day 7:</strong> You now have a real on-chain footprint + reputation. Ready for airdrops.</div>
            </div>
            <div class="step">
              <div class="step-num">4</div>
              <div class="step-text"><strong>Week 2+:</strong> Claim verified airdrops from /airdrops page. Keep building. Scale up.</div>
            </div>
          </div>

          <!-- Key Advantage -->
          <div class="highlight">
            <strong>🔑 The Real Advantage:</strong> Most people jump straight to airdrop hunting. They get rugged. They panic. We make you do 7 days of real work first so you understand what you're doing and have actual on-chain credentials. That's why our farmers succeed.
          </div>

          <!-- How to Navigate -->
          <div class="section">
            <h2>📍 How to Navigate Web3Farmyard</h2>
            <p><strong>Start here (you are at step 1):</strong></p>
            <ol style="color: #666; margin: 12px 0;">
              <li>Click "Start Day 1" to begin your onboarding journey</li>
              <li>Complete all 7 days (should take 2-3 hours per day max)</li>
              <li>Once Day 7 is done, your profile automatically unlocks access to the /airdrops page</li>
              <li>Start claiming. Keep learning. Scale up.</li>
            </ol>
            <p style="color: #999; font-size: 14px; margin-top: 15px;">
              💡 <strong>Tip:</strong> Join our Discord and Twitter (@web3farmyard) to ask questions, share wins, and stay updated on new airdrops and strategies.
            </p>
          </div>

          <!-- Call to Action -->
          <div style="text-align: center;">
            <a href="https://www.web3farmyard.com/onboarding/day-1" class="cta-button">Start Day 1 Now →</a>
          </div>

          <!-- What's Coming -->
          <div class="section">
            <h2>📬 What You'll Get From Us</h2>
            <p>Every week, you'll receive curated updates including:</p>
            <ul style="color: #666; margin: 12px 0;">
              <li>✓ New verified airdrops (with risk ratings)</li>
              <li>✓ Advanced farming strategies (for experienced farmers)</li>
              <li>✓ Scam alerts (we catch and flag them before you fall for them)</li>
              <li>✓ Tool updates and integrations</li>
              <li>✓ Community wins and shared experiences</li>
            </ul>
          </div>

          <!-- Final Message -->
          <div class="section">
            <p style="color: #1a6b00; font-weight: 600; font-size: 16px;">
              One more thing: You're joining a community of builders and farmers who've committed to doing this the right way. No shortcuts. No FUD. Just solid execution.
            </p>
            <p style="color: #666; margin-top: 12px;">
              We're excited to have you here. Let's farm.
            </p>
            <p style="color: #999; font-size: 14px; margin-top: 20px;">
              — The Web3Farmyard Team 🌾
            </p>
          </div>

        </div>

        <!-- Footer -->
        <div class="footer">
          <p style="margin-bottom: 15px;">
            <a href="https://www.web3farmyard.com">Web3Farmyard.com</a> | 
            <a href="https://twitter.com/web3farmyard">Twitter (@web3farmyard)</a> | 
            <a href="https://discord.gg/web3farmyard">Discord</a> | 
            <a href="https://t.me/web3farmyard">Telegram</a>
          </p>
          <p style="margin: 15px 0;">
            You're receiving this because you signed up at Web3Farmyard.
          </p>
          <p style="color: #ccc; margin: 0;">
            © 2024 Web3Farmyard. Not financial advice. Always DYOR.
          </p>
        </div>

      </div>
    </body>
    </html>
  `
}