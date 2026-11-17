'use client'
import { useState, useEffect } from 'react'

interface Props {
  chainName: string
  initialTvl: number
  initialChange1d: number | null
  initialChange7d: number | null
  initialChange1m: number | null
  rank: number
}

interface SnapshotChain {
  name: string
  tvl: number
  change_1d?: number | null
  change_7d?: number | null
  change_1m?: number | null
  dexVolume24h?: number | null
  nftVolume24h?: number | null
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isOptionalNumber(value: unknown): boolean {
  return value === undefined || value === null || (typeof value === 'number' && Number.isFinite(value))
}

function isSnapshotChain(value: unknown): value is SnapshotChain {
  return isRecord(value) &&
    typeof value.name === 'string' &&
    typeof value.tvl === 'number' &&
    Number.isFinite(value.tvl) &&
    isOptionalNumber(value.change_1d) &&
    isOptionalNumber(value.change_7d) &&
    isOptionalNumber(value.change_1m) &&
    isOptionalNumber(value.dexVolume24h) &&
    isOptionalNumber(value.nftVolume24h)
}

function formatNumber(num: number | null): string {
  if (num === null || !Number.isFinite(num)) return '—'
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
  if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`
  return `$${num.toFixed(2)}`
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
  rank,
}: Props) {
  const [tvl, setTvl] = useState(initialTvl)
  const [change1d, setChange1d] = useState(initialChange1d)
  const [change7d, setChange7d] = useState(initialChange7d)
  const [change1m, setChange1m] = useState(initialChange1m)
  const [dexVolume, setDexVolume] = useState<number | null>(null)
  const [nftVolume, setNftVolume] = useState<number | null>(null)
  const [updatedAt, setUpdatedAt] = useState<string | null>(null)
  const [snapshotError, setSnapshotError] = useState(false)
  const [currentRank, setCurrentRank] = useState(rank)

  useEffect(() => {
    let active = true

    const refresh = async () => {
      try {
        const response = await fetch('/showroom-data.php', { cache: 'no-store' })
        if (!response.ok) throw new Error(`Showroom data request failed: ${response.status}`)

        const data: unknown = await response.json()
        if (
          !isRecord(data) ||
          !Array.isArray(data.chains) ||
          !data.chains.every(isSnapshotChain) ||
          typeof data.updatedAt !== 'string' ||
          !Number.isFinite(Date.parse(data.updatedAt))
        ) {
          throw new Error('Showroom data response had an invalid shape')
        }

        const snapshotChains: SnapshotChain[] = data.chains
        const chain = snapshotChains.find(item => item.name === chainName)
        if (!active) return
        if (!chain) throw new Error(`Chain "${chainName}" was not found in the daily snapshot`)

        setTvl(chain.tvl)
        setChange1d(chain.change_1d ?? null)
        setChange7d(chain.change_7d ?? null)
        setChange1m(chain.change_1m ?? null)
        setDexVolume(typeof chain.dexVolume24h === 'number' ? chain.dexVolume24h : null)
        setNftVolume(typeof chain.nftVolume24h === 'number' ? chain.nftVolume24h : null)
        setUpdatedAt(data.updatedAt)
        setCurrentRank([...snapshotChains]
          .sort((a, b) => b.tvl - a.tvl)
          .findIndex(item => item.name === chainName) + 1)
        setSnapshotError(false)
      } catch (error) {
        console.error('Unable to load daily chain metrics:', error)
        if (active) setSnapshotError(true)
      }
    }

    void refresh()
    return () => {
      active = false
    }
  }, [chainName])

  return (
    <section className="mb-8">
      <div className="grid gap-4 md:grid-cols-4">
        {/* Rank */}
        <div className="glass p-5">
          <div className="font-mono text-[8px] tracking-widest mb-3" style={{ color: '#999' }}>
            RANK
          </div>
          <div className="font-serif text-3xl font-bold text-dark">#{currentRank}</div>
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
            24H TVL CHANGE
          </div>
          <div className="font-mono font-bold text-lg">
            <ChangeIndicator change={change1d} />
          </div>
        </div>

        {/* 7D Change */}
        <div className="glass p-5">
          <div className="font-mono text-[8px] tracking-widest mb-3" style={{ color: '#999' }}>
            7D TVL CHANGE
          </div>
          <div className="font-mono font-bold text-lg">
            <ChangeIndicator change={change7d} />
          </div>
        </div>

        <div className="glass p-5">
          <div className="font-mono text-[8px] tracking-widest mb-3" style={{ color: '#999' }}>
            30D TVL CHANGE
          </div>
          <div className="font-mono font-bold text-lg">
            <ChangeIndicator change={change1m} />
          </div>
        </div>

        <div className="glass p-5">
          <div className="font-mono text-[8px] tracking-widest mb-3" style={{ color: '#999' }}>
            24H DEX VOLUME
          </div>
          <div className="font-serif font-bold text-dark text-2xl">{formatNumber(dexVolume)}</div>
        </div>

        <div className="glass p-5">
          <div className="font-mono text-[8px] tracking-widest mb-3" style={{ color: '#999' }}>
            24H NFT VOLUME
          </div>
          <div className="font-serif font-bold text-dark text-2xl">{formatNumber(nftVolume)}</div>
        </div>
      </div>

      {/* Data source attribution */}
      <div style={{ textAlign: 'right', marginTop: 12, fontSize: 11, color: '#999' }}>
        {snapshotError && <span role="status">Daily snapshot unavailable; metrics may be build-time values. </span>}
        {updatedAt && <span>Snapshot: {new Date(updatedAt).toLocaleString('en-US', { timeZone: 'UTC' })} UTC · </span>}
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