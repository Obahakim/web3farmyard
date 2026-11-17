import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/Nav'
import ChainLogo from '@/components/ChainLogo'
import Footer from '@/components/Footer'
import { getAllChains, fmt, llamaLogo, toSlug } from '@/lib/defillama'
import { getChainContent, generateGenericDescription } from '@/lib/chain-data'
import ChainLiveMetrics from './ChainLiveMetrics'

interface Props {
  params: Promise<{ chain: string }>
}

export async function generateStaticParams() {
  const chains = await getAllChains()
  return chains.map(c => ({ chain: toSlug(c.name) }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { chain } = await params                    // ← Fixed: await outside
  const chains = await getAllChains()
  const foundChain = chains.find(c => toSlug(c.name) === chain)
  
  if (!foundChain) return { title: 'Chain Not Found' }

  const content = getChainContent(foundChain.name) || generateGenericDescription(foundChain)

  return {
    title: `${foundChain.name} Blockchain — TVL & DEX Volume`,
    description: `Daily TVL, TVL-change, and DEX-volume metrics for ${foundChain.name}.`,
    alternates: { canonical: `https://www.web3farmyard.com/showroom/${chain}` },
  }
}

export default async function ChainDetailPage({ params }: Props) {
  const { chain } = await params
  const chains = await getAllChains()
  const foundChain = chains.find(c => toSlug(c.name) === chain)
  
  if (!foundChain) notFound()

  const rank = chains.findIndex(c => c.name === foundChain.name) + 1
  const content = getChainContent(foundChain.name) || generateGenericDescription(foundChain)

  const related = chains
    .filter(c => c.name !== foundChain.name)
    .slice(Math.max(0, rank - 3), rank + 3)
    .slice(0, 4)

  return (
    <>
      <Nav />

      <main className="max-w-[1100px] mx-auto px-7 pb-16">
        {/* Breadcrumb */}
        <nav className="pt-6 pb-2">
          <ol className="flex gap-2 font-mono text-[9px] flex-wrap" style={{color:'#aaa'}}>
            <li><Link href="/" style={{color:'#1a6b00'}}>Home</Link></li>
            <li>/</li>
            <li><Link href="/showroom" style={{color:'#1a6b00'}}>Showroom</Link></li>
            <li>/</li>
            <li style={{color:'#333'}}>{foundChain.name}</li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="py-8">
          <div className="flex items-center gap-5 flex-wrap mb-6">
            <div className="w-[72px] h-[72px] rounded-2xl overflow-hidden flex items-center justify-center" style={{background:'#f0f0f0'}}>
              <ChainLogo src={llamaLogo(foundChain.name)} alt={foundChain.name} size={72} />
            </div>
            <div>
              <div className="font-mono text-[9px] tracking-widest mb-1" style={{color:'#1a6b00'}}>
                RANK #{rank} · {content.category.toUpperCase()}
              </div>
              <h1 className="font-serif font-bold text-dark" style={{fontSize:'clamp(32px,5vw,52px)', lineHeight:1.1}}>
                {foundChain.name}
              </h1>
            </div>
          </div>
        </section>

        <ChainLiveMetrics 
          chainName={foundChain.name} 
          initialTvl={foundChain.tvl}
          initialChange1d={foundChain.change_1d ?? null}
          initialChange7d={foundChain.change_7d ?? null}
          initialChange1m={foundChain.change_1m ?? null}
          rank={rank} 
        />

        {/* About Section */}
        <section className="glass p-6 mb-6">
          <h2 className="font-serif text-xl font-bold mb-4">About {foundChain.name}</h2>
          <p className="text-sm" style={{color:'#444', lineHeight:1.85}}>{content.description}</p>
        </section>

        {/* Links */}
        <div className="flex gap-3 flex-wrap">
          <Link href="/toolkit" className="btn-primary">🛠️ Open Web3 Toolkit</Link>
          <Link href="/airdrops" className="btn-outline">🌾 View Airdrops</Link>
        </div>
      </main>

      <Footer />
    </>
  )
}