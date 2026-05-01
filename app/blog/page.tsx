'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function BlogList() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch('https://yoursite.wordpress.com/wp-json/wp/v2/posts?per_page=50')
        if (res.ok) {
          const data = await res.json()
          setPosts(data)
        }
      } catch (err) {
        console.error('Error fetching posts:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  if (loading) return <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading posts...</div>

  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '42px', marginBottom: '40px' }}>📝 Web3 Blog</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {posts.map((post: any) => (
            <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ background: '#111', padding: '24px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.3s' }}>
                <h2 style={{ color: '#c8ff00', marginBottom: '10px', fontSize: '18px' }}>
                  {post.title.rendered}
                </h2>
                <p style={{ color: '#999', marginBottom: '10px', fontSize: '14px' }}>
                  {post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 100)}...
                </p>
                <div style={{ color: '#666', fontSize: '12px' }}>
                  {new Date(post.date).toLocaleDateString()}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <div style={{ textAlign: 'center', color: '#666', paddingTop: '60px' }}>
            No posts found
          </div>
        )}
      </div>
    </main>
  )
}