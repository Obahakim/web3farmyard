'use client'

import { useEffect, useMemo, useState } from 'react'
import { adminGet } from '@/lib/admin-api'

interface AnalyticsEvent {
  id?: string | number
  event_type?: string
  page?: string
  timestamp?: string
  duration_ms?: number | null
}

const card: React.CSSProperties = { background: '#101010', border: '1px solid #242424', borderRadius: 13, padding: 18 }
const muted: React.CSSProperties = { color: '#858585', fontSize: 11 }

export function OverviewTab({ airdrops, subscribers, users, onNavigate }: {
  airdrops: number
  subscribers: number
  users: number
  onNavigate: (tab: string) => void
}) {
  const metrics = [
    { label: 'AIRDROPS', value: airdrops, note: 'Managed listings' },
    { label: 'SUBSCRIBERS', value: subscribers, note: 'Newsletter records' },
    { label: 'FARMER PROFILES', value: users, note: 'Registered profiles' },
  ]
  const actions = [
    { title: 'Add an airdrop', detail: 'Create or update a listing', tab: 'airdrops', symbol: '↗' },
    { title: 'Compose newsletter', detail: 'Choose an audience and preview', tab: 'newsletter', symbol: '✉' },
    { title: 'Upload video link', detail: 'Fetch YouTube metadata and review', tab: 'videos', symbol: '▶' },
    { title: 'View subscribers', detail: 'Review subscription records', tab: 'subscribers', symbol: '◎' },
  ]
  return (
    <section style={{ display: 'grid', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 12 }}>
        {metrics.map(metric => <div key={metric.label} style={card}>
          <div style={{ color: '#9b9b9b', font: '700 9px monospace', letterSpacing: '.13em' }}>{metric.label}</div>
          <div style={{ color: '#c8ff00', font: '600 30px Inter,sans-serif', marginTop: 9 }}>{metric.value.toLocaleString()}</div>
          <div style={{ ...muted, marginTop: 5 }}>{metric.note}</div>
        </div>)}
      </div>
      <div>
        <div style={{ color: '#eee', font: '600 17px Inter,sans-serif', marginBottom: 12 }}>Quick actions</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: 10 }}>
          {actions.map(action => <button key={action.tab} type="button" onClick={() => onNavigate(action.tab)} style={{ ...card, textAlign: 'left', cursor: 'pointer', color: '#eee', minHeight: 116 }}>
            <div style={{ color: '#c8ff00', fontSize: 18 }}>{action.symbol}</div>
            <div style={{ font: '600 12px Inter,sans-serif', marginTop: 12 }}>{action.title}</div>
            <div style={{ ...muted, marginTop: 5, lineHeight: 1.5 }}>{action.detail}</div>
          </button>)}
        </div>
      </div>
      <div style={{ ...card, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ color: '#c8ff00', font: '700 9px monospace', letterSpacing: '.14em' }}>CONTENT WORKFLOW</div>
          <div style={{ color: '#eee', font: '600 15px Inter,sans-serif', marginTop: 7 }}>Keep the Farmyard current.</div>
          <p style={{ ...muted, maxWidth: 570, lineHeight: 1.65, margin: '6px 0 0' }}>Manage listings, send useful updates and curate educational videos from one place. Video records stay in draft until you approve them.</p>
        </div>
        <button type="button" onClick={() => onNavigate('videos')} style={{ background: '#c8ff00', border: 0, borderRadius: 8, padding: '12px 15px', color: '#080808', font: '700 9px monospace', cursor: 'pointer' }}>OPEN VIDEO LIBRARY ↗</button>
      </div>
      <style jsx>{`
        @media(max-width:800px){section > div:first-child{grid-template-columns:1fr 1fr!important}section > div:nth-child(2) > div:last-child{grid-template-columns:1fr 1fr!important}}
        @media(max-width:480px){section > div:first-child,section > div:nth-child(2) > div:last-child{grid-template-columns:1fr!important}}
      `}</style>
    </section>
  )
}

export function AnalyticsTab() {
  const [events, setEvents] = useState<AnalyticsEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    adminGet<AnalyticsEvent[]>('analytics_events', 500)
      .then(data => setEvents(Array.isArray(data) ? data : []))
      .catch(reason => setError(reason instanceof Error ? reason.message : 'Analytics could not be loaded.'))
      .finally(() => setLoading(false))
  }, [])

  const summary = useMemo(() => {
    const now = Date.now()
    const sevenDays = events.filter(event => event.timestamp && now - new Date(event.timestamp).getTime() <= 7 * 86400000)
    const byType = new Map<string, number>()
    const byPage = new Map<string, number>()
    sevenDays.forEach(event => {
      const type = event.event_type || 'unknown'
      const page = event.page || '/'
      byType.set(type, (byType.get(type) || 0) + 1)
      byPage.set(page, (byPage.get(page) || 0) + 1)
    })
    return {
      total: sevenDays.length,
      types: [...byType.entries()].sort((a,b) => b[1]-a[1]).slice(0,8),
      pages: [...byPage.entries()].sort((a,b) => b[1]-a[1]).slice(0,8),
    }
  }, [events])

  const panel: React.CSSProperties = { background: '#101010', border: '1px solid #242424', borderRadius: 12, padding: 18 }
  return (
    <section style={{ display: 'grid', gap: 16 }}>
      <header>
        <div style={{ color: '#c8ff00', font: '700 9px monospace', letterSpacing: '.15em' }}>PERFORMANCE / FIRST-PARTY EVENTS</div>
        <h2 style={{ margin: '8px 0 5px', color: '#f2f2f2', font: '600 25px Inter,sans-serif' }}>Analytics</h2>
        <p style={{ color: '#858585', fontSize: 12, margin: 0 }}>A view of the latest 500 recorded events, with a seven-day summary. No subscriber email data is shown here.</p>
      </header>
      {loading ? <div style={panel}>Loading analytics…</div> : error ? <div role="alert" style={{ ...panel, color: '#ff8b8b' }}>{error}</div> : (
        <>
          <div style={{ ...panel, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ color: '#c8ff00', font: '600 34px Inter,sans-serif' }}>{summary.total.toLocaleString()}</div>
            <div><div style={{ color: '#eee', fontSize: 13, fontWeight: 700 }}>Events in the last 7 days</div><div style={{ color: '#777', fontSize: 10, marginTop: 4 }}>Based on the most recent 500 records returned by the server.</div></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={panel}>
              <h3 style={{ color: '#eee', fontSize: 13, margin: '0 0 14px' }}>Event types</h3>
              {summary.types.length ? summary.types.map(([name,count]) => <div key={name} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, borderTop: '1px solid #242424', padding: '10px 0', color: '#aaa', fontSize: 11 }}><span>{name}</span><strong style={{ color: '#c8ff00' }}>{count}</strong></div>) : <p style={{ color: '#777', fontSize: 11 }}>No events in this period.</p>}
            </div>
            <div style={panel}>
              <h3 style={{ color: '#eee', fontSize: 13, margin: '0 0 14px' }}>Most active pages</h3>
              {summary.pages.length ? summary.pages.map(([name,count]) => <div key={name} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, borderTop: '1px solid #242424', padding: '10px 0', color: '#aaa', fontSize: 11 }}><span style={{ overflowWrap: 'anywhere' }}>{name}</span><strong style={{ color: '#c8ff00' }}>{count}</strong></div>) : <p style={{ color: '#777', fontSize: 11 }}>No page activity in this period.</p>}
            </div>
          </div>
        </>
      )}
      <style jsx>{`@media(max-width:650px){section > div:nth-of-type(3){grid-template-columns:1fr!important}}`}</style>
    </section>
  )
}
