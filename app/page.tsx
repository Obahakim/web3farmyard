import Link from 'next/link'
import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import NewsletterSignup from '@/components/NewsletterSignup'
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateWebPageSchema,
  generateCourseSchema,
} from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Web3Farmyard — Learn to Navigate Web3 in 7 Simple Steps',
  description: 'A beginner-friendly Web3 onboarding platform with seven clear steps, practical guides, DeFi rankings, airdrop information, and tools for exploring the ecosystem.',
  keywords: ['Web3', 'beginner guides', 'DeFi', 'crypto education', 'blockchain', 'airdrops', 'wallet safety'],
  openGraph: {
    title: 'Web3Farmyard — Learn to Navigate Web3 in 7 Simple Steps',
    description: 'Start with the Web3 basics, explore market data, and find clear guides for your next step.',
    url: 'https://web3farmyard.com',
    siteName: 'Web3Farmyard',
    images: [{
      url: 'https://web3farmyard.com/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Learn to navigate Web3 with Web3Farmyard',
    }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Web3Farmyard — Learn Web3 in 7 Simple Steps',
    description: 'Beginner-friendly lessons, practical guides, market data, and tools for exploring Web3.',
    images: ['https://web3farmyard.com/og-image.jpg'],
  },
  alternates: { canonical: 'https://web3farmyard.com' },
}

const learningPath = [
  { day: 1, title: 'Set up your wallet', description: 'Create a wallet and learn the basics of keeping it secure.' },
  { day: 2, title: 'Make your first swap', description: 'See how token swaps work and what to check before confirming.' },
  { day: 3, title: 'Explore blockchain bridges', description: 'Learn how assets move between different networks.' },
  { day: 4, title: 'Understand DeFi lending', description: 'Explore lending, supplying assets, and how interest works.' },
  { day: 5, title: 'Practice advanced DeFi', description: 'Build on swaps, bridges, and lending with more confidence.' },
  { day: 6, title: 'Try an on-chain quest', description: 'Follow a guided quest and understand on-chain activity.' },
  { day: 7, title: 'Plan your next steps', description: 'Review what you learned and keep exploring at your own pace.' },
]

function getSchemaMarkup() {
  const organizationSchema = generateOrganizationSchema()
  const websiteSchema = generateWebSiteSchema({
    url: 'https://web3farmyard.com',
    name: 'Web3Farmyard',
    description: 'A Web3 onboarding and information hub with beginner lessons, practical guides, market data, and tools.',
    publisherId: 'https://web3farmyard.com/#organization',
  })
  const courseSchema = generateCourseSchema({
    id: 'https://web3farmyard.com/#course',
    name: 'Learn to Navigate Web3 in 7 Simple Steps',
    description: 'A beginner-friendly path through wallet setup, token swaps, blockchain bridges, DeFi lending, on-chain quests, and next steps.',
    providerId: 'https://web3farmyard.com/#organization',
    authorName: 'Web3Farmyard Community',
    coursePrerequisites: 'No prerequisites. Beginner-friendly.',
    hasCourseInstance: [
      { name: 'Day 1: Set Up Your Wallet', url: 'https://web3farmyard.com/onboarding/day-1', duration: 'PT20M' },
      { name: 'Day 2: Make Your First Swap', url: 'https://web3farmyard.com/onboarding/day-2', duration: 'PT20M' },
      { name: 'Day 3: Explore Blockchain Bridges', url: 'https://web3farmyard.com/onboarding/day-3', duration: 'PT15M' },
      { name: 'Day 4: Understand DeFi Lending', url: 'https://web3farmyard.com/onboarding/day-4', duration: 'PT15M' },
      { name: 'Day 5: Practice Advanced DeFi', url: 'https://web3farmyard.com/onboarding/day-5', duration: 'PT25M' },
      { name: 'Day 6: Try an On-Chain Quest', url: 'https://web3farmyard.com/onboarding/day-6', duration: 'PT30M' },
      { name: 'Day 7: Plan Your Next Steps', url: 'https://web3farmyard.com/onboarding/day-7', duration: 'PT20M' },
    ],
    educationLevel: 'Beginner to Intermediate',
    inLanguage: 'en-US',
    isAccessibleForFree: true,
    aggregateRating: { ratingValue: 4.8, ratingCount: 247 },
  }, false)
  const webpageSchema = generateWebPageSchema({
    id: 'https://web3farmyard.com/#webpage',
    url: 'https://web3farmyard.com',
    name: 'Learn to Navigate Web3 in 7 Simple Steps — Web3Farmyard',
    description: 'A beginner-friendly Web3 onboarding platform and information hub.',
    isPartOfId: 'https://web3farmyard.com/#website',
    primaryImage: { url: 'https://web3farmyard.com/og-image.jpg', width: 1200, height: 630 },
    datePublished: '2024-01-01T00:00:00Z',
    dateModified: new Date().toISOString(),
    inLanguage: 'en-US',
  }, false)

  return {
    '@context': 'https://schema.org',
    '@graph': [organizationSchema, websiteSchema, courseSchema, webpageSchema],
  }
}

export default function HomePage() {
  const schemaMarkup = getSchemaMarkup()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />
      <Nav />

      <main className="home-page">
        <div className="home-shell">
          <section className="home-hero" aria-labelledby="home-title">
            <div className="home-hero-glow" aria-hidden="true" />
            <div className="home-hero-layout">
              <div className="home-hero-copy">
                <span className="home-eyebrow"><span /> YOUR WEB3 STARTING POINT</span>
                <h1 id="home-title">Learn to navigate <em>Web3</em> in 7 simple steps.</h1>
                <p>
                  A clear path through wallets, DeFi, and on-chain basics—plus the guides and
                  market data to help you keep exploring.
                </p>
                <div className="home-hero-actions">
                  <Link href="#join-now" className="home-primary-button">
                    Join Now <span aria-hidden="true">↗</span>
                  </Link>
                  <Link href="#learning-path" className="home-text-button">
                    Explore the 7 steps <span aria-hidden="true">↓</span>
                  </Link>
                </div>
                <div className="home-hero-note">
                  <span aria-hidden="true">✦</span> Beginner-friendly. Learn at your own pace.
                </div>
              </div>

              <nav className="home-floating-cards" aria-label="Explore Web3Farmyard">
                <div className="home-ranking-card">
                  <div className="home-card-heading">
                    <span>EXPLORE THE MARKETS</span>
                    <span className="home-card-live"><i /> DAILY DATA</span>
                  </div>
                  <Link href="/showroom/#rank-tvl" className="home-ranking-link">
                    <span className="home-ranking-icon">TVL</span>
                    <span><strong>DeFi chains by TVL</strong><small>Compare total value locked</small></span>
                    <span className="home-card-arrow" aria-hidden="true">↗</span>
                  </Link>
                  <Link href="/showroom/#rank-dex" className="home-ranking-link">
                    <span className="home-ranking-icon">DEX</span>
                    <span><strong>DEX volume · 24h</strong><small>See trading activity by chain</small></span>
                    <span className="home-card-arrow" aria-hidden="true">↗</span>
                  </Link>
                  <Link href="/showroom/#rank-nft" className="home-ranking-link">
                    <span className="home-ranking-icon">NFT</span>
                    <span><strong>NFT volume · 24h</strong><small>Explore NFT markets by chain</small></span>
                    <span className="home-card-arrow" aria-hidden="true">↗</span>
                  </Link>
                </div>

                <Link href="/blog/what-is-tvl-in-cryptocurrency-blockchain" className="home-float-card home-guide-card">
                  <span className="home-float-card-label">START WITH A GUIDE <span aria-hidden="true">↗</span></span>
                  <strong>What is TVL?</strong>
                  <small>A simple guide to a key DeFi metric.</small>
                </Link>
                <Link href="/blog/how-to-position-for-airdrops-in-2026" className="home-float-card home-guide-card">
                  <span className="home-float-card-label">WEB3 EXPLAINER <span aria-hidden="true">↗</span></span>
                  <strong>Explore airdrops</strong>
                  <small>Learn the basics and assess opportunities.</small>
                </Link>
                <Link href="/airdrops" className="home-float-card home-destination-card">
                  <span className="home-destination-icon">✳</span>
                  <span><strong>Airdrops</strong><small>Curated opportunities</small></span>
                  <span className="home-card-arrow" aria-hidden="true">↗</span>
                </Link>
                <Link href="/toolkit" className="home-float-card home-destination-card">
                  <span className="home-destination-icon">⌘</span>
                  <span><strong>Web3 Toolkit</strong><small>Useful tools and resources</small></span>
                  <span className="home-card-arrow" aria-hidden="true">↗</span>
                </Link>
              </nav>
            </div>
            <div className="home-hero-footer">
              <span>LEARN THE BASICS</span><i /> <span>EXPLORE THE ECOSYSTEM</span><i /> <span>MAKE INFORMED CHOICES</span>
            </div>
          </section>

          <section className="home-path-section" id="learning-path" aria-labelledby="path-title">
            <div className="home-section-heading">
              <span className="home-section-kicker">A SIMPLE PLACE TO START</span>
              <h2 id="path-title">Web3, one step at a time.</h2>
              <p>Seven short lessons to help you understand the tools and ideas behind Web3.</p>
            </div>
            <div className="home-step-grid">
              {learningPath.map(step => (
                <Link key={step.day} href={`/onboarding/day-${step.day}`} className="home-step-card">
                  <span className="home-step-number">0{step.day}</span>
                  <span className="home-step-day">DAY {step.day}</span>
                  <strong>{step.title}</strong>
                  <p>{step.description}</p>
                  <span className="home-step-arrow" aria-hidden="true">↗</span>
                </Link>
              ))}
            </div>
            <div className="home-section-action">
              <Link href="/onboarding/day-1" className="home-outline-button">
                Start with step one <span aria-hidden="true">→</span>
              </Link>
            </div>
          </section>

          <section className="home-hub-section" id="about" aria-labelledby="hub-title">
            <div className="home-section-heading">
              <span className="home-section-kicker">MORE THAN A LEARNING PATH</span>
              <h2 id="hub-title">One hub. Many ways to explore.</h2>
              <p>Find practical explainers, useful tools, market data, and context for the wider ecosystem.</p>
            </div>
            <div className="home-hub-grid">
              <Link href="/blog" className="home-hub-card">
                <span className="home-hub-icon">01</span><span className="home-hub-label">LEARN</span>
                <strong>Guides &amp; articles</strong><p>Clear explainers for Web3 concepts and tools.</p><span className="home-card-arrow" aria-hidden="true">↗</span>
              </Link>
              <Link href="/showroom" className="home-hub-card">
                <span className="home-hub-icon">02</span><span className="home-hub-label">COMPARE</span>
                <strong>Chain rankings</strong><p>Explore TVL, DEX volume, and NFT activity.</p><span className="home-card-arrow" aria-hidden="true">↗</span>
              </Link>
              <Link href="/airdrops" className="home-hub-card">
                <span className="home-hub-icon">03</span><span className="home-hub-label">DISCOVER</span>
                <strong>Airdrops</strong><p>Review curated opportunities and project details.</p><span className="home-card-arrow" aria-hidden="true">↗</span>
              </Link>
              <Link href="/toolkit" className="home-hub-card">
                <span className="home-hub-icon">04</span><span className="home-hub-label">USE</span>
                <strong>Web3 toolkit</strong><p>Find wallets, analytics, bridges, and safety tools.</p><span className="home-card-arrow" aria-hidden="true">↗</span>
              </Link>
            </div>
          </section>

          <div className="home-newsletter-wrap" id="join-now">
            <NewsletterSignup />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
