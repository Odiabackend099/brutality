import { createClient } from '@supabase/supabase-js'

/**
 * Admin Service - Isolated service layer for admin operations
 * This service uses the service role key and should only be used for
 * operations that require bypassing Row Level Security (RLS)
 */
export class AdminService {
  private supabase: any
  private isInitialized: boolean = false

  constructor() {
    this.initializeSupabase()
  }

  private initializeSupabase() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !serviceRoleKey) {
      console.warn('AdminService: Missing environment variables, using dummy client')
      // Create a dummy client for testing
      this.supabase = {
        from: () => ({
          select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
          update: () => ({ eq: () => Promise.resolve({ error: null }) }),
          insert: () => Promise.resolve({ data: null, error: null }),
          upsert: () => Promise.resolve({ error: null }),
          rpc: () => Promise.resolve({ error: null })
        })
      }
      this.isInitialized = true
      return
    }

    this.supabase = createClient(url, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    this.isInitialized = true
  }

  /**
   * Get user usage data (admin operation)
   */
  async getUserUsage(userId: string) {
    this.ensureInitialized()
    
    const { data: profile, error } = await this.supabase
      .from('profiles')
      .select('minutes_used, minutes_quota, plan')
      .eq('id', userId)
      .single()

    if (error || !profile) {
      throw new Error('Failed to fetch usage data')
    }

    return {
      minutesUsed: profile.minutes_used,
      minutesQuota: profile.minutes_quota,
      plan: profile.plan,
      remaining: profile.minutes_quota - profile.minutes_used
    }
  }

  /**
   * Update user usage (admin operation with transaction)
   */
  async updateUserUsage(
    userId: string,
    agentId: string,
    usage: {
      seconds: number
      kind: 'tts' | 'inference'
      costCents?: number
      meta?: Record<string, any>
    }
  ) {
    this.ensureInitialized()
    
    const minutes = Math.ceil(usage.seconds / 60)

    // Use a transaction-like approach with RPC function
    const { error } = await this.supabase.rpc('update_user_usage', {
      p_user_id: userId,
      p_agent_id: agentId,
      p_seconds: usage.seconds,
      p_minutes: minutes,
      p_kind: usage.kind,
      p_cost_cents: usage.costCents || 0,
      p_meta: usage.meta || {}
    })

    if (error) {
      console.error('Failed to update usage:', error)
      throw new Error('Failed to update usage')
    }
  }

  /**
   * Check if user can make a call (admin operation)
   */
  async canUserMakeCall(userId: string) {
    this.ensureInitialized()
    
    const { data: profile } = await this.supabase
      .from('profiles')
      .select('minutes_quota, minutes_used, plan, created_at')
      .eq('id', userId)
      .single()

    if (!profile) {
      return { canCall: false, reason: 'User profile not found.' }
    }

    // Check if user has paid plan
    if (profile.plan && profile.plan !== 'trial') {
      const minutesRemaining = (profile.minutes_quota || 0) - (profile.minutes_used || 0)
      if (minutesRemaining > 0) {
        return { canCall: true }
      } else {
        return { canCall: false, reason: 'No minutes remaining in your plan. Please upgrade to continue.' }
      }
    }

    // For trial users, check 5-minute limit
    const FREE_TRIAL_MINUTES = 5
    const minutesUsed = profile.minutes_used || 0
    
    if (minutesUsed < FREE_TRIAL_MINUTES) {
      return { canCall: true }
    } else {
      return { canCall: false, reason: 'Free trial minutes exhausted. Please upgrade to continue.' }
    }
  }

  /**
   * Record trial usage (admin operation)
   */
  async recordTrialUsage(userId: string, callDurationSeconds: number) {
    this.ensureInitialized()
    
    const callDurationMinutes = callDurationSeconds / 60
    const FREE_TRIAL_MINUTES = 5

    // Use RPC function for atomic operation
    const { error } = await this.supabase.rpc('record_trial_usage', {
      p_user_id: userId,
      p_duration_seconds: callDurationSeconds,
      p_duration_minutes: callDurationMinutes,
      p_free_trial_minutes: FREE_TRIAL_MINUTES
    })

    if (error) {
      console.error('Error recording trial usage:', error)
      return false
    }

    return true
  }

  /**
   * Get trial status (admin operation)
   */
  async getTrialStatus(userId: string) {
    this.ensureInitialized()
    
    const { data: profile } = await this.supabase
      .from('profiles')
      .select('minutes_quota, minutes_used, plan, created_at')
      .eq('id', userId)
      .single()

    if (!profile) {
      return {
        isActive: false,
        minutesUsed: 0,
        minutesRemaining: 0,
        expiresAt: null,
        hasExpired: true
      }
    }

    const FREE_TRIAL_MINUTES = 5
    const TRIAL_DURATION_DAYS = 30

    // Check if user has paid plan
    if (profile.plan && profile.plan !== 'trial') {
      return {
        isActive: true,
        minutesUsed: profile.minutes_used || 0,
        minutesRemaining: (profile.minutes_quota || 0) - (profile.minutes_used || 0),
        expiresAt: null,
        hasExpired: false
      }
    }

    // For trial users
    const minutesUsed = profile.minutes_used || 0
    const isWithinFreeTrial = minutesUsed < FREE_TRIAL_MINUTES
    const trialExpiresAt = new Date(profile.created_at)
    trialExpiresAt.setDate(trialExpiresAt.getDate() + TRIAL_DURATION_DAYS)
    const hasExpired = new Date() > trialExpiresAt

    return {
      isActive: isWithinFreeTrial && !hasExpired,
      minutesUsed,
      minutesRemaining: Math.max(0, FREE_TRIAL_MINUTES - minutesUsed),
      expiresAt: trialExpiresAt,
      hasExpired
    }
  }

  private ensureInitialized() {
    if (!this.isInitialized) {
      throw new Error('AdminService not initialized. This should not happen.')
    }
  }
}

// Singleton instance for admin operations
let adminServiceInstance: AdminService | null = null

/**
 * Get the admin service instance
 * This should only be used in secure backend contexts
 */
export function getAdminService(): AdminService {
  if (!adminServiceInstance) {
    adminServiceInstance = new AdminService()
  }
  return adminServiceInstance
}

/**
 * Security warning for developers
 */
export const ADMIN_SERVICE_WARNING = `
⚠️  ADMIN SERVICE WARNING ⚠️

This service uses the Supabase service role key which bypasses Row Level Security.
It should ONLY be used for:
- Admin operations that require elevated privileges
- Background jobs and system processes
- Operations that cannot use regular user authentication

NEVER use this service in:
- Client-side code
- Public API endpoints without additional authorization
- User-facing operations that can use regular authentication

The service role key has full database access and should be treated as a secret.
`
