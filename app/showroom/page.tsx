import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { getAllChains, fmt, llamaLogo, toSlug } from '@/lib/defillama'
import { generateShowroomMetadata } from '@/lib/metadata'
import {
  generateDatasetSchema,
  generateOrganizationSchema,
  generateWebPageSchema,
  generateWebSiteSchema,
} from '@/lib/schema'
import ChainLogo from '@/components/ChainLogo'

export const metadata: Metadata = generateShowroomMetadata()

export default async function ShowroomPage() {
  const chains = await getAllChains()

  // ✅ Dataset schema for the live data page
  const datasetSchema = generateDatasetSchema({
    name: 'Web3 Blockchain TVL Rankings',
    description: '191+ blockchains ranked by total value locked with real-time DeFi metrics',
    url: 'https://www.web3farmyard.com/showroom',
    datePublished: new Date().toISOString().split('T')[0],
    dateModified: new Date().toISOString().split('T')[0],
    creator: 'Web3Farmyard',
    keywords: ['DeFi', 'TVL', 'blockchain rankings', 'chain metrics'],
  }, false)

  const showroomSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      generateOrganizationSchema(),
      generateWebSiteSchema({
        url: 'https://www.web3farmyard.com',
        name: 'Web3Farmyard',
        description: 'Track 191+ blockchains by live TVL, protocol counts, and DeFi metrics.',
        publisherId: 'https://www.web3farmyard.com/#organization',
      }),
      generateWebPageSchema({
        id: 'https://www.web3farmyard.com/showroom#webpage',
        url: 'https://www.web3farmyard.com/showroom',
        name: 'Live DeFi Chain Rankings — Web3Farmyard',
        description: 'Ranked blockchain TVL data with live DeFi metrics for 191+ chains.',
        isPartOfId: 'https://www.web3farmyard.com/#website',
        primaryImage: { url: 'https://www.web3farmyard.com/og-showroom.png', width: 1200, height: 630 },
        datePublished: new Date().toISOString().split('T')[0],
        dateModified: new Date().toISOString().split('T')[0],
        inLanguage: 'en-US',
      }, false),
      datasetSchema,
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(showroomSchema) }}
      />

      <Nav />

      {/* Ticker */}
      <div style={{ overflow: 'hidden', background: '#060606', padding: '7px 0', borderBottom: '3px solid #1a6b00' }}>
        <div style={{ display: 'flex', animation: 'ticker 40s linear infinite', whiteSpace: 'nowrap' }}>
          {chains
            .slice(0, 12)
            .map((c, i) => (
              <span
                key={i}
                className="font-mono text-[10px] tracking-[0.15em]"
                style={{ color: '#1a6b00', paddingRight: 48 }}
              >
                {c.name.toUpperCase()} ${fmt(c.tvl).replace('$', '')} · 
              </span>
            ))}
        </div>
      </div>

      <main className="max-w-[1100px] mx-auto px-7">
        {/* Hero Section */}
        <section className="py-12 animate-fadeUp">
          <div className="font-mono text-[8px] tracking-[0.25em] mb-3 inline-block px-3 py-[3px] rounded-full" style={{ background: '#0d1a00', color: '#c8ff00' }}>
            📊 LIVE CHAIN DATA
          </div>
          <h1 className="font-serif font-bold text-dark mb-3" style={{ fontSize: 'clamp(28px,5vw,52px)', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            Every chain. Every metric. Live.
          </h1>
          <p className="text-sm max-w-lg mb-8" style={{ color: '#555', lineHeight: 1.8 }}>
            Total value locked, protocol counts, 24h and 7d TVL changes across 191+ tracked blockchains. Data sourced from DeFiLlama and updated every 5 minutes.
          </p>

          {/* Stats Bar */}
          <div className="flex gap-4 flex-wrap mb-8">
            {[
              { label: 'TOTAL TVL', val: fmt(chains.reduce((sum, c) => sum + c.tvl, 0)), color: '#0a0a0a' },
              { label: 'CHAINS', val: chains.length, color: '#1a6b00' },
              { label: '#1 BY TVL', val: chains[0]?.name || 'Ethereum', color: '#1a6b00' },
              { label: 'LAST UPDATE', val: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), color: '#666' },
            ].map(s => (
              <div key={s.label} className="glass px-4 py-3">
                <div className="font-mono text-[7px] tracking-[0.12em] mb-1" style={{ color: '#888' }}>
                  {s.label}
                </div>
                <div className="font-serif font-bold" style={{ color: s.color, fontSize: typeof s.val === 'number' ? 16 : 14 }}>
                  {s.val}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ✅ Blog Links Section */}
        <section className="grid gap-4 md:grid-cols-2 mb-8">
          <Link
            href="/blog/how-to-position-for-airdrops-in-2026"
            className="glass p-5 hover:bg-white/5 transition-all"
            style={{ borderLeft: '3px solid #1a6b00' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-dark mb-2">📖 How to Position for Airdrops in 2026</h3>
                <p className="text-sm" style={{ color: '#555' }}>
                  Learn the strategies to maximize your airdrop farming while minimizing risk.
                </p>
              </div>
              <div style={{ fontSize: 24, marginLeft: 12 }}>→</div>
            </div>
          </Link>
          <Link
            href="/blog/what-is-tvl-in-cryptocurrency-blockchain"
            className="glass p-5 hover:bg-white/5 transition-all"
            style={{ borderLeft: '3px solid #1a6b00' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-dark mb-2">📖 What is TVL? A Beginner's Guide</h3>
                <p className="text-sm" style={{ color: '#555' }}>
                  Understand the #1 metric for tracking DeFi health and blockchain adoption.
                </p>
              </div>
              <div style={{ fontSize: 24, marginLeft: 12 }}>→</div>
            </div>
          </Link>
        </section>

        {/* Chain Rankings Table */}
        <section className="glass p-6 mb-12">
          <h2 className="font-serif font-bold text-dark mb-6 text-lg">
            RANKED BY TOTAL VALUE LOCKED — {chains.length} CHAINS
          </h2>

          <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {chains.map((chain, i) => {
              const rank = i + 1
              const slug = toSlug(chain.name)

              return (
                <Link
                  key={chain.name}
                  href={`/showroom/${slug}`}
                  className="glass p-4 hover:bg-white/5 transition-all cursor-pointer"
                  style={{ borderLeft: rank <= 10 ? '3px solid #1a6b00' : '3px solid #ddd' }}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="font-mono font-bold text-dark" style={{ minWidth: 30 }}>
                      #{rank}
                    </div>
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center" style={{ background: '#f0f0f0', flexShrink: 0 }}>
                      <ChainLogo src={`https://icons.llama.fi/${slug}.jpg`} alt={chain.name} size={40} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-mono font-bold text-dark text-sm">{chain.name}</div>
                    </div>
                  </div>

                  <div className="font-serif font-bold text-dark text-lg mb-2">{fmt(chain.tvl)}</div>
                  {chain.change_7d !== null && (
                    <div style={{ fontSize: 12, color: chain.change_7d > 0 ? '#1a6b00' : '#cc0000' }}>
                      {chain.change_7d > 0 ? '↑' : '↓'} {Math.abs(chain.change_7d).toFixed(2)}% (7d)
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        </section>

        {/* About Section */}
        <section className="glass p-6 mb-12">
          <h2 className="font-serif text-xl font-bold text-dark mb-4">About This Data</h2>
          <p className="text-sm mb-4" style={{ color: '#555', lineHeight: 1.8 }}>
            <strong>Total Value Locked (TVL)</strong> measures the total amount of cryptocurrency deposited into DeFi protocols on a given blockchain. It is the primary metric used to assess the health and adoption of a blockchain ecosystem.
          </p>
          <p className="text-sm" style={{ color: '#555', lineHeight: 1.8 }}>
            This data is sourced from <strong>DeFiLlama</strong>, the largest DeFi data aggregator, which tracks over {chains.length} chains and thousands of protocols. TVL changes daily as users deposit and withdraw from lending protocols, liquidity pools, and yield aggregators. A rising TVL indicates growing user confidence and capital inflows into the ecosystem.
          </p>
        </section>
      </main>

      <Footer />
    </>
  )
}