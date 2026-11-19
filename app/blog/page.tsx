
import Link from 'next/link'
import type { Metadata } from 'next'

import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import {
  generateOrganizationSchema,
  generateWebPageSchema,
  generateWebSiteSchema,
  generateItemListSchema,
} from '@/lib/schema'

interface BlogPost {
  id: number
  slug: string
  title: {
    rendered: string
  }
  excerpt: {
    rendered: string
  }
  date: string
}

export const metadata: Metadata = {
  title: 'Web3Farmyard Blog — Web3, DeFi, and Airdrops',

  description:
    'Read practical explainers on Web3, DeFi, airdrops, wallet security, and blockchain technology.',

  openGraph: {
    title: 'Web3Farmyard Blog',

    description:
      'Practical guides and explainers for exploring Web3, DeFi, and blockchain tools.',

    url: 'https://web3farmyard.com/blog/',

    type: 'website'
  }
}

function stripHtml(html: string): string {
  if (!html) {
    return ''
  }

  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .trim()
    .substring(0, 200)
}

async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch(
      'https://web3farmyard.com/cms/wp-json/wp/v2/posts?per_page=100&_fields=id,slug,title,excerpt,date',
      {
        headers: {
          Accept: 'application/json'
        },

       next: {
  revalidate: 3600
}
      }
    )

    if (!response.ok) {
      console.error(
        'Failed fetching posts:',
        response.status
      )

      return []
    }

    const posts =
      (await response.json()) as BlogPost[]

    const cleanedPosts = posts.filter(
      function (post) {
        return (
          Boolean(post.id) &&
          Boolean(post.slug) &&
          Boolean(post.title) &&
          Boolean(post.title.rendered)
        )
      }
    )

    cleanedPosts.sort(function (a, b) {
      return (
        new Date(b.date).getTime() -
        new Date(a.date).getTime()
      )
    })

    console.log(
      'Loaded posts:',
      cleanedPosts.length
    )

    return cleanedPosts
  } catch (error) {
    console.error(
      'Error fetching posts:',
      error
    )

    return []
  }
}

export default async function BlogPage() {
  const posts = await getBlogPosts()
  const blogSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      generateOrganizationSchema(),
      generateWebSiteSchema({
        url: 'https://www.web3farmyard.com/blog',
        name: 'Web3Farmyard Blog',
        description: 'Practical Web3 guides, airdrop updates, and explainers for beginners.',
        publisherId: 'https://www.web3farmyard.com/#organization',
      }),
      generateWebPageSchema({
        id: 'https://www.web3farmyard.com/blog#webpage',
        url: 'https://www.web3farmyard.com/blog',
        name: 'Web3Farmyard Blog — DeFi Guides & Airdrop Strategies',
        description: 'Read practical guides on DeFi, airdrops, wallet security, and blockchain technology.',
        isPartOfId: 'https://www.web3farmyard.com/#website',
        inLanguage: 'en-US',
      }, false),
      generateItemListSchema(posts.map(post => ({
        name: post.title.rendered.replace(/<[^>]*>/g, ''),
        url: `https://www.web3farmyard.com/blog/${post.slug}`,
      })), false),
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <Nav />

      <main className="theme-page blog-page">
        <div className="theme-page-shell">
          <header className="theme-page-hero">
            <span className="theme-page-eyebrow">THE WEB3 JOURNAL</span>
            <h1>
            Web3Farmyard Blog
            </h1>

            <p>
              Practical explainers, market context, and security insights to help you navigate Web3.
            </p>
          </header>

          {posts.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {posts.map(function (post) {
                return (
                  <article
                    key={post.id}
                    className="theme-page-card blog-post-card"
                  >
                    <h2 className="font-semibold text-xl mb-3">
                      <Link href={'/blog/' + post.slug}>
                        {stripHtml(post.title.rendered)}
                      </Link>
                    </h2>

                    <p className="text-sm mb-5">
                      {stripHtml(post.excerpt.rendered)}
                    </p>

                    <div className="flex items-center justify-between gap-4">
                      <time className="text-xs">
                        {new Date(post.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </time>

                      <Link
                        href={'/blog/' + post.slug}
                        className="text-sm font-bold text-[#547a3d]"
                      >
                        Read →
                      </Link>
                    </div>
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="theme-page-card p-10 text-center">
              <p className="text-sm text-[#69766b]">No posts found.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
