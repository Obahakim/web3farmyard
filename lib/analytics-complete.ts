// lib/analytics-complete.ts
// Copy this to your Next.js project as lib/analytics-complete.ts
// Then import it on every page that needs tracking

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPA_URL || ''
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPA_KEY || ''

let supabase: any = null

if (typeof window !== 'undefined') {
  supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
}

export interface AnalyticsEvent {
  event_type: string
  page: string
  user_email?: string
  metadata?: any
  duration_ms?: number
}

// Store events locally first, sync with backend
const LOCAL_STORAGE_KEY = 'w3f_analytics'
const MAX_LOCAL_EVENTS = 1000

export async function trackEvent(event: AnalyticsEvent) {
  // Add to local storage
  if (typeof window !== 'undefined') {
    try {
      const existing = localStorage.getItem(LOCAL_STORAGE_KEY) || '[]'
      const events = JSON.parse(existing)
      
      events.push({
        ...event,
        timestamp: new Date().toISOString(),
      })

      // Keep only last 1000 events
      const trimmed = events.slice(-MAX_LOCAL_EVENTS)
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(trimmed))
    } catch (err) {
      console.error('Local analytics error:', err)
    }
  }

  // Try to send to backend
  try {
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    }).catch(() => {}) // Fail silently
  } catch (err) {
    console.error('Analytics sync error:', err)
  }
}

// 📊 PAGE VIEW
export async function trackPageView(page: string) {
  await trackEvent({
    event_type: 'page_view',
    page,
  })
}

// 🌾 ONBOARDING
export async function trackOnboardingStarted(email?: string) {
  await trackEvent({
    event_type: 'onboarding_started',
    page: 'onboarding',
    user_email: email,
  })
}

export async function trackOnboardingProgress(day: number, email?: string) {
  await trackEvent({
    event_type: 'onboarding_progress',
    page: `onboarding/day-${day}`,
    user_email: email,
    metadata: { day },
  })
}

export async function trackOnboardingCompleted(email?: string) {
  await trackEvent({
    event_type: 'onboarding_completed',
    page: 'onboarding',
    user_email: email,
  })
}

// ⏱️ TIME ON PAGE
export async function trackTimeOnPage(page: string, durationMs: number) {
  await trackEvent({
    event_type: 'time_on_page',
    page,
    duration_ms: durationMs,
  })
}

// 💾 DOWNLOADS
export async function trackDownload(filename: string, fileType: string) {
  await trackEvent({
    event_type: 'download',
    page: 'downloads',
    metadata: { filename, fileType },
  })
}

// 🎁 AIRDROP CLICK
export async function trackAirdropClick(airdropName: string, url: string) {
  await trackEvent({
    event_type: 'airdrop_click',
    page: 'airdrops',
    metadata: { airdropName, url },
  })
}

// 📰 ARTICLE VIEW
export async function trackArticleView(slug: string, title: string) {
  await trackEvent({
    event_type: 'article_view',
    page: `blog/${slug}`,
    metadata: { slug, title },
  })
}

// 🛠️ TOOLKIT USAGE
export async function trackToolkitUse(toolName: string) {
  await trackEvent({
    event_type: 'toolkit_use',
    page: 'toolkit',
    metadata: { toolName },
  })
}

// 📧 NEWSLETTER SIGNUP
export async function trackNewsletterSignup(email: string, farmerName?: string) {
  await trackEvent({
    event_type: 'newsletter_signup',
    page: 'homepage',
    user_email: email,
    metadata: { farmerName },
  })
}

// Get all local analytics (for admin panel)
export function getLocalAnalytics() {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY) || '[]'
    return JSON.parse(data)
  } catch {
    return []
  }
}

// Clear local analytics
export function clearLocalAnalytics() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LOCAL_STORAGE_KEY)
  }
}

// Get analytics summary
export function getAnalyticsSummary() {
  const events = getLocalAnalytics()
  
  return {
    totalEvents: events.length,
    pageViews: events.filter((e: any) => e.event_type === 'page_view').length,
    onboardingStarted: events.filter((e: any) => e.event_type === 'onboarding_started').length,
    onboardingCompleted: events.filter((e: any) => e.event_type === 'onboarding_completed').length,
    downloads: events.filter((e: any) => e.event_type === 'download').length,
    airdropClicks: events.filter((e: any) => e.event_type === 'airdrop_click').length,
    articleViews: events.filter((e: any) => e.event_type === 'article_view').length,
    newsletterSignups: events.filter((e: any) => e.event_type === 'newsletter_signup').length,
    toolkitUses: events.filter((e: any) => e.event_type === 'toolkit_use').length,
  }
}

// Track page views on mount (use in layout)
export function usePageTracking(page: string) {
  if (typeof window !== 'undefined') {
    const startTime = Date.now()
    
    trackPageView(page)
    
    // Track time on page on unmount
    return () => {
      const duration = Date.now() - startTime
      trackTimeOnPage(page, duration)
    }
  }
}
