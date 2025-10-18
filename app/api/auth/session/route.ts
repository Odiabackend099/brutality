import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { randomUUID } from 'crypto'

// Force dynamic rendering since we use cookies
export const dynamic = 'force-dynamic'

// Get current session status
export async function GET() {
  const requestId = randomUUID()
  const timestamp = new Date().toISOString()

  console.log(`[${requestId}] Auth session check started`, {
    timestamp
  })

  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch {
            // Cookie setting can fail during static generation - ignore
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch {
            // Cookie removal can fail during static generation - ignore
          }
        },
      },
    }
  )

  try {
    // Use getUser() for security - validates the session with Supabase
    const { data, error } = await supabase.auth.getUser()

    if (error) {
      console.log(`[${requestId}] No active session`)
      return NextResponse.json(
        { authenticated: false, session: null, requestId },
        { status: 401 }
      )
    }

    console.log(`[${requestId}] ✅ Active session for user:`, {
      email: data.user.email,
      userId: data.user.id
    })

    return NextResponse.json({ 
      authenticated: true, 
      user: {
        id: data.user.id,
        email: data.user.email
      },
      requestId 
    })
  } catch (e: any) {
    console.error(`[${requestId}] ❌ Session check exception:`, {
      error: e?.message || 'Unknown error'
    })

    return NextResponse.json(
      { authenticated: false, error: e?.message || 'Internal server error', requestId },
      { status: 500 }
    )
  }
}

// Sync client-side session to server cookies after sign-in/sign-out
export async function POST(req: NextRequest) {
  const requestId = randomUUID()
  const timestamp = new Date().toISOString()

  console.log(`[${requestId}] Auth session sync started`, {
    timestamp,
    url: req.url,
    method: req.method
  })

  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch {
            // Cookie setting can fail during static generation - ignore
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch {
            // Cookie removal can fail during static generation - ignore
          }
        },
      },
    }
  )

  try {
    const body = await req.json().catch(() => ({}))
    const action = body?.action as 'refresh' | 'signout' | undefined

    console.log(`[${requestId}] Session action:`, action || 'refresh')

    if (action === 'signout') {
      await supabase.auth.signOut()
      console.log(`[${requestId}] ✅ Sign out successful`)
      return NextResponse.json({ ok: true })
    }

    // Use getUser() for security - validates the session with Supabase
    const { data, error } = await supabase.auth.getUser()

    if (error) {
      console.error(`[${requestId}] ❌ Session validation failed:`, {
        error: error.message,
        status: error.status
      })
      return NextResponse.json(
        { ok: false, error: error.message, requestId },
        { status: 401 }
      )
    }

    console.log(`[${requestId}] ✅ Session validated for user:`, {
      email: data.user.email,
      userId: data.user.id
    })

    return NextResponse.json({ ok: true, user: data.user })
  } catch (e: any) {
    console.error(`[${requestId}] ❌ Session sync exception:`, {
      error: e?.message || 'Unknown error',
      stack: e?.stack,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json(
      { ok: false, error: e?.message || 'Internal server error', requestId },
      { status: 500 }
    )
  }
}


