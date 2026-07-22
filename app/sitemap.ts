// FILE: app/sitemap.ts
// DYNAMIC SITEMAP - Includes homepage, pages, and blog posts

import { MetadataRoute } from 'next'

// Required for static export
export const dynamic = 'force-static'

interface BlogPost {
  slug: string
  date: string
}

async function getBlogPosts(): Promise<BlogPost[]> {
  const WP_URL = 'https://deepskyblue-beaver-138558.hostingersite.com/cms'
  
  try {
    const response = await fetch(
      `${WP_URL}/wp-json/wp/v2/posts?per_page=100&_fields=slug,date`,
      {
        headers: {
          'User-Agent': 'Web3Farmyard-Sitemap/1.0',
          'Accept': 'application/json'
        }
      }
    )

    if (!response.ok) return []

    const posts: BlogPost[] = await response.json()
    return posts.filter(post => post.slug && typeof post.slug === 'string')
  } catch (error) {
    console.error('Error fetching posts for sitemap:', error)
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://web3farmyard.com'
  const currentDate = new Date().toISOString().split('T')[0]

  // Get blog posts
  const blogPosts = await getBlogPosts()

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/onboarding/day-1`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/onboarding/day-2`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/onboarding/day-3`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/onboarding/day-4`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/onboarding/day-5`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/onboarding/day-6`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/onboarding/day-7`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/airdrops`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/showroom`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/toolkit`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/junkyard`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]

  // Dynamic blog posts
  const blogPostUrls: MetadataRoute.Sitemap = blogPosts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.date || currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Combine all
  return [...staticPages, ...blogPostUrls]
}