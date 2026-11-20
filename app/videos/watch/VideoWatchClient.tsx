'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface VideoRecord {
  id: number | string
  youtube_video_id: string
  title: string
  channel_title: string
  summary: string
  difficulty: string[]
  tags: string[]
}

export default function VideoWatchClient() {
  const [video, setVideo] = useState<VideoRecord | null>(null)
  const [state, setState] = useState<'checking' | 'ready' | 'missing'>('checking')

  useEffect(() => {
    let active = true
    const id = new URLSearchParams(window.location.search).get('v')
    if (!id) { setState('missing'); return }
    fetch('/api-proxy.php?action=public-videos', { cache: 'no-store' })
      .then(async response => {
        if (!response.ok) throw new Error('Unable to load this video.')
        const rows = await response.json()
        const selected = Array.isArray(rows) ? rows.find((row: VideoRecord) => String(row.id) === id) : null
        if (!active) return
        if (selected) { setVideo(selected); setState('ready') } else setState('missing')
      })
      .catch(() => { if (active) setState('missing') })
    return () => { active = false }
  }, [])

  const frame = (videoId: string) => `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?rel=0`

  if (state === 'checking') return <main style={shell}>LOADING LESSON…</main>
  if (state === 'missing' || !video) return <main style={shell}><p style={kicker}>LESSON NOT FOUND</p><h1 style={title}>This lesson is unavailable.</h1><Link href="/videos/" style={link}>BACK TO THE SHELF</Link></main>

  return <main style={shell}>
    <Link href="/videos/" style={back}>← ALL LESSONS</Link>
    <div style={playerWrap}><iframe src={frame(video.youtube_video_id)} title={video.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" style={{ width: '100%', height: '100%', border: 0 }} /></div>
    <article style={{ maxWidth: 900, margin: '28px auto' }}>
      <p style={kicker}>WEB3FARMYARD / VIDEO LESSON</p>
      <h1 style={title}>{video.title}</h1>
      <p style={creator}>{video.channel_title}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, margin: '16px 0' }}>{(video.difficulty || []).map(item => <span key={item} style={tag}>{item.toUpperCase()}</span>)}{(video.tags || []).map(item => <span key={item} style={tag}>#{item.replace(/-/g, ' ')}</span>)}</div>
      {video.summary && <p style={summary}>{video.summary}</p>}
    </article>
  </main>
}

const shell: React.CSSProperties = { minHeight: '100vh', background: '#090b0e', color: '#f2f3f5', padding: 'clamp(20px, 5vw, 60px)', fontFamily: 'Inter, sans-serif' }
const kicker: React.CSSProperties = { color: '#c8ff00', font: '700 9px monospace', letterSpacing: '.18em' }
const title: React.CSSProperties = { color: '#f4f5f6', fontSize: 'clamp(28px, 5vw, 48px)', lineHeight: 1.12, letterSpacing: '-.045em', margin: '12px 0', fontWeight: 650 }
const link: React.CSSProperties = { display: 'inline-block', marginTop: 15, background: '#c8ff00', color: '#080a0b', borderRadius: 7, padding: '11px 15px', textDecoration: 'none', font: '700 9px monospace' }
const back: React.CSSProperties = { display: 'inline-block', color: '#c8ff00', textDecoration: 'none', font: '700 9px monospace', letterSpacing: '.1em', marginBottom: 20 }
const playerWrap: React.CSSProperties = { width: 'min(100%, 1100px)', aspectRatio: '16 / 9', margin: '0 auto', overflow: 'hidden', border: '1px solid #252c34', borderRadius: 12, background: '#000' }
const creator: React.CSSProperties = { color: '#929ba5', fontSize: 12 }
const tag: React.CSSProperties = { border: '1px solid #343d47', color: '#aab3be', padding: '5px 7px', borderRadius: 4, font: '8px monospace' }
const summary: React.CSSProperties = { color: '#aab2bb', fontSize: 14, lineHeight: 1.8 }
