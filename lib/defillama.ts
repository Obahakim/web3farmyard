import { Chain } from './types'

const LLAMA = 'https://api.llama.fi'
const LLAMA_COINS = 'https://coins.llama.fi'

export async function getAllChains(): Promise<Chain[]> {
  const res = await fetch(`${LLAMA}/v2/chains`, { next: { revalidate: 86400 } })
  if (!res.ok) throw new Error(`DeFiLlama chains error: ${res.status}`)

  const data: unknown = await res.json()
  if (!Array.isArray(data)) throw new Error('DeFiLlama chains response was not a list')

  return data
    .filter((chain): chain is Chain =>
      typeof chain === 'object' &&
      chain !== null &&
      'name' in chain &&
      typeof chain.name === 'string' &&
      'tvl' in chain &&
      typeof chain.tvl === 'number' &&
      Number.isFinite(chain.tvl)
    )
    .sort((a, b) => b.tvl - a.tvl)
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
