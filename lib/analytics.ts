/**
 * Analytics tracking utility for Web3Farmyard
 * Tracks: page views, time spent, onboarding progress, downloads, etc.
 */

export interface PageEvent {
  page: string
  event: string
  timestamp: string
  duration?: number
  userId?: string
  metadata?: Record<string, any>
}

/**
 * Track page view
 */
export function trackPageView(page: string, metadata?: Record<string, any>) {
  const event: PageEvent = {
    page,
    event: 'page_view',
    timestamp: new Date().toISOString(),
    metadata,
  }
  
  // Send to analytics backend (Supabase or analytics table)
  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  }).catch(err => console.warn('Analytics error:', err))

  // Also track in localStorage for admin dashboard
  trackLocalAnalytics(event)
}

/**
 * Track time spent on page
 */
export function trackTimeOnPage(page: string, durationMs: number) {
  const event: PageEvent = {
    page,
    event: 'time_spent',
    timestamp: new Date().toISOString(),
    duration: durationMs,
  }

  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  }).catch(err => console.warn('Analytics error:', err))

  trackLocalAnalytics(event)
}

/**
 * Track onboarding progress
 */
export function trackOnboardingProgress(day: number, status: 'started' | 'completed') {
  const event: PageEvent = {
    page: `/onboarding/day-${day}`,
    event: `onboarding_${status}`,
    timestamp: new Date().toISOString(),
    metadata: { day },
  }

  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  }).catch(err => console.warn('Analytics error:', err))

  trackLocalAnalytics(event)
}

/**
 * Track download events
 */
export function trackDownload(fileName: string, fileType: string) {
  const event: PageEvent = {
    page: window.location.pathname,
    event: 'download',
    timestamp: new Date().toISOString(),
    metadata: { fileName, fileType },
  }

  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  }).catch(err => console.warn('Analytics error:', err))

  trackLocalAnalytics(event)
}

/**
 * Track newsletter signup
 */
export function trackNewsletterSignup(email: string) {
  const event: PageEvent = {
    page: '/',
    event: 'newsletter_signup',
    timestamp: new Date().toISOString(),
    metadata: { email },
  }

  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  }).catch(err => console.warn('Analytics error:', err))

  trackLocalAnalytics(event)
}

/**
 * Track custom events
 */
export function trackEvent(page: string, eventName: string, metadata?: Record<string, any>) {
  const event: PageEvent = {
    page,
    event: eventName,
    timestamp: new Date().toISOString(),
    metadata,
  }

  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  }).catch(err => console.warn('Analytics error:', err))

  trackLocalAnalytics(event)
}

/**
 * Store analytics in localStorage for admin dashboard fallback
 */
function trackLocalAnalytics(event: PageEvent) {
  try {
    const existing = localStorage.getItem('w3f_analytics') || '[]'
    const events = JSON.parse(existing)
    events.push(event)
    
    // Keep only last 1000 events
    if (events.length > 1000) {
      events.shift()
    }
    
    localStorage.setItem('w3f_analytics', JSON.stringify(events))
  } catch (err) {
    console.warn('LocalStorage analytics error:', err)
  }
}

/**
 * Get analytics summary from localStorage
 */
export function getLocalAnalyticsSummary() {
  try {
    const data = localStorage.getItem('w3f_analytics') || '[]'
    const events = JSON.parse(data)

    return {
      totalEvents: events.length,
      pageViews: events.filter((e: PageEvent) => e.event === 'page_view').length,
      onboardingStarted: events.filter((e: PageEvent) => e.event === 'onboarding_started').length,
      onboardingCompleted: events.filter((e: PageEvent) => e.event === 'onboarding_completed').length,
      downloads: events.filter((e: PageEvent) => e.event === 'download').length,
      newsletterSignups: events.filter((e: PageEvent) => e.event === 'newsletter_signup').length,
      events,
    }
  } catch (err) {
    console.error('Error getting analytics:', err)
    return {
      totalEvents: 0,
      pageViews: 0,
      onboardingStarted: 0,
      onboardingCompleted: 0,
      downloads: 0,
      newsletterSignups: 0,
      events: [],
    }
  }
}

/**
 * Clear analytics (admin only)
 */
export function clearAnalytics() {
  localStorage.removeItem('w3f_analytics')
}

/**
 * Track page time on mount/unmount
 * Usage: useEffect(() => trackPageTime(), [])
 */
export function usePageTimer(page: string) {
  const startTime = Date.now()
  return () => {
    const duration = Date.now() - startTime
    trackTimeOnPage(page, duration)
  }
}
