import { createClient } from '@supabase/supabase-js'

function createServiceSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}

export interface Usage {
  minutesUsed: number
  minutesQuota: number
  plan: string
  remaining: number
}

export async function getUsage(userId: string): Promise<Usage> {
  const supabase = createServiceSupabase()
  
  const { data: profile, error } = await supabase
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

export async function assertWithinQuota(userId: string, secondsNeeded: number) {
  const usage = await getUsage(userId)
  const minutesNeeded = Math.ceil(secondsNeeded / 60)
  
  if (usage.remaining < minutesNeeded) {
    throw new Error('Quota exceeded. Please upgrade your plan.')
  }
  
  return true
}

export async function addUsage(
  userId: string,
  agentId: string,
  usage: {
    seconds: number
    kind: 'tts' | 'inference'
    costCents?: number
    meta?: Record<string, any>
  }
) {
  const supabase = createServiceSupabase()
  const minutes = Math.ceil(usage.seconds / 60)

  // Insert usage log
  const { error: logError } = await supabase
    .from('usage_logs')
    .insert({
      user_id: userId,
      agent_id: agentId,
      kind: usage.kind,
      seconds: usage.seconds,
      cost_cents: usage.costCents || 0,
      meta: usage.meta || {}
    })

  if (logError) {
    console.error('Failed to log usage:', logError)
  }

  // Update profile minutes
  const { data: profile } = await supabase
    .from('profiles')
    .select('minutes_used')
    .eq('id', userId)
    .single()

  if (profile) {
    await supabase
      .from('profiles')
      .update({ 
        minutes_used: profile.minutes_used + minutes,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
  }
}

