import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

import { trackToolkitUse } from '@/lib/analytics-complete'
import {
  generateOrganizationSchema,
  generateWebPageSchema,
  generateWebSiteSchema,
  generateItemListSchema,
} from '@/lib/schema'

const handleToolUse = (toolName: string) => {
  trackToolkitUse(toolName)
}

export const metadata: Metadata = {
  title: 'Web3 Toolkit | Web3Farmyard',
  description: 'Explore wallets, DEXs, airdrop platforms, security resources, analytics, and other useful Web3 tools.',
}

interface Tool {
  id: string
  name: string
  category: 'Wallet' | 'DEX' | 'Lending' | 'Bridge' | 'Analytics' | 'Social' | 'Airdrop' | 'Security'
  description: string
  url: string
  isEssential: boolean
  emoji: string
  logo?: string
}

const tools: Tool[] = [
  // === BEGINNER'S ESSENTIAL PACK ===
  { id: 'metamask', name: 'MetaMask', category: 'Wallet', description: 'The essential wallet for Ethereum and EVM chains. Start here.', url: 'https://metamask.io', isEssential: true, emoji: '🦊' },
  { id: 'okx-wallet', name: 'OKX Web3 Wallet', category: 'Wallet', description: 'Professional multi-chain wallet with built-in DEX and bridge.', url: 'https://www.okx.com/web3', isEssential: true, emoji: '🪙' },
  { id: 'zerion', name: 'Zerion', category: 'Analytics', description: 'See all your DeFi positions and portfolio value in one place.', url: 'https://zerion.io', isEssential: true, emoji: '📊' },
  { id: 'galxe', name: 'Galxe', category: 'Airdrop', description: 'Biggest platform for airdrop quests and on-chain credentials.', url: 'https://galxe.com', isEssential: true, emoji: '🚀' },
  { id: 'zealy', name: 'Zealy', category: 'Airdrop', description: 'Complete XP quests and earn badges in Web3 communities.', url: 'https://zealy.io', isEssential: true, emoji: '⭐' },
  { id: 'taskon', name: 'TaskOn', category: 'Airdrop', description: 'Join communities and earn points + token rewards from tasks.', url: 'https://taskon.xyz', isEssential: true, emoji: '✨' },
  { id: 'twitter', name: 'X (Twitter)', category: 'Social', description: 'Your gateway to the Web3 community. Follow projects and build network.', url: 'https://twitter.com', isEssential: true, emoji: '𝕏' },
  { id: 'telegram', name: 'Telegram', category: 'Social', description: 'Connect with Web3 communities, get updates, and make friends.', url: 'https://telegram.org', isEssential: true, emoji: '💬' },
  { id: 'discord', name: 'Discord', category: 'Social', description: 'Join project communities, chat with builders, and stay informed.', url: 'https://discord.com', isEssential: true, emoji: '🎮' },
  { id: 'chain-org', name: 'Chain.org', category: 'Analytics', description: 'Discover chains, ecosystems, and network insights in one place.', url: 'https://chain.org', isEssential: true, emoji: '⛓️', logo: 'https://www.google.com/s2/favicons?domain=chain.org' },
  { id: 'faucet-drip', name: 'Faucet Drip', category: 'Airdrop', description: 'Claim testnet tokens and practice onchain actions safely.', url: 'https://faucet.drip', isEssential: true, emoji: '🚰', logo: 'https://www.google.com/s2/favicons?domain=faucet.drip' },

  // === ADDITIONAL WALLETS ===
  { id: 'trust-wallet', name: 'Trust Wallet', category: 'Wallet', description: 'A mobile wallet for managing digital assets across multiple networks.', url: 'https://trustwallet.com', isEssential: false, emoji: '👛' },
  { id: 'phantom', name: 'Phantom', category: 'Wallet', description: 'Best Solana wallet. Lightning-fast transactions and airdrops.', url: 'https://phantom.app', isEssential: false, emoji: '👻' },
  { id: 'rabby', name: 'Rabby Wallet', category: 'Wallet', description: 'Smart wallet that detects scams across 50+ chains automatically.', url: 'https://rabby.io', isEssential: false, emoji: '🐰' },
  { id: 'ledger', name: 'Ledger Live', category: 'Wallet', description: 'Hardware wallet for maximum security. For long-term holding.', url: 'https://ledger.com', isEssential: false, emoji: '🔐' },

  // === DEXES & SWAPS ===
  { id: 'uniswap', name: 'Uniswap', category: 'DEX', description: 'The largest DEX. Best liquidity and deepest pools.', url: 'https://uniswap.org', isEssential: false, emoji: '🦄' },
  { id: 'pancakeswap', name: 'PancakeSwap', category: 'DEX', description: 'Biggest DEX on BSC. Fast and cheap swaps.', url: 'https://pancakeswap.finance', isEssential: false, emoji: '🥞' },
  { id: 'jupiter', name: 'Jupiter', category: 'DEX', description: 'Best Solana DEX aggregator. Always finds the best price.', url: 'https://jup.ag', isEssential: false, emoji: '🪐' },
  { id: 'curve', name: 'Curve Finance', category: 'DEX', description: 'Best for stablecoin swaps with lowest slippage.', url: 'https://curve.fi', isEssential: false, emoji: '➰' },
  { id: '1inch', name: '1inch', category: 'DEX', description: 'DEX aggregator. Automatically finds best swap routes.', url: 'https://1inch.io', isEssential: false, emoji: '⚡' },

  // === LENDING & YIELD ===
  { id: 'aave', name: 'Aave', category: 'Lending', description: 'The largest lending protocol. Lend crypto and earn yield.', url: 'https://aave.com', isEssential: false, emoji: '👻' },
  { id: 'compound', name: 'Compound', category: 'Lending', description: 'First major lending protocol. Community-governed with COMP.', url: 'https://compound.finance', isEssential: false, emoji: '🏛️' },
  { id: 'morpho', name: 'Morpho', category: 'Lending', description: 'Optimized lending with better rates than Aave and Compound.', url: 'https://morpho.org', isEssential: false, emoji: '🧬' },
  { id: 'yearn', name: 'Yearn Finance', category: 'Lending', description: 'Optimize your yield across all DeFi protocols automatically.', url: 'https://yearn.finance', isEssential: false, emoji: '🌾' },

  // === BRIDGES ===
  { id: 'stargate', name: 'Stargate Finance', category: 'Bridge', description: 'Best cross-chain bridge. Fast and reliable.', url: 'https://stargate.finance', isEssential: false, emoji: '🌉' },
  { id: 'across', name: 'Across Protocol', category: 'Bridge', description: 'Fast bridge between Ethereum and L2s with low fees.', url: 'https://across.to', isEssential: false, emoji: '🌊' },
  { id: 'lido', name: 'Lido', category: 'Bridge', description: 'Explore liquid staking and track staked ETH across Ethereum apps.', url: 'https://lido.fi', isEssential: false, emoji: '🫗' },

  // === ANALYTICS & RESEARCH ===
  { id: 'etherscan', name: 'Etherscan', category: 'Analytics', description: 'Ethereum blockchain explorer. See all transactions and contracts.', url: 'https://etherscan.io', isEssential: false, emoji: '🔍' },
  { id: 'defillama', name: 'DefiLlama', category: 'Analytics', description: 'Track TVL across all DeFi protocols and chains.', url: 'https://defillama.com', isEssential: false, emoji: '🦙' },
  { id: 'dexscreener', name: 'DexScreener', category: 'Analytics', description: 'Real-time DEX charts and new token launches.', url: 'https://dexscreener.com', isEssential: false, emoji: '📈' },

  // === SECURITY ===
  { id: 'token-sniffer', name: 'Token Sniffer', category: 'Security', description: 'Scan tokens for scams and honeypots before buying.', url: 'https://tokensniffer.com', isEssential: false, emoji: '🚨' },
  { id: 'rug-checker', name: 'Rug Checker', category: 'Security', description: 'Detect malicious contracts and protect your wallet.', url: 'https://rugchecker.com', isEssential: false, emoji: '🛡️' },
  { id: 'revoke', name: 'Revoke.cash', category: 'Security', description: 'Revoke malicious token approvals and protect your wallet.', url: 'https://revoke.cash', isEssential: true, emoji: '⛔', logo: 'https://www.google.com/s2/favicons?domain=revoke.cash' },
]

export default function ToolkitPage() {
  const essentialTools = tools.filter(t => t.isEssential)
  const otherTools = tools.filter(t => !t.isEssential)
  const categories = ['Wallet', 'DEX', 'Lending', 'Bridge', 'Analytics', 'Security'] as const
  const toolkitSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      generateOrganizationSchema(),
      generateWebSiteSchema({
        url: 'https://www.web3farmyard.com/toolkit',
        name: 'Web3 Toolkit — Web3Farmyard',
        description: 'Curated Web3 tools for airdrops, wallets, bridges, analytics, and security.',
        publisherId: 'https://www.web3farmyard.com/#organization',
      }),
      generateWebPageSchema({
        id: 'https://www.web3farmyard.com/toolkit#webpage',
        url: 'https://www.web3farmyard.com/toolkit',
        name: 'Web3 Toolkit — Essential Crypto Tools | Web3Farmyard',
        description: 'A curated collection of wallets, DEXs, bridges, analytics, and security tools for exploring Web3.',
        isPartOfId: 'https://www.web3farmyard.com/#website',
        inLanguage: 'en-US',
      }, false),
      generateItemListSchema(tools.map(tool => ({
        name: tool.name,
        url: tool.url,
      })), false),
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolkitSchema) }}
      />
      <Nav />

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 rounded-full bg-[#f0f8e8] border border-[#1a6b00]/20 mb-4">
            <span className="font-mono text-xs tracking-widest text-[#1a6b00]">🧰 TOOLKIT</span>
          </div>
          <h1 className="font-serif text-6xl md:text-7xl font-bold text-[#0a0a0a] mb-6 leading-tight">
            Your Web3 Arsenal
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A curated collection of tools for exploring Web3, researching projects, and managing your digital assets more safely.
          </p>
        </div>

        {/* ===== BEGINNER'S ESSENTIAL PACK ===== */}
        <section className="mb-20">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a6b00] via-[#0f4600] to-[#0a0a0a] p-12 md:p-16 border-2 border-[#c8ff00]">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#c8ff00]/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#c8ff00]/5 rounded-full -ml-48 -mb-48 blur-3xl"></div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-3 mb-6">
                <span className="text-4xl">🚀</span>
                <h2 className="font-serif text-4xl font-bold text-white">Beginner's Essential Pack</h2>
              </div>

              <p className="text-[#c8ff00]/90 text-lg mb-12 max-w-3xl leading-relaxed">
                Start with these essential tools as you follow the 7-day onboarding path and learn the Web3 basics.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {essentialTools.map((tool) => (
                  <a
                    key={tool.id}
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-[#c8ff00]/30 hover:border-[#c8ff00] rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl flex-shrink-0">
                        {tool.logo ? (
                          <img src={tool.logo} alt={`${tool.name} logo`} className="w-10 h-10 rounded-md object-contain bg-white/90 p-1" />
                        ) : (
                          <span>{tool.emoji}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-serif font-bold text-white text-lg group-hover:text-[#c8ff00] transition-colors">
                          {tool.name}
                        </h3>
                        <p className="text-sm text-[#c8ff00]/70 group-hover:text-[#c8ff00] transition-colors mt-1">
                          {tool.description}
                        </p>
                      </div>
                      <div className="text-[#c8ff00] group-hover:translate-x-1 transition-transform flex-shrink-0">→</div>
                    </div>
                  </a>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/onboarding/day-1"
                  className="bg-[#c8ff00] hover:bg-white text-[#0a0a0a] font-bold px-8 py-4 rounded-xl transition-all"
                >
                  Start Your 7-Day Journey →
                </Link>
                <a
                  href="#full-toolkit"
                  className="border-2 border-[#c8ff00] text-[#c8ff00] hover:bg-[#c8ff00] hover:text-[#0a0a0a] font-bold px-8 py-4 rounded-xl transition-all"
                >
                  Explore Full Toolkit ↓
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Info Cards */}
        <section className="grid md:grid-cols-3 gap-6 mb-20">
          {[
            {
              title: '✓ Non-Custodial',
              desc: 'You control your keys. No central authority holds your funds.',
            },
            {
              title: '✓ Thoroughly Tested',
              desc: 'Useful tools for exploring Web3, researching projects, and managing digital assets.',
            },
            {
              title: '✓ Continuously Updated',
              desc: 'We test new tools quarterly and remove anything unsafe or outdated.',
            },
          ].map((card, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="font-serif font-bold text-lg text-[#1a6b00] mb-2">{card.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </section>

        {/* ===== FULL TOOLKIT ===== */}
        <section id="full-toolkit">
          <div className="mb-12">
            <h2 className="font-serif text-4xl font-bold text-[#0a0a0a] mb-3">Complete Toolkit: {tools.length} Tools</h2>
            <p className="text-gray-600">All tools organized by category. The Beginner's Essential Pack appears first, then the full catalog.</p>
          </div>

          {/* Tools by Category */}
          {categories.map((category) => {
            const categoryTools = otherTools.filter(t => t.category === category)
            if (categoryTools.length === 0) return null

            return (
              <div key={category} className="mb-14">
                <h3 className="font-serif text-2xl font-bold text-[#0a0a0a] mb-6 flex items-center gap-3">
                  <span className="text-3xl">
                    {category === 'Wallet' && '👛'}
                    {category === 'DEX' && '🔄'}
                    {category === 'Lending' && '💰'}
                    {category === 'Bridge' && '🌉'}
                    {category === 'Analytics' && '📊'}
                    {category === 'Security' && '🛡️'}
                  </span>
                  {category}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryTools.map((tool) => (
                    <a
                      key={tool.id}
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group bg-white border border-gray-200 hover:border-[#1a6b00] rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-3xl flex-shrink-0">{tool.emoji}</div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-serif font-bold text-[#0a0a0a] group-hover:text-[#1a6b00] transition-colors">
                            {tool.name}
                          </h4>
                          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                            {tool.description}
                          </p>
                          <div className="mt-4 text-[#1a6b00] group-hover:underline text-sm font-medium">
                            Visit →
                          </div>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )
          })}
        </section>

        {/* CTA Section */}
        <section className="bg-[#f0f8e8] border-2 border-[#1a6b00] rounded-3xl p-12 text-center mt-20">
          <h2 className="font-serif text-3xl font-bold text-[#0a0a0a] mb-4">Ready to Explore Web3?</h2>
          <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
            These tools are your foundation. Master the Beginner's Essential Pack in your first 7 days, then gradually expand to the full toolkit as you grow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/onboarding/day-1"
              className="bg-[#1a6b00] hover:bg-[#134f00] text-white font-bold px-10 py-4 rounded-xl transition-all"
            >
              Start Onboarding
            </Link>
            <Link
              href="/airdrops"
              className="border-2 border-[#1a6b00] text-[#1a6b00] hover:bg-[#f0f8e8] font-bold px-10 py-4 rounded-xl transition-all"
            >
              View Airdrops
            </Link>
          </div>
        </section>

        {/* Internal Links */}
        <section className="mt-20 pt-12 border-t border-gray-200">
          <h2 className="font-serif text-2xl font-bold text-[#0a0a0a] mb-8">Learn More</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/onboarding/day-1" className="border-2 border-[#1a6b00] rounded-xl p-6 hover:bg-[#f0f8e8] transition-colors">
              <h3 className="font-serif font-bold text-[#1a6b00] mb-2">📚 7-Day Onboarding</h3>
              <p className="text-sm text-gray-600">Structured learning path through all essential tools</p>
            </Link>
            <Link href="/blog" className="border-2 border-[#1a6b00] rounded-xl p-6 hover:bg-[#f0f8e8] transition-colors">
              <h3 className="font-serif font-bold text-[#1a6b00] mb-2">📖 Blog</h3>
              <p className="text-sm text-gray-600">Deep guides on security, wallets, and DeFi strategy</p>
            </Link>
            <Link href="/airdrops" className="border-2 border-[#1a6b00] rounded-xl p-6 hover:bg-[#f0f8e8] transition-colors">
              <h3 className="font-serif font-bold text-[#1a6b00] mb-2">🌾 Active Airdrops</h3>
              <p className="text-sm text-gray-600">Review curated opportunities and project details</p>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}