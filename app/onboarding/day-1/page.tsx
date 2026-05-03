'use client'

import { useEffect, useState } from 'react'
import { trackOnboardingStarted, trackOnboardingCompleted } from '@/lib/analytics-complete'

export default function Day1() {
  const [completed, setCompleted] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    trackOnboardingStarted('user@example.com')
  }, [])

  const handleComplete = () => {
    trackOnboardingCompleted('user@example.com')
    setCompleted(true)
  }

  if (!mounted) return null

  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: '40px 20px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '60px' }}>
          <a href="/onboarding/day-1" style={{ color: '#c8ff00', textDecoration: 'none' }}>
            🌱 Onboarding
          </a>
          <h1 style={{ 
            fontSize: '48px', 
            marginTop: '10px',
            marginBottom: '10px',
            color: '#f0f0f0',
            fontWeight: '700'
          }}>
            Day 1: Create Your Wallet
          </h1>
          <p style={{ 
            fontSize: '16px',
            color: '#999',
            marginBottom: '20px'
          }}>
            Your first step into Web3: Create a secure wallet and claim testnet ETH
          </p>
        </div>

        {/* Progress Bar */}
        <div style={{
          background: '#111',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '40px'
        }}>
          <div style={{
            fontSize: '12px',
            color: '#999',
            marginBottom: '10px'
          }}>
            Progress: Day 1 of 7
          </div>
          <div style={{
            background: '#0a0a0a',
            height: '8px',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              background: '#c8ff00',
              height: '100%',
              width: '14%',
              transition: 'width 0.3s'
            }} />
          </div>
        </div>

        {/* Main Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 300px',
          gap: '40px',
          marginBottom: '60px'
        }}>
          {/* Left Column - Lessons */}
          <div>
            {/* Lesson 1 */}
            <section style={{
              background: '#111',
              padding: '30px',
              borderRadius: '8px',
              marginBottom: '30px',
              border: '1px solid #222'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px'
              }}>
                <div style={{
                  background: '#c8ff00',
                  color: '#0a0a0a',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '16px'
                }}>
                  1
                </div>
                <h2 style={{ 
                  fontSize: '20px',
                  color: '#f0f0f0',
                  fontWeight: '700'
                }}>
                  Download a Web3 Wallet
                </h2>
              </div>

              <p style={{
                color: '#ccc',
                lineHeight: '1.7',
                marginBottom: '20px'
              }}>
                A Web3 wallet is your gateway to the blockchain. Think of it like a bank account, but you have complete control. No middleman.
              </p>

              <div style={{
                background: '#0a0a0a',
                padding: '20px',
                borderRadius: '6px',
                marginBottom: '20px',
                borderLeft: '4px solid #c8ff00'
              }}>
                <div style={{
                  fontSize: '14px',
                  color: '#ccc',
                  marginBottom: '15px',
                  fontWeight: '700'
                }}>
                  ✅ Choose one:
                </div>
                <ul style={{
                  color: '#999',
                  fontSize: '14px',
                  marginLeft: '20px',
                  lineHeight: '1.8'
                }}>
                  <li><strong>MetaMask</strong> - Most popular. Works on Chrome, Firefox, Safari</li>
                  <li><strong>Coinbase Wallet</strong> - Beginner-friendly alternative</li>
                  <li><strong>Rabby Wallet</strong> - Advanced features, high security</li>
                </ul>
              </div>

              <a href="https://metamask.io" target="_blank" rel="noopener noreferrer" style={{
                display: 'inline-block',
                padding: '12px 20px',
                background: '#c8ff00',
                color: '#0a0a0a',
                textDecoration: 'none',
                borderRadius: '4px',
                fontWeight: '700',
                fontSize: '14px'
              }}>
                Download MetaMask →
              </a>
            </section>

            {/* Lesson 2 */}
            <section style={{
              background: '#111',
              padding: '30px',
              borderRadius: '8px',
              marginBottom: '30px',
              border: '1px solid #222'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px'
              }}>
                <div style={{
                  background: '#c8ff00',
                  color: '#0a0a0a',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '16px'
                }}>
                  2
                </div>
                <h2 style={{ 
                  fontSize: '20px',
                  color: '#f0f0f0',
                  fontWeight: '700'
                }}>
                  Create Your First Wallet
                </h2>
              </div>

              <p style={{
                color: '#ccc',
                lineHeight: '1.7',
                marginBottom: '20px'
              }}>
                After installing your wallet, create a new wallet. You'll get a 12-word seed phrase - this is your wallet's master key.
              </p>

              <div style={{
                background: '#0a0a0a',
                padding: '20px',
                borderRadius: '6px',
                marginBottom: '20px',
                borderLeft: '4px solid #ff6b6b'
              }}>
                <div style={{
                  fontSize: '14px',
                  color: '#ff6b6b',
                  marginBottom: '10px',
                  fontWeight: '700'
                }}>
                  ⚠️ CRITICAL: Seed Phrase Safety
                </div>
                <p style={{
                  color: '#ccc',
                  fontSize: '14px',
                  lineHeight: '1.6'
                }}>
                  Write these 12 words on paper. Keep them private. Never share them with anyone, not even support staff. If someone has your seed phrase, they control your funds.
                </p>
              </div>

              <div style={{
                background: '#0a0a0a',
                padding: '20px',
                borderRadius: '6px',
                borderLeft: '4px solid #00ffe0'
              }}>
                <div style={{
                  fontSize: '14px',
                  color: '#00ffe0',
                  marginBottom: '10px',
                  fontWeight: '700'
                }}>
                  💡 Pro Tip
                </div>
                <p style={{
                  color: '#ccc',
                  fontSize: '14px',
                  lineHeight: '1.6'
                }}>
                  Use a password manager to store your seed phrase safely. Consider using a hardware wallet (Ledger, Trezor) for large amounts.
                </p>
              </div>
            </section>

            {/* Lesson 3 */}
            <section style={{
              background: '#111',
              padding: '30px',
              borderRadius: '8px',
              marginBottom: '30px',
              border: '1px solid #222'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px'
              }}>
                <div style={{
                  background: '#c8ff00',
                  color: '#0a0a0a',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '16px'
                }}>
                  3
                </div>
                <h2 style={{ 
                  fontSize: '20px',
                  color: '#f0f0f0',
                  fontWeight: '700'
                }}>
                  Get Your Address & Testnet ETH
                </h2>
              </div>

              <p style={{
                color: '#ccc',
                lineHeight: '1.7',
                marginBottom: '20px'
              }}>
                Your wallet has an address (like an IBAN). This is public - you can share it safely. Use testnet to practice without real money.
              </p>

              <div style={{
                background: '#0a0a0a',
                padding: '20px',
                borderRadius: '6px',
                marginBottom: '20px'
              }}>
                <div style={{
                  fontSize: '12px',
                  color: '#999',
                  marginBottom: '8px'
                }}>
                  Steps:
                </div>
                <ol style={{
                  color: '#ccc',
                  fontSize: '14px',
                  marginLeft: '20px',
                  lineHeight: '1.8'
                }}>
                  <li>Click your wallet address in MetaMask</li>
                  <li>Copy it (you'll see a check mark)</li>
                  <li>Go to <strong>sepolia.faucet.paradigm.xyz</strong></li>
                  <li>Paste your address</li>
                  <li>Click "Send me ETH"</li>
                  <li>Wait 1-2 minutes - you'll see funds appear!</li>
                </ol>
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <div>
            {/* Quick Checklist */}
            <div style={{
              background: '#111',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #222',
              position: 'sticky',
              top: '20px'
            }}>
              <div style={{
                fontSize: '14px',
                color: '#c8ff00',
                fontWeight: '700',
                marginBottom: '15px'
              }}>
                ✅ Today's Tasks
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                {[
                  'Download MetaMask/Wallet',
                  'Create new wallet',
                  'Save seed phrase safely',
                  'Switch to Sepolia testnet',
                  'Claim testnet ETH',
                  'See funds arrive'
                ].map((task, i) => (
                  <label key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    color: '#ccc'
                  }}>
                    <input type="checkbox" style={{ cursor: 'pointer' }} />
                    {task}
                  </label>
                ))}
              </div>

              <div style={{
                marginTop: '20px',
                padding: '15px',
                background: '#0a0a0a',
                borderRadius: '6px',
                borderLeft: '4px solid #c8ff00'
              }}>
                <div style={{
                  fontSize: '12px',
                  color: '#999',
                  marginBottom: '8px'
                }}>
                  ⏱️ Time needed
                </div>
                <div style={{
                  fontSize: '18px',
                  color: '#c8ff00',
                  fontWeight: '700'
                }}>
                  15-20 minutes
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div style={{
              marginTop: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <button 
                disabled
                style={{
                  padding: '12px',
                  background: '#333',
                  color: '#999',
                  border: '1px solid #222',
                  borderRadius: '6px',
                  fontSize: '13px',
                  cursor: 'not-allowed',
                  fontWeight: '700'
                }}
              >
                ← Previous Day
              </button>
              <a href="/onboarding/day-2" style={{
                padding: '12px',
                background: '#222',
                color: '#c8ff00',
                border: '1px solid #333',
                borderRadius: '6px',
                fontSize: '13px',
                textDecoration: 'none',
                textAlign: 'center',
                fontWeight: '700'
              }}>
                Next Day →
              </a>
            </div>
          </div>
        </div>

        {/* Completion Button */}
        {!completed ? (
          <button 
            onClick={handleComplete}
            style={{
              width: '100%',
              padding: '16px',
              background: '#c8ff00',
              color: '#0a0a0a',
              border: 'none',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer',
              borderRadius: '6px',
              transition: 'all 0.3s'
            }}
          >
            ✅ I've Completed Day 1 →
          </button>
        ) : (
          <div style={{
            padding: '20px',
            background: '#0a0a0a',
            border: '2px solid #c8ff00',
            borderRadius: '6px',
            color: '#c8ff00',
            textAlign: 'center',
            fontWeight: '700',
            fontSize: '16px'
          }}>
            🎉 Day 1 Complete! Move to Day 2
          </div>
        )}

        {/* Footer */}
        <div style={{
          marginTop: '60px',
          paddingTop: '40px',
          borderTop: '1px solid #222',
          textAlign: 'center',
          color: '#666',
          fontSize: '14px'
        }}>
          <p style={{ marginBottom: '10px' }}>
            Need help? Join our community on Discord
          </p>
          <a href="https://discord.gg/web3farmyard" style={{
            color: '#c8ff00',
            textDecoration: 'none'
          }}>
            → Discord Community
          </a>
        </div>
      </div>
    </main>
  )
}