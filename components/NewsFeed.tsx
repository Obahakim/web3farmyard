'use client'
import { useEffect, useState, useCallback, Suspense } from 'react'
import { NewsArticle } from '@/lib/types'

const CACHE_TTL = 3 * 60 * 60 * 1000 // 3 hours

interface Props {
  type: 'showroom' | 'junkyard'
  label: string
  description: string
  accentColor: string
  fallbackArticles?: NewsArticle[] // Fallback data to show while loading (SSR)
}

function timeAgo(ts: number): string {
  const secs = Math.floor(Date.now() / 1000) - ts
  if (secs < 60) return secs + 's ago'
  if (secs < 3600) return Math.floor(secs / 60) + 'm ago'
  if (secs < 86400) return Math.floor(secs / 3600) + 'h ago'
  return Math.floor(secs / 86400) + 'd ago'
}

// Skeleton loader while data is fetching
function NewsFeedSkeleton({ accentColor, label, description }: { accentColor: string; label: string; description: string }) {
  const dot = { background: accentColor }

  return (
    <div className="glass mb-8">
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-[6px] h-[6px] rounded-full inline-block animate-pulse" style={dot} />
            <span className="font-mono text-[8px] tracking-[0.18em] text-gray-400">LIVE FEED</span>
          </div>
          <div className="font-serif text-[15px] font-bold text-dark">{label}</div>
          <div className="text-[11px] mt-[2px]" style={{ color: '#888' }}>
            {description}
          </div>
        </div>
      </div>
      <div className="news-strip">
        <div className="font-mono text-[9px] tracking-[0.12em] text-gray-300 text-center w-full py-12">
          <span className="inline-block w-4 h-4 border-2 border-t-2 border-gray-300 border-t-current rounded-full animate-spin" style={{ borderTopColor: accentColor }} />
          <span className="block mt-3">Loading latest updates...</span>
        </div>
      </div>
    </div>
  )
}

// Client-side live feed loader
function LiveNewsFeed({ type, label, description, accentColor, fallbackArticles }: Props) {
  const [articles, setArticles] = useState<NewsArticle[]>(fallbackArticles || [])
  const [loading, setLoading] = useState(!fallbackArticles) // If no fallback, show loading
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [error, setError] = useState(false)

  const loadFeed = useCallback(async (force = false) => {
    const cacheKey = `w3f_news_${type}`
    setError(false)

    // Try cache first
    if (!force) {
      try {
        const cached = JSON.parse(localStorage.getItem(cacheKey) || 'null')
        if (cached && Date.now() - cached.ts < CACHE_TTL) {
          setArticles(cached.articles)
          setLastUpdated(new Date(cached.ts))
          setLoading(false)
          return
        }
      } catch {}
    }

    setLoading(true)
    try {
      const r = await fetch(`/api-proxy.php?action=news&type=${type}`)
      if (!r.ok) throw new Error(String(r.status))
      const d = await r.json()
      const arts: NewsArticle[] = d.articles || []
      const now = Date.now()

      // Only update if we got actual data (not empty array)
      if (arts.length > 0) {
        localStorage.setItem(cacheKey, JSON.stringify({ articles: arts, ts: now }))
        setArticles(arts)
      }
      setLastUpdated(new Date(now))
    } catch (err) {
      // If fetch fails but we have fallback data, keep showing that
      if (articles.length === 0) {
        setError(true)
      }
    } finally {
      setLoading(false)
    }
  }, [type, articles.length])

  // Load feed client-side AFTER initial render
  useEffect(() => {
    // Small delay to ensure page content renders first
    const timer = setTimeout(() => {
      loadFeed()
    }, 100)
    return () => clearTimeout(timer)
  }, [loadFeed])

  const dot = { background: accentColor }

  return (
    <div
      className="glass mb-8"
      style={type === 'junkyard' ? { borderLeft: '4px solid #ff4d4d' } : {}}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-[6px] h-[6px] rounded-full inline-block" style={dot} />
            <span className="font-mono text-[8px] tracking-[0.18em] text-gray-400">LIVE FEED</span>
            {lastUpdated && (
              <span className="font-mono text-[8px] text-gray-300 ml-2">
                {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>
          <div className="font-serif text-[15px] font-bold text-dark">{label}</div>
          <div className="text-[11px] mt-[2px]" style={{ color: '#888' }}>
            {description}
          </div>
        </div>
        <button
          onClick={() => loadFeed(true)}
          className="font-mono text-[8px] border rounded-lg px-3 py-[6px] bg-transparent cursor-pointer transition-all hover:bg-white"
          style={{ borderColor: 'rgba(0,0,0,0.1)', color: '#666' }}
          title="Refresh"
        >
          ↻
        </button>
      </div>

      {/* Content Strip */}
      <div className="news-strip">
        {error && articles.length === 0 && (
          <div
            className="font-mono text-[9px] tracking-[0.12em] text-center w-full py-8"
            style={{ color: '#cc0000' }}
          >
            FEED TEMPORARILY UNAVAILABLE — CLICK ↻ TO RETRY
          </div>
        )}

        {articles.length === 0 && !error && (
          <div className="font-mono text-[9px] tracking-[0.12em] text-gray-300 text-center w-full py-8">
            NO STORIES YET
          </div>
        )}

        {articles.map((a, i) => (
          <NewsCard key={i} article={a} accentColor={accentColor} junkyard={type === 'junkyard'} />
        ))}
      </div>
    </div>
  )
}

/**
 * NewsFeed component - Suspends until client hydrates, then loads live data
 * IMPORTANT: This lazy-loads client-side so Google indexes the page content
 * immediately, not the "FETCHING" loader state
 */
export default function NewsFeed(props: Props) {
  return (
    <Suspense fallback={<NewsFeedSkeleton {...props} />}>
      <LiveNewsFeed {...props} />
    </Suspense>
  )
}

function NewsCard({
  article: a,
  accentColor,
  junkyard,
}: {
  article: NewsArticle
  accentColor: string
  junkyard: boolean
}) {
  const catColors: Record<string, string> = {
    chain: '#1a6b00',
    defi: '#1a6b00',
    exploit: '#cc0000',
    hack: '#cc0000',
    rug: '#dc2626',
    security: '#b91c1c',
    fraud: '#991b1b',
    market: '#d97706',
    tech: '#0ea5e9',
    collapse: '#cc0000',
  }
  const catColor = catColors[a.category] || accentColor
  const hasImg = a.image && a.image.startsWith('http')

  return (
    <a
      href={a.url || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className="news-card"
      style={junkyard ? { borderTop: `3px solid ${catColor}` } : {}}
    >
      {hasImg && (
        <div style={{ height: 110, background: '#f0f0f0', overflow: 'hidden' }}>
          <img
            src={a.image}
            alt={a.title}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={e => {
              ;(e.target as HTMLElement).parentElement!.style.display = 'none'
            }}
          />
        </div>
      )}
      <div style={{ padding: '12px 14px' }}>
        <div className="flex items-center gap-[6px] mb-[6px]">
          <span
            className="font-mono text-[7px] font-bold text-white px-2 py-[2px] rounded-full whitespace-nowrap"
            style={{ background: catColor }}
          >
            {(a.category || 'NEWS').toUpperCase()}
          </span>
          <span className="font-mono text-[7px] text-gray-400">{a.source}</span>
          {a.time > 0 && (
            <span className="font-mono text-[7px] text-gray-300 ml-auto">{timeAgo(a.time)}</span>
          )}
        </div>
        <div
          className="font-serif font-bold text-dark mb-[6px]"
          style={{ fontSize: 13, lineHeight: 1.4 }}
        >
          {a.title}
        </div>
        {a.summary && (
          <div
            className="text-[11px]"
            style={{
              color: '#666',
              lineHeight: 1.55,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical' as const,
              overflow: 'hidden',
            }}
          >
            {a.summary}
          </div>
        )}
      </div>
    </a>
  )
}
