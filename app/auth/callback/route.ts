import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'

export async function GET(request: NextRequest) {
  const requestId = randomUUID()
  const timestamp = new Date().toISOString()

  console.log(`[${requestId}] OAuth callback started`, {
    timestamp,
    url: request.url
  })

  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/dashboard'
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  // Check for OAuth errors from provider
  if (error) {
    console.error(`[${requestId}] ❌ OAuth provider error:`, {
      error,
      description: errorDescription
    })

    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent(errorDescription || error)}`,
        request.url
      )
    )
  }

  if (!code) {
    console.error(`[${requestId}] ❌ No authorization code provided`)
    return NextResponse.redirect(
      new URL('/login?error=No authentication code provided', request.url)
    )
  }

  console.log(`[${requestId}] Exchanging code for session...`)

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
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error(`[${requestId}] ❌ Code exchange failed:`, {
        error: exchangeError.message,
        status: exchangeError.status
      })

      return NextResponse.redirect(
        new URL(
          `/login?error=${encodeURIComponent('Authentication failed: ' + exchangeError.message)}`,
          request.url
        )
      )
    }

    console.log(`[${requestId}] ✅ OAuth authentication successful`, {
      email: data.user?.email,
      userId: data.user?.id,
      redirectTo: next
    })

    // Successful authentication - redirect to dashboard or specified page
    return NextResponse.redirect(new URL(next, request.url))
  } catch (error: any) {
    console.error(`[${requestId}] ❌ OAuth callback exception:`, {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    })

    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent('Authentication failed. Please try again.')}`,
        request.url
      )
    )
  }
}
