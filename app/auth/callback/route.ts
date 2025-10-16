import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/dashboard'

  if (code) {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          getAll() {
            return cookieStore.getAll().map(c => ({ name: c.name, value: c.value }))
          },
          set(name: string, value: string, options?: any) {
            // @ts-expect-error - next types
            cookieStore.set({ name, value, ...(options || {}) })
          },
          setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
            cookiesToSet.forEach(({ name, value, options }) => {
              // @ts-expect-error - next types
              cookieStore.set({ name, value, ...(options || {}) })
            })
          },
          remove(name: string, options?: any) {
            // @ts-expect-error - next types
            cookieStore.set({ name, value: '', ...(options || {}) })
          },
        },
      }
    )

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
