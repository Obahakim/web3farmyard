// ── WordPress Headless CMS Integration ────────────────────────────────────
const WP_URL = process.env.NEXT_PUBLIC_WP_URL || 'https://www.web3farmyard.com/cms'

export interface WPPost {
  id:             number
  slug:           string
  status:         string
  title:          { rendered: string }
  excerpt:        { rendered: string }
  content:        { rendered: string }
  date:           string
  modified:       string
  featured_media: number
  _embedded?: any
  yoast_head_json?: {
    title?:       string
    description?: string
  }
}

// Lighter fetch for list of posts (avoids 400 error)
export async function getWPPosts(perPage = 30): Promise<WPPost[]> {
  try {
    console.log(`🔄 Fetching up to ${perPage} posts from ${WP_URL}...`)

    const res = await fetch(
      `${WP_URL}/wp-json/wp/v2/posts?status=publish&per_page=${perPage}`,
      { next: { revalidate: 3600 } }   // ISR: revalidate every hour
    )

    if (!res.ok) {
      console.error(`❌ WordPress API error: ${res.status} ${res.statusText}`)
      return []
    }

    const posts = await res.json()
    console.log(`✅ Successfully fetched ${posts.length} published posts`)
    return posts
  } catch (error) {
    console.error('❌ Failed to fetch posts from WordPress:', error)
    return []
  }
}

// Single post (keep _embed only for one post)
export async function getWPPostBySlug(slug: string): Promise<WPPost | null> {
  try {
    const res = await fetch(
      `${WP_URL}/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed=1`,
      { next: { revalidate: 3600 } }
    )

    if (!res.ok) return null
    const posts: WPPost[] = await res.json()
    return posts[0] || null
  } catch {
    return null
  }
}

// Keep other functions simple
export async function getWPRecentPosts(count = 3): Promise<WPPost[]> {
  try {
    const res = await fetch(
      `${WP_URL}/wp-json/wp/v2/posts?status=publish&per_page=${count}`,
      { next: { revalidate: 1800 } }
    )
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export async function getWPCategories() {
  try {
    const res = await fetch(`${WP_URL}/wp-json/wp/v2/categories?per_page=50&hide_empty=true`, {
      next: { revalidate: 86400 }
    })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

// Helpers (unchanged)
export function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

export function getFeaturedImage(post: any): string {
  return post._embedded?.['wp:featuredmedia']?.[0]?.source_url || ''
}

export function getPostCategories(post: any): string[] {
  return (post._embedded?.['wp:term']?.[0] || []).map((t: any) => t.name)
}

export function formatWPDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch { return dateStr }
}

export function readingTime(content: string): string {
  const words = stripHtml(content).split(/\s+/).length
  const mins = Math.max(1, Math.round(words / 200))
  return `${mins} min read`
}