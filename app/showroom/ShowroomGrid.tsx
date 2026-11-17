'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Chain } from '@/lib/types'
import { fmt, fmtPct, toSlug, llamaLogo, initials } from '@/lib/defillama'

interface ShowroomSnapshot {
  chains: Chain[]
  updatedAt: string
  partialFailures: number
}

interface Props {
  initialChains: Chain[]
  initialUpdatedAt: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isOptionalNumber(value: unknown): boolean {
  return value === undefined || value === null || (typeof value === 'number' && Number.isFinite(value))
}

function isOptionalString(value: unknown): boolean {
  return value === undefined || value === null || typeof value === 'string'
}

function isChain(value: unknown): value is Chain {
  return isRecord(value) &&
    typeof value.name === 'string' &&
    typeof value.tvl === 'number' &&
    Number.isFinite(value.tvl) &&
    isOptionalNumber(value.change_1d) &&
    isOptionalNumber(value.change_7d) &&
    isOptionalNumber(value.change_1m) &&
    isOptionalNumber(value.dexVolume24h) &&
    isOptionalNumber(value.nftVolume24h) &&
    isOptionalNumber(value.chainId) &&
    isOptionalString(value.tokenSymbol) &&
    isOptionalString(value.gecko_id)
}

function isSnapshot(value: unknown): value is ShowroomSnapshot {
  return isRecord(value) &&
    Array.isArray(value.chains) &&
    value.chains.every(isChain) &&
    typeof value.updatedAt === 'string' &&
    Number.isFinite(Date.parse(value.updatedAt)) &&
    typeof value.partialFailures === 'number' &&
    Number.isInteger(value.partialFailures) &&
    value.partialFailures >= 0
}

export default function ShowroomGrid({ initialChains, initialUpdatedAt }: Props) {
  const [chains, setChains] = useState<Chain[]>(initialChains)
  const [mode, setMode] = useState<'tvl' | 'dexVolume' | 'nftVolume'>('tvl')
  const [lastUpdate, setLastUpdate] = useState(initialUpdatedAt)
  const [hasSnapshot, setHasSnapshot] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const [partialFailures, setPartialFailures] = useState(0)

  useEffect(() => {
    let active = true

    const refresh = async () => {
      try {
        const response = await fetch('/showroom-data.php', { cache: 'no-store' })
        if (!response.ok) throw new Error(`Showroom data request failed: ${response.status}`)

        const data: unknown = await response.json()
        if (!isSnapshot(data)) throw new Error('Showroom data response had an invalid shape')
        if (!active) return

        setChains(data.chains)
        setLastUpdate(data.updatedAt)
        setPartialFailures(data.partialFailures)
        setHasSnapshot(true)
        setLoadError(false)
      } catch (error) {
        console.error('Unable to load the daily Showroom snapshot:', error)
        if (active) setLoadError(true)
      }
    }

    void refresh()
    const id = setInterval(() => void refresh(), 24 * 60 * 60 * 1000)

    return () => {
      active = false
      clearInterval(id)
    }
  }, [])

  const sorted = mode === 'tvl'
    ? [...chains].sort((a, b) => (b.tvl || 0) - (a.tvl || 0))
    : mode === 'dexVolume'
      ? [...chains]
        .filter(chain => chain.dexVolume24h !== null && chain.dexVolume24h !== undefined)
        .sort((a, b) => (b.dexVolume24h || 0) - (a.dexVolume24h || 0))
      : [...chains]
        .filter(chain => chain.nftVolume24h !== null && chain.nftVolume24h !== undefined)
        .sort((a, b) => (b.nftVolume24h || 0) - (a.nftVolume24h || 0))
  const ranked = sorted.slice(0, 50)
  const hasDexVolumes = chains.some(chain => typeof chain.dexVolume24h === 'number')
  const hasNftVolumes = chains.some(chain => typeof chain.nftVolume24h === 'number')
  const snapshotIsStale = hasSnapshot && Date.now() - Date.parse(lastUpdate) > 24 * 60 * 60 * 1000

  return (
    <div>
      {/* Controls */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="font-mono text-[8px] tracking-[0.15em]" style={{ color: '#888' }}>
          TOP {ranked.length} OF {sorted.length} CHAINS · DATA AS OF {new Date(lastUpdate).toLocaleString('en-US', { timeZone: 'UTC' })} UTC
        </div>
        <div className="flex flex-wrap gap-1" style={{ background: '#1a1a1a', borderRadius: 8, overflow: 'hidden' }}>
          {(['tvl', 'dexVolume', 'nftVolume'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              disabled={
                (m === 'dexVolume' && (!hasSnapshot || !hasDexVolumes)) ||
                (m === 'nftVolume' && (!hasSnapshot || !hasNftVolumes))
              }
              className="font-mono text-[9px] font-bold px-4 py-2 border-none cursor-pointer transition-all"
              style={{
                background: mode === m ? '#c8ff00' : '#0d0d0d',
                color: mode === m ? '#0a0a0a' : '#888',
                opacity:
                  (m === 'dexVolume' && (!hasSnapshot || !hasDexVolumes)) ||
                  (m === 'nftVolume' && (!hasSnapshot || !hasNftVolumes))
                    ? 0.5
                    : 1,
              }}
            >
              {m === 'tvl' ? 'BY TVL' : m === 'dexVolume' ? 'BY 24H DEX VOLUME' : 'BY 24H NFT VOLUME'}
            </button>
          ))}
        </div>
      </div>

      {loadError && (
        <p role="status" className="mb-4 text-sm text-red-700">
          Daily chain metrics are unavailable. Showing the build-time TVL snapshot.
        </p>
      )}
      {partialFailures > 0 && (
        <p role="status" className="mb-4 text-sm text-amber-700">
          Some daily chain metrics could not be refreshed ({partialFailures} upstream requests).
        </p>
      )}
      {snapshotIsStale && (
        <p role="status" className="mb-4 text-sm text-amber-700">
          This snapshot is over 24 hours old. Check that the Hostinger cron task is running.
        </p>
      )}
      {hasSnapshot && !hasNftVolumes && (
        <p role="status" className="mb-4 text-sm text-amber-700">
          NFT volume is not available in this snapshot yet. Run the updated daily refresh to populate it.
        </p>
      )}

      {/* Grid */}
      <div
        className="glass overflow-hidden mb-8"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(110px,1fr))', gap: '2px', background: '#e8e8ea', borderRadius: 16 }}
      >
        {ranked.map((chain, i) => {
          const pct = chain.change_1d
          const pctColor = pct === null || pct === undefined ? '#888' : pct > 0 ? '#1a6b00' : '#cc0000'
          const pctStr = pct === null || pct === undefined ? '—' : fmtPct(pct)
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
                    const fallback = document.createElement('span')
                    fallback.style.fontFamily = "'Space Mono',monospace"
                    fallback.style.fontSize = '11px'
                    fallback.style.fontWeight = '700'
                    fallback.style.color = '#666'
                    fallback.textContent = initials(chain.name)
                    img.replaceWith(fallback)
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

              <div className="font-serif font-bold text-dark" style={{ fontSize: 13 }}>
                {mode === 'tvl'
                  ? fmt(chain.tvl)
                  : fmt(mode === 'dexVolume' ? chain.dexVolume24h : chain.nftVolume24h)}
              </div>
              <div className="font-mono text-[7px] text-gray-400">
                {mode === 'tvl' ? 'TVL' : mode === 'dexVolume' ? '24H DEX VOLUME' : '24H NFT VOLUME'}
              </div>

              <div className="font-mono font-bold" style={{ fontSize: 8, color: pctColor }}>
                {pctStr} (24h TVL)
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
