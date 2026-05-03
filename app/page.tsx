import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import NewsletterForm from '@/components/NewsletterForm'
import { getAllChains, fmt, fmtPct, llamaLogo, toSlug } from '@/lib/defillama'
import { SEED_PROJECTS } from '@/lib/junkyard-data'

export const metadata: Metadata = {
  title: 'Web3Farmyard — Live DeFi Data, Crypto Airdrops & Graveyard',
  description: 'Track live TVL across every blockchain, discover profitable crypto airdrops, and learn from the biggest failures in Web3 history.',
  keywords: [
    'DeFi',
    'airdrops',
    'TVL tracker',
    'blockchain data',
    'crypto farming',
    'Web3 learning',
  ],
  alternates: { canonical: 'https://www.web3farmyard.com/' },
  openGraph: {
    title: 'Web3Farmyard — Live DeFi Data & Airdrops',
    description: 'Track live TVL, discover airdrops, learn from failures.',
    url: 'https://www.web3farmyard.com/',
    type: 'website',
    images: [
      {
        url: 'https://www.web3farmyard.com/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
  },
}

export const revalidate = 3600

export default async function HomePage() {
  const chains = await getAllChains()
  const top5 = chains.slice(0, 5)
  const totalTvl = chains.reduce((s, c) => s + (c.tvl || 0), 0)
  
  const SCHEMA = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Web3Farmyard',
    url: 'https://www.web3farmyard.com',
    description: 'Live DeFi data, airdrops, and crypto graveyard',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <Nav />
      <main className="max-w-[1100px] mx-auto px-7">

        {/* HERO */}
        <section className="py-16 animate-fadeUp">
          <div
            className="font-mono text-[8px] tracking-[0.25em] mb-3"
            style={{ color: '#1a6b00' }}
          >
            DECENTRALIZED · LIVE · YOURS
          </div>
          <h1
            className="font-serif font-bold text-dark mb-4"
            style={{
              fontSize: 'clamp(36px,6vw,68px)',
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
            }}
          >
            The farmer&apos;s edge
            <br />
            <span
              style={{
                WebkitTextStroke: '1.5px #c8ff00',
                color: 'transparent',
              }}
            >
              in every cycle.
            </span>
          </h1>
          <p
            className="text-[15px] mb-8 max-w-[520px]"
            style={{ color: '#555', lineHeight: 1.8 }}
          >
            Live TVL across every blockchain. Curated airdrops. A permanent
            record of everything that failed — so you don&apos;t repeat it.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/airdrops" className="btn-primary">
              🌾 EXPLORE AIRDROPS
            </Link>
            <Link href="/showroom" className="btn-outline">
              📊 LIVE CHAIN DATA
            </Link>
          </div>
        </section>

        {/* LIVE STATS */}
        <section className="glass p-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              ['TOTAL TVL TRACKED', fmt(totalTvl), '#1a6b00'],
              ['CHAINS TRACKED', chains.length.toString(), '#0a0a0a'],
              ['TOP CHAIN', chains[0]?.name || '—', '#0a0a0a'],
              ['CONFIRMED DEAD', SEED_PROJECTS.length + '+ Projects', '#ff4d4d'],
            ].map(([label, val, color]) => (
              <div key={label}>
                <div
                  className="font-mono text-[8px] tracking-[0.12em] mb-1"
                  style={{ color: '#aaa' }}
                >
                  {label}
                </div>
                <div
                  className="font-serif text-2xl font-bold"
                  style={{ color }}
                >
                  {val}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* BENTO GRID */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link
            href="/airdrops"
            className="bento glass p-6 no-underline md:col-span-2 block hover:shadow-lg transition-shadow"
          >
            <div
              className="font-mono text-[8px] tracking-[0.18em] mb-3"
              style={{ color: '#1a6b00' }}
            >
              🌾 AIRDROPS
            </div>
            <div className="font-serif text-2xl font-bold text-dark mb-2">
              Curated Airdrop Listings
            </div>
            <p className="text-sm mb-4" style={{ color: '#666', lineHeight: 1.7 }}>
              Risk-rated, deadline-tracked, chain-filtered. Every airdrop
              reviewed.
            </p>
            <div
              className="font-mono text-[8px] font-bold"
              style={{ color: '#1a6b00' }}
            >
              VIEW LIVE AIRDROPS →
            </div>
          </Link>

          <Link
            href="/showroom"
            className="bento glass p-6 no-underline block hover:shadow-lg transition-shadow"
            style={{ background: '#0a0a0a' }}
          >
            <div
              className="font-mono text-[8px] tracking-[0.18em] mb-3"
              style={{ color: '#c8ff00' }}
            >
              📊 SHOWROOM
            </div>
            <div className="font-serif text-2xl font-bold mb-2" style={{ color: '#f0f0f0' }}>
              Live Chain Metrics
            </div>
            <p className="text-sm mb-4" style={{ color: '#888', lineHeight: 1.7 }}>
              TVL, protocol counts, 24h changes. Every major chain, live.
            </p>
            <div
              className="font-mono text-[8px] font-bold"
              style={{ color: '#c8ff00' }}
            >
              VIEW SHOWROOM →
            </div>
          </Link>

          <Link
            href="/junkyard"
            className="bento glass p-6 no-underline block hover:shadow-lg transition-shadow"
            style={{ background: '#0d0606' }}
          >
            <div
              className="font-mono text-[8px] tracking-[0.18em] mb-3"
              style={{ color: '#ff4d4d' }}
            >
              ☠️ JUNKYARD
            </div>
            <div className="font-serif text-2xl font-bold mb-2" style={{ color: '#f0f0f0' }}>
              The Crypto Graveyard
            </div>
            <p className="text-sm mb-4" style={{ color: '#777', lineHeight: 1.7 }}>
              Rugs, Ponzis, exploits. Documented so history doesn&apos;t repeat.
            </p>
            <div
              className="font-mono text-[8px] font-bold"
              style={{ color: '#ff4d4d' }}
            >
              ENTER GRAVEYARD →
            </div>
          </Link>

          <Link
            href="/resources/mobile-farmer"
            className="bento glass p-6 no-underline md:col-span-2 block hover:shadow-lg transition-shadow"
            style={{ background: 'linear-gradient(135deg,#0d1a00,#0a0a0a)' }}
          >
            <div
              className="font-mono text-[8px] tracking-[0.18em] mb-3"
              style={{ color: '#c8ff00' }}
            >
              📱 FREE EBOOK
            </div>
            <div className="font-serif text-2xl font-bold mb-2" style={{ color: '#f0f0f0' }}>
              The Mobile Farmer
            </div>
            <p className="text-sm mb-4" style={{ color: '#888', lineHeight: 1.7 }}>
              Farm airdrops on your phone. No desktop. No jargon. Free forever.
            </p>
            <div
              className="font-mono text-[8px] font-bold"
              style={{ color: '#c8ff00' }}
            >
              READ FREE →
            </div>
          </Link>
        </section>

        {/* TOP CHAINS */}
        {top5.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl font-bold text-dark">
                Top Chains by TVL
              </h2>
              <Link
                href="/showroom"
                className="font-mono text-[8px] font-bold no-underline hover:underline"
                style={{ color: '#1a6b00' }}
              >
                VIEW ALL {chains.length} →
              </Link>
            </div>
            <div className="glass overflow-hidden">
              {top5.map((chain, i) => (
                <Link
                  key={chain.name}
                  href={`/showroom/${toSlug(chain.name)}`}
                  className="flex items-center gap-4 no-underline transition-colors hover:bg-opacity-75"
                  style={{
                    padding: '14px 20px',
                    borderBottom:
                      i < 4 ? '1px solid rgba(0,0,0,0.05)' : 'none',
                  }}
                >
                  <span
                    className="font-mono text-[8px] w-5 text-right flex-shrink-0"
                    style={{ color: '#ccc' }}
                  >
                    #{i + 1}
                  </span>
                  <img
                    src={llamaLogo(chain.name)}
                    alt={chain.name}
                    width={28}
                    height={28}
                    className="rounded-full flex-shrink-0"
                    style={{ objectFit: 'cover' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-[10px] font-bold text-dark">
                      {chain.name}
                    </div>
                  </div>
                  <div
                    className="font-serif text-base font-bold"
                    style={{ color: '#1a6b00' }}
                  >
                    {fmt(chain.tvl)}
                  </div>
                  {chain.change_1d !== null && chain.change_1d !== undefined && (
                    <div
                      className="font-mono text-[9px] w-16 text-right flex-shrink-0"
                      style={{
                        color: chain.change_1d >= 0 ? '#1a6b00' : '#ff4d4d',
                      }}
                    >
                      {fmtPct(chain.change_1d)}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* NEWSLETTER */}
        <section className="glass p-8 mb-2">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div
                className="font-mono text-[8px] tracking-[0.2em] mb-2"
                style={{ color: '#1a6b00' }}
              >
                FREE NEWSLETTER
              </div>
              <h2 className="font-serif text-2xl font-bold text-dark mb-3">
                Stay ahead of the cycle.
              </h2>
              <p className="text-sm" style={{ color: '#666', lineHeight: 1.8 }}>
                Airdrop alerts, DeFi news, post-mortems. Signal, not noise. No
                ads. Ever.
              </p>
            </div>
            <NewsletterForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}