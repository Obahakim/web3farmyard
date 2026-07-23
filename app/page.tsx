// FILE: app/page.tsx
// HOMEPAGE - SEO Optimized with JSON-LD Schema

import Link from 'next/link'
import { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FloatingChat from '@/components/FloatingChat'
import NewsletterSignup from '@/components/NewsletterSignup'
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateWebPageSchema,
  generateCourseSchema,
} from '@/lib/schema'

// SEO Metadata
export const metadata: Metadata = {
  title: 'Web3Farmyard - Learn DeFi, Earn Airdrops, Master Web3 in 7 Days',
  description: 'Free 7-day structured course to master Web3 farming. Learn wallet creation, DeFi swaps, task farming, and airdrop hunting. No experience or money required.',
  keywords: ['web3', 'defi', 'airdrops', 'farming', 'cryptocurrency', 'blockchain', 'tutorial'],
  
  openGraph: {
    title: 'Web3Farmyard - Master Web3 in 7 Days',
    description: 'Free structured learning path through DeFi, task farming, and airdrops. Join thousands of farmers.',
    url: 'https://web3farmyard.com',
    siteName: 'Web3Farmyard',
    images: [
      {
        url: 'https://web3farmyard.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Web3Farmyard - Learn DeFi'
      }
    ],
    type: 'website'
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Web3Farmyard - Master Web3 in 7 Days',
    description: 'Free 7-day DeFi learning course. Learn farming, airdrops, and yield strategies.',
    images: ['https://web3farmyard.com/og-image.jpg']
  },

  alternates: {
    canonical: 'https://web3farmyard.com'
  }
}

// JSON-LD Schema Markup
function getSchemaMarkup() {
  const organizationSchema = generateOrganizationSchema()
  const websiteSchema = generateWebSiteSchema({
    url: 'https://web3farmyard.com',
    name: 'Web3Farmyard',
    description: 'Learn DeFi. Track yields. Catch airdrops. Farm smarter.',
    publisherId: 'https://web3farmyard.com/#organization',
  })
  const courseSchema = generateCourseSchema({
    id: 'https://web3farmyard.com/#course',
    name: 'Master Web3 in 7 Days',
    description: 'A structured 7-day learning path through wallet creation, DeFi trading, task farming, and airdrop hunting. No experience required.',
    providerId: 'https://web3farmyard.com/#organization',
    authorName: 'Web3Farmyard Community',
    coursePrerequisites: 'No prerequisites. Beginner-friendly.',
    hasCourseInstance: [
      { name: 'Day 1: Create Your Wallet', url: 'https://web3farmyard.com/onboarding/day-1', duration: 'PT20M' },
      { name: 'Day 2: First Token Swap', url: 'https://web3farmyard.com/onboarding/day-3', duration: 'PT20M' },
      { name: 'Day 3: Bridge Tokens', url: 'https://web3farmyard.com/onboarding/day-4', duration: 'PT15M' },
      { name: 'Day 4: Lend on DeFi', url: 'https://web3farmyard.com/onboarding/day-5', duration: 'PT15M' },
      { name: 'Day 5: Swaps & Bridges', url: 'https://web3farmyard.com/onboarding/day-2', duration: 'PT25M' },
      { name: 'Day 6: Practice', url: 'https://web3farmyard.com/onboarding/day-6', duration: 'PT30M' },
      { name: 'Day 7: Go Live', url: 'https://web3farmyard.com/onboarding/day-7', duration: 'PT20M' },
    ],
    educationLevel: 'Beginner to Intermediate',
    inLanguage: 'en-US',
    isAccessibleForFree: true,
    aggregateRating: { ratingValue: 4.8, ratingCount: 247 },
  }, false)

  const webpageSchema = generateWebPageSchema({
    id: 'https://web3farmyard.com/#webpage',
    url: 'https://web3farmyard.com',
    name: 'Web3Farmyard - Master Web3 in 7 Days',
    description: 'Learn DeFi, discover airdrops, and farm on-chain in just 7 days.',
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
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />

      <Nav />
      <main className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          
          {/* HERO SECTION */}
          <section className="mb-16 text-center">
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-[#0a0a0a] mb-6 leading-tight">
              Master Web3 in 7 Days
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
              No experience needed. No money required. A structured 7-day path through wallet creation, DeFi, task farming, and airdrops. Join thousands learning to farm on-chain.
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              <Link
                href="/onboarding/day-1"
                className="px-8 py-4 bg-[#1a6b00] hover:bg-[#134f00] text-white font-bold rounded-lg transition-all text-lg"
              >
                Start Day 1 →
              </Link>
              <Link
                href="/airdrops"
                className="px-8 py-4 border-2 border-[#00ffe0] text-[#00ffe0] font-bold rounded-lg hover:bg-[#00ffe0] hover:text-[#0a0a0a] transition-all text-lg"
              >
                View Airdrops
              </Link>
            </div>
            <div className="mt-6 flex justify-center">
              <Link
                href="/resources"
                className="inline-flex items-center gap-3 rounded-2xl border-2 border-[#1a6b00] bg-[#f0f8e8] px-6 py-4 text-[#0a0a0a] font-semibold hover:bg-white transition-all"
              >
                <span className="text-xl">📘</span>
                <span>Web3 on Mobile: Free Ebook</span>
              </Link>
            </div>
          </section>

          {/* 7-DAY PATH PREVIEW */}
          <section className="mb-16">
            <h2 className="font-serif text-3xl font-bold text-[#0a0a0a] mb-8 text-center">
              Your 7-Day Learning Path
            </h2>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
              {[
                { day: 1, title: 'Wallet', icon: '🔐' },
                { day: 2, title: 'Swap & Bridge', icon: '🌉' },
                { day: 3, title: 'Task Farming', icon: '📋' },
                { day: 4, title: 'Zealy', icon: '⚙️' },
                { day: 5, title: 'Galxe', icon: '🏆' },
                { day: 6, title: 'Practice', icon: '🎯' },
                { day: 7, title: 'Go Live', icon: '🚀' },
              ].map((d) => (
                <Link key={d.day} href={`/onboarding/day-${d.day}`}>
                  <div className="p-4 bg-gradient-to-br from-[#f0f8e8] to-white border-2 border-[#d0e8c0] rounded-lg hover:border-[#1a6b00] transition-all text-center cursor-pointer">
                    <div className="text-3xl mb-2" aria-label={d.title}>{d.icon}</div>
                    <div className="font-mono text-xs text-gray-600">DAY {d.day}</div>
                    <div className="font-bold text-sm text-[#0a0a0a] mt-1">{d.title}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* NEWSLETTER SIGNUP */}
          <section className="mb-16 max-w-2xl mx-auto">
            <NewsletterSignup />
            
          </section>

          {/* FEATURES */}
          <section className="mb-16">
            <h2 className="font-serif text-3xl font-bold text-[#0a0a0a] mb-8 text-center">
              Everything You Need
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link href="/airdrops">
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-[#00ffe0] transition-all cursor-pointer h-full">
                  <div className="text-4xl mb-4" aria-label="Airdrops">🎁</div>
                  <h3 className="font-bold text-[#0a0a0a] mb-2">Airdrops</h3>
                  <p className="text-sm text-gray-600">191+ chains, real-time data</p>
                </div>
              </Link>
              <Link href="/showroom">
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-[#00ffe0] transition-all cursor-pointer h-full">
                  <div className="text-4xl mb-4" aria-label="Showroom">📊</div>
                  <h3 className="font-bold text-[#0a0a0a] mb-2">Showroom</h3>
                  <p className="text-sm text-gray-600">Live TVL & metrics</p>
                </div>
              </Link>
              <Link href="/toolkit">
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-[#00ffe0] transition-all cursor-pointer h-full">
                  <div className="text-4xl mb-4" aria-label="Toolkit">🛠️</div>
                  <h3 className="font-bold text-[#0a0a0a] mb-2">Toolkit</h3>
                  <p className="text-sm text-gray-600">30+ Web3 tools</p>
                </div>
              </Link>
              <Link href="/blog">
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-[#00ffe0] transition-all cursor-pointer h-full">
                  <div className="text-4xl mb-4" aria-label="Blog">📚</div>
                  <h3 className="font-bold text-[#0a0a0a] mb-2">Blog</h3>
                  <p className="text-sm text-gray-600">Guides & analysis</p>
                </div>
              </Link>
            </div>
          </section>

          {/* CTA SECTION */}
          <section className="bg-gradient-to-r from-[#f0f8e8] to-white rounded-2xl p-12 border-2 border-[#d0e8c0] text-center">
            <h2 className="font-serif text-3xl font-bold text-[#0a0a0a] mb-4">
              Ready to Farm?
            </h2>
            <p className="text-gray-700 mb-6 text-lg max-w-2xl mx-auto">
              Join thousands of farmers learning Web3. Start with Day 1 or jump into Airdrops. Everything you need is here.
            </p>
            <Link
              href="/onboarding/day-1"
              className="inline-block px-8 py-4 bg-[#1a6b00] hover:bg-[#134f00] text-white font-bold rounded-lg transition-all text-lg"
            >
              Begin Your Journey →
            </Link>
          </section>

        </div>
      </main>

      {/* Floating Chat Button */}
      <FloatingChat />

      <Footer />
    </>
  )
}