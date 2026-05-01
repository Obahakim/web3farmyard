// FILE: app/airdrops/page.tsx
// ✅ STATIC EXPORT VERSION: ISR instead of force-dynamic

import type { Metadata } from 'next'
import AirdropsClient from './AirdropsClient'
import { getAirdrops } from '@/lib/supabase'
import { generateAirdropPageMetadata } from '@/lib/metadata'
import { generateFAQPageSchema } from '@/lib/schema'

import { trackAirdropClick } from '@/lib/analytics-complete'

const handleAirdropClick = (airdropName: string, url: string) => {
  trackAirdropClick(airdropName, url)
  window.open(url, '_blank')
}

// ✅ Metadata for SEO (must be in Server Component)
export const metadata: Metadata = generateAirdropPageMetadata()

// ✅ Server Component - handles metadata & server-side data fetching
export default async function AirdropsPage() {
  let airdrops: any[] = []
  
  try {
    airdrops = await getAirdrops() || []
  } catch (err) {
    console.error('Error fetching airdrops:', err)
    airdrops = []
  }

  // ✅ Generate FAQ schema safely
  const faqSchema = generateFAQPageSchema([])

  return (
    <>
      {/* Safe JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c'),
        }}
      />
      
      {/* ✅ Client Component - handles interactivity & analytics */}
      <AirdropsClient initialAirdrops={airdrops} />
    </>
  )
}

// ✅ ISR (Incremental Static Regeneration)
// Revalidate every 60 seconds - updates without rebuild
// Works perfectly with static export
export const revalidate = 60

// ❌ REMOVED: force-dynamic (breaks static export)
// ISR provides near-real-time updates instead