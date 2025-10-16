import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Sync client-side session to server cookies after sign-in/sign-out
export async function POST(req: NextRequest) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  try {
    const body = await req.json().catch(() => ({}))
    const action = body?.action as 'refresh' | 'signout' | undefined

    if (action === 'signout') {
      await supabase.auth.signOut()
      return NextResponse.json({ ok: true })
    }

    // Use getUser() for security - validates the session with Supabase
    const { data, error } = await supabase.auth.getUser()
    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 401 })
    }
    return NextResponse.json({ ok: true, user: data.user })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Unknown error' }, { status: 500 })
  }
}


