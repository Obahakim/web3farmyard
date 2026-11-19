'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HakimAdminEntry() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/hakim/dashboard')
  }, [router])

  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a', color: '#c8ff00', display: 'grid', placeItems: 'center', fontFamily: 'monospace', fontSize: '11px' }}>
      OPENING WEB3FARMYARD ADMIN...
    </main>
  )
}
