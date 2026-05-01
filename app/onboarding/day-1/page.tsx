'use client'

import { useEffect, useState } from 'react'
import { trackOnboardingStarted, trackOnboardingCompleted } from '@/lib/analytics-complete'

export default function Day1() {
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    trackOnboardingStarted('user@example.com')
  }, [])

  const handleComplete = () => {
    trackOnboardingCompleted('user@example.com')
    setCompleted(true)
  }

  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: '40px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '36px', marginBottom: '20px', color: '#c8ff00' }}>🌱 Day 1: Getting Started</h1>
        
        <div style={{ background: '#111', padding: '24px', borderRadius: '8px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '15px' }}>Lesson 1: Create Your Wallet</h2>
          <p style={{ lineHeight: '1.6', marginBottom: '15px', color: '#ccc' }}>
            A Web3 wallet is your gateway to the decentralized world. Think of it like a bank account, but you control it completely.
          </p>
          
          <div style={{ background: '#0a0a0a', padding: '15px', borderRadius: '6px', marginBottom: '15px', borderLeft: '4px solid #c8ff00' }}>
            <strong>✅ Tasks:</strong>
            <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
              <li>Download MetaMask or Coinbase Wallet</li>
              <li>Create a new wallet</li>
              <li>Save your seed phrase (12 words) in a safe place</li>
              <li>Complete the backup confirmation</li>
            </ul>
          </div>

          <p style={{ color: '#999', fontSize: '14px' }}>
            ⚠️ <strong>Important:</strong> Never share your seed phrase with anyone. Not even with support staff!
          </p>
        </div>

        <div style={{ background: '#111', padding: '24px', borderRadius: '8px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '15px' }}>Lesson 2: Get Some ETH</h2>
          <p style={{ lineHeight: '1.6', marginBottom: '15px', color: '#ccc' }}>
            You need ETH (Ethereum) to pay gas fees when using the blockchain.
          </p>
          <p style={{ background: '#0a0a0a', padding: '15px', borderRadius: '6px', color: '#ccc', borderLeft: '4px solid #00ffe0' }}>
            <strong>💡 Tip:</strong> Start with a small amount ($10-50) while you're learning.
          </p>
        </div>

        {!completed ? (
          <button 
            onClick={handleComplete}
            style={{
              width: '100%',
              padding: '14px',
              background: '#c8ff00',
              color: '#0a0a0a',
              border: 'none',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              borderRadius: '6px'
            }}
          >
            ✅ I've Completed Day 1 →
          </button>
        ) : (
          <div style={{ background: '#0a0a0a', border: '2px solid #c8ff00', padding: '16px', borderRadius: '6px', color: '#c8ff00', textAlign: 'center' }}>
            <strong>🎉 Day 1 Complete! Move to Day 2</strong>
          </div>
        )}

        <div style={{ marginTop: '40px', textAlign: 'center', color: '#666' }}>
          <p>Progress: Day 1 of 7</p>
          <a href="/onboarding/day-2" style={{ color: '#c8ff00', textDecoration: 'none', marginTop: '20px', display: 'inline-block' }}>
            Continue to Day 2 →
          </a>
        </div>
      </div>
    </main>
  )
}