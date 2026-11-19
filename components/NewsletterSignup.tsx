// FILE: app/components/NewsletterSignupClientSide.tsx
// NEWSLETTER FORM - Client-side Supabase + Resend (works on static export)
// Calls API routes for email sending (secure)

'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { CheckCircle2, AlertCircle, Loader } from 'lucide-react'

// Initialize Supabase client (public key is safe)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPA_URL!,
  process.env.NEXT_PUBLIC_SUPA_KEY!
)

interface SubscribeResult {
  success: boolean
  message: string
}

// Security: Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length < 255
}

function sanitizeUsername(name: string): string {
  return name
    .trim()
    .substring(0, 40)
    .replace(/[<>]/g, '')
}

async function subscribeNewsletter(
  email: string,
  username: string
): Promise<SubscribeResult> {
  try {
    if (!email) {
      return { success: false, message: 'Email is required' }
    }
    if (!username.trim()) {
      return { success: false, message: 'Please choose a username' }
    }

    const cleanEmail = email.trim().toLowerCase()
    const cleanUsername = sanitizeUsername(username)

    if (!isValidEmail(cleanEmail)) {
      return { success: false, message: 'Please enter a valid email' }
    }

    if (cleanUsername.length < 2) {
      return { success: false, message: 'Username must be at least 2 characters' }
    }

    // Check if already subscribed
    const { data: existing, error: selectError } = await supabase
      .from('subscribers')
      .select('id, subscribed, farmer_name')
      .eq('email', cleanEmail)
      .single()

    // Error could be "no rows" which is expected for new subscribers
    if (selectError && selectError.code !== 'PGRST116') {
      throw selectError
    }

    // If exists and subscribed
    if (existing && existing.subscribed) {
      return {
        success: false,
        message: 'You are already subscribed! Check your email for the latest posts.'
      }
    }

    // If exists but unsubscribed, reactivate
    if (existing && !existing.subscribed) {
      const { error: updateError } = await supabase
        .from('subscribers')
        .update({
          subscribed: true,
          subscribed_at: new Date().toISOString(),
          unsubscribed_at: null,
          farmer_name: cleanUsername,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)

      if (updateError) throw updateError

      // Send welcome email via API route
      await sendWelcomeEmailViaAPI(cleanEmail, cleanUsername)

      return {
        success: true,
        message: 'Welcome back! Check your email for a welcome message.'
      }
    }

    // New subscriber - insert into Supabase
    const { error: insertError } = await supabase
      .from('subscribers')
      .insert([
        {
          email: cleanEmail,
          farmer_name: cleanUsername,
          subscribed: true,
          subscribed_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])

    if (insertError) {
      if (insertError.code === '23505') {
        return {
          success: false,
          message: 'This email is already subscribed.'
        }
      }
      throw insertError
    }

    // Send welcome email via API route
    await sendWelcomeEmailViaAPI(cleanEmail, cleanUsername)

    return {
      success: true,
      message: 'Welcome to Web3Farmyard! Check your email for a welcome message.'
    }
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return {
      success: false,
      message: 'Something went wrong. Please try again later.'
    }
  }
}

// Call API route to send email (keeps Resend key secure)
async function sendWelcomeEmailViaAPI(email: string, username: string) {
  try {
    const response = await fetch('/api/send-welcome-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        farmerName: username
      })
    })

    if (!response.ok) {
      console.error('Failed to send email:', await response.text())
      // Don't throw - email failure shouldn't block subscription
    }
  } catch (error) {
    console.error('Error sending welcome email:', error)
    // Don't throw - email failure shouldn't block subscription
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

    if (!email.trim()) {
      setErrorMessage('Please enter your email')
      return
    }
    if (!username.trim()) {
      setErrorMessage('Please choose a username')
      return
    }

    setIsLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const result = await subscribeNewsletter(email, username)

      if (result.success) {
        setSuccessMessage(result.message)
        setEmail('')
        setUsername('')

        // Clear success message after 5 seconds
        setTimeout(() => setSuccessMessage(''), 5000)
      } else {
        setErrorMessage(result.message)
      }
    } catch (error) {
      setErrorMessage('Something went wrong. Please try again.')
      console.error('Subscription error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="newsletter-signup" aria-labelledby="newsletter-title">
      {/* Header */}
      <div className="newsletter-heading">
        <span className="home-section-kicker">STAY CURIOUS</span>
        <h2 id="newsletter-title">
          Get the next step in your inbox.
        </h2>
        <p>
          Join the Web3Farmyard newsletter for new guides, ecosystem insights, and market updates.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="newsletter-form">
        {/* Email Input */}
        <div>
          <label htmlFor="newsletter-username">
            Username
          </label>
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
          <label htmlFor="newsletter-email">
            Email address
          </label>
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

        <button
          type="submit"
          disabled={isLoading}
          className="newsletter-submit"
        >
          {isLoading ? (
            <>
              <Loader size={18} className="animate-spin" />
              Joining...
            </>
          ) : (
            <>Join Now <span aria-hidden="true">↗</span></>
          )}
        </button>

        {/* Terms */}
        <p className="newsletter-terms">
          No spam. Unsubscribe anytime. Your email is safe with us.
        </p>
      </form>

      {/* Success Message */}
      {successMessage && (
        <div className="newsletter-message newsletter-success" role="status">
          <CheckCircle2 className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-sm font-bold text-green-900">Success!</p>
            <p className="text-sm text-green-800">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="newsletter-message newsletter-error" role="alert">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-sm font-bold text-red-900">Oops!</p>
            <p className="text-sm text-red-800">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="newsletter-note">
        <p>
          <strong>What happens next?</strong> We’ll send a welcome note and occasional updates with new resources and Web3 insights.
        </p>
      </div>
    </section>
  )
}