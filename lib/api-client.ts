import { supabase } from './supabase-client'

export interface Call {
  id: string
  created_at: string
  customer_phone: string
  duration: number
  status: 'completed' | 'missed' | 'in_progress'
  transcript?: string
  recording_url?: string
}

export interface Lead {
  id: string
  created_at: string
  name: string
  email?: string
  phone: string
  source: string
  status: 'new' | 'contacted' | 'qualified' | 'converted'
  notes?: string
}

export interface UsageStats {
  total_calls: number
  total_minutes: number
  total_leads: number
  calls_this_month: number
  minutes_this_month: number
  plan_limit: number
  plan_name: string
}

/**
 * Fetch user's call history
 */
export async function getCalls(limit = 50): Promise<{ data?: Call[]; error?: any }> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { error: { message: 'Not authenticated' } }
    }

    const { data, error } = await supabase
      .from('calls')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      return { error }
    }

    return { data: data as Call[] }
  } catch (err) {
    return { error: err }
  }
}

/**
 * Fetch user's leads
 */
export async function getLeads(limit = 50): Promise<{ data?: Lead[]; error?: any }> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { error: { message: 'Not authenticated' } }
    }

    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      return { error }
    }

    return { data: data as Lead[] }
  } catch (err) {
    return { error: err }
  }
}

/**
 * Fetch user's usage statistics
 */
export async function getUsageStats(): Promise<{ data?: UsageStats; error?: any }> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { error: { message: 'Not authenticated' } }
    }

    // Get user's subscription info
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('plan_name, plan_limit')
      .eq('id', user.id)
      .single()

    if (profileError) {
      return { error: profileError }
    }

    // Get call statistics
    const { data: calls, error: callsError } = await supabase
      .from('calls')
      .select('duration, created_at')
      .eq('user_id', user.id)

    if (callsError) {
      return { error: callsError }
    }

    // Get lead count
    const { count: leadCount, error: leadsError } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (leadsError) {
      return { error: leadsError }
    }

    // Calculate statistics
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    const totalCalls = calls?.length || 0
    const totalMinutes = calls?.reduce((sum, call) => sum + (call.duration || 0), 0) || 0
    
    const callsThisMonth = calls?.filter(call => {
      const callDate = new Date(call.created_at)
      return callDate.getMonth() === currentMonth && callDate.getFullYear() === currentYear
    }).length || 0

    const minutesThisMonth = calls?.filter(call => {
      const callDate = new Date(call.created_at)
      return callDate.getMonth() === currentMonth && callDate.getFullYear() === currentYear
    }).reduce((sum, call) => sum + (call.duration || 0), 0) || 0

    return {
      data: {
        total_calls: totalCalls,
        total_minutes: Math.round(totalMinutes / 60), // Convert to minutes
        total_leads: leadCount || 0,
        calls_this_month: callsThisMonth,
        minutes_this_month: Math.round(minutesThisMonth / 60),
        plan_limit: profile?.plan_limit || 100,
        plan_name: profile?.plan_name || 'Free Trial',
      }
    }
  } catch (err) {
    return { error: err }
  }
}

/**
 * Update lead status
 */
export async function updateLeadStatus(
  leadId: string,
  status: Lead['status']
): Promise<{ data?: Lead; error?: any }> {
  try {
    const { data, error } = await supabase
      .from('leads')
      .update({ status })
      .eq('id', leadId)
      .select()
      .single()

    if (error) {
      return { error }
    }

    return { data: data as Lead }
  } catch (err) {
    return { error: err }
  }
}

/**
 * Add notes to a lead
 */
export async function addLeadNotes(
  leadId: string,
  notes: string
): Promise<{ data?: Lead; error?: any }> {
  try {
    const { data, error } = await supabase
      .from('leads')
      .update({ notes })
      .eq('id', leadId)
      .select()
      .single()

    if (error) {
      return { error }
    }

    return { data: data as Lead }
  } catch (err) {
    return { error: err }
  }
}

/**
 * Export data (calls or leads) to CSV
 */
export function exportToCSV(data: any[], filename: string) {
  if (!data || data.length === 0) {
    throw new Error('No data to export')
  }

  // Get headers from first object
  const headers = Object.keys(data[0])
  
  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header]
        // Escape commas and quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value
      }).join(',')
    )
  ].join('\n')

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

