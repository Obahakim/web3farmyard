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

// Security: Sanitize farmer name
function sanitizeFarmerName(name: string): string {
  return name
    .trim()
    .substring(0, 100)
    .replace(/[<>]/g, '')
}

async function subscribeNewsletter(
  email: string,
  farmerName?: string
): Promise<SubscribeResult> {
  try {
    // Validate inputs
    if (!email) {
      return { success: false, message: 'Email is required' }
    }

    const cleanEmail = email.trim().toLowerCase()

    if (!isValidEmail(cleanEmail)) {
      return { success: false, message: 'Please enter a valid email' }
    }

    if (farmerName && farmerName.trim().length > 100) {
      return { success: false, message: 'Farmer name is too long' }
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
          farmer_name: farmerName ? sanitizeFarmerName(farmerName) : existing.farmer_name,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)

      if (updateError) throw updateError

      // Send welcome email via API route
      await sendWelcomeEmailViaAPI(cleanEmail, farmerName || existing.farmer_name)

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
          farmer_name: farmerName ? sanitizeFarmerName(farmerName) : null,
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
    await sendWelcomeEmailViaAPI(cleanEmail, farmerName)

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
async function sendWelcomeEmailViaAPI(email: string, farmerName?: string | null) {
  try {
    const displayName = farmerName || 'Farmer'

    const response = await fetch('/api/send-welcome-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        farmerName: displayName
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
  const [farmerName, setFarmerName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      setErrorMessage('Please enter your email')
      return
    }

    setIsLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const result = await subscribeNewsletter(email, farmerName)

      if (result.success) {
        setSuccessMessage(result.message)
        setEmail('')
        setFarmerName('')

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
    <section className="bg-gradient-to-br from-[#f0f8e8] to-white rounded-2xl p-8 md:p-12 border-2 border-[#d0e8c0]">
      {/* Header */}
      <div className="mb-8">
        <h2 className="font-serif text-3xl font-bold text-[#0a0a0a] mb-2">
          Welcome to Web3Farmyard
        </h2>
        <p className="text-gray-700 font-mono text-sm">
          Learn DeFi. Track yields. Catch airdrops. Farm smarter.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Input */}
        <div>
          <label className="block text-sm font-bold text-[#0a0a0a] mb-2 font-mono">
            Email Address (Required)
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            disabled={isLoading}
            className="w-full px-4 py-3 border-2 border-[#d0e8c0] rounded-lg focus:outline-none focus:border-[#1a6b00] text-[#0a0a0a] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            required
          />
        </div>

        {/* Farmer Name Input */}
        <div>
          <label className="block text-sm font-bold text-[#0a0a0a] mb-2 font-mono">
            Your Farmer Name (Optional)
          </label>
          <input
            type="text"
            value={farmerName}
            onChange={(e) => setFarmerName(e.target.value)}
            placeholder="e.g., moonglove, defi_wizard"
            disabled={isLoading}
            className="w-full px-4 py-3 border-2 border-[#d0e8c0] rounded-lg focus:outline-none focus:border-[#1a6b00] text-[#0a0a0a] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            maxLength={100}
          />
          <p className="text-xs text-gray-600 mt-1 font-mono">
            This is how you'll appear in the community (if you choose to post)
          </p>
        </div>

        {/* Subscribe Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-6 py-3 bg-[#1a6b00] hover:bg-[#134f00] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 mt-6"
        >
          {isLoading ? (
            <>
              <Loader size={18} className="animate-spin" />
              Subscribing...
            </>
          ) : (
            '🌾 Join the Farm'
          )}
        </button>

        {/* Terms */}
        <p className="text-xs text-gray-600 text-center font-mono">
          No spam. Unsubscribe anytime. Your email is safe with us.
        </p>
      </form>

      {/* Success Message */}
      {successMessage && (
        <div className="mt-6 bg-green-50 border-2 border-green-300 rounded-lg p-4 flex gap-3">
          <CheckCircle2 className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-sm font-bold text-green-900">Success!</p>
            <p className="text-sm text-green-800">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="mt-6 bg-red-50 border-2 border-red-300 rounded-lg p-4 flex gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-sm font-bold text-red-900">Oops!</p>
            <p className="text-sm text-red-800">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-8 bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
        <p className="text-sm text-blue-900 font-mono">
          <strong>What happens next?</strong> We'll send a welcome email to your inbox with resources to start farming. Then weekly insights on yields, airdrops, and DeFi strategies.
        </p>
      </div>
    </section>
  )
}