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
  const isDevelopment = process.env.NODE_ENV === 'development'

  useEffect(() => {
    const syncModeFromHash = () => {
      if (window.location.hash === '#rank-tvl') setMode('tvl')
      if (window.location.hash === '#rank-dex') setMode('dexVolume')
      if (window.location.hash === '#rank-nft') setMode('nftVolume')
    }

    syncModeFromHash()
    window.addEventListener('hashchange', syncModeFromHash)
    return () => window.removeEventListener('hashchange', syncModeFromHash)
  }, [])

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
  const hasNftVolumes = chains.some(chain => typeof chain.nftVolume24h === 'number')
  const snapshotIsStale = hasSnapshot && Date.now() - Date.parse(lastUpdate) > 24 * 60 * 60 * 1000
  const dexVolumeChains = chains.filter(chain =>
    typeof chain.dexVolume24h === 'number' && Number.isFinite(chain.dexVolume24h)
  )
  const nftVolumeChains = chains.filter(chain =>
    typeof chain.nftVolume24h === 'number' && Number.isFinite(chain.nftVolume24h)
  )
  const totalDexVolume = dexVolumeChains.reduce((total, chain) => total + (chain.dexVolume24h ?? 0), 0)
  const totalNftVolume = nftVolumeChains.reduce((total, chain) => total + (chain.nftVolume24h ?? 0), 0)
  const volumeDetail = (count: number) => {
    if (!hasSnapshot) {
      if (!isDevelopment) return ''
      return loadError ? 'Daily snapshot unavailable' : 'Waiting for daily snapshot'
    }
    if (count === 0) return isDevelopment ? 'No reported volume in snapshot' : ''
    return `Across ${count} reporting ${count === 1 ? 'chain' : 'chains'}`
  }
  const volumeValue = (total: number, count: number) =>
    !hasSnapshot || count === 0 ? '—' : total === 0 ? '$0.00' : fmt(total)

  return (
    <div className="showroom-ranking">
      <div className="showroom-bento" aria-label="24-hour volume and recommended guides">
        <article className="showroom-bento-card showroom-bento-dex">
          <div className="showroom-bento-label">
            <span>TOTAL DEX VOLUME · 24H</span>
            <span className="showroom-bento-marker" aria-hidden="true">↗</span>
          </div>
          <strong className="showroom-bento-value">{volumeValue(totalDexVolume, dexVolumeChains.length)}</strong>
          <p>{volumeDetail(dexVolumeChains.length)}</p>
        </article>

        <article className="showroom-bento-card showroom-bento-nft">
          <div className="showroom-bento-label">
            <span>TOTAL NFT VOLUME · 24H</span>
            <span className="showroom-bento-marker" aria-hidden="true">✦</span>
          </div>
          <strong className="showroom-bento-value">{volumeValue(totalNftVolume, nftVolumeChains.length)}</strong>
          <p>{volumeDetail(nftVolumeChains.length)}</p>
        </article>

        <Link href="/blog/how-to-position-for-airdrops-in-2026" className="showroom-bento-card showroom-bento-guide">
          <span className="showroom-bento-label">FIELD GUIDE <span aria-hidden="true">↗</span></span>
          <strong>How to Position for Airdrops in 2026</strong>
          <p>Strategies to maximize airdrop opportunities while managing risk.</p>
        </Link>

        <Link href="/blog/what-is-tvl-in-cryptocurrency-blockchain" className="showroom-bento-card showroom-bento-guide showroom-bento-guide-wide">
          <span className="showroom-bento-label">METRIC GUIDE <span aria-hidden="true">↗</span></span>
          <strong>What is TVL?</strong>
          <p>Understand a core measure of DeFi activity and blockchain adoption.</p>
        </Link>
      </div>

      <div className="showroom-controls">
        <div className="showroom-result-count">
          <strong>TOP {ranked.length} OF {sorted.length}</strong>
          <span>DATA AS OF {new Date(lastUpdate).toLocaleString('en-US', { timeZone: 'UTC' })} UTC</span>
        </div>
        <div className="showroom-mode-switch" role="group" aria-label="Choose ranking metric">
          {(['tvl', 'dexVolume', 'nftVolume'] as const).map(m => (
            <button
              key={m}
              id={m === 'tvl' ? 'rank-tvl' : m === 'dexVolume' ? 'rank-dex' : 'rank-nft'}
              type="button"
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              className="showroom-mode-button"
              style={{
                background: mode === m ? '#c8ff00' : 'transparent',
                color: mode === m ? '#0a0d11' : '#a6adbb',
              }}
            >
              {m === 'tvl' ? 'TVL' : m === 'dexVolume' ? 'DEX VOL 24H' : 'NFT VOL 24H'}
            </button>
          ))}
        </div>
      </div>

      {isDevelopment && loadError && (
        <p role="status" className="showroom-data-message showroom-data-error">
          Daily chain metrics are unavailable. Showing the build-time TVL snapshot.
          {' '}Next.js dev does not execute the Hostinger PHP snapshot endpoint.
        </p>
      )}
      {isDevelopment && partialFailures > 0 && (
        <p role="status" className="showroom-data-message showroom-data-warning">
          Some daily chain metrics could not be refreshed ({partialFailures} upstream requests).
        </p>
      )}
      {isDevelopment && snapshotIsStale && (
        <p role="status" className="showroom-data-message showroom-data-warning">
          This snapshot is over 24 hours old. Check that the Hostinger cron task is running.
        </p>
      )}
      {isDevelopment && hasSnapshot && !hasNftVolumes && (
        <p role="status" className="showroom-data-message showroom-data-warning">
          NFT volume is not available in this snapshot yet. Run the updated daily refresh to populate it.
        </p>
      )}
      {isDevelopment && mode !== 'tvl' && ranked.length === 0 && (
        <p role="status" className="showroom-data-message showroom-data-warning">
          No 24-hour {mode === 'dexVolume' ? 'DEX' : 'NFT'} volume data is available in this snapshot.
        </p>
      )}

      <div className="showroom-table-wrap">
        <table className="showroom-table">
          <thead>
            <tr>
              <th scope="col">RANK</th>
              <th scope="col">CHAIN</th>
              <th scope="col">{mode === 'tvl' ? 'TOTAL VALUE LOCKED' : mode === 'dexVolume' ? 'DEX VOLUME · 24H' : 'NFT VOLUME · 24H'}</th>
              <th scope="col">TVL CHANGE · 24H</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((chain, i) => {
              const pct = chain.change_1d
              const pctColor = pct === null || pct === undefined ? '#8992a2' : pct > 0 ? '#75d99b' : '#ff8585'
              const pctStr = pct === null || pct === undefined ? '—' : fmtPct(pct)
              const slug = toSlug(chain.name)
              const logoSrc = chain.gecko_id
                ? `https://icons.llama.fi/${chain.gecko_id}.jpg`
                : llamaLogo(chain.name)

              return (
                <tr key={chain.name}>
                  <td className="showroom-rank">#{i + 1}</td>
                  <td>
                    <Link href={`/showroom/${slug}`} className="showroom-chain-link">
                      <span className="showroom-chain-logo">
                        <img
                          src={logoSrc}
                          alt=""
                          width={32}
                          height={32}
                          onError={e => {
                            const img = e.target as HTMLImageElement
                            const fallback = document.createElement('span')
                            fallback.textContent = initials(chain.name)
                            img.replaceWith(fallback)
                          }}
                        />
                      </span>
                      <span className="showroom-chain-name">
                        <strong>{chain.name}</strong>
                        {chain.tokenSymbol && <small>{chain.tokenSymbol}</small>}
                      </span>
                    </Link>
                  </td>
                  <td className="showroom-metric-value">
                    {mode === 'tvl'
                      ? fmt(chain.tvl)
                      : fmt(mode === 'dexVolume' ? chain.dexVolume24h : chain.nftVolume24h)}
                  </td>
                  <td>
                    <span className="showroom-change" style={{ color: pctColor }}>
                      {pctStr}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
