'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

export default function NewbieHub() {
  const [open, setOpen]         = useState(false)
  const [showBadge, setShowBadge] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const btnRef   = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!localStorage.getItem('w3f_newbie_seen')) {
      setShowBadge(true)
    }
  }, [])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        open &&
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        btnRef.current  && !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [open])

  function toggle() {
    setOpen(o => !o)
    if (!open) {
      localStorage.setItem('w3f_newbie_seen', '1')
      setShowBadge(false)
    }
  }

  return (
    <>
      {/* Panel */}
      <div
        ref={panelRef}
        className={`newbie-panel ${open ? 'open' : ''}`}
        role="dialog"
        aria-label="Newbie Hub — beginner resources"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-[18px] pt-[18px] pb-0">
          <div>
            <div className="font-mono text-[8px] tracking-[0.18em] mb-1" style={{ color: '#1a6b00' }}>FREE RESOURCES</div>
            <div className="font-serif text-[17px] font-bold text-dark">Newbie Hub 🔧</div>
          </div>
          <button
            onClick={toggle}
            className="bg-transparent border-none text-gray-400 text-lg cursor-pointer p-1 hover:text-dark transition-colors"
          >✕</button>
        </div>
        <p
          className="px-[18px] py-[10px] text-xs"
          style={{ color: '#666', lineHeight: 1.6, borderBottom: '1px solid rgba(0,0,0,0.06)' }}
        >
          A clear place to begin learning the Web3 basics — for free.
        </p>

        {/* Resources */}
        <div className="p-[14px] flex flex-col gap-[10px]">
          {/* Ebook */}
          <Link
            href="/onboarding/day-1"
            className="no-underline block rounded-xl p-[14px] transition-all hover:shadow-md"
            style={{ background: '#f8f8f6', border: '1px solid rgba(0,0,0,0.06)' }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-11 h-14 rounded-md flex items-center justify-center flex-shrink-0 text-[22px]"
                style={{ background: 'linear-gradient(135deg,#0a0a0a,#1a6b00)' }}
              >📱</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-serif text-[13px] font-bold text-dark">7-Day Learning Path</span>
                  <span
                    className="font-mono text-[7px] px-2 py-[2px] rounded-full whitespace-nowrap"
                    style={{ background: '#dcfce7', color: '#166534' }}
                  >FREE COURSE</span>
                </div>
                <p className="text-[11px]" style={{ color: '#666', lineHeight: 1.5, margin: 0 }}>
                  Learn about wallets, DeFi, and on-chain basics one step at a time.
                </p>
                <div className="font-mono text-[8px] font-bold mt-[6px]" style={{ color: '#1a6b00' }}>
                  START LEARNING →
                </div>
              </div>
            </div>
          </Link>

          <div
            className="text-center py-[10px] font-mono text-[8px] tracking-[0.1em]"
            style={{ color: '#bbb' }}
          >
            MORE GUIDES COMING SOON
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-[18px] py-3 flex items-center justify-between"
          style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}
        >
          <span className="font-mono text-[8px]" style={{ color: '#bbb' }}>All resources are 100% free</span>
          <a href="mailto:support@web3farmyard.com" className="font-mono text-[8px] no-underline" style={{ color: '#1a6b00' }}>
            Contact us
          </a>
        </div>
      </div>

      {/* Floating button */}
      <button ref={btnRef} onClick={toggle} className="newbie-btn">
        🔧 NEWBIE HUB
        {showBadge && <span className="newbie-badge">1</span>}
      </button>
    </>
  )
}
