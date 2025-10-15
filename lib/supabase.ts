// Supabase client configuration
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check .env.local')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

// Database types
export interface Payment {
  id: string
  full_name: string | null
  email: string | null
  amount: number | null
  currency: string | null
  plan: 'starter' | 'pro' | null
  transaction_ref: string | null
  flutterwave_id: string
  payment_link_id: string | null
  status: string | null
  verified: boolean | null
  payload: any | null
  created_at: string
  updated_at: string
}

export interface Lead {
  id: string
  name: string | null
  business: string | null
  contact: string | null
  description: string | null
  created_at: string
}

export interface CallLog {
  id: string
  user_id: string | null
  session_id: string | null
  message_type: 'text' | 'voice' | null
  ai_response: string | null
  duration_ms: number | null
  tokens_used: number | null
  tts_chars: number | null
  created_at: string
}

export interface UserProfile {
  id: string
  email: string
  full_name: string | null
  company: string | null
  phone: string | null
  plan: 'free' | 'starter' | 'pro' | null
  created_at: string
  updated_at: string
}
