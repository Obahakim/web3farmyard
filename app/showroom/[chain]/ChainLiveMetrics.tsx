'use client'
import { useState, useEffect } from 'react'

interface Props {
  chainName: string
  initialTvl: number
  initialChange1d: number | null
  initialChange7d: number | null
  initialChange1m: number | null
  initialProtocols: number | null
  rank: number
}

function formatNumber(num: number): string {
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
  if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`
  return `$${num.toFixed(2)}`
}

function formatChange(change: number | null): string {
  if (change === null || change === undefined) return '—'
  if (change === 0) return '—'
  const sign = change > 0 ? '+' : ''
  return `${sign}${change.toFixed(2)}%`
}

function ChangeIndicator({ change }: { change: number | null }) {
  if (change === null || change === 0) return <span style={{ color: '#999' }}>—</span>
  const color = change > 0 ? '#1a6b00' : '#cc0000'
  const icon = change > 0 ? '↑' : '↓'
  return (
    <span style={{ color }}>
      {icon} {Math.abs(change).toFixed(2)}%
    </span>
  )
}

export default function ChainLiveMetrics({
  chainName,
  initialTvl,
  initialChange1d,
  initialChange7d,
  initialChange1m,
  initialProtocols,
  rank,
}: Props) {
  const [tvl, setTvl] = useState(initialTvl)
  const [change1d, setChange1d] = useState(initialChange1d)
  const [change7d, setChange7d] = useState(initialChange7d)
  const [change1m, setChange1m] = useState(initialChange1m)
  const [protocols, setProtocols] = useState(initialProtocols)
  const [loading, setLoading] = useState(false)

  // Optionally fetch fresh data client-side
  useEffect(() => {
    // You can add a fetch here if you have a /api/chain/[name] endpoint
    // For now, we'll just use the initial data
  }, [chainName])

  return (
    <section className="mb-8">
      <div className="grid gap-4 md:grid-cols-5">
        {/* Rank */}
        <div className="glass p-5">
          <div className="font-mono text-[8px] tracking-widest mb-3" style={{ color: '#999' }}>
            RANK
          </div>
          <div className="font-serif text-3xl font-bold text-dark">#{rank}</div>
        </div>

        {/* TVL */}
        <div className="glass p-5">
          <div className="font-mono text-[8px] tracking-widest mb-3" style={{ color: '#999' }}>
            TOTAL VALUE LOCKED
          </div>
          <div
            className="font-serif font-bold text-dark"
            style={{ fontSize: 'clamp(18px, 4vw, 24px)', lineHeight: 1.2 }}
          >
            {formatNumber(tvl)}
          </div>
        </div>

        {/* 24H Change */}
        <div className="glass p-5">
          <div className="font-mono text-[8px] tracking-widest mb-3" style={{ color: '#999' }}>
            24H CHANGE
          </div>
          <div className="font-mono font-bold text-lg">
            <ChangeIndicator change={change1d} />
          </div>
        </div>

        {/* 7D Change */}
        <div className="glass p-5">
          <div className="font-mono text-[8px] tracking-widest mb-3" style={{ color: '#999' }}>
            7D CHANGE
          </div>
          <div className="font-mono font-bold text-lg">
            <ChangeIndicator change={change7d} />
          </div>
        </div>

        {/* Active Protocols */}
        <div className="glass p-5">
          <div className="font-mono text-[8px] tracking-widest mb-3" style={{ color: '#999' }}>
            ACTIVE PROTOCOLS
          </div>
          <div className="font-serif text-3xl font-bold text-dark">
            {protocols !== null && protocols !== undefined ? protocols : '—'}
          </div>
        </div>
      </div>

      {/* Data source attribution */}
      <div style={{ textAlign: 'right', marginTop: 12, fontSize: 11, color: '#999' }}>
        <a
          href={`https://defillama.com/chain/${chainName}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#1a6b00', textDecoration: 'none' }}
        >
          Data: DeFiLlama ↗
        </a>
      </div>
    </section>
  )
}