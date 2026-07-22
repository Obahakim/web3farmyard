import { Chain } from './types'

const LLAMA = 'https://api.llama.fi'
const LLAMA_COINS = 'https://coins.llama.fi'

export async function getAllChains(): Promise<Chain[]> {
  try {
    const res = await fetch(`${LLAMA}/protocols`, { next: { revalidate: 3600 } })
    if (!res.ok) throw new Error(`DeFiLlama error: ${res.status}`)
    const data: Chain[] = await res.json()
    return data
      .filter(c => c.tvl && c.tvl > 500_000)
      .sort((a, b) => b.tvl - a.tvl)
  } catch {
    return []
  }
}

export async function getChainBySlug(slug: string): Promise<Chain | null> {
  const chains = await getAllChains()
  return chains.find(c =>
    toSlug(c.name) === slug.toLowerCase() ||
    c.name.toLowerCase() === slug.toLowerCase()
  ) || null
}

export function toSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export function fromSlug(slug: string, chains: Chain[]): Chain | undefined {
  return chains.find(c => toSlug(c.name) === slug.toLowerCase())
}

export function llamaLogo(name: string): string {
  const slug = name.toLowerCase()
    .replace(/\s*\/\s*/g, '-')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
  return `https://icons.llama.fi/${slug}.jpg`
}

export function fmt(n: number | null | undefined): string {
  if (!n || isNaN(n)) return '—'
  if (n >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B'
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(2) + 'M'
  if (n >= 1e3) return '$' + (n / 1e3).toFixed(2) + 'K'
  return '$' + n.toFixed(2)
}

export function fmtPct(n: number | null | undefined): string {
  if (n === null || n === undefined || isNaN(n)) return '—'
  const sign = n > 0 ? '+' : ''
  return sign + n.toFixed(2) + '%'
}

export function pctColor(n: number | null | undefined): string {
  if (!n || isNaN(n)) return 'text-gray-500'
  return n > 0 ? 'text-lime' : 'text-red'
}

export function initials(name: string): string {
  return (name || '?').split(' ').map(w => w[0] || '').join('').slice(0, 2).toUpperCase()
}
