import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { randomUUID } from 'crypto'

// Force dynamic rendering since we use cookies
export const dynamic = 'force-dynamic'

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
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options })
        },
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: any[]) {
          cookiesToSet.forEach(({ name, value, ...options }) => {
            cookieStore.set({ name, value, ...options })
          })
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


