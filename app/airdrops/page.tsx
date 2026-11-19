'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import {
  generateOrganizationSchema,
  generateWebPageSchema,
  generateWebSiteSchema,
} from '@/lib/schema'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPA_URL!,
  process.env.NEXT_PUBLIC_SUPA_KEY!
)

interface Airdrop {
  id: string
  name: string
  reward: string
  reward_amount?: string
  reward_token?: string
  description?: string
  fullDescription?: string
  task?: string
  chain?: string
  deadline?: string
  url: string
  risk: 'low' | 'medium' | 'high'
  logo?: string
  image_url?: string
  status: string
  created_at?: string
}

const riskColors = {
  low: '#1a6b00',
  medium: '#ff9500',
  high: '#ff4d4d'
}

// Bento pattern: determines which cards get extra span in the grid.
// Cycles every 6 cards so the layout stays visually balanced no matter
// how many airdrops are live.
function getBentoClasses(index: number): string {
  const pattern = index % 6
  if (pattern === 0) return 'md:col-span-2 md:row-span-2' // big feature card
  if (pattern === 3) return 'md:row-span-2' // tall card
  return ''
}

export default function AirdropsPage() {
  const [airdrops, setAirdrops] = useState<Airdrop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedAirdrop, setSelectedAirdrop] = useState<Airdrop | null>(null)

  useEffect(() => {
    const fetchAirdrops = async () => {
      try {
        setLoading(true)
        const { data, error: err } = await supabase
          .from('airdrops')
          .select('*')
          .eq('status', 'live')
          .order('created_at', { ascending: false })

        if (err) throw err

        // Combine seed data with database data
        // const allAirdrops = [...seedAirdrops, ...(data || [])]
        setAirdrops(data)
        setError('')
      } catch (err) {
        console.error('Error fetching airdrops:', err)
        // Use seed data if database fails
        // setAirdrops(seedAirdrops)
      } finally {
        setLoading(false)
      }
    }

    fetchAirdrops()

    const interval = setInterval(fetchAirdrops, 30000)
    return () => clearInterval(interval)
  }, [])

  const airdropsSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      generateOrganizationSchema(),
      generateWebSiteSchema({
        url: 'https://www.web3farmyard.com/airdrops',
        name: 'Live Crypto Airdrops 2026 | Web3Farmyard',
        description: 'Fresh Web3 airdrops with task-based reward opportunities, risk flags, and live deadlines.',
        publisherId: 'https://www.web3farmyard.com/#organization',
      }),
      generateWebPageSchema({
        id: 'https://www.web3farmyard.com/airdrops#webpage',
        url: 'https://www.web3farmyard.com/airdrops',
        name: 'Live Crypto Airdrops 2026 — Web3Farmyard',
        description: 'Browse live airdrop opportunities with risk ratings, task steps, and deadlines.',
        isPartOfId: 'https://www.web3farmyard.com/#website',
        inLanguage: 'en-US',
      }, false),
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(airdropsSchema) }}
      />
      <Nav />
      <main className="theme-page airdrops-page">
        <div className="theme-page-shell">
          <header className="theme-page-hero">
            <span className="theme-page-eyebrow">PROJECT DISCOVERY</span>
            <h1>
            Airdrops
            </h1>
            <p>
              Explore curated opportunities with project details and risk context. Always do your own research.
            </p>
          </header>

        {loading && (
          <div className="text-center py-20">
            <p className="text-gray-500 animate-pulse">Loading airdrops...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {!loading && airdrops.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600">No active airdrops right now. Check back soon!</p>
          </div>
        )}

        {!loading && airdrops.length > 0 && (
          <div className="airdrops-grid grid grid-cols-1 md:grid-cols-4 md:auto-rows-[220px] gap-5">
            {airdrops.map((airdrop, index) => {
              const risk = airdrop.risk || 'low'
              return (
                <div
                  key={airdrop.id}
                  className={`bento-flip-card group ${getBentoClasses(index)}`}
                  onClick={() => setSelectedAirdrop(airdrop)}
                >
                  <div className="bento-flip-inner">
                    {/* FRONT FACE */}
                    <div
                      className="bento-flip-front"
                      style={
                        airdrop.image_url
                          ? {
                              backgroundImage: `linear-gradient(180deg, rgba(10,10,10,0.15) 0%, rgba(10,10,10,0.85) 100%), url(${airdrop.image_url})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                            }
                          : undefined
                      }
                    >
                      {!airdrop.image_url && <div className="bento-front-fallback" />}

                      <div
                        className="bento-risk-badge"
                        style={{ background: riskColors[risk] }}
                      >
                        {risk.toUpperCase()}
                      </div>

                      <div className="bento-front-content">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">🪂</span>
                          {airdrop.chain && (
                            <span className="font-mono text-[10px] text-white/70 tracking-wide">
                              {airdrop.chain}
                            </span>
                          )}
                        </div>
                        <h3 className="font-serif text-xl font-bold text-white leading-tight mb-1">
                          {airdrop.name}
                        </h3>
                        <p className="font-bold text-[#c8ff00] text-sm">
                          {airdrop.reward}
                        </p>
                      </div>
                    </div>

                    {/* BACK FACE */}
                    <div className="bento-flip-back">
                      <div>
                        <h3 className="font-serif text-lg font-bold text-[#0a0a0a] mb-2 leading-tight">
                          {airdrop.name}
                        </h3>

                        <div className="bento-reward-box">
                          <p className="font-mono text-[10px] text-gray-500 mb-0.5">REWARD</p>
                          <p className="font-bold text-[#1a6b00] text-base">
                            {airdrop.reward}
                          </p>
                        </div>

                        {airdrop.description && (
                          <p className="text-xs text-gray-600 mt-3 line-clamp-3">
                            {airdrop.description}
                          </p>
                        )}
                      </div>

                      <a
                        href={airdrop.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="bento-join-btn"
                        style={{ background: riskColors[risk] }}
                      >
                        Join →
                      </a>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Full Description Modal */}
        {selectedAirdrop && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedAirdrop(null)}
          >
            <div
              className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="font-serif text-3xl font-bold text-[#0a0a0a] mb-2">
                    {selectedAirdrop.name}
                  </h2>
                  <p className="text-gray-600">{selectedAirdrop.chain}</p>
                </div>
                <button
                  onClick={() => setSelectedAirdrop(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>

              {selectedAirdrop.image_url && (
                <div className="mb-6 h-64 overflow-hidden rounded bg-gray-100">
                  <img
                    src={selectedAirdrop.image_url}
                    alt={selectedAirdrop.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                </div>
              )}

              <div className="mb-6 p-4 bg-[#f0f8e8] rounded">
                <p className="font-mono text-sm text-gray-600 mb-2">REWARD</p>
                <p className="font-bold text-[#1a6b00] text-xl mb-2">{selectedAirdrop.reward}</p>
                {selectedAirdrop.reward_token && (
                  <p className="font-mono text-sm text-gray-600">
                    Token: {selectedAirdrop.reward_token}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-lg text-[#0a0a0a] mb-3">About</h3>
                <p className="text-gray-700 leading-relaxed">
                  {selectedAirdrop.fullDescription || selectedAirdrop.description}
                </p>
              </div>

              {selectedAirdrop.task && (
                <div className="mb-6">
                  <h3 className="font-bold text-lg text-[#0a0a0a] mb-3">Tasks</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedAirdrop.task}</p>
                </div>
              )}

              {selectedAirdrop.deadline && (
                <div className="mb-6 p-3 bg-gray-100 rounded">
                  <p className="font-mono text-sm text-gray-600">
                    <strong>Deadline:</strong> {selectedAirdrop.deadline}
                  </p>
                </div>
              )}

              <div className="flex gap-4">
                <a
                  href={selectedAirdrop.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 bg-[#1a6b00] hover:bg-[#134f00] text-white font-bold rounded transition-colors text-center"
                >
                  Join →
                </a>
                <button
                  onClick={() => setSelectedAirdrop(null)}
                  className="flex-1 py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-16 pt-8 border-t border-gray-200">
          <Link
            href="/"
            className="text-[#1a6b00] hover:text-[#134f00] font-bold transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
        </div>
      </main>
      <Footer />

      <style jsx>{`
        .bento-flip-card {
          perspective: 1200px;
          cursor: pointer;
          min-height: 220px;
        }

        .bento-flip-inner {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: inherit;
          transition: transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1);
          transform-style: preserve-3d;
          border-radius: 12px;
        }

        .bento-flip-card:hover .bento-flip-inner {
          transform: rotateY(180deg);
        }

        .bento-flip-front,
        .bento-flip-back {
          position: absolute;
          inset: 0;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          border-radius: 12px;
          overflow: hidden;
        }

        .bento-flip-front {
          background-color: #102d1c;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 18px;
        }

        .bento-front-fallback {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #102d1c 0%, #294b30 100%);
          z-index: 0;
        }

        .bento-front-content {
          position: relative;
          z-index: 1;
        }

        .bento-risk-badge {
          position: absolute;
          top: 14px;
          right: 14px;
          z-index: 1;
          padding: 3px 9px;
          border-radius: 5px;
          font-family: monospace;
          font-size: 10px;
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.05em;
        }

        .bento-flip-back {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          transform: rotateY(180deg);
          padding: 18px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .bento-reward-box {
          background: #edf4e8;
          border-radius: 8px;
          padding: 10px 12px;
        }

        .bento-join-btn {
          display: block;
          width: 100%;
          text-align: center;
          color: #fff;
          font-weight: 700;
          font-size: 13px;
          padding: 10px 14px;
          border-radius: 999px;
          margin-top: 12px;
          transition: opacity 0.15s ease;
        }

        .bento-join-btn:hover {
          opacity: 0.88;
        }

        @media (max-width: 767px) {
          .bento-flip-inner {
            transform: none !important;
          }
          .bento-flip-back {
            position: relative;
            transform: none;
            margin-top: 10px;
            border-radius: 12px;
          }
          .bento-flip-front {
            position: relative;
            min-height: 200px;
          }
          .bento-flip-card {
            min-height: auto;
          }
        }
      `}</style>
    </>
  )
}