'use client'

import Link from 'next/link'
import { useState } from 'react'
import PriceTicker from '@/components/PriceTicker'

export default function Nav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Toolkit', href: '/toolkit/' },
    { label: 'Showroom', href: '/showroom/' },
    { label: 'Videos', href: '/videos/' },
    { label: 'Blog', href: '/blog/' },
    { label: 'Airdrops', href: '/airdrops/' },
    { label: 'Junkyard', href: '/junkyard/' },
  ]

  return (
    <>
      <header className="site-header sticky top-0 z-50">
        <PriceTicker />
        <nav className="site-nav" aria-label="Main navigation">
          <div className="site-nav-inner">
            <Link href="/" className="site-nav-brand" aria-label="Web3Farmyard home">
              <span className="site-nav-mark" aria-hidden="true">W</span>
              <span>Web3Farmyard</span>
            </Link>

            <div className="site-nav-pill">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </div>

            <Link href="/#join-now" className="site-nav-join">
              Join Now <span aria-hidden="true">↗</span>
            </Link>

            <button
              type="button"
              className="site-nav-menu-button"
              aria-expanded={mobileMenuOpen}
              aria-controls="site-mobile-nav"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              onClick={() => setMobileMenuOpen(open => !open)}
            >
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                {mobileMenuOpen
                  ? <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  : <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
              </svg>
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="site-mobile-nav" id="site-mobile-nav">
              {navItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/#join-now"
                className="site-mobile-join"
                onClick={() => setMobileMenuOpen(false)}
              >
                Join Now <span aria-hidden="true">↗</span>
              </Link>
            </div>
          )}
        </nav>
      </header>
    </>
  )
}