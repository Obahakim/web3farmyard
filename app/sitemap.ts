import { MetadataRoute } from 'next'
import { getAllChains, toSlug } from '@/lib/defillama'
import { PROJECT_DETAILS } from '@/lib/junkyard-data'

export const dynamic = 'force-static'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const chains = await getAllChains().catch(() => [])
  const BASE = 'https://www.web3farmyard.com'
  const NOW  = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                              lastModified: NOW, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE}/airdrops`,                lastModified: NOW, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/showroom`,                lastModified: NOW, changeFrequency: 'hourly',  priority: 0.9 },
    { url: `${BASE}/junkyard`,                lastModified: NOW, changeFrequency: 'daily',   priority: 0.8 },
    { url: `${BASE}/resources/mobile-farmer`, lastModified: NOW, changeFrequency: 'monthly', priority: 0.7 },
  ]

  const chainPages: MetadataRoute.Sitemap = chains.map(c => ({
    url: `${BASE}/showroom/${toSlug(c.name)}`,
    lastModified: NOW,
    changeFrequency: 'hourly' as const,
    priority: c.tvl > 1e9 ? 0.8 : 0.6,
  }))

  const projectPages: MetadataRoute.Sitemap = Object.keys(PROJECT_DETAILS).map(slug => ({
    url: `${BASE}/junkyard/${slug}`,
    lastModified: new Date('2026-04-05'),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...chainPages, ...projectPages]
}
