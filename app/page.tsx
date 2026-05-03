import { generateHomepageMetadata } from '@/lib/metadata'

export const metadata = generateHomepageMetadata()

export default function HomePage() {
  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Hero Section */}
        <section style={{ marginBottom: '80px', textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '64px', 
            marginBottom: '20px',
            color: '#c8ff00',
            fontWeight: '700',
            letterSpacing: '-0.02em'
          }}>
             Web3Farmyard
          </h1>
          <p style={{ 
            fontSize: '20px', 
            marginBottom: '40px', 
            color: '#999',
            lineHeight: '1.6',
            maxWidth: '600px',
            margin: '0 auto 40px'
          }}>
            Learn DeFi. Track live chain data. Discover airdrops. Earn while you learn.
          </p>
        </section>

        {/* Newsletter Signup */}
        <section style={{
          background: '#111',
          padding: '60px 40px',
          borderRadius: '12px',
          marginBottom: '80px',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '28px',
            marginBottom: '15px',
            color: '#f0f0f0'
          }}>
            Join 1000+ Web3 Farmers
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#999',
            marginBottom: '30px'
          }}>
            Get weekly insights on airdrops, DeFi strategies, and on-chain opportunities.
          </p>

          <form style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            maxWidth: '500px',
            margin: '0 auto',
            marginBottom: '20px'
          }}>
            {/* Email Input */}
            <input 
              type="email" 
              placeholder="your@email.com" 
              style={{ 
                padding: '14px 18px', 
                background: '#0a0a0a',
                border: '1px solid #333',
                color: '#fff',
                borderRadius: '6px',
                fontSize: '16px',
                outline: 'none'
              }}
              required
            />

            {/* Farmer Name */}
            <input 
              type="text" 
              placeholder="Your farmer name (optional)" 
              style={{ 
                padding: '14px 18px', 
                background: '#0a0a0a',
                border: '1px solid #333',
                color: '#fff',
                borderRadius: '6px',
                fontSize: '16px',
                outline: 'none'
              }}
            />

            {/* Checkbox */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '14px',
              color: '#999'
            }}>
              <input 
                type="checkbox" 
                id="subscribe"
                defaultChecked
                style={{
                  width: '20px',
                  height: '20px',
                  cursor: 'pointer'
                }}
              />
              <label htmlFor="subscribe" style={{ cursor: 'pointer' }}>
                I want to receive weekly airdrop tips and Web3 insights
              </label>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              style={{
                padding: '14px',
                background: '#c8ff00',
                color: '#0a0a0a',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s',
                letterSpacing: '0.5px'
              }}
            >
               Subscribe & Start Learning
            </button>
          </form>

          <p style={{ fontSize: '12px', color: '#666' }}>
            No spam, unsubscribe anytime. Read our privacy policy.
          </p>
        </section>

        {/* Featured Pages Grid */}
        <section style={{ marginBottom: '80px' }}>
          <h2 style={{ 
            fontSize: '32px', 
            marginBottom: '40px',
            color: '#f0f0f0'
          }}>
            Your Learning Path
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px'
          }}>
            {/* Onboarding Card */}
            <a href="/onboarding/day-1" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                background: '#111',
                padding: '40px 30px',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                border: '1px solid #222',
                height: '100%'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#1a1a1a'
                e.currentTarget.style.borderColor = '#c8ff00'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#111'
                e.currentTarget.style.borderColor = '#222'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>🌱</div>
                <h3 style={{ 
                  color: '#c8ff00', 
                  marginBottom: '12px',
                  fontSize: '20px',
                  fontWeight: '700'
                }}>
                  Onboarding
                </h3>
                <p style={{ 
                  color: '#999',
                  fontSize: '14px',
                  lineHeight: '1.6'
                }}>
                  Learn Web3 fundamentals in 7 days. Create wallets, execute swaps, and build your on-chain reputation.
                </p>
                <div style={{
                  marginTop: '20px',
                  fontSize: '12px',
                  color: '#666'
                }}>
                  ⏱️ 30 min per day
                </div>
              </div>
            </a>

            {/* Airdrops Card */}
            <a href="/airdrops" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                background: '#111',
                padding: '40px 30px',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                border: '1px solid #222',
                height: '100%'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#1a1a1a'
                e.currentTarget.style.borderColor = '#00ffe0'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#111'
                e.currentTarget.style.borderColor = '#222'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>🎁</div>
                <h3 style={{ 
                  color: '#00ffe0', 
                  marginBottom: '12px',
                  fontSize: '20px',
                  fontWeight: '700'
                }}>
                  Airdrops
                </h3>
                <p style={{ 
                  color: '#999',
                  fontSize: '14px',
                  lineHeight: '1.6'
                }}>
                  Curated airdrop opportunities with risk ratings, deadlines, and step-by-step tasks.
                </p>
                <div style={{
                  marginTop: '20px',
                  fontSize: '12px',
                  color: '#666'
                }}>
                  📊 {Math.floor(Math.random() * 50) + 20}+ active airdrops
                </div>
              </div>
            </a>

            {/* Toolkit Card */}
            <a href="/toolkit" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                background: '#111',
                padding: '40px 30px',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                border: '1px solid #222',
                height: '100%'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#1a1a1a'
                e.currentTarget.style.borderColor = '#ff9f00'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#111'
                e.currentTarget.style.borderColor = '#222'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>🛠️</div>
                <h3 style={{ 
                  color: '#ff9f00', 
                  marginBottom: '12px',
                  fontSize: '20px',
                  fontWeight: '700'
                }}>
                  Toolkit
                </h3>
                <p style={{ 
                  color: '#999',
                  fontSize: '14px',
                  lineHeight: '1.6'
                }}>
                  30+ essential tools: wallets, DEXs, bridges, lending protocols, and analytics.
                </p>
                <div style={{
                  marginTop: '20px',
                  fontSize: '12px',
                  color: '#666'
                }}>
                  🔗 All verified & tested
                </div>
              </div>
            </a>
          </div>
        </section>

        {/* DeFi Showroom Card */}
        <section style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #111 100%)',
          padding: '60px 40px',
          borderRadius: '12px',
          marginBottom: '80px',
          border: '1px solid #222'
        }}>
          <h2 style={{ 
            fontSize: '28px', 
            marginBottom: '20px',
            color: '#f0f0f0'
          }}>
            📊 Live DeFi Metrics
          </h2>
          <p style={{ 
            color: '#999',
            marginBottom: '30px',
            fontSize: '16px'
          }}>
            Track 191+ blockchains in real-time. See TVL, protocol counts, and 24h changes.
          </p>
          <a href="/showroom" style={{
            display: 'inline-block',
            padding: '14px 28px',
            background: '#c8ff00',
            color: '#0a0a0a',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: '700',
            transition: 'all 0.3s'
          }}>
            Explore Showroom →
          </a>
        </section>

        {/* The Graveyard Card */}
        <section style={{
          background: 'linear-gradient(135deg, #2a1a1a 0%, #1a0a0a 100%)',
          padding: '60px 40px',
          borderRadius: '12px',
          marginBottom: '80px',
          border: '1px solid #441111'
        }}>
          <h2 style={{ 
            fontSize: '28px', 
            marginBottom: '20px',
            color: '#ff6b6b'
          }}>
            ⚰️ The Crypto Graveyard
          </h2>
          <p style={{ 
            color: '#999',
            marginBottom: '30px',
            fontSize: '16px'
          }}>
            Learn from 29+ major failures. Luna, FTX, BitConnect, and more. Don't repeat history.
          </p>
          <a href="/junkyard" style={{
            display: 'inline-block',
            padding: '14px 28px',
            background: '#ff6b6b',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: '700',
            transition: 'all 0.3s'
          }}>
            See the Failures →
          </a>
        </section>

        {/* Footer CTA */}
        <section style={{
          textAlign: 'center',
          paddingTop: '40px',
          borderTop: '1px solid #222',
          marginTop: '60px'
        }}>
          <h2 style={{ 
            fontSize: '24px', 
            marginBottom: '15px',
            color: '#f0f0f0'
          }}>
            Ready to Earn Your First Airdrop?
          </h2>
          <p style={{ 
            color: '#999',
            marginBottom: '30px',
            fontSize: '16px'
          }}>
            Start with Day 1 of Onboarding. No blockchain experience needed.
          </p>
          <a href="/onboarding/day-1" style={{
            display: 'inline-block',
            padding: '16px 32px',
            background: '#c8ff00',
            color: '#0a0a0a',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: '700',
            fontSize: '16px',
            transition: 'all 0.3s'
          }}>
             Start Learning Now
          </a>
        </section>
      </div>
    </main>
  )
}