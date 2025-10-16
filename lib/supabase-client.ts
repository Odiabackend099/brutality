import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Browser client for use in client components
export const supabase = createClientComponentClient()

export type AuthError = {
  message: string
  status?: number
}

export type AuthResponse<T = any> = {
  data?: T
  error?: AuthError
}

