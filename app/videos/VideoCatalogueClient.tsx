'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { adminGet, setAdminCsrfToken } from '@/lib/admin-api'

type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced'
interface VideoRecord {
  id: number | string
  youtube_video_id: string
  youtube_url: string
  title: string
  channel_title: string
  thumbnail_url: string
  summary: string
  difficulty: Difficulty[]
  tags: string[]
  status: 'draft' | 'approved' | 'rejected'
  is_featured: boolean
  display_order: number
}

const levels: Array<'All levels' | Difficulty> = ['All levels', 'Beginner', 'Intermediate', 'Advanced']

export default function VideoCatalogueClient() {
  const [videos, setVideos] = useState<VideoRecord[]>([])
  const [level, setLevel] = useState<typeof levels[number]>('All levels')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    fetch('/api-proxy.php?action=public-videos', { cache: 'no-store' })
      .then(async response => {
        if (!response.ok) throw new Error('The video catalogue is temporarily unavailable.')
        const data = await response.json()
        if (active) setVideos(Array.isArray(data) ? data : [])
      })
      .catch(err => { if (active) setError(err instanceof Error ? err.message : 'Unable to load the catalogue.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase()
    return videos.filter(video => {
      const matchesLevel = level === 'All levels' || (video.difficulty || []).includes(level)
      const matchesSearch = !term || [video.title, video.channel_title, video.summary, ...(video.tags || [])].join(' ').toLowerCase().includes(term)
      return matchesLevel && matchesSearch
    }).sort((a, b) => Number(b.is_featured) - Number(a.is_featured) || a.display_order - b.display_order)
  }, [videos, level, search])

  if (loading) return <main style={shell}><p style={kicker}>WEB3FARMYARD / NFT & WEB3 VIDEO LIBRARY</p><h1 style={heading}>Loading the learning shelf…</h1></main>

  return <main style={shell}>
    <header style={{ maxWidth: 850, marginBottom: 34 }}>
      <p style={kicker}>WEB3FARMYARD / LEARN BY WATCHING</p>
      <h1 style={heading}>Videos<span style={{ color: '#c8ff00' }}>.</span></h1>
      <p style={copy}>Explore NFT tutorials, NFT marketplace walkthroughs, NFT minting guides, Web3 creator interviews and NFT live-streaming sessions. Search by topic or difficulty, then learn directly from the people building across Web3.</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 22 }}>
        <input aria-label="Search videos" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search NFTs, live streaming, marketplaces, creators…" style={searchField} />
        <select aria-label="Filter by difficulty" value={level} onChange={event => setLevel(event.target.value as typeof level)} style={searchField}>
          {levels.map(item => <option key={item} value={item}>{item}</option>)}
        </select>
      </div>
    </header>
    {error && <p role="alert" style={{ color: '#ff9292' }}>{error}</p>}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, color: '#929292', font: '10px monospace', letterSpacing: '.1em' }}>
      <span>APPROVED VIDEOS</span><span>{visible.length} VIDEOS</span>
    </div>
    {visible.length === 0 ? <section style={empty}><strong style={{ color: '#eee', fontSize: 18 }}>The shelf is being stocked.</strong><p style={copy}>Approved lessons will appear here as they are published.</p></section> :
      <section style={grid}>
        {visible.map(video => <Link key={video.id} href={`/videos/watch/?v=${encodeURIComponent(String(video.id))}`} style={videoCard}>
          <div style={{ position: 'relative', aspectRatio: '16 / 9', background: '#151515', overflow: 'hidden' }}>
            {/* YouTube thumbnails are public image assets returned by YouTube oEmbed. */}
            <img src={video.thumbnail_url} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            <span style={play}>▶</span>
            {video.is_featured && <span style={featured}>FEATURED</span>}
          </div>
          <div style={{ padding: 17 }}>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
              {(video.difficulty || []).map(item => <span key={item} style={levelTag}>{item.toUpperCase()}</span>)}
              {(video.tags || []).slice(0, 4).map(tag => <span key={tag} style={levelTag}>#{tag.replace(/-/g, ' ')}</span>)}
            </div>
            <h2 style={cardTitle}>{video.title}</h2>
            <p style={creator}>{video.channel_title}</p>
            {video.summary && <p style={summary}>{video.summary}</p>}
            <span style={watch}>WATCH LESSON ↗</span>
          </div>
        </Link>)}
      </section>
    }
    <footer style={{ marginTop: 64, paddingTop: 20, borderTop: '1px solid #252525', color: '#666', font: '9px monospace', letterSpacing: '.1em' }}>WEB3FARMYARD · NFT EDUCATION · WEB3 VIDEO GUIDES · CREATOR STREAMS</footer>
  </main>
}

const shell: React.CSSProperties = { minHeight: '100vh', background: '#090b0e', color: '#f2f3f5', padding: 'clamp(22px, 5vw, 64px)', fontFamily: 'Inter, sans-serif' }
const kicker: React.CSSProperties = { color: '#c8ff00', font: '700 9px monospace', letterSpacing: '.18em', margin: '0 0 16px' }
const heading: React.CSSProperties = { color: '#f4f5f6', fontSize: 'clamp(34px, 6vw, 62px)', lineHeight: 1.02, letterSpacing: '-.055em', fontWeight: 650, margin: '0 0 14px' }
const copy: React.CSSProperties = { color: '#969da7', fontSize: 14, lineHeight: 1.8, maxWidth: 680 }
const button: React.CSSProperties = { display: 'inline-block', marginTop: 12, padding: '12px 17px', borderRadius: 8, background: '#c8ff00', color: '#080a0b', textDecoration: 'none', font: '700 9px monospace', letterSpacing: '.1em' }
const searchField: React.CSSProperties = { minWidth: 190, flex: '1 1 220px', background: '#11151a', border: '1px solid #29313b', borderRadius: 8, padding: '12px 14px', color: '#e9edf2', fontSize: 12 }
const grid: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,285px),1fr))', gap: 16 }
const videoCard: React.CSSProperties = { display: 'block', overflow: 'hidden', border: '1px solid #252c34', borderRadius: 13, background: '#101419', color: 'inherit', textDecoration: 'none', transition: 'border-color .2s ease, transform .2s ease' }
const play: React.CSSProperties = { position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', display: 'grid', placeItems: 'center', width: 48, height: 48, borderRadius: 50, background: 'rgba(200,255,0,.94)', color: '#080a0b', fontSize: 17, paddingLeft: 3 }
const featured: React.CSSProperties = { position: 'absolute', left: 12, top: 12, background: '#c8ff00', color: '#090b0e', padding: '5px 8px', borderRadius: 4, font: '700 8px monospace', letterSpacing: '.08em' }
const levelTag: React.CSSProperties = { border: '1px solid #343d47', borderRadius: 4, color: '#aab3be', padding: '4px 6px', font: '8px monospace', letterSpacing: '.06em' }
const cardTitle: React.CSSProperties = { margin: '0 0 7px', color: '#f0f2f4', fontSize: 16, lineHeight: 1.4, fontWeight: 600 }
const creator: React.CSSProperties = { color: '#9aa3ad', fontSize: 11, margin: '0 0 10px' }
const summary: React.CSSProperties = { color: '#838d98', fontSize: 11, lineHeight: 1.65, margin: '0 0 14px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }
const watch: React.CSSProperties = { color: '#c8ff00', font: '700 9px monospace', letterSpacing: '.1em' }
const empty: React.CSSProperties = { border: '1px dashed #343b44', borderRadius: 12, padding: 32, background: '#101419' }
