// FILE: app/blog/[slug]/page.tsx
// INDIVIDUAL BLOG POST - Fixed params handling

import { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import DOMPurify from 'isomorphic-dompurify'
import {
  generateOrganizationSchema,
  generateWebPageSchema,
  generateWebSiteSchema,
  generateBlogPostingSchema,
  generateBreadcrumbListSchema,
} from '@/lib/schema'

interface BlogPost {
  id: number
  slug: string
  title: {
    rendered: string
  }
  content: {
    rendered: string
  }
  excerpt: {
    rendered: string
  }
  date: string
  modified: string
  author: number
}

interface PageProps {
  params: Promise<{ slug: string }>
}

const WP_URL = 'https://web3farmyard.com/cms/wp-json/wp/v2/posts'

// Fetch all blog post slugs for static generation
async function getAllPostSlugs(): Promise<string[]> {
  try {
    console.log(`📡 Fetching all post slugs from: ${WP_URL}`)
    
    const response = await fetch(
      `${WP_URL}?per_page=100&_fields=slug`,
      {
        headers: {
          'User-Agent': 'Web3Farmyard-Blog-Fetcher/1.0',
          'Accept': 'application/json'
        }
      }
    )

    if (!response.ok) {
      console.error(`❌ Failed to fetch slugs: ${response.status}`)
      return []
    }

    const posts: any[] = await response.json()
    const slugs = posts
      .map(post => post.slug)
      .filter(slug => slug && typeof slug === 'string')
    
    console.log(`✅ Found ${slugs.length} post slugs`)
    
    return slugs
  } catch (error) {
    console.error('❌ Error fetching post slugs:', error)
    return []
  }
}

// Fetch individual post by slug
async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    if (!slug || slug === 'undefined') {
      console.error(`❌ Invalid slug: ${slug}`)
      return null
    }

    const response = await fetch(
      `${WP_URL}?slug=${encodeURIComponent(slug)}&_fields=id,slug,title,content,excerpt,date,modified,author`,
      {
        headers: {
          'User-Agent': 'Web3Farmyard-Blog-Fetcher/1.0',
          'Accept': 'application/json'
        }
      }
    )

    if (!response.ok) {
      console.error(`❌ WordPress returned status ${response.status}`)
      return null
    }

    const posts: BlogPost[] = await response.json()
    
    if (posts.length === 0) {
      console.warn(`⚠️ No post found with slug: ${slug}`)
      return null
    }
    
    return posts[0]
  } catch (error) {
    console.error(`❌ Error fetching post: ${error}`)
    return null
  }
}

// Generate static params for all posts
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs()
  console.log(`🔨 Building static pages for ${slugs.length} posts`)
  return slugs.map(slug => ({ 
    slug: slug 
  }))
}

// Generate metadata for post
export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const resolvedParams = await params
  const post = await getPostBySlug(resolvedParams.slug)

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'This blog post does not exist.'
    }
  }

  const title = post.title.rendered.replace(/<[^>]*>/g, '')
  const description = post.excerpt.rendered
    .replace(/<[^>]*>/g, '')
    .substring(0, 160)

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      url: `https://web3farmyard.com/blog/${post.slug}/`,
      type: 'article'
    }
  }
}

function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'table', 'tr', 'td', 'th', 'tbody', 'thead', 'code', 'pre', 'hr'],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'target', 'rel']
  })
}

export default async function BlogPostPage({ params }: PageProps) {
  const resolvedParams = await params
  const post = await getPostBySlug(resolvedParams.slug)

  if (!post) {
    return (
      <>
        <Nav />
        <main className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center py-20">
            <h1 className="font-serif text-4xl font-bold text-[#0a0a0a] mb-4">
              Post Not Found
            </h1>
            <p className="text-gray-600 mb-8">
              This blog post does not exist or has been removed.
            </p>
            <Link
              href="/blog"
              className="inline-block px-6 py-3 bg-[#1a6b00] hover:bg-[#134f00] text-white font-bold rounded-lg transition-all"
            >
              ← Back to Blog
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const title = post.title.rendered.replace(/<[^>]*>/g, '')
  const sanitizedContent = sanitizeHtml(post.content.rendered)
  const publishDate = new Date(post.date)
  const modifiedDate = new Date(post.modified)

  const blogPostSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      generateOrganizationSchema(),
      generateWebSiteSchema({
        url: `https://www.web3farmyard.com/blog/${post.slug}`,
        name: 'Web3Farmyard Blog',
        description: post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 160),
        publisherId: 'https://www.web3farmyard.com/#organization',
      }),
      generateWebPageSchema({
        id: `https://www.web3farmyard.com/blog/${post.slug}#webpage`,
        url: `https://www.web3farmyard.com/blog/${post.slug}`,
        name: title,
        description: post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 160),
        isPartOfId: 'https://www.web3farmyard.com/#website',
        inLanguage: 'en-US',
      }, false),
      generateBlogPostingSchema({
        title,
        description: post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 160),
        url: `https://www.web3farmyard.com/blog/${post.slug}`,
        datePublished: post.date,
        dateModified: post.modified,
        authorName: 'Web3Farmyard',
        publisherName: 'Web3Farmyard',
        mainEntityOfPageId: `https://www.web3farmyard.com/blog/${post.slug}#webpage`,
      }, false),
      generateBreadcrumbListSchema([
        { name: 'Home', url: 'https://www.web3farmyard.com' },
        { name: 'Blog', url: 'https://www.web3farmyard.com/blog' },
        { name: title, url: `https://www.web3farmyard.com/blog/${post.slug}` },
      ], false),
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostSchema) }}
      />
      <Nav />
      <main className="max-w-4xl mx-auto px-6 py-12">
        
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-[#1a6b00] font-bold text-sm hover:text-[#134f00] mb-8 transition-colors"
        >
          ← Back to Blog
        </Link>

        <article className="mb-12">
          <header className="mb-8">
            <h1 className="font-serif text-5xl font-bold text-[#0a0a0a] mb-4 leading-tight">
              {title}
            </h1>
            
            <div className="flex flex-wrap gap-6 text-sm text-gray-600 font-mono">
              <time dateTime={post.date}>
                Published: {publishDate.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              
              {post.modified !== post.date && (
                <time dateTime={post.modified}>
                  Updated: {modifiedDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              )}
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <div
              className="blog-content space-y-6"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
              style={{
                lineHeight: '1.8',
              }}
            />
          </div>

          <style>{`
            .blog-content p {
              margin-bottom: 1.5rem;
              color: #333;
              line-height: 1.8;
            }
            
            .blog-content h2, .blog-content h3, .blog-content h4 {
              margin-top: 2rem;
              margin-bottom: 1rem;
              color: #0a0a0a;
              font-weight: bold;
            }

            .blog-content h2 {
              font-size: 1.75rem;
              border-bottom: 2px solid #1a6b00;
              padding-bottom: 0.5rem;
            }

            .blog-content h3 {
              font-size: 1.5rem;
            }

            .blog-content h4 {
              font-size: 1.25rem;
            }

            .blog-content ul, .blog-content ol {
              margin: 1.5rem 0;
              padding-left: 2rem;
            }

            .blog-content li {
              margin-bottom: 0.5rem;
              color: #333;
            }

            .blog-content blockquote {
              border-left: 4px solid #1a6b00;
              padding-left: 1rem;
              margin: 1.5rem 0;
              font-style: italic;
              color: #666;
            }

            .blog-content a {
              color: #1a6b00;
              text-decoration: underline;
              font-weight: 500;
            }

            .blog-content a:hover {
              color: #134f00;
            }

            .blog-content code {
              background: #f5f5f5;
              padding: 0.2rem 0.4rem;
              border-radius: 4px;
              font-family: 'Courier New', monospace;
              color: #d63384;
            }

            .blog-content pre {
              background: #f5f5f5;
              padding: 1rem;
              border-radius: 8px;
              overflow-x: auto;
              margin: 1.5rem 0;
            }

            .blog-content pre code {
              background: none;
              padding: 0;
              color: #0a0a0a;
            }

            .blog-content table {
              border-collapse: collapse;
              width: 100%;
              margin: 1.5rem 0;
              border: 1px solid #ddd;
            }

            .blog-content th, .blog-content td {
              border: 1px solid #ddd;
              padding: 0.75rem;
              text-align: left;
            }

            .blog-content th {
              background: #f5f5f5;
              font-weight: bold;
            }

            .blog-content img {
              max-width: 100%;
              height: auto;
              border-radius: 8px;
              margin: 1.5rem 0;
            }

            .blog-content hr {
              border: none;
              border-top: 2px solid #e0e0e0;
              margin: 2rem 0;
            }
          `}</style>
        </article>

        <div className="border-t-2 border-gray-200 pt-8">
          <Link
            href="/blog"
            className="inline-block px-6 py-3 bg-[#1a6b00] hover:bg-[#134f00] text-white font-bold rounded-lg transition-all"
          >
            ← Back to Blog
          </Link>
        </div>

      </main>
      <Footer />
    </>
  )
}