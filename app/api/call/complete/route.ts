import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'
import { FreeTrialManager } from '@/lib/free-trial'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { callSid, duration, userId, agentId } = await request.json()

    if (!callSid || !duration || !userId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    const supabase = createServerSupabase()

    // Record trial usage
    const usageRecorded = await FreeTrialManager.recordTrialUsage(userId, duration)

    if (!usageRecorded) {
      console.log(`[Call Complete] Could not record trial usage for user ${userId}`)
    }

    // Record call in call_logs
    const { error: logError } = await supabase
      .from('call_logs')
      .insert({
        user_id: userId,
        agent_id: agentId,
        twilio_call_sid: callSid,
        duration_seconds: duration,
        status: 'completed',
        trial_usage: true
      })

    if (logError) {
      console.error('Error recording call log:', logError)
    }

    // Get updated trial status
    const trialStatus = await FreeTrialManager.getTrialStatus(userId)

    return NextResponse.json({
      success: true,
      usageRecorded,
      trialStatus,
      message: 'Call completed and usage recorded'
    })

  } catch (error) {
    console.error('Call complete error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
