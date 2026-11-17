import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { getAllChains } from '@/lib/defillama'
import { generateShowroomMetadata } from '@/lib/metadata'
import {
  generateDatasetSchema,
  generateOrganizationSchema,
  generateWebPageSchema,
  generateWebSiteSchema,
} from '@/lib/schema'
import ShowroomGrid from './ShowroomGrid'

export const metadata: Metadata = generateShowroomMetadata()

export default async function ShowroomPage() {
  const chains = await getAllChains()

  const datasetSchema = generateDatasetSchema({
    name: 'DeFi Chain TVL, DEX Volume, and NFT Volume Rankings',
    description: 'DeFi chains ranked by TVL, 24-hour DEX trading volume, and 24-hour NFT trading volume',
    url: 'https://www.web3farmyard.com/showroom',
    datePublished: new Date().toISOString().split('T')[0],
    dateModified: new Date().toISOString().split('T')[0],
    creator: 'Web3Farmyard',
    keywords: ['DeFi', 'TVL', 'DEX volume', 'NFT volume', 'blockchain rankings', 'chain metrics'],
  }, false)

  const showroomSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      generateOrganizationSchema(),
      generateWebSiteSchema({
        url: 'https://www.web3farmyard.com',
        name: 'Web3Farmyard',
        description: 'Track DeFi chains by TVL, 24-hour DEX volume, and 24-hour NFT trading volume.',
        publisherId: 'https://www.web3farmyard.com/#organization',
      }),
      generateWebPageSchema({
        id: 'https://www.web3farmyard.com/showroom#webpage',
        url: 'https://www.web3farmyard.com/showroom',
        name: 'DeFi Chain Rankings — Web3Farmyard',
        description: 'DeFi chains ranked by TVL, 24-hour DEX volume, and 24-hour NFT trading volume.',
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
          <span className="font-mono text-[10px] tracking-[0.15em]" style={{ color: '#1a6b00', paddingRight: 48 }}>
            DEFI LLAMA DATA · DAILY SNAPSHOT · TVL · 24H TVL CHANGE · 24H DEX VOLUME · 24H NFT VOLUME ·
          </span>
        </div>
      </div>

      <main className="max-w-[1100px] mx-auto px-7">
        {/* Hero Section */}
        <section className="py-12 animate-fadeUp">
          <div className="font-mono text-[8px] tracking-[0.25em] mb-3 inline-block px-3 py-[3px] rounded-full" style={{ background: '#0d1a00', color: '#c8ff00' }}>
            📊 DAILY CHAIN DATA
          </div>
          <h1 className="font-serif font-bold text-dark mb-3" style={{ fontSize: 'clamp(28px,5vw,52px)', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            Every chain. Every metric. Refreshed daily.
          </h1>
          <p className="text-sm max-w-lg mb-8" style={{ color: '#555', lineHeight: 1.8 }}>
            Explore DeFiLlama chains ranked by total value locked, 24-hour DEX volume, and 24-hour NFT trading volume. TVL change is also shown. Data is refreshed once daily.
          </p>

          {/* Stats Bar */}
          <div className="flex gap-4 flex-wrap mb-8">
            {[
              { label: 'CHAINS TRACKED', val: chains.length, color: '#1a6b00' },
              { label: 'RANKING MODES', val: '03', color: '#0a0a0a' },
              { label: 'UPDATE CADENCE', val: '24 HOURS', color: '#666' },
              { label: 'DATA SOURCE', val: 'DEFILLAMA', color: '#1a6b00' },
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

        <section className="glass p-6 mb-12">
          <h2 className="font-serif font-bold text-dark mb-6 text-lg">
            CHAIN RANKINGS
          </h2>
          <ShowroomGrid initialChains={chains} initialUpdatedAt={new Date().toISOString()} />
        </section>

        {/* About Section */}
        <section className="glass p-6 mb-12">
          <h2 className="font-serif text-xl font-bold text-dark mb-4">About This Data</h2>
          <p className="text-sm mb-4" style={{ color: '#555', lineHeight: 1.8 }}>
            <strong>Total Value Locked (TVL)</strong> measures the total amount of cryptocurrency deposited into DeFi protocols on a given blockchain. It is the primary metric used to assess the health and adoption of a blockchain ecosystem.
          </p>
          <p className="text-sm" style={{ color: '#555', lineHeight: 1.8 }}>
            This data is sourced from <strong>DeFiLlama</strong>, which tracks {chains.length} chains and thousands of protocols. TVL changes as users deposit and withdraw from lending protocols, liquidity pools, and yield aggregators. The Showroom snapshot is refreshed once daily.
          </p>
          <p className="text-sm mt-4" style={{ color: '#555', lineHeight: 1.8 }}>
            NFT-volume rankings include only chains for which DeFiLlama reports NFT trading data.
          </p>
        </section>
      </main>

      <Footer />
    </>
  )
}