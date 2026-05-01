import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

import { trackDownload } from '@/lib/analytics-complete'

const handleDownload = (filename: string) => {
  trackDownload(filename, 'pdf') // or 'guide', 'spreadsheet', etc.
}

export const metadata: Metadata = {
  title: 'The Mobile Farmer — Free Crypto Airdrop Ebook',
  description: 'Free ebook: How to Farm Crypto Airdrops on Your Phone. 8 chapters. No desktop required. No email needed. Download instantly from Web3Farmyard.',
  alternates: { canonical: 'https://www.web3farmyard.com/resources/mobile-farmer' },
  openGraph: { title: 'The Mobile Farmer — Free Crypto Airdrop Ebook', description: 'Farm airdrops using only a mobile phone. Free download.' },
}

const CHAPTERS = [
  ['01','Why Mobile Farming Works','Protocols don\'t care what device you\'re on. Here\'s how to exploit that.'],
  ['02','Setting Up Your Burner Arsenal','Multiple wallets, one phone. MetaMask Mobile, Rabby and Trust Wallet — safely.'],
  ['03','Reading a Legitimate Airdrop','The 6-point checklist before you interact with any project.'],
  ['04','Bridging on Mobile','Moving assets between chains on a phone without fees destroying you.'],
  ['05','Testnet Interactions','Why testnet activity leads to the biggest airdrops — and how to stack it.'],
  ['06','Tracking & Staying Organised','Spreadsheet templates, calendar alerts, and what to do when you miss a snapshot.'],
  ['07','Tax, Wallets & Staying Anonymous','Basic OPSEC and when to think about tax on airdrop rewards.'],
  ['08','The 30-Day Mobile Farming Plan','A day-by-day action plan to your first claimed airdrop.'],
]

export default function MobileFarmerPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: 'The Mobile Farmer: How to Farm Crypto Airdrops on Your Phone',
    author: { '@type': 'Organization', name: 'Web3Farmyard' },
    publisher: { '@type': 'Organization', name: 'Web3Farmyard', url: 'https://www.web3farmyard.com' },
    url: 'https://www.web3farmyard.com/resources/mobile-farmer',
    description: 'A free beginner guide to farming crypto airdrops using only a mobile phone.',
    inLanguage: 'en',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  }

  return (
    <>
      <Nav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main className="max-w-[1100px] mx-auto px-7 py-8">

        {/* Breadcrumb */}
        <nav className="mb-6 font-mono text-[9px]" aria-label="Breadcrumb">
          <ol className="flex gap-2 flex-wrap" style={{ listStyle:'none', color:'#999' }}>
            <li><Link href="/" className="no-underline" style={{ color:'#1a6b00' }}>Home</Link></li>
            <li>/</li>
            <li><Link href="/airdrops" className="no-underline" style={{ color:'#1a6b00' }}>Airdrops</Link></li>
            <li>/</li>
            <li>The Mobile Farmer</li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="grid md:grid-cols-2 gap-10 items-center mb-16 animate-fadeUp">
          {/* Book cover */}
          <div className="flex justify-center">
            <div style={{ width:260, background:'linear-gradient(145deg,#0a0a0a,#1a2a00)', borderRadius:'12px 20px 20px 12px', padding:'40px 32px', boxShadow:'8px 8px 40px rgba(0,0,0,0.25)', position:'relative', textAlign:'center' }}>
              <div style={{ position:'absolute', left:0, top:0, bottom:0, width:12, background:'linear-gradient(90deg,#c8ff00,#1a6b00)', borderRadius:'12px 0 0 12px' }} />
              <div className="font-mono text-[8px] tracking-[0.2em] mb-5" style={{ color:'#c8ff00' }}>WEB3FARMYARD.COM</div>
              <div style={{ fontSize:52, marginBottom:16 }}>📱</div>
              <div className="font-serif font-bold" style={{ fontSize:20, color:'#fff', lineHeight:1.3, marginBottom:8 }}>The Mobile Farmer</div>
              <div className="font-mono text-[9px]" style={{ color:'#c8ff00', lineHeight:1.5, marginBottom:20 }}>How to Farm Crypto Airdrops on Your Phone</div>
              <div className="font-mono text-[8px]" style={{ color:'#555' }}>BY WEB3FARMYARD</div>
            </div>
          </div>

          <div>
            <div className="font-mono text-[8px] tracking-[0.2em] mb-3" style={{ color:'#1a6b00' }}>FREE EBOOK · INSTANT DOWNLOAD</div>
            <h1 className="font-serif font-bold text-dark mb-4" style={{ fontSize:'clamp(24px,4vw,38px)', lineHeight:1.2, letterSpacing:'-0.02em' }}>
              The Mobile Farmer: How to Farm Crypto Airdrops on Your Phone
            </h1>
            <p className="text-[15px] mb-6" style={{ color:'#555', lineHeight:1.8 }}>
              You don't need a desktop. You don't need thousands in capital. You need a phone, a strategy, and a burner wallet. This guide covers everything from your first testnet transaction to spotting which airdrops are worth your time.
            </p>
            <div className="flex gap-2 flex-wrap mb-6">
              {['✓ Beginner friendly','✓ Mobile-first','✓ No jargon'].map(t => (
                <span key={t} className="font-mono text-[9px] px-3 py-[4px] rounded-full" style={{ background:'#dcfce7', color:'#166534' }}>{t}</span>
              ))}
            </div>
            <div className="flex gap-3 flex-wrap">
              <a href="/uploads/mobile-farmer-web3farmyard.pdf" download className="btn-primary">📖 DOWNLOAD FREE PDF</a>
              <Link href="/airdrops" className="btn-outline">🌾 VIEW LIVE AIRDROPS</Link>
            </div>
          </div>
        </section>

        {/* Chapters */}
        <section className="mb-12">
          <h2 className="font-serif text-2xl font-bold text-dark mb-4">What You Will Learn</h2>
          <p className="text-sm mb-6 max-w-xl" style={{ color:'#666', lineHeight:1.7 }}>Every chapter is written for someone who has never touched DeFi. By the end you will be farming like someone who has been doing this for years.</p>
          <div className="grid gap-3" style={{ gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))' }}>
            {CHAPTERS.map(([num, title, desc]) => (
              <div key={num} className="glass p-5">
                <div className="font-mono text-[8px] tracking-[0.15em] mb-2" style={{ color:'#1a6b00' }}>CHAPTER {num}</div>
                <div className="font-serif font-bold text-dark mb-2" style={{ fontSize:15 }}>{title}</div>
                <p className="text-[12px]" style={{ color:'#666', lineHeight:1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Who it's for */}
        <section className="glass p-8 mb-12">
          <h2 className="font-serif text-xl font-bold text-dark mb-4">Who This Is For</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="font-mono text-[9px] font-bold mb-3" style={{ color:'#1a6b00' }}>✓ PERFECT FOR YOU IF...</div>
              <ul className="text-[13px]" style={{ color:'#444', lineHeight:2.2, listStyle:'none' }}>
                {["You've heard about airdrops but never done one","You only have a smartphone","You have limited capital (&lt;$100)","You want a repeatable system","You're in Africa, Asia, or Latin America"].map(i => <li key={i} dangerouslySetInnerHTML={{__html:i}}/>)}
              </ul>
            </div>
            <div>
              <div className="font-mono text-[9px] font-bold mb-3" style={{ color:'#cc0000' }}>✗ NOT FOR YOU IF...</div>
              <ul className="text-[13px]" style={{ color:'#444', lineHeight:2.2, listStyle:'none' }}>
                {["You want guaranteed returns","You're looking for get-rich-quick schemes","You're not willing to use a burner wallet"].map(i=><li key={i}>{i}</li>)}
              </ul>
            </div>
          </div>
        </section>

        {/* Download CTA */}
        <section className="glass p-10 text-center mb-12">
          <div style={{ fontSize:48, marginBottom:16 }}>📱</div>
          <h2 className="font-serif text-2xl font-bold text-dark mb-3">Download Free — No Email Required</h2>
          <p className="text-sm max-w-lg mx-auto mb-6" style={{ color:'#666', lineHeight:1.7 }}>No signup wall. No email gate. Click download, get the PDF. If you find it useful, share it with someone who needs it.</p>
          <a href="/uploads/mobile-farmer-web3farmyard.pdf" download className="btn-primary text-[11px] py-4 px-10">
            ⬇ DOWNLOAD THE MOBILE FARMER — FREE
          </a>
          <p className="font-mono text-[8px] mt-4 tracking-[0.1em]" style={{ color:'#bbb' }}>PDF · FREE · ALWAYS WILL BE</p>
        </section>

        {/* SEO content */}
        <section className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="font-serif text-xl font-bold text-dark mb-3">Why Mobile Airdrop Farming Works</h2>
            <p className="text-sm mb-3" style={{ color:'#555', lineHeight:1.85 }}>Crypto airdrops distribute tokens to early users of a protocol — often worth hundreds or thousands of dollars. They reward on-chain activity: swapping, bridging, providing liquidity, or using a testnet. Most of these interactions work perfectly on mobile.</p>
            <p className="text-sm" style={{ color:'#555', lineHeight:1.85 }}>You do not need a $2,000 desktop setup. You need a strategy, a system, and the discipline to document your activity. The Mobile Farmer covers the exact workflow used by active airdrop hunters across three continents.</p>
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-dark mb-3">Specific to Mobile</h2>
            <p className="text-sm mb-3" style={{ color:'#555', lineHeight:1.85 }}>Every instruction in this book has been tested on Android and iOS. Every wallet recommendation is mobile-compatible. Every protocol was accessed from a phone. If it cannot be done on a phone, it is not in this book.</p>
            <p className="text-sm" style={{ color:'#555', lineHeight:1.85 }}>Airdrop farming is one of the few genuine wealth transfer mechanisms in Web3 that does not require initial capital to work. The Mobile Farmer shows you how to maximise your chances of qualifying before the snapshot.</p>
          </div>
        </section>

      </main>

      <Footer />
    </>
  )
}
