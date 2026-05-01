'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/',          label: 'HOME' },
  { href: '/airdrops',  label: 'AIRDROPS' },
  { href: '/toolkit',   label: '🛠️ TOOLKIT' },     // ← Added
  { href: '/showroom',  label: 'SHOWROOM' },
  { href: '/junkyard',  label: '💀 JUNKYARD' },
  { href: '/blog',      label: '✍ BLOG' },
]

export default function Nav() {
  const path = usePathname()

  return (
    <nav
      className="sticky top-0 z-50"
      style={{
        background: 'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
        boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
      }}
    >
      <div className="max-w-[1100px] mx-auto px-7 py-3 flex items-center justify-between flex-wrap gap-3">
        {/* Logo */}
        <Link href="/" className="no-underline">
          <div className="font-mono text-[7px] text-gray-300 tracking-[0.2em] mb-[1px]">DECENTRALIZED</div>
          <div className="font-serif text-[17px] font-bold text-dark tracking-tight">WEB3FARMYARD.COM</div>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-2 flex-wrap">
          {links.map(l => {
            const active = path === l.href || (l.href !== '/' && path.startsWith(l.href))
            return (
              <Link
                key={l.href}
                href={l.href}
                className="font-mono text-[10px] font-bold tracking-[0.1em] no-underline px-4 py-[7px] rounded-lg border transition-all"
                style={{
                  background:    active ? '#0a0a0a' : 'transparent',
                  color:         active ? '#c8ff00' : '#666',
                  borderColor:   active ? '#0a0a0a' : 'rgba(0,0,0,0.1)',
                }}
              >
                {l.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}