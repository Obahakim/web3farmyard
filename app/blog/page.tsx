
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
  title:
    'Web3Farmyard Blog - DeFi Guides, Airdrop Alerts & Farming Strategies',

  description:
    'Read practical guides on DeFi strategies, airdrop hunting, wallet security, and Web3 farming tips.',

  openGraph: {
    title: 'Web3Farmyard Blog',

    description:
      'Practical guides, DeFi strategies, and airdrop tips for Web3 farmers.',

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
        description: 'Practical Web3 guides, airdrop updates, and farming strategies for beginners.',
        publisherId: 'https://www.web3farmyard.com/#organization',
      }),
      generateWebPageSchema({
        id: 'https://www.web3farmyard.com/blog#webpage',
        url: 'https://www.web3farmyard.com/blog',
        name: 'Web3Farmyard Blog — DeFi Guides & Airdrop Strategies',
        description: 'Read practical guides on DeFi strategies, airdrop hunting, wallet security, and Web3 farming tips.',
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

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="font-serif text-5xl font-bold mb-4 text-[#0a0a0a]">
            Web3Farmyard Blog
          </h1>

          <p className="text-lg text-gray-600">
            Practical guides, airdrop alerts,
            DeFi strategies, and wallet
            security tips.
          </p>
        </div>

        {posts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2">
            {posts.map(function (post) {
              return (
                <article
                  key={post.id}
                  className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-[#1a6b00] transition-all"
                >
                  <div className="p-6">
                    <h2 className="font-serif text-xl font-bold mb-3">
                      <Link
                        href={
                          '/blog/' + post.slug
                        }
                        className="hover:text-[#1a6b00]"
                      >
                        {stripHtml(
                          post.title.rendered
                        )}
                      </Link>
                    </h2>

                    <p className="text-gray-600 text-sm mb-4">
                      {stripHtml(
                        post.excerpt.rendered
                      )}
                    </p>

                    <div className="flex items-center justify-between">
                      <time className="text-xs text-gray-500">
                        {new Date(
                          post.date
                        ).toLocaleDateString(
                          'en-US',
                          {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }
                        )}
                      </time>

                      <Link
                        href={
                          '/blog/' + post.slug
                        }
                        className="text-[#1a6b00] font-bold text-sm"
                      >
                        Read →
                      </Link>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <p>No posts found.</p>
          </div>
        )}
      </main>

      <Footer />
    </>
  )
}
