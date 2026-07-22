import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import JunkyardClient from './JunkyardClient'
import { getJunkyard } from '@/lib/supabase'
import { SEED_PROJECTS, SEED_CHAINS } from '@/lib/junkyard-data'
import { generateJunkyardMetadata } from '@/lib/metadata'
import {
  generateFAQPageSchema,
  generateOrganizationSchema,
  generateWebPageSchema,
  generateWebSiteSchema,
} from '@/lib/schema'
import Link from 'next/link'

export const metadata: Metadata = generateJunkyardMetadata()

export default async function JunkyardPage() {
  const dbItems = await getJunkyard()
  const allItems = dbItems.length > 0
    ? [...dbItems, ...SEED_PROJECTS.filter(s => !dbItems.find((d: {name:string}) => d.name === s.name)), ...SEED_CHAINS.filter(s => !dbItems.find((d: {name:string}) => d.name === s.name))]
    : [...SEED_PROJECTS, ...SEED_CHAINS]

  // ✅ FAQPage schema for "How to Identify Scam Projects" section
  const faqSchema = generateFAQPageSchema([
    {
      question: 'How do I identify a scam crypto project before it rugs?',
      answer:
        'Check the team: if the developers are anonymous or have no track record, that is a major red flag. Verify the smart contract on Etherscan or equivalent — look for unverified code or suspicious patterns. Check the tokenomics: does the team hold a massive supply? Can they dump on you? Use tools like Token Sniffer or RugDoc to scan for honeypots. Look at the community: are they using high-pressure tactics or FOMO language? Legitimate projects explain their value prop clearly.',
    },
    {
      question: 'What are the most common rug pull warning signs?',
      answer:
        'Guaranteed returns or yields that seem too good (especially 10%+ APY from unknown protocols). Developers who are unnamed or refuse to show their identity. Token supply concentrated in founder wallets. Liquidity pool is small relative to market cap (easy to exit). Contract is not verified on the blockchain explorer. The whitepaper is vague or stolen from another project. The project launched during a bull run with zero working product. If you see these signs, run.',
    },
    {
      question: 'Should I trust projects backed by venture capital?',
      answer:
        'Venture backing is helpful but not a guarantee. Venture capitalists can be fooled or complicit. Luna, FTX, and Celsius all had major VC backing and still collapsed. However, VC backing does mean the project went through some due diligence. The key is: a VC backing does not replace your own research. Always assume VCs are looking for returns, not necessarily long-term safety. Do your own diligence regardless of backing.',
    },
  ])

  const junkyardSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      generateOrganizationSchema(),
      generateWebSiteSchema({
        url: 'https://www.web3farmyard.com/junkyard',
        name: 'The Crypto Graveyard — Web3Farmyard',
        description: 'A permanent archive of crypto rug pulls, exploits, Ponzi schemes, and failed projects.',
        publisherId: 'https://www.web3farmyard.com/#organization',
      }),
      generateWebPageSchema({
        id: 'https://www.web3farmyard.com/junkyard#webpage',
        url: 'https://www.web3farmyard.com/junkyard',
        name: 'The Crypto Graveyard — Every Major Rug Pull, Ponzi & Collapse',
        description: 'Explore a permanent record of crypto failures, scams, and collapse stories with lessons for Web3 farmers.',
        isPartOfId: 'https://www.web3farmyard.com/#website',
        primaryImage: { url: 'https://www.web3farmyard.com/og-junkyard.png', width: 1200, height: 630 },
        inLanguage: 'en-US',
      }, false),
      generateFAQPageSchema([
        {
          question: 'How do I identify a scam crypto project before it rugs?',
          answer:
            'Check the team: if the developers are anonymous or have no track record, that is a major red flag. Verify the smart contract on Etherscan or equivalent — look for unverified code or suspicious patterns. Check the tokenomics: does the team hold a massive supply? Can they dump on you? Use tools like Token Sniffer or RugDoc to scan for honeypots. Look at the community: are they using high-pressure tactics or FOMO language? Legitimate projects explain their value prop clearly.',
        },
        {
          question: 'What are the most common rug pull warning signs?',
          answer:
            'Guaranteed returns or yields that seem too good (especially 10%+ APY from unknown protocols). Developers who are unnamed or refuse to show their identity. Token supply concentrated in founder wallets. Liquidity pool is small relative to market cap (easy to exit). Contract is not verified on the blockchain explorer. The whitepaper is vague or stolen from another project. The project launched during a bull run with zero working product. If you see these signs, run.',
        },
        {
          question: 'Should I trust projects backed by venture capital?',
          answer:
            'Venture backing is helpful but not a guarantee. Venture capitalists can be fooled or complicit. Luna, FTX, and Celsius all had major VC backing and still collapsed. However, VC backing does mean the project went through some due diligence. The key is: a VC backing does not replace your own research. Always assume VCs are looking for returns, not necessarily long-term safety. Do your own diligence regardless of backing.',
        },
      ], false),
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(junkyardSchema) }}
      />

      <Nav />

      <div style={{ overflow: 'hidden', background: '#060606', padding: '7px 0', borderBottom: '3px solid #ff4d4d' }}>
        <div style={{ display: 'flex', animation: 'ticker 32s linear infinite', whiteSpace: 'nowrap' }}>
          {['RIP LUNA/UST', 'RIP FTX', 'RIP BITCONNECT', 'RIP SQUID GAME TOKEN', 'RIP SAFEMOON', 'RIP IRON FINANCE', 'RIP TERRA CLASSIC', 'THEY WARNED YOU', 'RIP LUNA/UST', 'RIP FTX', 'RIP BITCONNECT', 'RIP SQUID GAME TOKEN', 'RIP SAFEMOON', 'RIP IRON FINANCE'].map((t, i) => (
            <span key={i} className="font-mono text-[10px] tracking-[0.15em]" style={{ color: t.startsWith('RIP') ? '#cc0000' : '#555', paddingRight: 48 }}>
              {t}
            </span>
          ))}
        </div>
      </div>

      <main className="max-w-[1100px] mx-auto px-7">
        <section className="py-12 animate-fadeUp">
          <div className="font-mono text-[8px] tracking-[0.25em] mb-3 animate-flicker" style={{ color: '#cc0000' }}>
            ☠️ THE JUNKYARD
          </div>
          <h1 className="font-serif font-bold text-dark mb-4" style={{ fontSize: 'clamp(32px,5vw,58px)', lineHeight: 1.05, letterSpacing: '-0.03em' }}>
            They promised moonshots.
            <br />
            <span style={{ WebkitTextStroke: '1px #ff4d4d', color: 'transparent' }}>
              They delivered dust.
            </span>
          </h1>
          <p className="text-[15px] max-w-xl mb-6" style={{ color: '#555', lineHeight: 1.8 }}>
            A permanent record of crypto's worst failures. Rugs, ponzis, exploits, abandoned projects and dead chains. Preserved so history doesn't have to repeat itself — though it probably will.
          </p>
          <div className="glass p-4" style={{ background: '#0d0606', border: 'none', borderLeft: '3px solid #ff4d4d' }}>
            <p className="font-mono text-[10px]" style={{ color: '#5a2a2a', lineHeight: 1.8 }}>
              ⚠ <strong style={{ color: '#ff7a7a' }}>IMPORTANT:</strong> This page exists purely for historical record and education. None of these projects are listed as investments. If someone is trying to sell you a token from this list — run.
            </p>
          </div>
        </section>

        <section className="glass p-5 mb-8">
          <h2 className="font-serif font-bold text-dark mb-2 text-lg">The Crypto Graveyard</h2>
          <p className="text-sm" style={{ color: '#555', lineHeight: 1.8 }}>
            Explore documented crypto failures including <strong>rug pulls</strong>, <strong>Ponzi schemes</strong>, <strong>smart contract exploits</strong>, and <strong>collapsed ecosystems</strong>. Each entry includes its cause of death, peak values, and lessons learned.
          </p>
        </section>

        {/* ✅ Blog Links Section */}
        <section className="grid gap-4 md:grid-cols-1 mb-8">
          <Link
            href="/blog/how-to-identify-scam-projects-in-crypto"
            className="glass p-5 hover:bg-white/5 transition-all"
            style={{ borderLeft: '3px solid #ff4d4d' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-dark mb-2">📖 How to Identify Scam Projects in Crypto</h3>
                <p className="text-sm" style={{ color: '#555' }}>
                  Learn the red flags that separate legitimate projects from rug pulls and Ponzis. Essential reading before you invest.
                </p>
              </div>
              <div style={{ fontSize: 24, marginLeft: 12 }}>→</div>
            </div>
          </Link>
        </section>

        <JunkyardClient initialItems={allItems} />

        {/* ✅ FAQ Section — structured data will help with featured snippets */}
        <section className="mt-12 mb-12">
          <h2 className="font-serif text-xl font-bold text-dark mb-4">How to Identify Scam Projects in Crypto</h2>
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
            {[
              {
                title: 'Check the team',
                text: 'If the developers are anonymous or have no track record, that is a major red flag. Verify the smart contract on Etherscan — look for unverified code or suspicious patterns.',
              },
              {
                title: 'Analyze the tokenomics',
                text: 'Does the team hold a massive supply? Can they dump on you? Use tools like Token Sniffer or RugDoc to scan for honeypots. Check if the liquidity pool is locked.',
              },
              {
                title: 'Watch for pressure tactics',
                text: 'Legitimate projects explain their value clearly. Scams use FOMO ("LIMITED TIME!"), guaranteed returns, or celebrity endorsements. If it sounds too good to be true, it is.',
              },
            ].map(c => (
              <div key={c.title} className="glass p-5">
                <h3 className="font-bold text-dark mb-2" style={{ fontSize: 15 }}>
                  {c.title}
                </h3>
                <p className="text-[13px]" style={{ color: '#555', lineHeight: 1.7 }}>
                  {c.text}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}