'use client'

import { useEffect, useMemo, useState } from 'react'
import { adminGet, adminPost, adminPatch, adminYoutubePreview, type YouTubePreview } from '@/lib/admin-api'

type VideoStatus = 'draft' | 'approved' | 'rejected'
type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced'

interface VideoRecord extends YouTubePreview {
  id: string
  summary: string
  difficulty: Difficulty[]
  categories: string[]
  status: VideoStatus
  is_featured: boolean
  display_order: number
  created_at?: string
  updated_at?: string
}

const difficulties: Difficulty[] = ['Beginner', 'Intermediate', 'Advanced']
const panel: React.CSSProperties = { background: '#101010', border: '1px solid #252525', borderRadius: 14, padding: 20 }
const field: React.CSSProperties = { width: '100%', boxSizing: 'border-box', background: '#080808', border: '1px solid #303030', borderRadius: 8, color: '#f2f2f2', padding: '11px 12px', font: '13px Inter, sans-serif', outline: 'none' }
const label: React.CSSProperties = { display: 'block', marginBottom: 7, color: '#929292', font: '700 9px monospace', letterSpacing: '.12em' }
const button: React.CSSProperties = { border: '1px solid #343434', background: '#151515', color: '#ddd', borderRadius: 8, padding: '9px 13px', font: '700 9px monospace', letterSpacing: '.08em', cursor: 'pointer' }
const primary: React.CSSProperties = { ...button, borderColor: '#c8ff00', background: '#c8ff00', color: '#080808' }

export default function VideoLibraryTab() {
  const [videos, setVideos] = useState<VideoRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [previewing, setPreviewing] = useState(false)
  const [url, setUrl] = useState('')
  const [metadata, setMetadata] = useState<YouTubePreview | null>(null)
  const [summary, setSummary] = useState('')
  const [difficulty, setDifficulty] = useState<Difficulty[]>([])
  const [categories, setCategories] = useState('')
  const [status, setStatus] = useState<VideoStatus>('draft')
  const [featured, setFeatured] = useState(false)
  const [order, setOrder] = useState('0')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [notice, setNotice] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [difficultyFilter, setDifficultyFilter] = useState('all')
  const [search, setSearch] = useState('')

  async function loadVideos() {
    setLoading(true)
    try {
      const data = await adminGet<VideoRecord[]>('youtube_videos', 500)
      setVideos(Array.isArray(data) ? data : [])
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not load the video library.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void loadVideos() }, [])

  const filteredVideos = useMemo(() => videos.filter(video => {
    const matchesStatus = statusFilter === 'all' || video.status === statusFilter
    const matchesDifficulty = difficultyFilter === 'all' || (video.difficulty || []).includes(difficultyFilter as Difficulty)
    const query = search.trim().toLowerCase()
    const matchesSearch = !query || video.title.toLowerCase().includes(query) || video.channel_title.toLowerCase().includes(query)
    return matchesStatus && matchesDifficulty && matchesSearch
  }), [videos, statusFilter, difficultyFilter, search])

  function resetForm() {
    setUrl('')
    setMetadata(null)
    setSummary('')
    setDifficulty([])
    setCategories('')
    setStatus('draft')
    setFeatured(false)
    setOrder('0')
    setEditingId(null)
  }

  async function getPreview() {
    if (!url.trim()) { setNotice('Paste a YouTube URL or video ID first.'); return }
    setPreviewing(true)
    setNotice('')
    try {
      const result = await adminYoutubePreview(url.trim())
      const duplicate = videos.find(video => video.youtube_video_id === result.video_id && video.id !== editingId)
      if (duplicate) {
        setNotice('This video is already in your library. Open its existing record to edit it.')
        setMetadata(null)
        return
      }
      setMetadata(result)
      setUrl(result.youtube_url)
      setNotice('YouTube metadata retrieved. Add the editorial details and save the record.')
    } catch (error) {
      setMetadata(null)
      setNotice(error instanceof Error ? error.message : 'YouTube metadata preview failed.')
    } finally {
      setPreviewing(false)
    }
  }

  function editVideo(video: VideoRecord) {
    setEditingId(video.id)
    setUrl(video.youtube_url)
    setMetadata({
      video_id: video.youtube_video_id,
      youtube_url: video.youtube_url,
      title: video.title,
      channel_title: video.channel_title,
      thumbnail_url: video.thumbnail_url,
    })
    setSummary(video.summary || '')
    setDifficulty(video.difficulty || [])
    setCategories((video.categories || []).join(', '))
    setStatus(video.status)
    setFeatured(video.is_featured)
    setOrder(String(video.display_order ?? 0))
    setNotice('Editing selected video.')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function toggleDifficulty(value: Difficulty) {
    setDifficulty(current => current.includes(value) ? current.filter(item => item !== value) : [...current, value])
  }

  async function saveVideo() {
    if (!metadata) { setNotice('Retrieve a YouTube preview before saving.'); return }
    if (difficulty.length === 0) { setNotice('Assign at least one difficulty level.'); return }
    setSaving(true)
    setNotice('')
    const payload = {
      youtube_video_id: metadata.video_id,
      title: metadata.title,
      channel_title: metadata.channel_title,
      thumbnail_url: metadata.thumbnail_url,
      summary,
      difficulty,
      categories: categories.split(',').map(item => item.trim().toLowerCase().replace(/\s+/g, '-')).filter(Boolean),
      status,
      is_featured: featured,
      display_order: Math.max(0, Number(order) || 0),
    }
    try {
      if (editingId) {
        const result = await adminPatch<VideoRecord[]>('youtube_videos', editingId, payload)
        const updated = Array.isArray(result) ? result[0] : undefined
        if (updated) setVideos(current => current.map(video => video.id === editingId ? updated : video))
        else await loadVideos()
        setNotice('Video record updated.')
      } else {
        const result = await adminPost<VideoRecord[]>('youtube_videos', payload)
        const created = Array.isArray(result) ? result[0] : undefined
        if (created) setVideos(current => [created, ...current])
        else await loadVideos()
        setNotice('Video saved as ' + status + '.')
      }
      resetForm()
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not save this video.')
    } finally {
      setSaving(false)
    }
  }

  async function updateStatus(video: VideoRecord, next: VideoStatus) {
    try {
      const result = await adminPatch<VideoRecord[]>('youtube_videos', video.id, { status: next })
      const updated = Array.isArray(result) ? result[0] : undefined
      setVideos(current => current.map(item => item.id === video.id ? (updated || { ...item, status: next }) : item))
      setNotice('Video status changed to ' + next + '.')
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not update video status.')
    }
  }

  return (
    <section style={{ display: 'grid', gap: 20 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ color: '#c8ff00', font: '700 9px monospace', letterSpacing: '.16em', marginBottom: 8 }}>CONTENT MANAGEMENT / YOUTUBE</div>
          <h2 style={{ margin: 0, color: '#f4f4f4', font: '600 27px Inter, sans-serif', letterSpacing: '-.04em' }}>NFT Video Library</h2>
          <p style={{ margin: '8px 0 0', color: '#888', fontSize: 13, lineHeight: 1.6, maxWidth: 650 }}>Add YouTube videos, review their metadata, write an editorial summary and control approval. Only approved records are intended for the public library.</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ ...button, cursor: 'default' }}>{videos.length} TOTAL</span>
          <span style={{ ...button, color: '#c8ff00', cursor: 'default' }}>{videos.filter(v => v.status === 'approved').length} APPROVED</span>
          <span style={{ ...button, color: '#e7bd72', cursor: 'default' }}>{videos.filter(v => v.status === 'draft').length} DRAFTS</span>
        </div>
      </header>

      <div style={panel}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 18 }}>
          <div>
            <h3 style={{ margin: 0, color: '#f1f1f1', fontSize: 16 }}>{editingId ? 'Edit video record' : 'Add a YouTube video'}</h3>
            <p style={{ margin: '5px 0 0', color: '#777', fontSize: 11 }}>Paste a YouTube URL or its 11-character video ID. Metadata is retrieved server-side.</p>
          </div>
          {editingId && <button type="button" style={button} onClick={resetForm}>CANCEL EDIT</button>}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: 9 }}>
          <input value={url} onChange={event => setUrl(event.target.value)} placeholder="https://www.youtube.com/watch?v=..." style={field} />
          <button type="button" disabled={previewing} style={{ ...primary, opacity: previewing ? .6 : 1 }} onClick={getPreview}>{previewing ? 'FETCHING…' : 'FETCH PREVIEW'}</button>
        </div>

        {metadata && (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(260px, .9fr)', gap: 18, marginTop: 18 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 10, background: '#050505', aspectRatio: '16 / 9' }}>
                <iframe title={'YouTube preview: ' + metadata.title} src={'https://www.youtube-nocookie.com/embed/' + metadata.video_id} style={{ width: '100%', height: '100%', border: 0, position: 'absolute', inset: 0 }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 12 }}>
                <img src={metadata.thumbnail_url} alt="" style={{ width: 92, aspectRatio: '16 / 9', objectFit: 'cover', borderRadius: 6, background: '#222' }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ color: '#f0f0f0', fontWeight: 700, fontSize: 13, lineHeight: 1.4 }}>{metadata.title}</div>
                  <div style={{ color: '#888', fontSize: 11, marginTop: 5 }}>{metadata.channel_title}</div>
                  <a href={metadata.youtube_url} target="_blank" rel="noreferrer" style={{ display: 'inline-block', color: '#c8ff00', fontSize: 10, marginTop: 7 }}>OPEN ON YOUTUBE ↗</a>
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', alignContent: 'start', gap: 14 }}>
              <div>
                <label style={label}>EDITORIAL SUMMARY</label>
                <textarea value={summary} onChange={event => setSummary(event.target.value)} rows={5} maxLength={3000} placeholder="Explain what the viewer will learn and why this video is worth their time." style={{ ...field, resize: 'vertical', lineHeight: 1.6 }} />
                <div style={{ color: '#666', fontSize: 10, textAlign: 'right' }}>{summary.length}/3000</div>
              </div>
              <div>
                <label style={label}>DIFFICULTY LEVELS · SELECT ALL THAT APPLY</label>
                <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                  {difficulties.map(level => <button key={level} type="button" onClick={() => toggleDifficulty(level)} style={{ ...button, borderColor: difficulty.includes(level) ? '#c8ff00' : '#343434', background: difficulty.includes(level) ? 'rgba(200,255,0,.12)' : '#151515', color: difficulty.includes(level) ? '#c8ff00' : '#aaa' }}>{level}</button>)}
                </div>
              </div>
              <div>
                <label style={label}>ADMIN CATEGORIES · OPTIONAL / NOT PUBLIC YET</label>
                <input value={categories} onChange={event => setCategories(event.target.value)} placeholder="e.g. DeFi, NFTs, Wallets" style={field} />
                <div style={{ color: '#666', fontSize: 10, marginTop: 5 }}>Comma-separated. Stored for internal filtering only.</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={label}>PUBLISHING STATUS</label>
                  <select value={status} onChange={event => setStatus(event.target.value as VideoStatus)} style={field}>
                    <option value="draft">Draft</option><option value="approved">Approved</option><option value="rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label style={label}>DISPLAY ORDER</label>
                  <input type="number" min="0" value={order} onChange={event => setOrder(event.target.value)} style={field} />
                </div>
              </div>
              <label style={{ display: 'flex', gap: 9, alignItems: 'center', color: '#bbb', fontSize: 12 }}>
                <input type="checkbox" checked={featured} onChange={event => setFeatured(event.target.checked)} /> Feature this video
              </label>
              <button type="button" disabled={saving} onClick={saveVideo} style={{ ...primary, padding: 13, opacity: saving ? .6 : 1 }}>{saving ? 'SAVING…' : editingId ? 'SAVE CHANGES' : 'SAVE VIDEO'}</button>
            </div>
          </div>
        )}
      </div>

      {notice && <div role="status" style={{ border: '1px solid #343434', background: '#111', color: '#c8ff00', borderRadius: 8, padding: '11px 14px', fontSize: 12 }}>{notice}</div>}

      <div style={{ ...panel, padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: 18, borderBottom: '1px solid #242424', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <h3 style={{ margin: 0, color: '#f2f2f2', fontSize: 16 }}>Library records</h3>
            <p style={{ margin: '5px 0 0', color: '#777', fontSize: 11 }}>Search, filter, edit and approve videos.</p>
          </div>
          <button type="button" style={button} onClick={() => void loadVideos()}>REFRESH</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(160px, 1fr) minmax(160px, 1fr) minmax(180px, 1.4fr)', gap: 9, padding: 14, borderBottom: '1px solid #242424' }}>
          <select value={statusFilter} onChange={event => setStatusFilter(event.target.value)} style={field}>
            <option value="all">All statuses</option><option value="draft">Drafts</option><option value="approved">Approved</option><option value="rejected">Rejected</option>
          </select>
          <select value={difficultyFilter} onChange={event => setDifficultyFilter(event.target.value)} style={field}>
            <option value="all">All difficulty levels</option>{difficulties.map(level => <option key={level} value={level}>{level}</option>)}
          </select>
          <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search title or channel…" style={field} />
        </div>
        {loading ? <div style={{ padding: 28, color: '#888', fontSize: 12 }}>Loading video records…</div> : filteredVideos.length === 0 ? <div style={{ padding: 28, color: '#777', fontSize: 12 }}>No videos match these filters.</div> : (
          <div style={{ display: 'grid', gap: 1, background: '#292929' }}>
            {filteredVideos.map(video => (
              <article key={video.id} style={{ display: 'grid', gridTemplateColumns: '150px minmax(0, 1fr) auto', gap: 15, alignItems: 'center', padding: 15, background: '#101010' }}>
                <img src={video.thumbnail_url} alt="" style={{ width: '100%', aspectRatio: '16 / 9', objectFit: 'cover', borderRadius: 7, background: '#222' }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ color: '#eee', fontSize: 13, fontWeight: 700, lineHeight: 1.4 }}>{video.title}</div>
                  <div style={{ color: '#777', fontSize: 10, marginTop: 4 }}>{video.channel_title} · {video.youtube_video_id}</div>
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 8 }}>
                    <span style={{ ...button, padding: '4px 7px', color: video.status === 'approved' ? '#c8ff00' : video.status === 'rejected' ? '#ff8181' : '#e7bd72' }}>{video.status.toUpperCase()}</span>
                    {(video.difficulty || []).map(level => <span key={level} style={{ ...button, padding: '4px 7px', color: '#aaa' }}>{level}</span>)}
                    {video.is_featured && <span style={{ ...button, padding: '4px 7px', color: '#c8ff00' }}>FEATURED</span>}
                  </div>
                  {video.summary && <p style={{ color: '#888', fontSize: 11, lineHeight: 1.5, margin: '8px 0 0' }}>{video.summary}</p>}
                </div>
                <div style={{ display: 'grid', gap: 7 }}>
                  <button type="button" style={button} onClick={() => editVideo(video)}>EDIT</button>
                  {video.status !== 'approved' && <button type="button" style={primary} onClick={() => void updateStatus(video, 'approved')}>APPROVE</button>}
                  {video.status !== 'rejected' && <button type="button" style={button} onClick={() => void updateStatus(video, 'rejected')}>REJECT</button>}
                  {video.status !== 'draft' && <button type="button" style={button} onClick={() => void updateStatus(video, 'draft')}>SET DRAFT</button>}
                  <a href={video.youtube_url} target="_blank" rel="noreferrer" style={{ color: '#c8ff00', font: '700 9px monospace', textAlign: 'center', textDecoration: 'none' }}>WATCH ↗</a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
      <style jsx>{`
        @media (max-width: 760px) {
          section > div:nth-of-type(2) > div:nth-child(3) { grid-template-columns: 1fr !important; }
          article { grid-template-columns: 96px minmax(0,1fr) !important; }
          article > div:last-child { grid-column: 1 / -1; display: flex !important; flex-wrap: wrap; }
          article > div:last-child button { flex: 1; }
        }
        @media (max-width: 620px) {
          .video-preview-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
