import { supabase, AuthResponse } from './supabase-client'

export interface SignUpData {
  email: string
  password: string
  fullName?: string
  company?: string
}

export interface SignInData {
  email: string
  password: string
}

export interface ResetPasswordData {
  email: string
}

/**
 * Sign up a new user with email verification
 */
export async function signUp(data: SignUpData): Promise<AuthResponse> {
  try {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
          company: data.company,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      return { error: { message: error.message, status: error.status } }
    }

    return { data: authData }
  } catch (err: any) {
    return { error: { message: err.message || 'Sign up failed' } }
  }
}

/**
 * Sign in an existing user
 */
export async function signIn(data: SignInData): Promise<AuthResponse> {
  try {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      return { error: { message: error.message, status: error.status } }
    }

    // Sync session cookies on server so middleware sees session
    try {
      const syncResponse = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action: 'refresh' }),
      })
      
      if (!syncResponse.ok) {
        console.warn('Session sync returned:', syncResponse.status)
      }
    } catch (syncError) {
      console.warn('Session sync failed:', syncError)
      // Don't fail the login if sync fails - cookies might already be set
    }
    
    return { data: authData }
  } catch (err: any) {
    return { error: { message: err.message || 'Sign in failed' } }
  }
}

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle(): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      return { error: { message: error.message, status: error.status } }
    }

    return { data }
  } catch (err: any) {
    return { error: { message: err.message || 'Google sign in failed' } }
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<AuthResponse> {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      return { error: { message: error.message, status: error.status } }
    }
    try {
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action: 'signout' })
      })
    } catch {}
    return { data: { success: true } }
  } catch (err: any) {
    return { error: { message: err.message || 'Sign out failed' } }
  }
}

/**
 * Send password reset email
 */
export async function resetPassword(data: ResetPasswordData): Promise<AuthResponse> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) {
      return { error: { message: error.message, status: error.status } }
    }

    return { data: { success: true } }
  } catch (err: any) {
    return { error: { message: err.message || 'Password reset failed' } }
  }
}

/**
 * Update user password
 */
export async function updatePassword(newPassword: string): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) {
      return { error: { message: error.message, status: error.status } }
    }

    return { data }
  } catch (err: any) {
    return { error: { message: err.message || 'Password update failed' } }
  }
}

/**
 * Get current user session
 */
export async function getSession() {
  try {
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      return { error: { message: error.message, status: error.status } }
    }

    return { data }
  } catch (err: any) {
    return { error: { message: err.message || 'Failed to get session' } }
  }
}

/**
 * Get current user
 */
export async function getUser() {
  try {
    const { data, error } = await supabase.auth.getUser()

    if (error) {
      return { error: { message: error.message, status: error.status } }
    }

    return { data }
  } catch (err: any) {
    return { error: { message: err.message || 'Failed to get user' } }
  }
}

