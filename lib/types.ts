export interface Chain {
  name: string
  tvl: number
  change_1d: number | null
  change_7d: number | null
  change_1m: number | null
  protocols: number | null
  tokenSymbol?: string
  chainId?: number
  gecko_id?: string
  cmcId?: string
}

export interface Airdrop {
  id: string
  name: string
  logo: string
  reward: string
  task: string
  chain: string
  risk: 'low' | 'medium' | 'high'
  deadline: string
  url: string
  image_url: string
  status: string
  created_at: string
}

export interface JunkyardItem {
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
  type: 'project' | 'chain'
  category: string
  status: string
}

export interface Post {
  id: string
  title: string
  excerpt: string
  body: string
  tags: string[]
  image: string
  urls: { label: string; url: string }[]
  status: string
  date: string
  ai: boolean
  created_at: string
}

export interface NewsArticle {
  title: string
  url: string
  source: string
  time: number
  category: string
  image: string
  summary: string
}

export interface ChainDetail {
  name: string
  slug: string
  symbol?: string
  description: string
  launched: string
  category: string
  consensus: string
  evmCompatible: boolean
  website?: string
  explorer?: string
  highlights: string[]
  tvl?: number
  protocols?: number
  rank?: number
}
