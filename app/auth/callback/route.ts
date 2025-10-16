import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/dashboard'

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })

    try {
      await supabase.auth.exchangeCodeForSession(code)

      // Successful authentication - redirect to dashboard or specified page
      return NextResponse.redirect(new URL(next, request.url))
    } catch (error) {
      console.error('Auth callback error:', error)
      return NextResponse.redirect(
        new URL('/login?error=Authentication failed', request.url)
      )
    }
  }

  // No code present - redirect to login
  return NextResponse.redirect(
    new URL('/login?error=No authentication code provided', request.url)
  )
}
