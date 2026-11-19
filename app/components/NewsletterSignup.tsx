'use client'

import { useState } from 'react'
import { CheckCircle2, AlertCircle, Loader } from 'lucide-react'

interface SubscribeResult {
  success: boolean
  message: string
}

async function subscribeNewsletter(email: string, username: string): Promise<SubscribeResult> {
  const response = await fetch('/api-proxy.php?action=subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, farmerName: username, topics: [], frequency: 'weekly' }),
  })

  const result = await response.json().catch(() => ({}))
  if (!response.ok) {
    return { success: false, message: result.error || 'Unable to subscribe right now. Please try again.' }
  }

  return {
    success: true,
    message: result.message || 'Welcome to Web3Farmyard. Check your inbox.',
  }
}

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const cleanEmail = email.trim().toLowerCase()
    const cleanUsername = username.trim()

    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) || cleanEmail.length > 254) {
      setErrorMessage('Please enter a valid email address.')
      return
    }
    if (cleanUsername.length < 2 || cleanUsername.length > 40) {
      setErrorMessage('Username must be between 2 and 40 characters.')
      return
    }

    setIsLoading(true)
    setErrorMessage('')
    setSuccessMessage('')
    try {
      const result = await subscribeNewsletter(cleanEmail, cleanUsername)
      if (result.success) {
        setSuccessMessage(result.message)
        setEmail('')
        setUsername('')
      } else {
        setErrorMessage(result.message)
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error)
      setErrorMessage('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="newsletter-signup" aria-labelledby="newsletter-title">
      <div className="newsletter-heading">
        <span className="home-section-kicker">STAY CURIOUS</span>
        <h2 id="newsletter-title">Get the next step in your inbox.</h2>
        <p>Join the Web3Farmyard newsletter for new guides, ecosystem insights, and market updates.</p>
      </div>

      <form onSubmit={handleSubmit} className="newsletter-form">
        <div>
          <label htmlFor="newsletter-username">Username</label>
          <input
            id="newsletter-username"
            name="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your username"
            autoComplete="username"
            disabled={isLoading}
            maxLength={40}
            minLength={2}
            required
          />
        </div>
        <div>
          <label htmlFor="newsletter-email">Email address</label>
          <input
            id="newsletter-email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            autoComplete="email"
            disabled={isLoading}
            required
          />
        </div>
        <button type="submit" disabled={isLoading} className="newsletter-submit">
          {isLoading ? (
            <><Loader size={18} className="animate-spin" /> Joining...</>
          ) : (
            <>Join Now <span aria-hidden="true">↗</span></>
          )}
        </button>
        <p className="newsletter-terms">No spam. Unsubscribe anytime. Your email is safe with us.</p>
      </form>

      {successMessage && (
        <div className="newsletter-message newsletter-success" role="status">
          <CheckCircle2 className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-sm font-bold text-green-900">Success!</p>
            <p className="text-sm text-green-800">{successMessage}</p>
          </div>
        </div>
      )}
      {errorMessage && (
        <div className="newsletter-message newsletter-error" role="alert">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-sm font-bold text-red-900">Unable to subscribe</p>
            <p className="text-sm text-red-800">{errorMessage}</p>
          </div>
        </div>
      )}
      <div className="newsletter-note">
        <p><strong>What happens next?</strong> We’ll send a welcome note and occasional updates with new resources and Web3 insights.</p>
      </div>
    </section>
  )
}
