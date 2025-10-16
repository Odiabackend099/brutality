import { createBrowserClient } from '@supabase/ssr'

/**
 * Validate Supabase environment variables for client-side use
 * This runs in the browser, so only check public variables
 */
function validateClientSupabaseEnv() {
  if (typeof window === 'undefined') {
    // Skip validation during SSR
    return
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    console.error(
      '❌ Supabase Configuration Error:\n' +
      'Missing required environment variables:\n' +
      '- NEXT_PUBLIC_SUPABASE_URL\n' +
      '- NEXT_PUBLIC_SUPABASE_ANON_KEY\n\n' +
      'These must be set in your .env.local file or Vercel environment variables.\n' +
      'Authentication features will not work until these are configured.'
    )
  }
}

// Validate environment on module load (client-side only)
validateClientSupabaseEnv()

// Browser client for use in client components
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export type AuthError = {
  message: string
  status?: number
}

export type AuthResponse<T = any> = {
  data?: T
  error?: AuthError
}

