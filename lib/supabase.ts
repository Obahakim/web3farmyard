import { createClient } from '@supabase/supabase-js'

const SUPA_URL = process.env.NEXT_PUBLIC_SUPA_URL!
const SUPA_KEY = process.env.NEXT_PUBLIC_SUPA_KEY!

export const supabase = createClient(SUPA_URL, SUPA_KEY)

// ============================================
// PUBLIC READS
// ============================================

export async function getAirdrops() {
  const { data } = await supabase
    .from('airdrops')
    .select('*')
    .eq('status', 'live')
    .order('created_at', { ascending: false })
  return data || []
}

export async function getJunkyard() {
  const { data } = await supabase
    .from('junkyard')
    .select('*')
    .order('created_at', { ascending: false })
  return data || []
}

export async function getPosts() {
  const { data } = await supabase
    .from('posts')
    .select('id,title,excerpt,image,tags,date,created_at')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
  return data || []
}

// ============================================
// PROTECTED WRITES VIA PHP PROXY
// ============================================

export async function subscribeEmail(email: string, topics: string[] = ['defi', 'airdrops'], frequency: string = 'weekly') {
  const res = await fetch('/api-proxy.php?action=subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, topics, frequency }),
  })
  return res.json()
}

export async function saveOnboardingProgress(email: string, streak: number, completedDays: number[]) {
  const res = await fetch('/api-proxy.php?action=save-progress', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      streak,
      completed_days: completedDays,
      last_updated: new Date().toISOString()
    }),
  })
  return res.json()
}

// ============================================
// SUBMISSION FUNCTIONS
// ============================================

export async function submitAirdrop(payload: Record<string, unknown>) {
  return supabase.from('airdrops').insert({ ...payload, status: 'pending' })
}

export async function submitJunkyard(payload: Record<string, unknown>) {
  return supabase.from('junkyard').insert({ ...payload, status: 'pending' })
}

// ============================================
// FARMER PROFILE MANAGEMENT
// ============================================

/**
 * Save or update a farmer profile in Supabase
 * @param email - Email address (UNIQUE)
 * @param farmerName - Name of the farmer
 * @returns Success/error response
 */
export async function saveFarmerProfile(email: string, farmerName: string) {
  try {
    if (!email || !farmerName) {
      return { success: false, error: 'Email and farmer name are required' }
    }

    const { data, error } = await supabase
      .from('farmer_profiles')
      .upsert(
        {
          email: email.toLowerCase(),
          farmer_name: farmerName.trim(),
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'email',
        }
      )
      .select()

    if (error) {
      console.error('Supabase error:', error)
      if (error.code === 'PGRST301' || error.message.includes('relation')) {
        return {
          success: false,
          error: 'Database table not set up. Contact administrator.',
        }
      }
      // Check for duplicate key error
      if (error.message.includes('duplicate') || error.message.includes('Duplicate key')) {
        return {
          success: false,
          error: 'This email is already registered. Use a different email.',
        }
      }
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (err) {
    console.error('Save profile error:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error occurred',
    }
  }
}

/**
 * Fetch a farmer profile from Supabase
 * @param email - Email address to look up
 * @returns Farmer profile or null
 */
export async function getFarmerProfile(email: string) {
  try {
    const { data, error } = await supabase
      .from('farmer_profiles')
      .select('*')
      .eq('email', email.toLowerCase())
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      console.error('Fetch profile error:', error)
      return null
    }

    return data
  } catch (err) {
    console.error('Error fetching profile:', err)
    return null
  }
}

/**
 * Get all farmer profiles (admin use)
 * @returns Array of all farmer profiles
 */
export async function getAllFarmerProfiles() {
  try {
    const { data, error } = await supabase
      .from('farmer_profiles')
      .select('*')
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Fetch all profiles error:', error)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Error fetching all profiles:', err)
    return []
  }
}

// ============================================
// NEWSLETTER SUBSCRIPTION MANAGEMENT
// ============================================

/**
 * Subscribe or unsubscribe a user from the newsletter
 * @param email - Email address
 * @param farmerName - Farmer name (optional)
 * @param subscribe - Whether to subscribe (true) or unsubscribe (false)
 * @returns Success/error response
 */
export async function subscribeToNewsletter(email: string, farmerName?: string, subscribe: boolean = true) {
  try {
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Valid email address required' }
    }

    if (subscribe) {
      // ADD subscriber
      const { data, error } = await supabase
        .from('subscribers')
        .upsert(
          {
            email: email.toLowerCase(),
            farmer_name: farmerName?.trim() || null,
            subscribed: true,
            subscribed_at: new Date().toISOString(),
            last_email_sent: null,
          },
          {
            onConflict: 'email',
          }
        )
        .select()

      if (error) {
        console.error('Subscribe error:', error)
        if (error.message.includes('duplicate') || error.message.includes('Duplicate key')) {
          return { success: true, message: 'Already subscribed' }
        }
        return { success: false, error: error.message }
      }

      return { success: true, data, message: 'Successfully subscribed to newsletter!' }
    } else {
      // REMOVE subscriber
      const { error } = await supabase
        .from('subscribers')
        .update({ subscribed: false, unsubscribed_at: new Date().toISOString() })
        .eq('email', email.toLowerCase())

      if (error) {
        console.error('Unsubscribe error:', error)
        return { success: false, error: error.message }
      }

      return { success: true, message: 'Successfully unsubscribed from newsletter' }
    }
  } catch (err) {
    console.error('Newsletter subscription error:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error occurred',
    }
  }
}

/**
 * Check if an email is already subscribed
 * @param email - Email address to check
 * @returns Boolean indicating subscription status
 */
export async function isSubscribed(email: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('subscribers')
      .select('subscribed')
      .eq('email', email.toLowerCase())
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return false
      }
      return false
    }

    return data?.subscribed === true
  } catch (err) {
    console.error('Error checking subscription:', err)
    return false
  }
}

/**
 * Get all active subscribers (admin use)
 * @returns Array of subscriber emails and info
 */
export async function getAllSubscribers() {
  try {
    const { data, error } = await supabase
      .from('subscribers')
      .select('email, farmer_name, subscribed_at')
      .eq('subscribed', true)
      .order('subscribed_at', { ascending: false })

    if (error) {
      console.error('Get subscribers error:', error)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Error getting subscribers:', err)
    return []
  }
}

// Database schema and RLS policies are maintained in SUPABASE_RUN_THIS.sql.