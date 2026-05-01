'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Chain } from '@/lib/types'
import { fmt, fmtPct, toSlug, llamaLogo, initials } from '@/lib/defillama'

interface Props { initialChains: Chain[] }

export default function ShowroomGrid({ initialChains }: Props) {
  const [chains, setChains] = useState<Chain[]>(initialChains)
  const [mode, setMode] = useState<'tvl' | 'volume'>('tvl')
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // Refresh every 5 minutes client-side
  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const r = await fetch('https://api.llama.fi/v2/chains')
        if (!r.ok) return
        const data: Chain[] = await r.json()
        setChains(data.filter(c => c.tvl && c.tvl > 500_000).sort((a, b) => b.tvl - a.tvl))
        setLastUpdate(new Date())
      } catch {}
    }, 5 * 60 * 1000)
    return () => clearInterval(id)
  }, [])

  const sorted = mode === 'tvl'
    ? [...chains].sort((a, b) => (b.tvl || 0) - (a.tvl || 0))
    : [...chains].sort((a, b) => Math.abs(b.change_1d || 0) - Math.abs(a.change_1d || 0))

  return (
    <div>
      {/* Controls */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="font-mono text-[8px] tracking-[0.15em]" style={{ color: '#888' }}>
          {chains.length} CHAINS · UPDATED {lastUpdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="flex gap-1" style={{ background: '#1a1a1a', borderRadius: 8, overflow: 'hidden' }}>
          {(['tvl', 'volume'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="font-mono text-[9px] font-bold px-4 py-2 border-none cursor-pointer transition-all"
              style={{
                background: mode === m ? '#c8ff00' : '#0d0d0d',
                color: mode === m ? '#0a0a0a' : '#555',
              }}
            >
              {m === 'tvl' ? 'BY TVL' : 'BY ACTIVITY'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div
        className="glass overflow-hidden mb-8"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(110px,1fr))', gap: '2px', background: '#e8e8ea', borderRadius: 16 }}
      >
        {sorted.map((chain, i) => {
          const pct = chain.change_1d
          const pctColor = pct === null ? '#888' : pct > 0 ? '#1a6b00' : '#cc0000'
          const pctStr = pct === null ? '—' : (pct > 0 ? '+' : '') + pct.toFixed(1) + '%'
          const slug = toSlug(chain.name)
          const logoSrc = chain.gecko_id
            ? `https://icons.llama.fi/${chain.gecko_id}.jpg`
            : llamaLogo(chain.name)

          return (
            <Link
              key={chain.name}
              href={`/showroom/${slug}`}
              className="no-underline bento"
              style={{ background: '#fff', padding: '12px 10px', display: 'block' }}
            >
              {/* Logo */}
              <div
                className="mb-2 rounded-lg overflow-hidden flex items-center justify-center"
                style={{ width: 36, height: 36, background: '#f0f0f0' }}
              >
                <img
                  src={logoSrc}
                  alt={chain.name}
                  width={36} height={36}
                  style={{ objectFit: 'contain', padding: 4 }}
                  onError={e => {
                    const img = e.target as HTMLImageElement
                    img.style.display = 'none'
                    img.parentElement!.innerHTML = `<span style="font-family:'Space Mono',monospace;font-size:11px;font-weight:700;color:#666">${initials(chain.name)}</span>`
                  }}
                />
              </div>

              {/* Rank */}
              <div className="font-mono text-[7px] mb-1" style={{ color: '#bbb' }}>#{i + 1}</div>

              {/* Name */}
              <div
                className="font-bold text-dark mb-1"
                style={{ fontSize: 11, lineHeight: 1.3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
              >
                {chain.name}
              </div>

              {/* TVL */}
              <div className="font-serif font-bold text-dark" style={{ fontSize: 13 }}>{fmt(chain.tvl)}</div>

              {/* 24h change */}
              <div className="font-mono font-bold" style={{ fontSize: 8, color: pctColor }}>{pctStr}</div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
