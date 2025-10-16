// API integration layer for backend operations
import { supabase } from './supabase-client'
import type { Payment, Lead, CallLog } from './supabase'

// ============================================================================
// Payments API
// ============================================================================

export async function getPayments(limit = 50) {
  const { data, error } = await supabase
    .from('payments_callwaiting')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data as Payment[]
}

export async function getPaymentsByEmail(email: string) {
  const { data, error} = await supabase
    .from('payments_callwaiting')
    .select('*')
    .eq('email', email)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Payment[]
}

export async function getPaymentStats() {
  const { data: payments, error } = await supabase
    .from('payments_callwaiting')
    .select('amount, verified, plan')

  if (error) throw error

  const total = payments?.reduce((sum, p) => sum + (Number(p.amount) || 0), 0) || 0
  const verified = payments?.filter(p => p.verified).length || 0
  const pending = payments?.filter(p => !p.verified).length || 0
  const starterCount = payments?.filter(p => p.plan === 'starter').length || 0
  const proCount = payments?.filter(p => p.plan === 'pro').length || 0

  return {
    total,
    verified,
    pending,
    starterCount,
    proCount,
    totalRevenue: total,
  }
}

// ============================================================================
// Leads API
// ============================================================================

export async function getLeads(limit = 50) {
  const { data, error } = await supabase
    .from('leads_callwaiting')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data as Lead[]
}

export async function createLead(lead: Omit<Lead, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('leads_callwaiting')
    .insert(lead)
    .select()
    .single()

  if (error) throw error
  return data as Lead
}

export async function getLeadStats() {
  const { data: leads, error, count } = await supabase
    .from('leads_callwaiting')
    .select('*', { count: 'exact' })

  if (error) throw error

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const todayCount = leads?.filter(l =>
    new Date(l.created_at) >= today
  ).length || 0

  const thisWeek = new Date()
  thisWeek.setDate(thisWeek.getDate() - 7)

  const weekCount = leads?.filter(l =>
    new Date(l.created_at) >= thisWeek
  ).length || 0

  return {
    total: count || 0,
    today: todayCount,
    thisWeek: weekCount,
  }
}

// ============================================================================
// Call Logs API
// ============================================================================

export async function getCallLogs(userId?: string, limit = 100) {
  let query = supabase
    .from('call_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (userId) {
    query = query.eq('user_id', userId)
  }

  const { data, error } = await query

  if (error) throw error
  return data as CallLog[]
}

export async function createCallLog(log: Omit<CallLog, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('call_logs')
    .insert(log)
    .select()
    .single()

  if (error) throw error
  return data as CallLog
}

export async function getCallStats(userId?: string) {
  let query = supabase
    .from('call_logs')
    .select('*')

  if (userId) {
    query = query.eq('user_id', userId)
  }

  const { data: logs, error } = await query

  if (error) throw error

  const totalCalls = logs?.length || 0
  const textCalls = logs?.filter(l => l.message_type === 'text').length || 0
  const voiceCalls = logs?.filter(l => l.message_type === 'voice').length || 0
  const totalTokens = logs?.reduce((sum, l) => sum + (l.tokens_used || 0), 0) || 0
  const totalChars = logs?.reduce((sum, l) => sum + (l.tts_chars || 0), 0) || 0
  const avgDuration = logs?.length
    ? logs.reduce((sum, l) => sum + (l.duration_ms || 0), 0) / logs.length
    : 0

  // Calculate today's calls
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayCalls = logs?.filter(l => new Date(l.created_at) >= today).length || 0

  // Calculate this week's calls
  const thisWeek = new Date()
  thisWeek.setDate(thisWeek.getDate() - 7)
  const weekCalls = logs?.filter(l => new Date(l.created_at) >= thisWeek).length || 0

  return {
    total: totalCalls,
    text: textCalls,
    voice: voiceCalls,
    today: todayCalls,
    thisWeek: weekCalls,
    totalTokens,
    totalChars,
    avgDuration: Math.round(avgDuration),
  }
}

// ============================================================================
// User Profile API
// ============================================================================

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    // Profile might not exist yet - this is okay
    if (error.code === 'PGRST116') {
      return null
    }
    throw error
  }

  return data
}

export async function upsertUserProfile(profile: any) {
  const { data, error } = await supabase
    .from('user_profiles')
    .upsert(profile)
    .select()
    .single()

  if (error) throw error
  return data
}

// ============================================================================
// Dashboard Stats (Combined)
// ============================================================================

export async function getDashboardStats(userId?: string) {
  const [callStats, paymentStats, leadStats] = await Promise.all([
    getCallStats(userId),
    getPaymentStats(),
    getLeadStats(),
  ])

  return {
    calls: callStats,
    payments: paymentStats,
    leads: leadStats,
  }
}
