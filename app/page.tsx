'use client'

import { useEffect, useState } from 'react'
import { trackPageView, trackNewsletterSignup } from '@/lib/analytics-complete'

export default function HomePage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    trackPageView('home')
  }, [])

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    try {
      // Your signup logic here
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      
      trackNewsletterSignup(email, 'Farmer')
      setSubmitted(true)
      setEmail('')
      setTimeout(() => setSubmitted(false), 3000)
    } catch (err) {
      console.error('Signup error:', err)
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>🌾 Web3Farmyard</h1>
        <p style={{ fontSize: '18px', marginBottom: '30px', color: '#ccc' }}>Learn Web3 farming strategies and discover airdrops.</p>
        
        <form onSubmit={handleSignup} style={{ marginBottom: '40px' }}>
          <input 
            type="email" 
            placeholder="Enter your email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ 
              padding: '12px', 
              width: '100%', 
              maxWidth: '400px',
              marginRight: '10px',
              background: '#111',
              border: '1px solid #333',
              color: '#fff',
              borderRadius: '4px'
            }}
          />
          <button 
            type="submit"
            style={{
              padding: '12px 24px',
              background: '#c8ff00',
              color: '#0a0a0a',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              marginTop: '10px'
            }}
          >
            Subscribe
          </button>
        </form>

        {submitted && <p style={{ color: '#c8ff00' }}>✅ Subscribed! Check your email.</p>}

        <div style={{ marginTop: '60px' }}>
          <h2 style={{ fontSize: '28px', marginBottom: '20px' }}>Featured Pages</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <a href="/onboarding/day-1" style={{ textDecoration: 'none' }}>
              <div style={{ background: '#111', padding: '20px', borderRadius: '8px', cursor: 'pointer' }}>
                <h3 style={{ color: '#c8ff00', marginBottom: '10px' }}>🌱 Onboarding</h3>
                <p style={{ color: '#999' }}>Learn the basics in 7 days</p>
              </div>
            </a>
            <a href="/airdrops" style={{ textDecoration: 'none' }}>
              <div style={{ background: '#111', padding: '20px', borderRadius: '8px', cursor: 'pointer' }}>
                <h3 style={{ color: '#00ffe0', marginBottom: '10px' }}>🎁 Airdrops</h3>
                <p style={{ color: '#999' }}>Discover active airdrops</p>
              </div>
            </a>
            <a href="/toolkit" style={{ textDecoration: 'none' }}>
              <div style={{ background: '#111', padding: '20px', borderRadius: '8px', cursor: 'pointer' }}>
                <h3 style={{ color: '#ff9f00', marginBottom: '10px' }}>🛠️ Toolkit</h3>
                <p style={{ color: '#999' }}>Essential tools for farming</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}