import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'
import { FreeTrialManager } from '@/lib/free-trial'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
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

    const { callDurationSeconds } = await request.json()

    if (!callDurationSeconds || callDurationSeconds <= 0) {
      return NextResponse.json(
        { error: 'Invalid call duration' },
        { status: 400 }
      )
    }

    // Record trial usage
    const success = await FreeTrialManager.recordTrialUsage(user.id, callDurationSeconds)

    if (!success) {
      return NextResponse.json(
        { 
          error: 'Unable to record usage. Trial may be exhausted or expired.',
          trialExhausted: true
        },
        { status: 403 }
      )
    }

    // Get updated trial status
    const trialStatus = await FreeTrialManager.getTrialStatus(user.id)

    return NextResponse.json({
      success: true,
      trialStatus,
      message: 'Usage recorded successfully'
    })

  } catch (error) {
    console.error('Record trial usage error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
