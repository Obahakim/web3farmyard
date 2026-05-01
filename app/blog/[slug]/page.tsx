import BlogAnalytics from '../analytics-client'

// Fetch from WordPress headless API
async function getWordPressPosts() {
  try {
    const res = await fetch('http://web3farmyard.com/cms/wp-json/wp/v2/posts?per_page=100', {
      next: { revalidate: 3600 }
    })
    if (!res.ok) return []
    return await res.json()
  } catch (err) {
    console.error('WordPress fetch error:', err)
    return []
  }
}

// Generate static params from WordPress posts
export async function generateStaticParams() {
  const posts = await getWordPressPosts()
  return posts.map((post: any) => ({
    slug: post.slug,
  }))
}

// Fetch individual post
async function getWordPressPost(slug: string) {
  try {
    const res = await fetch(
      `http://web3farmyard.com/cms/wp-json/wp/v2/posts?slug=${slug}`,
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) return null
    const posts = await res.json()
    return posts[0] || null
  } catch (err) {
    console.error('WordPress post fetch error:', err)
    return null
  }
}

export default async function BlogPost({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params
  const post = await getWordPressPost(slug)

  if (!post) {
    return (
      <main style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: '40px 20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h1>Post not found</h1>
          <a href="/blog" style={{ color: '#c8ff00', textDecoration: 'none' }}>← Back to blog</a>
        </div>
      </main>
    )
  }

  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: '40px 20px' }}>
      {/* Track article view and time spent */}
      <BlogAnalytics 
        slug={slug} 
        title={post.title.rendered}
        author={post._embedded?.author?.[0]?.name}
        category={post._embedded?.['wp:term']?.[0]?.[0]?.name}
      />
      
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Back to blog link */}
        <a 
          href="/blog" 
          style={{ 
            color: '#c8ff00', 
            textDecoration: 'none', 
            marginBottom: '20px', 
            display: 'inline-block' 
          }}
        >
          ← Back to Blog
        </a>

        <article style={{ marginTop: '30px' }}>
          {/* Article title */}
          <h1 style={{ 
            fontSize: '42px', 
            marginBottom: '10px', 
            lineHeight: '1.2' 
          }}>
            {post.title.rendered}
          </h1>
          
          {/* Article metadata */}
          <div style={{ 
            color: '#666', 
            marginBottom: '40px', 
            fontSize: '14px',
            display: 'flex',
            gap: '20px'
          }}>
            <span>📅 {new Date(post.date).toLocaleDateString()}</span>
            {post._embedded?.author?.[0]?.name && (
              <span>✍️ {post._embedded.author[0].name}</span>
            )}
          </div>

          {/* Article featured image */}
          {post._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
            <img 
              src={post._embedded['wp:featuredmedia'][0].source_url}
              alt={post.title.rendered}
              style={{
                width: '100%',
                maxHeight: '400px',
                objectFit: 'cover',
                borderRadius: '8px',
                marginBottom: '40px'
              }}
            />
          )}

          {/* Article content from WordPress */}
          <div style={{ 
            background: '#111', 
            padding: '30px', 
            borderRadius: '8px',
            lineHeight: '1.8',
            color: '#ccc'
          }}>
            <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
          </div>

          {/* Call to action */}
          <div style={{ 
            marginTop: '40px', 
            padding: '20px', 
            background: '#111', 
            borderRadius: '8px', 
            textAlign: 'center' 
          }}>
            <p style={{ marginBottom: '15px', color: '#ccc' }}>
              Ready to start your Web3 journey?
            </p>
            <a 
              href="/onboarding/day-1" 
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                background: '#c8ff00',
                color: '#0a0a0a',
                textDecoration: 'none',
                fontWeight: 'bold',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              Start the Onboarding →
            </a>
          </div>

          {/* Related articles / navigation */}
          <div style={{
            marginTop: '60px',
            paddingTop: '40px',
            borderTop: '1px solid #222',
            display: 'flex',
            justifyContent: 'space-between',
            gap: '20px'
          }}>
            <a 
              href="/blog" 
              style={{
                color: '#c8ff00',
                textDecoration: 'none',
                padding: '10px 16px',
                border: '1px solid #333',
                borderRadius: '4px',
                transition: 'all 0.3s'
              }}
            >
              ← All Articles
            </a>
            <a 
              href="/airdrops" 
              style={{
                color: '#c8ff00',
                textDecoration: 'none',
                padding: '10px 16px',
                border: '1px solid #333',
                borderRadius: '4px',
                transition: 'all 0.3s'
              }}
            >
              View Airdrops →
            </a>
          </div>
        </article>
      </div>
    </main>
  )
}