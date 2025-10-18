import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'
import { FreeTrialManager } from '@/lib/free-trial'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
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

    // Get trial status
    const trialStatus = await FreeTrialManager.getTrialStatus(user.id)
    const trialSummary = await FreeTrialManager.getTrialSummary(user.id)
    const callEligibility = await FreeTrialManager.canMakeCall(user.id)

    return NextResponse.json({
      success: true,
      trialStatus,
      trialSummary,
      callEligibility
    })

  } catch (error) {
    console.error('Trial status error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
