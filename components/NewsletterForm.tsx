'use client'
import { useState } from 'react'
import { subscribeEmail } from '@/lib/supabase'

const TOPICS = [
  { id: 'defi',      label: 'DeFi',       icon: '📈' },
  { id: 'airdrops',  label: 'Airdrops',   icon: '🪂' },
  { id: 'nft',       label: 'NFTs',       icon: '🖼️' },
  { id: 'layer2',    label: 'Layer 2',    icon: '⚡' },
  { id: 'security',  label: 'Security',   icon: '🛡️' },
  { id: 'meme',      label: 'Memecoins',  icon: '🐸' },
]

export default function NewsletterForm() {
  const [email,    setEmail]    = useState('')
  const [selected, setSelected] = useState<string[]>([])
  const [freq,     setFreq]     = useState('weekly')
  const [status,   setStatus]   = useState<'idle'|'loading'|'ok'|'err'>('idle')
  const [msg,      setMsg]      = useState('')

  function toggle(id: string) {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  async function submit() {
    if (!email.trim()) return
    setStatus('loading')
    try {
      const res = await subscribeEmail(email.trim(), selected, freq)
      if (res.ok || res.msg === 'Already subscribed') {
        setStatus('ok')
        setMsg(res.msg === 'Already subscribed' ? 'Already subscribed! Good to have you.' : 'You\'re in the Farmyard. 🌾')
      } else {
        throw new Error(res.error || 'Subscription failed')
      }
    } catch (e: unknown) {
      setStatus('err')
      setMsg(e instanceof Error ? e.message : 'Something went wrong')
    }
  }

  if (status === 'ok') {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-3">🌾</div>
        <div className="font-serif text-xl font-bold text-dark mb-2">{msg}</div>
        <p className="text-sm" style={{ color: '#666' }}>Expect signal, not noise. We respect your inbox.</p>
      </div>
    )
  }

  return (
    <div>
      {/* Honeypot — bots fill this, humans don't see it */}
      <input
        type="text"
        name="website"
        style={{ display: 'none' }}
        tabIndex={-1}
        aria-hidden="true"
        autoComplete="off"
      />

      <div className="mb-4">
        <label className="font-mono text-[8px] tracking-[0.15em] block mb-2" style={{ color: '#888' }}>
          YOUR EMAIL
        </label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder="you@example.com"
          className="w-full rounded-lg px-3 py-[10px] text-sm border outline-none transition-all"
          style={{
            background: 'rgba(255,255,255,0.8)',
            border: '1px solid rgba(0,0,0,0.12)',
            fontFamily: 'Inter, sans-serif',
          }}
        />
      </div>

      <div className="mb-4">
        <label className="font-mono text-[8px] tracking-[0.15em] block mb-2" style={{ color: '#888' }}>
          INTERESTS (optional)
        </label>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map(t => (
            <button
              key={t.id}
              onClick={() => toggle(t.id)}
              className="font-mono text-[8px] font-bold px-3 py-[5px] rounded-full border transition-all cursor-pointer"
              style={{
                background:   selected.includes(t.id) ? '#0a0a0a' : 'transparent',
                color:        selected.includes(t.id) ? '#c8ff00' : '#555',
                borderColor:  selected.includes(t.id) ? '#0a0a0a' : 'rgba(0,0,0,0.12)',
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      {status === 'err' && (
        <div className="font-mono text-[9px] mb-3" style={{ color: '#cc0000' }}>{msg}</div>
      )}

      <button
        onClick={submit}
        disabled={status === 'loading' || !email.trim()}
        className="btn-primary w-full justify-center"
        style={{
          background: (status === 'loading' || !email.trim()) ? '#1a1a1a' : '#c8ff00',
          color:      (status === 'loading' || !email.trim()) ? '#555'   : '#0a0a0a',
        }}
      >
        {status === 'loading' ? 'SUBSCRIBING...' : '↗ SUBSCRIBE FREE'}
      </button>

      <p className="font-mono text-[8px] text-center mt-3" style={{ color: '#bbb' }}>
        No spam. Unsubscribe anytime.
      </p>
    </div>
  )
}
