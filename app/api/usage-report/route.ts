import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'
import { getUsage } from '@/lib/usage'

// Force dynamic rendering since we use cookies for auth
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createServerSupabase()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get usage data
    const usage = await getUsage(user.id)

    return NextResponse.json({
      minutesUsed: usage.minutesUsed,
      minutesQuota: usage.minutesQuota,
      remaining: usage.remaining,
      plan: usage.plan
    })

  } catch (error) {
    console.error('Usage report error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

