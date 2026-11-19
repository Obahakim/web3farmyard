'use client'
import { useState } from 'react'
import Link from 'next/link'
import { submitJunkyard } from '@/lib/supabase'

// ── Types ──────────────────────────────────────────────────────────────────
interface Item {
  id: string | number
  name: string
  logo: string
  cause_of_death: string
  obituary: string
  peak_price: string
  peak_tvl: string
  peak_volume: string
  date_of_death: string
  chain: string
  type: string
  category: string
  status: string
}

interface Props { initialItems: Item[] }

// ── Constants ─────────────────────────────────────────────────────────────
const CAUSE_THEME: Record<string, { bg: string; border: string; text: string; sub: string; label: string }> = {
  rug:       { bg: '#fff3f1', border: '#d66c61', text: '#49251f', sub: '#9b514b', label: 'RUG PULL'  },
  ponzi:     { bg: '#fff8e9', border: '#d89225', text: '#553a0b', sub: '#9c6a14', label: 'PONZI'     },
  exploit:   { bg: '#eef8f3', border: '#479d83', text: '#183f35', sub: '#437a6c', label: 'EXPLOIT'   },
  abandoned: { bg: '#f2f4ef', border: '#a5afa1', text: '#374237', sub: '#717b6d', label: 'ABANDONED' },
  collapse:  { bg: '#fff8e9', border: '#d89225', text: '#553a0b', sub: '#9c6a14', label: 'COLLAPSE'  },
}

// Slugs that have dedicated pre-rendered detail pages in /junkyard/[project]
const KNOWN_SLUGS = new Set([
  'luna-ust', 'ftx-ftt', 'bitconnect', 'squid-game-token', 'safemoon', 'iron-finance',
])

function toSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

// ── Tombstone card ────────────────────────────────────────────────────────
// onSelect is passed from parent so setSelectedItem is in scope
function Tombstone({ item, delay, onSelect }: { item: Item; delay: number; onSelect: (item: Item) => void }) {
  const t    = CAUSE_THEME[item.cause_of_death] || CAUSE_THEME.abandoned
  const slug = String(item.id).startsWith('seed-')
    ? String(item.id).replace('seed-', '')
    : toSlug(item.name)
  const ini  = item.name.split(' ').map((w: string) => w[0] || '').join('').slice(0, 2).toUpperCase()

  return (
    <div
      className="tombstone flex flex-col items-center"
      style={{
        background: t.bg, border: `2px solid ${t.border}`, borderRadius: 16,
        width: 210, minHeight: 290, flexShrink: 0,
        padding: '22px 16px 18px', gap: 11, position: 'relative',
        animationDelay: `${delay}ms`,
      }}
    >
      {/* Top colour stripe */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: t.border, borderRadius: '14px 14px 0 0' }} />

      {/* Logo */}
      <div style={{
        width: 76, height: 76, borderRadius: 12,
        background: 'rgba(255,255,255,0.8)', border: `1px solid ${t.border}55`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        {item.logo ? (
          <span style={{ fontSize: 30, lineHeight: 1 }}>{item.logo}</span>
        ) : (
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 18, color: t.sub, fontWeight: 700 }}>
            {ini}
          </span>
        )}
      </div>

      {/* Name */}
      <div style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700, textAlign: 'center', fontSize: 11, color: t.text, letterSpacing: '0.05em', lineHeight: 1.4, wordBreak: 'break-word', maxWidth: 175 }}>
        {item.name.toUpperCase()}
      </div>

      {/* Date */}
      <div style={{ fontFamily: "'Space Mono',monospace", textAlign: 'center', fontSize: 8, color: t.sub, letterSpacing: '0.07em' }}>
        {item.date_of_death || 'DATE UNKNOWN'}
      </div>

      {/* Cause badge */}
      <div style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700, color: '#0a0a0a', background: t.border, fontSize: 8, padding: '4px 12px', borderRadius: 20, letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
        {t.label}
      </div>

      {/* R.I.P. */}
      <div style={{ fontFamily: "'Playfair Display',serif", fontStyle: 'italic', fontSize: 11, color: t.sub, letterSpacing: 2, opacity: 0.7 }}>
        R.I.P.
      </div>

      {/* Link OR button depending on whether a detail page exists */}
      {KNOWN_SLUGS.has(slug) ? (
        <Link
          href={`/junkyard/${slug}`}
          className="font-mono font-bold no-underline text-center rounded-full"
          style={{ fontSize: 7, color: '#0a0a0a', background: t.border, padding: '4px 12px', marginTop: 'auto', letterSpacing: '0.1em', whiteSpace: 'nowrap', display: 'block' }}
        >
          VIEW DETAILS →
        </Link>
      ) : (
        <button
          onClick={() => onSelect(item)}
          className="font-mono font-bold text-center rounded-full border-none cursor-pointer"
          style={{ fontSize: 7, color: '#0a0a0a', background: t.border, padding: '4px 12px', marginTop: 'auto', letterSpacing: '0.1em', whiteSpace: 'nowrap', display: 'block', width: '100%' }}
        >
          VIEW DETAILS →
        </button>
      )}
    </div>
  )
}

// ── Chain card ────────────────────────────────────────────────────────────
function ChainCard({ item, onSelect }: { item: Item; onSelect: (item: Item) => void }) {
  const slug      = String(item.id).startsWith('seed-') ? String(item.id).replace('seed-', '') : toSlug(item.name)
  const catColors: Record<string, string> = { exploit: '#479d83', rug: '#d66c61', collapse: '#d89225', abandoned: '#8b9687', ponzi: '#d89225' }
  const c = catColors[item.cause_of_death] || '#8b9687'

  return (
    <div
      className="glass bento flex gap-4 items-start p-5 cursor-pointer"
      onClick={() => !KNOWN_SLUGS.has(slug) && onSelect(item)}
    >
      {KNOWN_SLUGS.has(slug) ? (
        <Link href={`/junkyard/${slug}`} className="no-underline flex gap-4 items-start w-full">
          <ChainCardInner item={item} c={c} />
        </Link>
      ) : (
        <ChainCardInner item={item} c={c} />
      )}
    </div>
  )
}

function ChainCardInner({ item, c }: { item: Item; c: string }) {
  return (
    <>
      <div style={{ width: 44, height: 44, borderRadius: 10, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {item.logo
          ? <span style={{ fontSize: 22 }}>{item.logo}</span>
          : <span style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: 11, color: '#666' }}>{item.name.slice(0, 2).toUpperCase()}</span>
        }
      </div>
      <div className="flex-1 min-w-0">
        <div style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: 11, color: '#0a0a0a', marginBottom: 4 }}>{item.name}</div>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 8, color: '#888', marginBottom: 8 }}>{item.chain} · {item.date_of_death}</div>
        <p style={{ fontSize: 12, color: '#555', lineHeight: 1.6, marginBottom: 10 }}>
          {(item.obituary || '').slice(0, 100)}{(item.obituary || '').length > 100 ? '...' : ''}
        </p>
        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 7, fontWeight: 700, color: '#fff', background: c, padding: '2px 8px', borderRadius: 20 }}>
          {(item.cause_of_death || '').toUpperCase()}
        </span>
      </div>
    </>
  )
}

// ── Main component ────────────────────────────────────────────────────────
export default function JunkyardClient({ initialItems }: Props) {
  const [filter, setFilter]                 = useState('all')
  const [showForm, setShowForm]             = useState(false)
  const [selectedItem, setSelectedItem]     = useState<Item | null>(null)
  const [form, setForm]                     = useState({
    name: '', cause_of_death: 'rug', chain: '', date_of_death: '',
    peak_price: '', peak_tvl: '', obituary: '', logo: '💀', type: 'project',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted]   = useState(false)

  const projects = initialItems.filter(i => i.type !== 'chain')
  const chains   = initialItems.filter(i => i.type === 'chain')
  const filtered = filter === 'all' ? projects : projects.filter(p => p.cause_of_death === filter)
  const half     = Math.ceil(filtered.length / 2)
  const shelf1   = filtered.slice(0, half)
  const shelf2   = filtered.slice(half)

  async function handleSubmit() {
    if (!form.name.trim()) return
    setSubmitting(true)
    await submitJunkyard({ ...form, status: 'pending' })
    setSubmitting(false)
    setSubmitted(true)
  }

  const filters = ['all', 'rug', 'ponzi', 'exploit', 'abandoned', 'collapse']

  return (
    <>
      <div>
        {/* Filter row */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            {filters.map(f => (
              <button key={f} onClick={() => setFilter(f)} className="filter-btn"
                style={{ background: filter === f ? '#183522' : 'transparent', color: filter === f ? '#c8f17a' : '#526357', borderColor: filter === f ? '#183522' : '#dce5d8' }}>
                {f === 'all' ? 'ALL' : f.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="flex gap-5">
            <div>
              <div className="font-mono text-[8px]" style={{ color: '#888' }}>CONFIRMED DEAD</div>
              <div className="font-serif text-xl font-bold" style={{ color: '#547a3d' }}>{projects.length}</div>
            </div>
            <div>
              <div className="font-mono text-[8px]" style={{ color: '#888' }}>VALUE LOST</div>
              <div className="font-serif text-xl font-bold" style={{ color: '#738166' }}>BILLIONS</div>
            </div>
          </div>
        </div>

        {/* Shelf 1 */}
        <div className="font-mono text-[8px] tracking-[0.15em] mb-4" style={{ color: '#888' }}>
          ☠ SHELF 01 — PROJECTS, RUGS &amp; PONZIS
        </div>
        {shelf1.length === 0 ? (
          <div className="font-mono text-[9px] tracking-[0.12em] mb-8" style={{ color: '#aaa' }}>SHELF EMPTY</div>
        ) : (
          <div className="shelf-items mb-8">
            {shelf1.map((item, i) => (
              <Tombstone key={String(item.id)} item={item} delay={i * 60} onSelect={setSelectedItem} />
            ))}
          </div>
        )}

        {/* Shelf 2 */}
        {shelf2.length > 0 && (
          <>
            <div className="font-mono text-[8px] tracking-[0.15em] mb-4" style={{ color: '#888' }}>
              ☠ SHELF 02 — EXPLOITS, HACKS &amp; ABANDONED
            </div>
            <div className="shelf-items mb-12">
              {shelf2.map((item, i) => (
                <Tombstone key={String(item.id)} item={item} delay={i * 60} onSelect={setSelectedItem} />
              ))}
            </div>
          </>
        )}

        {/* Dead chains */}
        {chains.length > 0 && (
          <>
            <div className="flex items-center gap-4 mb-5">
              <div className="font-mono text-[9px] tracking-[0.2em]" style={{ color: '#888' }}>⛓ DEAD CHAINS</div>
              <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.06)' }} />
            </div>
            <div className="grid gap-3 mb-12" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))' }}>
              {chains.map(item => (
                <ChainCard key={String(item.id)} item={item} onSelect={setSelectedItem} />
              ))}
            </div>
          </>
        )}

        {/* Submit form */}
        <div className="mb-12">
          <button onClick={() => setShowForm(v => !v)} className="btn-outline" style={{ borderColor: '#ccddc1', color: '#294d31' }}>
            ☠ REPORT A DEAD PROJECT
          </button>
          {showForm && (
            <div className="glass p-6 mt-4">
              <h2 className="font-serif text-lg font-bold text-dark mb-4">Report a Dead Project</h2>
              {submitted ? (
                <div className="text-center py-4">
                  <div className="text-3xl mb-2">💀</div>
                  <p className="font-bold text-dark">Reported. We verify everything before adding to the graveyard.</p>
                </div>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {[
                    { k: 'name',          label: 'Project Name *', ph: 'MoonCoin'   },
                    { k: 'chain',         label: 'Chain',          ph: 'Ethereum'   },
                    { k: 'date_of_death', label: 'Date of Death',  ph: 'Jan 2024'   },
                    { k: 'peak_price',    label: 'Peak Price',     ph: '$1.50'       },
                    { k: 'peak_tvl',      label: 'Peak TVL',       ph: '$50M'        },
                    { k: 'logo',          label: 'Emoji',          ph: '💀'          },
                  ].map(({ k, label, ph }) => (
                    <div key={k}>
                      <label className="font-mono text-[8px] tracking-[0.12em] block mb-1" style={{ color: '#888' }}>{label}</label>
                      <input
                        value={(form as Record<string, string>)[k]}
                        onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))}
                        placeholder={ph}
                        className="w-full rounded-lg px-3 py-2 text-sm border outline-none"
                        style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(0,0,0,0.12)' }}
                      />
                    </div>
                  ))}
                  <div className="md:col-span-2">
                    <label className="font-mono text-[8px] tracking-[0.12em] block mb-1" style={{ color: '#888' }}>OBITUARY</label>
                    <textarea
                      value={form.obituary}
                      onChange={e => setForm(p => ({ ...p, obituary: e.target.value }))}
                      rows={3}
                      placeholder="What happened? How did it die?"
                      className="w-full rounded-lg px-3 py-2 text-sm border outline-none resize-y"
                      style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(0,0,0,0.12)' }}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="font-mono text-[8px] tracking-[0.12em] block mb-2" style={{ color: '#888' }}>CAUSE OF DEATH</label>
                    <div className="flex gap-2 flex-wrap">
                      {['rug', 'ponzi', 'exploit', 'collapse', 'abandoned'].map(c => (
                        <button key={c} onClick={() => setForm(p => ({ ...p, cause_of_death: c }))} className="filter-btn"
                          style={{ background: form.cause_of_death === c ? '#183522' : 'transparent', color: form.cause_of_death === c ? '#c8f17a' : '#526357', borderColor: form.cause_of_death === c ? '#183522' : '#dce5d8' }}>
                          {c.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button onClick={handleSubmit} disabled={submitting} className="btn-primary md:col-span-2">
                    {submitting ? 'SUBMITTING...' : '☠ SUBMIT FOR REVIEW'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Inline detail modal for DB items ─────────────────────────────── */}
      {selectedItem && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={() => setSelectedItem(null)}
        >
          <div
            style={{ background: '#fff', borderRadius: 20, maxWidth: 580, width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: 32 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
              <span style={{ fontSize: 44, lineHeight: 1 }}>{selectedItem.logo || '💀'}</span>
              <div style={{ flex: 1 }}>
                <span style={{
                  fontFamily: "'Space Mono',monospace", fontSize: 8, fontWeight: 700,
                  padding: '3px 12px', borderRadius: 20, display: 'inline-block', marginBottom: 8,
                  background: (CAUSE_THEME[selectedItem.cause_of_death]?.border || '#888') + '22',
                  color: CAUSE_THEME[selectedItem.cause_of_death]?.border || '#888',
                }}>
                  {(selectedItem.cause_of_death || '').toUpperCase()}
                </span>
                <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 24, color: '#0a0a0a', lineHeight: 1.2, margin: '0 0 6px' }}>
                  {selectedItem.name}
                </h2>
                <p style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: '#888', margin: 0 }}>
                  {selectedItem.chain} · {selectedItem.date_of_death || 'Date unknown'}
                </p>
              </div>
              <button onClick={() => setSelectedItem(null)}
                style={{ background: 'transparent', border: '1px solid #ddd', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', fontSize: 16, flexShrink: 0, color: '#666' }}>
                ✕
              </button>
            </div>

            {/* Stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
              {([['PEAK PRICE', selectedItem.peak_price], ['PEAK TVL', selectedItem.peak_tvl], ['CHAIN', selectedItem.chain], ['DATE OF DEATH', selectedItem.date_of_death]] as [string, string][]).map(([label, value]) => value ? (
                <div key={label} style={{ background: '#f4f7f1', borderRadius: 10, padding: '12px 14px' }}>
                  <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 7, color: '#aaa', letterSpacing: '0.12em', marginBottom: 4 }}>{label}</div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 15, color: '#0a0a0a' }}>{value}</div>
                </div>
              ) : null)}
            </div>

            {/* Obituary */}
            {selectedItem.obituary && (
              <div style={{ background: '#f4f7f1', borderRadius: 12, padding: 18, marginBottom: 20 }}>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 16, color: '#0a0a0a', marginBottom: 8 }}>What happened?</h3>
                <p style={{ fontSize: 13, color: '#444', lineHeight: 1.8, margin: 0 }}>{selectedItem.obituary}</p>
              </div>
            )}

            {/* Footer note */}
            <p style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: '#aaa', marginBottom: 16 }}>
              ☠ This project is confirmed dead. No investment potential. For historical reference only.
            </p>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link href="/junkyard" className="btn-outline" style={{ fontSize: 9 }}
                onClick={() => setSelectedItem(null)}>
                ← BACK TO JUNKYARD
              </Link>
              <button onClick={() => setSelectedItem(null)} className="btn-primary" style={{ fontSize: 9 }}>
                CLOSE ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
