// FILE: app/airdrops/AirdropsClient.tsx
// ✅ Client Component for interactivity + analytics

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { trackPageView } from '@/lib/analytics'

interface AirdropData {
  id: string
  name: string
  description?: string
  url?: string
  chain?: string
  deadline?: string
  status: string
  created_at?: string
}

interface AirdropsClientProps {
  initialAirdrops: AirdropData[]
}

export default function AirdropsClient({ initialAirdrops }: AirdropsClientProps) {
  const [airdrops, setAirdrops] = useState<AirdropData[]>(initialAirdrops)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // ✅ Track page view on mount
  useEffect(() => {
    trackPageView('/airdrops')
  }, [])

  // Filter logic
  const filteredAirdrops = airdrops.filter(airdrop => {
    const matchesFilter = filter === 'all' || airdrop.status === filter
    const matchesSearch = 
      airdrop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      airdrop.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      airdrop.chain?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <>
      <Nav />
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-[#0a0a0a] mb-4">
            Active Airdrops
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Explore curated airdrop opportunities with project details and risk context. Always do your own research.
          </p>

          {/* Search & Filter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <input
              type="text"
              placeholder="Search airdrops by name, description, or chain..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-6 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a6b00]"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  filter === 'all'
                    ? 'bg-[#1a6b00] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('live')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  filter === 'live'
                    ? 'bg-[#1a6b00] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Live
              </button>
            </div>
          </div>
        </div>

        {/* Airdrops Grid */}
        {filteredAirdrops.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              {searchTerm ? 'No airdrops match your search.' : 'No active airdrops at the moment.'}
            </p>
            <p className="text-gray-400 mt-2">Check back soon or follow @web3farmyard for updates.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAirdrops.map((airdrop) => (
              <div
                key={airdrop.id}
                className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-serif text-xl font-bold text-[#0a0a0a] flex-1">
                    {airdrop.name}
                  </h3>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium whitespace-nowrap ml-2">
                    {airdrop.status}
                  </span>
                </div>

                {airdrop.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {airdrop.description}
                  </p>
                )}

                <div className="space-y-3 mb-6 text-sm">
                  {airdrop.chain && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <span className="font-medium">Chain:</span>
                      <span className="text-gray-600">{airdrop.chain}</span>
                    </div>
                  )}
                  {airdrop.deadline && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <span className="font-medium">Deadline:</span>
                      <span className="text-gray-600">{airdrop.deadline}</span>
                    </div>
                  )}
                </div>

                {airdrop.url && (
                  <a
                    href={airdrop.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-[#1a6b00] hover:bg-[#0f4600] text-white font-medium py-3 rounded-lg text-center transition-all"
                  >
                    Go to Airdrop →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Additional Resources */}
        <div className="mt-16 pt-12 border-t border-gray-200">
          <h2 className="font-serif text-2xl font-bold text-[#0a0a0a] mb-6">
            Learn How to Evaluate Opportunities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/blog"
              className="bg-blue-50 border border-blue-200 rounded-lg p-6 hover:bg-blue-100 transition-all"
            >
              <h3 className="font-bold text-blue-900 mb-2">📖 Security Guide</h3>
              <p className="text-blue-800 text-sm">
                Learn how to identify scams, protect your wallet, and research projects before interacting.
              </p>
            </Link>
            <Link
              href="/junkyard"
              className="bg-red-50 border border-red-200 rounded-lg p-6 hover:bg-red-100 transition-all"
            >
              <h3 className="font-bold text-red-900 mb-2">☠️ Crypto Graveyard</h3>
              <p className="text-red-800 text-sm">
                Study 70+ major crypto failures to understand what NOT to do.
              </p>
            </Link>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-12 bg-gradient-to-r from-[#1a6b00]/10 to-[#c8ff00]/10 border-2 border-[#1a6b00] rounded-2xl p-8 text-center">
          <h3 className="font-serif text-2xl font-bold text-[#0a0a0a] mb-4">
            Haven't Done Onboarding Yet?
          </h3>
          <p className="text-gray-600 mb-6">
            Complete the 7-day Web3 onboarding first. You'll have the on-chain footprint needed to qualify for airdrops.
          </p>
          <Link
            href="/onboarding/day-1"
            className="inline-block bg-[#1a6b00] hover:bg-[#0f4600] text-white font-bold px-8 py-4 rounded-lg transition-all"
          >
            Start Onboarding →
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}