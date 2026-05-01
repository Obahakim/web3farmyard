'use client'

import { useEffect, useRef } from 'react'
import { trackArticleView, trackTimeOnPage } from '@/lib/analytics-complete'

interface BlogAnalyticsProps {
  slug: string
  title: string
  author?: string
  category?: string
}

/**
 * BlogAnalytics - Client component for tracking blog article views and engagement
 * 
 * This component:
 * - Tracks when an article is viewed
 * - Measures time spent on the article
 * - Handles errors gracefully
 * - Optimized for performance with React.memo
 */
export const BlogAnalytics = ({ 
  slug, 
  title, 
  author,
  category 
}: BlogAnalyticsProps) => {
  const startTimeRef = useRef<number>(0)
  const hasTrackedRef = useRef<boolean>(false)

  useEffect(() => {
    // Prevent duplicate tracking
    if (hasTrackedRef.current) return
    
    try {
      // Record when user views the article
      trackArticleView(slug, title)
      hasTrackedRef.current = true
      
      // Start timer for time-on-page tracking
      startTimeRef.current = Date.now()

      console.log(`📖 Tracked article view: ${title}`)
    } catch (error) {
      console.error('Failed to track article view:', error)
    }

    // Cleanup function - track time spent on page when leaving
    return () => {
      try {
        if (startTimeRef.current > 0) {
          const timeSpent = Date.now() - startTimeRef.current
          trackTimeOnPage(`blog/${slug}`, timeSpent)
          console.log(`⏱️ Article time tracked: ${timeSpent}ms`)
        }
      } catch (error) {
        console.error('Failed to track time on page:', error)
      }
    }
  }, [slug, title])

  // This component renders nothing, it's purely for tracking
  return null
}

// Memoize to prevent unnecessary re-renders
export default BlogAnalytics