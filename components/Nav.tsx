'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Nav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { label: 'HOME', href: '/' },
    { label: 'AIRDROPS', href: '/airdrops/' },
    { label: 'SHOWROOM', href: '/showroom/' },
    { label: 'TOOLKIT', href: '/toolkit/' },
    { label: 'JUNKYARD', href: '/junkyard/' },
    { label: 'BLOG', href: '/blog/' },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#1a1a1a] bg-[#0a0a0a]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="font-serif text-lg font-bold text-[#c8ff00] tracking-tight">
          Web3Farmyard
        </Link>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md border border-[#222] p-2 text-sm text-[#c8ff00] transition hover:border-[#444] hover:bg-white/5 md:hidden"
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation"
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-mono text-[11px] font-bold tracking-[0.1em] text-[#999] transition hover:text-[#c8ff00]"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {mobileMenuOpen ? (
        <div className="md:hidden border-t border-[#1a1a1a] bg-[#0a0a0a]/98 px-4 py-4">
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-lg px-3 py-2 font-mono text-sm tracking-[0.1em] text-[#ccc] transition hover:bg-[#111] hover:text-[#c8ff00]"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </nav>
  )
}