'use client'

import { useEffect, useState } from 'react'

const assets = [
  { id: 'bitcoin', symbol: 'BTC' },
  { id: 'ethereum', symbol: 'ETH' },
  { id: 'solana', symbol: 'SOL' },
  { id: 'binancecoin', symbol: 'BNB' },
  { id: 'ripple', symbol: 'XRP' },
  { id: 'cardano', symbol: 'ADA' },
  { id: 'dogecoin', symbol: 'DOGE' },
  { id: 'chainlink', symbol: 'LINK' },
] as const

interface PriceQuote {
  id: string
  symbol: string
  usd: number
  change24h?: number
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function parseQuotes(value: unknown): PriceQuote[] {
  if (!isRecord(value)) throw new Error('CoinGecko returned an invalid price response')

  const quotes = assets.flatMap(asset => {
    const raw = value[asset.id]
    if (!isRecord(raw) || typeof raw.usd !== 'number' || !Number.isFinite(raw.usd)) return []

    return [{
      ...asset,
      usd: raw.usd,
      change24h: typeof raw.usd_24h_change === 'number' && Number.isFinite(raw.usd_24h_change)
        ? raw.usd_24h_change
        : undefined,
    }]
  })

  if (quotes.length === 0) throw new Error('CoinGecko returned no valid prices')
  return quotes
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: price >= 1 ? 2 : 5,
  }).format(price)
}

function PriceItems({ quotes }: { quotes: PriceQuote[] }) {
  return (
    <>
      {quotes.map(quote => (
        <span className="price-ticker-item" key={quote.id}>
          <strong>{quote.symbol}</strong>
          <span>{formatPrice(quote.usd)}</span>
          {quote.change24h !== undefined && (
            <span className={quote.change24h >= 0 ? 'price-ticker-up' : 'price-ticker-down'}>
              {quote.change24h >= 0 ? '+' : ''}{quote.change24h.toFixed(2)}%
            </span>
          )}
        </span>
      ))}
    </>
  )
}

export default function PriceTicker() {
  const [quotes, setQuotes] = useState<PriceQuote[] | null>(null)
  const [unavailable, setUnavailable] = useState(false)

  useEffect(() => {
    let active = true

    const refresh = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,binancecoin,ripple,cardano,dogecoin,chainlink&vs_currencies=usd&include_24hr_change=true',
          { cache: 'no-store' },
        )
        if (!response.ok) throw new Error(`CoinGecko price request failed: ${response.status}`)

        const data: unknown = await response.json()
        const nextQuotes = parseQuotes(data)
        if (!active) return

        setQuotes(nextQuotes)
        setUnavailable(false)
      } catch (error) {
        console.error('Unable to refresh the crypto price ticker:', error)
        if (active) setUnavailable(true)
      }
    }

    void refresh()
    const intervalId = window.setInterval(() => void refresh(), 5 * 60 * 1000)

    return () => {
      active = false
      window.clearInterval(intervalId)
    }
  }, [])

  return (
    <div
      className="price-ticker"
      aria-label="Cryptocurrency prices"
      title={unavailable ? 'Latest price refresh failed' : 'Prices from CoinGecko'}
    >
      <span className="price-ticker-label">
        <span className="price-ticker-dot" aria-hidden="true" />
        MARKETS
      </span>
      {quotes ? (
        <div className="price-ticker-viewport" aria-live="off">
          <div className="price-ticker-track">
            <div className="price-ticker-group">
              <PriceItems quotes={quotes} />
            </div>
            <div className="price-ticker-group" aria-hidden="true">
              <PriceItems quotes={quotes} />
            </div>
          </div>
        </div>
      ) : (
        <span className="price-ticker-status" role="status">
          {unavailable ? 'Live prices temporarily unavailable' : 'Loading live prices…'}
        </span>
      )}
      {unavailable && quotes && <span className="price-ticker-stale">Refresh unavailable</span>}
    </div>
  )
}
